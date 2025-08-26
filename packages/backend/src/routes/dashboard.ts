import { Router } from 'express';
import { PortfolioService } from '../services/PortfolioService';
import { getDatabase } from '../database/init';

const router = Router();
const portfolioService = new PortfolioService(getDatabase());

// 获取Dashboard概览数据
router.get('/overview', async (req, res) => {
  try {
    const portfolios = await portfolioService.getAllPortfolios();
    const positions = await portfolioService.getPositions();
    const transactions = await portfolioService.getTransactions();

    // 计算总体统计
    const totalValue = portfolios.reduce((sum, p) => sum + p.totalValue, 0);
    const totalCost = portfolios.reduce((sum, p) => sum + p.totalCost, 0);
    const totalPnL = portfolios.reduce((sum, p) => sum + p.totalPnL, 0);
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    // 计算持仓统计
    const profitablePositions = positions.filter(
      (p) => p.unrealizedPnL > 0
    ).length;
    const losingPositions = positions.filter((p) => p.unrealizedPnL < 0).length;

    // 按赛道分组
    const sectorStats = positions.reduce((acc, position) => {
      const sector = position.sector;
      if (!acc[sector]) {
        acc[sector] = {
          name: sector,
          value: 0,
          count: 0,
          pnl: 0,
        };
      }
      acc[sector].value += position.marketValue;
      acc[sector].count += 1;
      acc[sector].pnl += position.unrealizedPnL;
      return acc;
    }, {} as Record<string, { name: string; value: number; count: number; pnl: number }>);

    const sectorData = Object.values(sectorStats).map((sector) => ({
      ...sector,
      weight: sector.value / totalValue,
      pnlPercent: sector.value > 0 ? (sector.pnl / sector.value) * 100 : 0,
    }));

    // 最近交易
    const recentTransactions = transactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    const overview = {
      portfolios: {
        total: portfolios.length,
        totalValue,
        totalCost,
        totalPnL,
        totalPnLPercent,
      },
      positions: {
        total: positions.length,
        profitable: profitablePositions,
        losing: losingPositions,
      },
      sectors: sectorData,
      recentTransactions,
    };

    res.json({
      success: true,
      data: overview,
      message: 'Dashboard概览数据',
    });
  } catch (error) {
    console.error('获取Dashboard概览数据失败:', error);
    res.status(500).json({
      success: false,
      error: '获取Dashboard概览数据失败',
    });
  }
});

// 获取风险分析数据
router.get('/risk-analysis', async (req, res) => {
  try {
    const { portfolioId } = req.query;
    const positions = await portfolioService.getPositions(
      portfolioId as string
    );

    // 计算风险指标
    const riskMetrics = {
      maxDrawdown: 0, // 这里需要历史数据计算
      volatility: 0, // 这里需要历史数据计算
      sharpeRatio: 0, // 这里需要历史数据计算
      beta: 0, // 这里需要历史数据计算
    };

    // 风险分布
    const riskDistribution = positions.reduce((acc, position) => {
      const riskLevel =
        position.unrealizedPnLPercent > 10
          ? 'high'
          : position.unrealizedPnLPercent > 5
          ? 'medium'
          : 'low';
      acc[riskLevel] = (acc[riskLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 集中度风险
    const concentrationRisk = positions.reduce((acc, position) => {
      acc += position.weight * position.weight; // HHI指数
      return acc;
    }, 0);

    const riskAnalysis = {
      metrics: riskMetrics,
      distribution: riskDistribution,
      concentrationRisk,
      alerts: [], // 这里可以添加风险警报逻辑
    };

    res.json({
      success: true,
      data: riskAnalysis,
      message: '风险分析数据',
    });
  } catch (error) {
    console.error('获取风险分析数据失败:', error);
    res.status(500).json({
      success: false,
      error: '获取风险分析数据失败',
    });
  }
});

export { router as dashboardRoutes };
