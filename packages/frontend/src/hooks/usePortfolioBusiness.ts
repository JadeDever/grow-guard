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
  TakeProfitAlert,
} from '@shared/types';
import { apiService } from '../services/api';
// 移除未使用的导入

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
  createPortfolio: (
    portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<Portfolio>;
  updatePortfolio: (
    id: string,
    updates: Partial<Portfolio>
  ) => Promise<Portfolio | null>;
  deletePortfolio: (id: string) => Promise<boolean>;
  selectPortfolio: (id: string) => Promise<void>;

  // 持仓管理
  addPosition: (
    position: Omit<Position, 'id' | 'lastUpdate'>
  ) => Promise<Position>;
  updatePosition: (
    id: string,
    updates: Partial<Position>
  ) => Promise<Position | null>;
  deletePosition: (id: string) => Promise<boolean>;
  updatePositionPrices: (
    updates: Array<{ stockCode: string; currentPrice: number }>
  ) => Promise<void>;

  // 交易管理
  createTradeOrder: (order: any) => Promise<any>;
  cancelTradeOrder: (id: string) => Promise<boolean>;
  getTradeHistory: (
    startDate?: string,
    endDate?: string
  ) => Promise<Transaction[]>;

  // 风险管理
  refreshRiskAssessment: () => Promise<void>;
  checkStopLossAndTakeProfit: () => Promise<void>;

  // 报告生成
  generateReport: (
    reportType?: string,
    startDate?: string,
    endDate?: string
  ) => Promise<Report>;
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
    error: null,
  });

  // 加载投资组合列表
  const loadPortfolios = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      const portfolios = await apiService.getPortfolios();
      setState((prev) => ({ ...prev, portfolios, loading: false }));

      // 如果没有选择投资组合，选择第一个
      if (!state.currentPortfolio && portfolios.length > 0) {
        await selectPortfolio(portfolios[0].id);
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '加载投资组合失败',
      }));
    }
  }, [state.currentPortfolio]);

  // 选择投资组合
  const selectPortfolio = useCallback(async (id: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const portfolio = await apiService.getPortfolio(id);
      if (!portfolio) {
        throw new Error('投资组合不存在');
      }

      setState((prev) => ({
        ...prev,
        currentPortfolio: portfolio,
        loading: false,
      }));

      // 加载相关数据
      await Promise.all([
        loadPositions(id),
        loadTransactions(id),
        loadRiskAssessment(id),
        loadTradeAnalysis(id),
        loadRebalanceSuggestions(id),
      ]);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '选择投资组合失败',
      }));
    }
  }, []);

  // 加载持仓数据
  const loadPositions = useCallback(async (portfolioId: string) => {
    try {
      const positions = await apiService.getPositions(portfolioId);
      setState((prev) => ({ ...prev, positions }));
    } catch (error) {
      console.error('加载持仓数据失败:', error);
    }
  }, []);

  // 加载交易记录
  const loadTransactions = useCallback(async (portfolioId: string) => {
    try {
      const transactions = await apiService.getTransactions(portfolioId);
      setState((prev) => ({ ...prev, transactions }));
    } catch (error) {
      console.error('加载交易记录失败:', error);
    }
  }, []);

  // 加载风险评估
  const loadRiskAssessment = useCallback(async (portfolioId: string) => {
    try {
      const riskAnalysis = await apiService.getRiskAnalysis(portfolioId);
      setState((prev) => ({ ...prev, riskAssessment: riskAnalysis }));
    } catch (error) {
      console.error('加载风险评估失败:', error);
    }
  }, []);

  // 加载交易分析
  const loadTradeAnalysis = useCallback(async (portfolioId: string) => {
    try {
      // 这里可以实现交易分析逻辑
      // 目前先返回一个模拟的交易分析，实际项目中需要与交易分析系统集成
      const tradeAnalysis = {
        id: crypto.randomUUID(),
        portfolioId,
        totalTrades: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        avgWinAmount: 0,
        avgLossAmount: 0,
        profitFactor: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        lastUpdated: new Date(),
      };
      setState((prev) => ({ ...prev, tradeAnalysis }));
    } catch (error) {
      console.error('加载交易分析失败:', error);
    }
  }, []);

  // 加载再平衡建议
  const loadRebalanceSuggestions = useCallback(async (portfolioId: string) => {
    try {
      // 这里可以实现再平衡建议逻辑
      // 目前先返回一个空的建议列表，实际项目中需要与再平衡系统集成
      const suggestions: RebalanceSuggestion[] = [];
      setState((prev) => ({ ...prev, rebalanceSuggestions: suggestions }));
    } catch (error) {
      console.error('加载再平衡建议失败:', error);
    }
  }, []);

  // 检查止损止盈
  const checkStopLossAndTakeProfit = useCallback(async () => {
    try {
      // 这里可以实现止损止盈检查逻辑
      // 目前先返回空的警报列表，实际项目中需要与风险管理系统集成
      const stopLossAlerts: StopLossAlert[] = [];
      const takeProfitAlerts: TakeProfitAlert[] = [];
      setState((prev) => ({
        ...prev,
        stopLossAlerts,
        takeProfitAlerts,
      }));
    } catch (error) {
      console.error('检查止损止盈失败:', error);
    }
  }, []);

  // 创建投资组合
  const createPortfolio = useCallback(
    async (portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const newPortfolio = await apiService.createPortfolio(portfolio);

        // 重新加载投资组合列表
        await loadPortfolios();

        setState((prev) => ({ ...prev, loading: false }));
        return newPortfolio;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '创建投资组合失败',
        }));
        throw error;
      }
    },
    [loadPortfolios]
  );

  // 更新投资组合
  const updatePortfolio = useCallback(
    async (id: string, updates: Partial<Portfolio>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const updatedPortfolio = await apiService.updatePortfolio(id, updates);

        if (updatedPortfolio) {
          // 更新当前投资组合
          if (state.currentPortfolio?.id === id) {
            setState((prev) => ({
              ...prev,
              currentPortfolio: updatedPortfolio,
            }));
          }

          // 更新投资组合列表
          setState((prev) => ({
            ...prev,
            portfolios: prev.portfolios.map((p) =>
              p.id === id ? updatedPortfolio : p
            ),
          }));
        }

        setState((prev) => ({ ...prev, loading: false }));
        return updatedPortfolio;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '更新投资组合失败',
        }));
        throw error;
      }
    },
    [state.currentPortfolio]
  );

  // 删除投资组合
  const deletePortfolio = useCallback(
    async (id: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const success = await apiService.deletePortfolio(id);

        if (success) {
          // 如果删除的是当前投资组合，清空相关数据
          if (state.currentPortfolio?.id === id) {
            setState((prev) => ({
              ...prev,
              currentPortfolio: null,
              positions: [],
              transactions: [],
              riskAssessment: null,
              tradeAnalysis: null,
              rebalanceSuggestions: [],
            }));
          }

          // 重新加载投资组合列表
          await loadPortfolios();
        }

        setState((prev) => ({ ...prev, loading: false }));
        return success;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '删除投资组合失败',
        }));
        throw error;
      }
    },
    [state.currentPortfolio, loadPortfolios]
  );

  // 添加持仓
  const addPosition = useCallback(
    async (position: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const newPosition = await apiService.createPosition(position);

        // 重新加载持仓数据
        if (state.currentPortfolio) {
          await loadPositions(state.currentPortfolio.id);
          await loadRiskAssessment(state.currentPortfolio.id);
          await loadRebalanceSuggestions(state.currentPortfolio.id);
        }

        setState((prev) => ({ ...prev, loading: false }));
        return newPosition;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '添加持仓失败',
        }));
        throw error;
      }
    },
    [
      state.currentPortfolio,
      loadPositions,
      loadRiskAssessment,
      loadRebalanceSuggestions,
    ]
  );

  // 更新持仓
  const updatePosition = useCallback(
    async (id: string, updates: Partial<Position>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const updatedPosition = await apiService.updatePosition(id, updates);

        if (updatedPosition) {
          // 重新加载相关数据
          if (state.currentPortfolio) {
            await Promise.all([
              loadPositions(state.currentPortfolio.id),
              loadRiskAssessment(state.currentPortfolio.id),
              loadRebalanceSuggestions(state.currentPortfolio.id),
            ]);
          }
        }

        setState((prev) => ({ ...prev, loading: false }));
        return updatedPosition;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '更新持仓失败',
        }));
        throw error;
      }
    },
    [
      state.currentPortfolio,
      loadPositions,
      loadRiskAssessment,
      loadRebalanceSuggestions,
    ]
  );

  // 删除持仓
  const deletePosition = useCallback(
    async (id: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const success = await apiService.deletePosition(id);

        if (success && state.currentPortfolio) {
          // 重新加载相关数据
          await Promise.all([
            loadPositions(state.currentPortfolio.id),
            loadRiskAssessment(state.currentPortfolio.id),
            loadRebalanceSuggestions(state.currentPortfolio.id),
          ]);
        }

        setState((prev) => ({ ...prev, loading: false }));
        return success;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '删除持仓失败',
        }));
        throw error;
      }
    },
    [
      state.currentPortfolio,
      loadPositions,
      loadRiskAssessment,
      loadRebalanceSuggestions,
    ]
  );

  // 更新持仓价格
  const updatePositionPrices = useCallback(
    async (updates: Array<{ stockCode: string; currentPrice: number }>) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // 批量更新持仓价格
        for (const update of updates) {
          const position = state.positions.find(
            (p) => p.stockCode === update.stockCode
          );
          if (position) {
            await apiService.updatePosition(position.id, {
              currentPrice: update.currentPrice,
            });
          }
        }

        // 重新加载相关数据
        if (state.currentPortfolio) {
          await Promise.all([
            loadPositions(state.currentPortfolio.id),
            loadRiskAssessment(state.currentPortfolio.id),
            checkStopLossAndTakeProfit(),
          ]);
        }

        setState((prev) => ({ ...prev, loading: false }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '更新持仓价格失败',
        }));
        throw error;
      }
    },
    [
      state.currentPortfolio,
      state.positions,
      loadPositions,
      loadRiskAssessment,
      checkStopLossAndTakeProfit,
    ]
  );

  // 创建交易订单
  const createTradeOrder = useCallback(
    async (order: any) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // 创建交易记录
        const transaction = await apiService.createTransaction({
          portfolioId: state.currentPortfolio!.id,
          stockCode: order.stockCode,
          stockName: order.stockName,
          type: order.type,
          quantity: order.quantity,
          price: order.price,
          amount: order.quantity * order.price,
          commission: order.commission || 0,
          date: new Date(),
          reason: order.reason,
        });

        // 重新加载交易数据
        if (state.currentPortfolio) {
          await Promise.all([
            loadTransactions(state.currentPortfolio.id),
            loadPositions(state.currentPortfolio.id),
          ]);
        }

        setState((prev) => ({ ...prev, loading: false }));
        return transaction;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '创建交易订单失败',
        }));
        throw error;
      }
    },
    [state.currentPortfolio, loadTransactions, loadPositions]
  );

  // 取消交易订单
  const cancelTradeOrder = useCallback(
    async (id: string) => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // 这里可以实现取消交易订单的逻辑
        // 目前先返回成功，实际项目中需要与交易系统集成
        const success = true;

        if (success && state.currentPortfolio) {
          // 重新加载交易数据
          await loadTransactions(state.currentPortfolio.id);
        }

        setState((prev) => ({ ...prev, loading: false }));
        return success;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '取消交易订单失败',
        }));
        throw error;
      }
    },
    [state.currentPortfolio, loadTransactions]
  );

  // 获取交易历史
  const getTradeHistory = useCallback(
    async (startDate?: string, endDate?: string) => {
      try {
        if (!state.currentPortfolio) return [];

        const transactions = await apiService.getTransactions(
          state.currentPortfolio.id
        );

        // 根据日期过滤
        let filteredTransactions = transactions;
        if (startDate || endDate) {
          filteredTransactions = transactions.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date(9999, 11, 31);
            return transactionDate >= start && transactionDate <= end;
          });
        }

        return filteredTransactions;
      } catch (error) {
        console.error('获取交易历史失败:', error);
        return [];
      }
    },
    [state.currentPortfolio]
  );

  // 刷新风险评估
  const refreshRiskAssessment = useCallback(async () => {
    if (state.currentPortfolio) {
      try {
        const riskAnalysis = await apiService.getRiskAnalysis(
          state.currentPortfolio.id
        );
        setState((prev) => ({ ...prev, riskAssessment: riskAnalysis }));
      } catch (error) {
        console.error('刷新风险评估失败:', error);
      }
    }
  }, [state.currentPortfolio]);

  // 生成报告
  const generateReport = useCallback(
    async (
      reportType: string = 'comprehensive',
      startDate?: string,
      endDate?: string
    ) => {
      try {
        if (!state.currentPortfolio) {
          throw new Error('请先选择投资组合');
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        // 这里可以实现报告生成逻辑
        // 目前先返回一个模拟报告，实际项目中需要与报告系统集成
        const report: Report = {
          id: crypto.randomUUID(),
          portfolioId: state.currentPortfolio.id,
          type: 'MORNING',
          title: `${reportType}报告 - ${state.currentPortfolio.name}`,
          content: `这是${state.currentPortfolio.name}的${reportType}报告内容`,
          summary: `投资组合总价值: ${state.currentPortfolio.totalValue.toFixed(
            2
          )}元`,
          keyMetrics: {
            totalValue: state.currentPortfolio.totalValue,
            totalPnL: state.currentPortfolio.totalPnL,
            totalPnLPercent: state.currentPortfolio.totalPnLPercent,
          },
          recommendations: ['建议关注市场风险', '考虑调整仓位配置'],
          createdAt: new Date(),
        };

        setState((prev) => ({ ...prev, loading: false }));
        return report;
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '生成报告失败',
        }));
        throw error;
      }
    },
    [state.currentPortfolio]
  );

  // 导出报告
  const exportReport = useCallback(async (report: Report, format: string) => {
    try {
      // 这里可以实现报告导出逻辑
      // 目前先返回一个模拟的导出内容，实际项目中需要与导出系统集成
      let exportedContent = '';

      if (format === 'json') {
        exportedContent = JSON.stringify(report, null, 2);
      } else if (format === 'csv') {
        exportedContent = `ID,投资组合ID,类型,标题,摘要,创建时间\n${
          report.id
        },${report.portfolioId},${report.type},${report.title},${
          report.summary
        },${report.createdAt.toISOString()}`;
      } else if (format === 'pdf') {
        exportedContent = `PDF格式报告: ${report.title}`;
      } else {
        exportedContent = `文本格式报告: ${report.title}\n${report.content}`;
      }

      return exportedContent;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : '导出报告失败',
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
        checkStopLossAndTakeProfit(),
      ]);
    }
  }, [
    state.currentPortfolio,
    loadPositions,
    loadTransactions,
    loadRiskAssessment,
    loadTradeAnalysis,
    loadRebalanceSuggestions,
    checkStopLossAndTakeProfit,
  ]);

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
    if (
      initialPortfolioId &&
      state.portfolios.length > 0 &&
      !state.currentPortfolio
    ) {
      selectPortfolio(initialPortfolioId);
    }
  }, [
    initialPortfolioId,
    state.portfolios,
    state.currentPortfolio,
    selectPortfolio,
  ]);

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
    refreshTransactions,
  };

  return {
    ...state,
    ...actions,
  };
};
