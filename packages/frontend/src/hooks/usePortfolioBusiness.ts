import { useState, useEffect, useCallback } from 'react';
import { 
  Portfolio, 
  Position, 
  Transaction, 
  Report,
  RiskAssessment,
  TradeAnalysis,
  RebalanceSuggestion,
  StopLossAlert,
  TakeProfitAlert
} from '@shared/types';
import { 
  portfolioService, 
  riskManagementService, 
  tradingService, 
  reportService 
} from '../services';

export interface PortfolioBusinessState {
  portfolios: Portfolio[];
  currentPortfolio: Portfolio | null;
  positions: Position[];
  transactions: Transaction[];
  riskAssessment: RiskAssessment | null;
  tradeAnalysis: TradeAnalysis | null;
  rebalanceSuggestions: RebalanceSuggestion[];
  stopLossAlerts: StopLossAlert[];
  takeProfitAlerts: TakeProfitAlert[];
  loading: boolean;
  error: string | null;
}

export interface PortfolioBusinessActions {
  // 投资组合管理
  createPortfolio: (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Portfolio>;
  updatePortfolio: (id: string, updates: Partial<Portfolio>) => Promise<Portfolio | null>;
  deletePortfolio: (id: string) => Promise<boolean>;
  selectPortfolio: (id: string) => Promise<void>;
  
  // 持仓管理
  addPosition: (position: Omit<Position, 'id' | 'lastUpdate'>) => Promise<Position>;
  updatePosition: (id: string, updates: Partial<Position>) => Promise<Position | null>;
  deletePosition: (id: string) => Promise<boolean>;
  updatePositionPrices: (updates: Array<{ stockCode: string; currentPrice: number }>) => Promise<void>;
  
  // 交易管理
  createTradeOrder: (order: any) => Promise<any>;
  cancelTradeOrder: (id: string) => Promise<boolean>;
  getTradeHistory: (startDate?: string, endDate?: string) => Promise<Transaction[]>;
  
  // 风险管理
  refreshRiskAssessment: () => Promise<void>;
  checkStopLossAndTakeProfit: () => Promise<void>;
  
  // 报告生成
  generateReport: (reportType?: string, startDate?: string, endDate?: string) => Promise<Report>;
  exportReport: (report: Report, format: string) => Promise<string>;
  
  // 数据刷新
  refreshData: () => Promise<void>;
  refreshPositions: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export const usePortfolioBusiness = (initialPortfolioId?: string) => {
  const [state, setState] = useState<PortfolioBusinessState>({
    portfolios: [],
    currentPortfolio: null,
    positions: [],
    transactions: [],
    riskAssessment: null,
    tradeAnalysis: null,
    rebalanceSuggestions: [],
    stopLossAlerts: [],
    takeProfitAlerts: [],
    loading: false,
    error: null
  });

  // 加载投资组合列表
  const loadPortfolios = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const portfolios = await portfolioService.getPortfolios();
      setState(prev => ({ ...prev, portfolios, loading: false }));
      
      // 如果没有选择投资组合，选择第一个
      if (!state.currentPortfolio && portfolios.length > 0) {
        await selectPortfolio(portfolios[0].id);
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '加载投资组合失败' 
      }));
    }
  }, [state.currentPortfolio]);

  // 选择投资组合
  const selectPortfolio = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const portfolio = await portfolioService.getPortfolio(id);
      if (!portfolio) {
        throw new Error('投资组合不存在');
      }
      
      setState(prev => ({ ...prev, currentPortfolio: portfolio, loading: false }));
      
      // 加载相关数据
      await Promise.all([
        loadPositions(id),
        loadTransactions(id),
        loadRiskAssessment(id),
        loadTradeAnalysis(id),
        loadRebalanceSuggestions(id)
      ]);
      
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '选择投资组合失败' 
      }));
    }
  }, []);

  // 加载持仓数据
  const loadPositions = useCallback(async (portfolioId: string) => {
    try {
      const positions = await portfolioService.getPositions(portfolioId);
      setState(prev => ({ ...prev, positions }));
    } catch (error) {
      console.error('加载持仓数据失败:', error);
    }
  }, []);

  // 加载交易记录
  const loadTransactions = useCallback(async (portfolioId: string) => {
    try {
      const transactions = await portfolioService.getTransactions(portfolioId);
      setState(prev => ({ ...prev, transactions }));
    } catch (error) {
      console.error('加载交易记录失败:', error);
    }
  }, []);

  // 加载风险评估
  const loadRiskAssessment = useCallback(async (portfolioId: string) => {
    try {
      if (!state.currentPortfolio) return;
      
      const riskAssessment = await riskManagementService.calculatePortfolioRisk(
        state.currentPortfolio, 
        state.positions
      );
      setState(prev => ({ ...prev, riskAssessment }));
    } catch (error) {
      console.error('加载风险评估失败:', error);
    }
  }, [state.currentPortfolio, state.positions]);

  // 加载交易分析
  const loadTradeAnalysis = useCallback(async (portfolioId: string) => {
    try {
      const tradeAnalysis = await tradingService.analyzeTradingPerformance(portfolioId);
      setState(prev => ({ ...prev, tradeAnalysis }));
    } catch (error) {
      console.error('加载交易分析失败:', error);
    }
  }, []);

  // 加载再平衡建议
  const loadRebalanceSuggestions = useCallback(async (portfolioId: string) => {
    try {
      const suggestions = await portfolioService.getRebalanceSuggestions(portfolioId);
      setState(prev => ({ ...prev, rebalanceSuggestions: suggestions }));
    } catch (error) {
      console.error('加载再平衡建议失败:', error);
    }
  }, []);

  // 检查止损止盈
  const checkStopLossAndTakeProfit = useCallback(async () => {
    try {
      const { stopLossAlerts, takeProfitAlerts } = riskManagementService.checkStopLossAndTakeProfit(state.positions);
      setState(prev => ({ 
        ...prev, 
        stopLossAlerts, 
        takeProfitAlerts 
      }));
    } catch (error) {
      console.error('检查止损止盈失败:', error);
    }
  }, [state.positions]);

  // 创建投资组合
  const createPortfolio = useCallback(async (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const newPortfolio = await portfolioService.createPortfolio(portfolio);
      
      // 重新加载投资组合列表
      await loadPortfolios();
      
      setState(prev => ({ ...prev, loading: false }));
      return newPortfolio;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '创建投资组合失败' 
      }));
      throw error;
    }
  }, [loadPortfolios]);

  // 更新投资组合
  const updatePortfolio = useCallback(async (id: string, updates: Partial<Portfolio>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedPortfolio = await portfolioService.updatePortfolio(id, updates);
      
      if (updatedPortfolio) {
        // 更新当前投资组合
        if (state.currentPortfolio?.id === id) {
          setState(prev => ({ ...prev, currentPortfolio: updatedPortfolio }));
        }
        
        // 更新投资组合列表
        setState(prev => ({
          ...prev,
          portfolios: prev.portfolios.map(p => p.id === id ? updatedPortfolio : p)
        }));
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return updatedPortfolio;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '更新投资组合失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio]);

  // 删除投资组合
  const deletePortfolio = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const success = await portfolioService.deletePortfolio(id);
      
      if (success) {
        // 如果删除的是当前投资组合，清空相关数据
        if (state.currentPortfolio?.id === id) {
          setState(prev => ({
            ...prev,
            currentPortfolio: null,
            positions: [],
            transactions: [],
            riskAssessment: null,
            tradeAnalysis: null,
            rebalanceSuggestions: []
          }));
        }
        
        // 重新加载投资组合列表
        await loadPortfolios();
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '删除投资组合失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio, loadPortfolios]);

  // 添加持仓
  const addPosition = useCallback(async (position: Omit<Position, 'id' | 'lastUpdate'>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const newPosition = await portfolioService.addPosition(position);
      
      // 重新加载持仓数据
      if (state.currentPortfolio) {
        await loadPositions(state.currentPortfolio.id);
        await loadRiskAssessment(state.currentPortfolio.id);
        await loadRebalanceSuggestions(state.currentPortfolio.id);
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return newPosition;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '添加持仓失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio, loadPositions, loadRiskAssessment, loadRebalanceSuggestions]);

  // 更新持仓
  const updatePosition = useCallback(async (id: string, updates: Partial<Position>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const updatedPosition = await portfolioService.updatePosition(id, updates);
      
      if (updatedPosition) {
        // 重新加载相关数据
        if (state.currentPortfolio) {
          await Promise.all([
            loadPositions(state.currentPortfolio.id),
            loadRiskAssessment(state.currentPortfolio.id),
            loadRebalanceSuggestions(state.currentPortfolio.id)
          ]);
        }
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return updatedPosition;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '更新持仓失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio, loadPositions, loadRiskAssessment, loadRebalanceSuggestions]);

  // 删除持仓
  const deletePosition = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const success = await portfolioService.deletePosition(id);
      
      if (success && state.currentPortfolio) {
        // 重新加载相关数据
        await Promise.all([
          loadPositions(state.currentPortfolio.id),
          loadRiskAssessment(state.currentPortfolio.id),
          loadRebalanceSuggestions(state.currentPortfolio.id)
        ]);
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '删除持仓失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio, loadPositions, loadRiskAssessment, loadRebalanceSuggestions]);

  // 更新持仓价格
  const updatePositionPrices = useCallback(async (updates: Array<{ stockCode: string; currentPrice: number }>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      await portfolioService.updatePositionPrices(updates);
      
      // 重新加载相关数据
      if (state.currentPortfolio) {
        await Promise.all([
          loadPositions(state.currentPortfolio.id),
          loadRiskAssessment(state.currentPortfolio.id),
          checkStopLossAndTakeProfit()
        ]);
      }
      
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '更新持仓价格失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio, loadPositions, loadRiskAssessment, checkStopLossAndTakeProfit]);

  // 创建交易订单
  const createTradeOrder = useCallback(async (order: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const newOrder = await tradingService.createTradeOrder(order);
      
      // 重新加载交易数据
      if (state.currentPortfolio) {
        await Promise.all([
          loadTransactions(state.currentPortfolio.id),
          loadTradeAnalysis(state.currentPortfolio.id)
        ]);
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return newOrder;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '创建交易订单失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio, loadTransactions, loadTradeAnalysis]);

  // 取消交易订单
  const cancelTradeOrder = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const success = await tradingService.cancelTradeOrder(id);
      
      if (success && state.currentPortfolio) {
        // 重新加载交易分析
        await loadTradeAnalysis(state.currentPortfolio.id);
      }
      
      setState(prev => ({ ...prev, loading: false }));
      return success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '取消交易订单失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio, loadTradeAnalysis]);

  // 获取交易历史
  const getTradeHistory = useCallback(async (startDate?: string, endDate?: string) => {
    try {
      if (!state.currentPortfolio) return [];
      
      const history = await tradingService.getTradeHistory(
        state.currentPortfolio.id, 
        startDate, 
        endDate
      );
      return history;
    } catch (error) {
      console.error('获取交易历史失败:', error);
      return [];
    }
  }, [state.currentPortfolio]);

  // 刷新风险评估
  const refreshRiskAssessment = useCallback(async () => {
    if (state.currentPortfolio) {
      await loadRiskAssessment(state.currentPortfolio.id);
    }
  }, [state.currentPortfolio, loadRiskAssessment]);

  // 生成报告
  const generateReport = useCallback(async (reportType: string = 'comprehensive', startDate?: string, endDate?: string) => {
    try {
      if (!state.currentPortfolio) {
        throw new Error('请先选择投资组合');
      }
      
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const report = await reportService.generatePortfolioReport(
        state.currentPortfolio.id,
        reportType as any,
        startDate,
        endDate
      );
      
      setState(prev => ({ ...prev, loading: false }));
      return report;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : '生成报告失败' 
      }));
      throw error;
    }
  }, [state.currentPortfolio]);

  // 导出报告
  const exportReport = useCallback(async (report: Report, format: string) => {
    try {
      const exportedContent = await reportService.exportReport(report, format as any);
      return exportedContent;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : '导出报告失败' 
      }));
      throw error;
    }
  }, []);

  // 刷新所有数据
  const refreshData = useCallback(async () => {
    if (state.currentPortfolio) {
      await Promise.all([
        loadPositions(state.currentPortfolio.id),
        loadTransactions(state.currentPortfolio.id),
        loadRiskAssessment(state.currentPortfolio.id),
        loadTradeAnalysis(state.currentPortfolio.id),
        loadRebalanceSuggestions(state.currentPortfolio.id),
        checkStopLossAndTakeProfit()
      ]);
    }
  }, [state.currentPortfolio, loadPositions, loadTransactions, loadRiskAssessment, loadTradeAnalysis, loadRebalanceSuggestions, checkStopLossAndTakeProfit]);

  // 刷新持仓数据
  const refreshPositions = useCallback(async () => {
    if (state.currentPortfolio) {
      await loadPositions(state.currentPortfolio.id);
    }
  }, [state.currentPortfolio, loadPositions]);

  // 刷新交易数据
  const refreshTransactions = useCallback(async () => {
    if (state.currentPortfolio) {
      await loadTransactions(state.currentPortfolio.id);
    }
  }, [state.currentPortfolio, loadTransactions]);

  // 初始化
  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  // 自动选择初始投资组合
  useEffect(() => {
    if (initialPortfolioId && state.portfolios.length > 0 && !state.currentPortfolio) {
      selectPortfolio(initialPortfolioId);
    }
  }, [initialPortfolioId, state.portfolios, state.currentPortfolio, selectPortfolio]);

  // 定期检查止损止盈
  useEffect(() => {
    if (state.currentPortfolio && state.positions.length > 0) {
      const interval = setInterval(() => {
        checkStopLossAndTakeProfit();
      }, 5 * 60 * 1000); // 每5分钟检查一次

      return () => clearInterval(interval);
    }
  }, [state.currentPortfolio, state.positions, checkStopLossAndTakeProfit]);

  const actions: PortfolioBusinessActions = {
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    selectPortfolio,
    addPosition,
    updatePosition,
    deletePosition,
    updatePositionPrices,
    createTradeOrder,
    cancelTradeOrder,
    getTradeHistory,
    refreshRiskAssessment,
    checkStopLossAndTakeProfit,
    generateReport,
    exportReport,
    refreshData,
    refreshPositions,
    refreshTransactions
  };

  return {
    ...state,
    ...actions
  };
};
