import {
  Portfolio,
  Position,
  Transaction,
  Sector,
  RiskMetrics,
  PerformanceData,
  RebalanceSuggestion,
  StopLossAlert,
} from '@shared/types';

export class PortfolioService {
  private portfolios: Portfolio[] = [];
  private positions: Position[] = [];
  private transactions: Transaction[] = [];

  constructor() {
    this.initializeMockData();
  }

  // 初始化模拟数据
  private initializeMockData() {
    // 模拟投资组合数据
    this.portfolios = [
      {
        id: '1',
        name: '成长型投资组合',
        description: '专注于高成长性科技股的投资组合',
        totalValue: 1250000,
        totalCost: 1200000,
        totalPnL: 50000,
        totalPnLPercent: 4.17,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-15',
      },
    ];

    // 模拟持仓数据
    this.positions = [
      {
        id: '1',
        portfolioId: '1',
        stockCode: '002594',
        stockName: '比亚迪',
        sector: '车与智能驾驶',
        quantity: 1000,
        avgPrice: 180.5,
        currentPrice: 185.2,
        marketValue: 185200,
        costValue: 180500,
        pnl: 4700,
        pnlPercent: 2.6,
        weight: 0.148,
        riskLevel: 'medium',
        stopLoss: 162.45, // 10%止损
        takeProfit: 216.6, // 20%止盈
        lastUpdate: '2024-01-15 14:30',
      },
      {
        id: '2',
        portfolioId: '1',
        stockCode: '300750',
        stockName: '宁德时代',
        sector: '新能源',
        quantity: 800,
        avgPrice: 165.8,
        currentPrice: 172.5,
        marketValue: 138000,
        costValue: 132640,
        pnl: 5360,
        pnlPercent: 4.0,
        weight: 0.11,
        riskLevel: 'low',
        stopLoss: 149.22,
        takeProfit: 198.96,
        lastUpdate: '2024-01-15 14:30',
      },
      {
        id: '3',
        portfolioId: '1',
        stockCode: '002415',
        stockName: '海康威视',
        sector: 'AI算力',
        quantity: 1200,
        avgPrice: 28.5,
        currentPrice: 31.2,
        marketValue: 37440,
        costValue: 34200,
        pnl: 3240,
        pnlPercent: 9.5,
        weight: 0.03,
        riskLevel: 'high',
        stopLoss: 25.65,
        takeProfit: 34.2,
        lastUpdate: '2024-01-15 14:30',
      },
    ];

    // 模拟交易记录
    this.transactions = [
      {
        id: '1',
        portfolioId: '1',
        stockCode: '002594',
        stockName: '比亚迪',
        type: 'buy',
        quantity: 500,
        price: 175.0,
        amount: 87500,
        date: '2024-01-10',
        reason: '建仓',
        commission: 25,
        tax: 0,
      },
      {
        id: '2',
        portfolioId: '1',
        stockCode: '002594',
        stockName: '比亚迪',
        type: 'buy',
        quantity: 500,
        price: 186.0,
        amount: 93000,
        date: '2024-01-12',
        reason: '加仓',
        commission: 25,
        tax: 0,
      },
      {
        id: '3',
        portfolioId: '1',
        stockCode: '300750',
        stockName: '宁德时代',
        type: 'buy',
        quantity: 800,
        price: 165.8,
        amount: 132640,
        date: '2024-01-08',
        reason: '建仓',
        commission: 25,
        tax: 0,
      },
    ];
  }

  // 获取投资组合列表
  async getPortfolios(): Promise<Portfolio[]> {
    return Promise.resolve(this.portfolios);
  }

  // 获取投资组合详情
  async getPortfolio(id: string): Promise<Portfolio | null> {
    const portfolio = this.portfolios.find((p) => p.id === id);
    return Promise.resolve(portfolio || null);
  }

  // 创建投资组合
  async createPortfolio(
    portfolio: Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Portfolio> {
    const newPortfolio: Portfolio = {
      ...portfolio,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.portfolios.push(newPortfolio);
    return Promise.resolve(newPortfolio);
  }

  // 更新投资组合
  async updatePortfolio(
    id: string,
    updates: Partial<Portfolio>
  ): Promise<Portfolio | null> {
    const index = this.portfolios.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.portfolios[index] = {
      ...this.portfolios[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return Promise.resolve(this.portfolios[index]);
  }

  // 删除投资组合
  async deletePortfolio(id: string): Promise<boolean> {
    const index = this.portfolios.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.portfolios.splice(index, 1);
    // 同时删除相关持仓和交易记录
    this.positions = this.positions.filter((p) => p.portfolioId !== id);
    this.transactions = this.transactions.filter((t) => t.portfolioId !== id);

    return Promise.resolve(true);
  }

  // 获取持仓列表
  async getPositions(portfolioId?: string): Promise<Position[]> {
    if (portfolioId) {
      return Promise.resolve(
        this.positions.filter((p) => p.portfolioId === portfolioId)
      );
    }
    return Promise.resolve(this.positions);
  }

  // 获取持仓详情
  async getPosition(id: string): Promise<Position | null> {
    const position = this.positions.find((p) => p.id === id);
    return Promise.resolve(position || null);
  }

  // 添加持仓
  async addPosition(
    position: Omit<Position, 'id' | 'lastUpdate'>
  ): Promise<Position> {
    const newPosition: Position = {
      ...position,
      id: Date.now().toString(),
      lastUpdate: new Date().toISOString(),
    };
    this.positions.push(newPosition);

    // 更新投资组合数据
    await this.updatePortfolioData(position.portfolioId);

    return Promise.resolve(newPosition);
  }

  // 更新持仓
  async updatePosition(
    id: string,
    updates: Partial<Position>
  ): Promise<Position | null> {
    const index = this.positions.findIndex((p) => p.id === id);
    if (index === -1) return null;

    this.positions[index] = {
      ...this.positions[index],
      ...updates,
      lastUpdate: new Date().toISOString(),
    };

    // 更新投资组合数据
    await this.updatePortfolioData(this.positions[index].portfolioId);

    return Promise.resolve(this.positions[index]);
  }

  // 删除持仓
  async deletePosition(id: string): Promise<boolean> {
    const index = this.positions.findIndex((p) => p.id === id);
    if (index === -1) return false;

    const portfolioId = this.positions[index].portfolioId;
    this.positions.splice(index, 1);

    // 更新投资组合数据
    await this.updatePortfolioData(portfolioId);

    return Promise.resolve(true);
  }

  // 获取交易记录
  async getTransactions(portfolioId?: string): Promise<Transaction[]> {
    if (portfolioId) {
      return Promise.resolve(
        this.transactions.filter((t) => t.portfolioId === portfolioId)
      );
    }
    return Promise.resolve(this.transactions);
  }

  // 添加交易记录
  async addTransaction(
    transaction: Omit<Transaction, 'id'>
  ): Promise<Transaction> {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    this.transactions.push(newTransaction);

    // 更新相关持仓
    await this.updatePositionFromTransaction(newTransaction);

    return Promise.resolve(newTransaction);
  }

  // 根据交易更新持仓
  private async updatePositionFromTransaction(
    transaction: Transaction
  ): Promise<void> {
    const existingPosition = this.positions.find(
      (p) =>
        p.portfolioId === transaction.portfolioId &&
        p.stockCode === transaction.stockCode
    );

    if (existingPosition) {
      if (transaction.type === 'buy') {
        // 买入：更新持仓数量和平均成本
        const totalQuantity = existingPosition.quantity + transaction.quantity;
        const totalCost = existingPosition.costValue + transaction.amount;
        const newAvgPrice = totalCost / totalQuantity;

        await this.updatePosition(existingPosition.id, {
          quantity: totalQuantity,
          avgPrice: newAvgPrice,
          costValue: totalCost,
        });
      } else {
        // 卖出：减少持仓数量
        const newQuantity = existingPosition.quantity - transaction.quantity;
        if (newQuantity <= 0) {
          // 完全卖出，删除持仓
          await this.deletePosition(existingPosition.id);
        } else {
          // 部分卖出，更新持仓
          const remainingCost =
            (existingPosition.costValue / existingPosition.quantity) *
            newQuantity;
          await this.updatePosition(existingPosition.id, {
            quantity: newQuantity,
            costValue: remainingCost,
          });
        }
      }
    } else if (transaction.type === 'buy') {
      // 新建持仓
      const newPosition: Omit<Position, 'id' | 'lastUpdate'> = {
        portfolioId: transaction.portfolioId,
        stockCode: transaction.stockCode,
        stockName: transaction.stockName,
        sector: '未知', // 需要从股票信息获取
        quantity: transaction.quantity,
        avgPrice: transaction.price,
        currentPrice: transaction.price,
        marketValue: transaction.amount,
        costValue: transaction.amount,
        pnl: 0,
        pnlPercent: 0,
        weight: 0,
        riskLevel: 'medium',
        stopLoss: transaction.price * 0.9,
        takeProfit: transaction.price * 1.2,
      };
      await this.addPosition(newPosition);
    }
  }

  // 更新投资组合数据
  private async updatePortfolioData(portfolioId: string): Promise<void> {
    const portfolioPositions = this.positions.filter(
      (p) => p.portfolioId === portfolioId
    );

    if (portfolioPositions.length === 0) return;

    const totalValue = portfolioPositions.reduce(
      (sum, p) => sum + p.marketValue,
      0
    );
    const totalCost = portfolioPositions.reduce(
      (sum, p) => sum + p.costValue,
      0
    );
    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

    // 更新持仓权重
    for (const position of portfolioPositions) {
      position.weight = position.marketValue / totalValue;
    }

    // 更新投资组合
    await this.updatePortfolio(portfolioId, {
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
    });
  }

  // 风险控制检查
  async checkRiskControl(portfolioId: string): Promise<{
    stopLossAlerts: StopLossAlert[];
    takeProfitAlerts: StopLossAlert[];
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    const positions = await this.getPositions(portfolioId);
    const stopLossAlerts: StopLossAlert[] = [];
    const takeProfitAlerts: StopLossAlert[] = [];

    for (const position of positions) {
      // 检查止损
      if (position.currentPrice <= position.stopLoss) {
        stopLossAlerts.push({
          positionId: position.id,
          stockCode: position.stockCode,
          stockName: position.stockName,
          currentPrice: position.currentPrice,
          stopLossPrice: position.stopLoss,
          lossPercent:
            ((position.currentPrice - position.avgPrice) / position.avgPrice) *
            100,
        });
      }

      // 检查止盈
      if (position.currentPrice >= position.takeProfit) {
        takeProfitAlerts.push({
          positionId: position.id,
          stockCode: position.stockCode,
          stockName: position.stockName,
          currentPrice: position.currentPrice,
          stopLossPrice: position.takeProfit,
          lossPercent:
            ((position.currentPrice - position.avgPrice) / position.avgPrice) *
            100,
        });
      }
    }

    // 计算整体风险等级
    const highRiskPositions = positions.filter((p) => p.riskLevel === 'high');
    const highRiskWeight = highRiskPositions.reduce(
      (sum, p) => sum + p.weight,
      0
    );

    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (highRiskWeight > 0.3) {
      riskLevel = 'high';
    } else if (highRiskWeight > 0.15) {
      riskLevel = 'medium';
    }

    return Promise.resolve({
      stopLossAlerts,
      takeProfitAlerts,
      riskLevel,
    });
  }

  // 获取再平衡建议
  async getRebalanceSuggestions(
    portfolioId: string
  ): Promise<RebalanceSuggestion[]> {
    const positions = await this.getPositions(portfolioId);
    const suggestions: RebalanceSuggestion[] = [];

    // 检查单一持仓权重过高
    for (const position of positions) {
      if (position.weight > 0.2) {
        // 超过20%
        suggestions.push({
          type: 'reduce',
          positionId: position.id,
          stockCode: position.stockCode,
          stockName: position.stockName,
          currentWeight: position.weight,
          suggestedWeight: 0.15,
          reason: '单一持仓权重过高，建议适当减仓以分散风险',
        });
      }
    }

    // 检查赛道集中度
    const sectorWeights = new Map<string, number>();
    for (const position of positions) {
      const currentWeight = sectorWeights.get(position.sector) || 0;
      sectorWeights.set(position.sector, currentWeight + position.weight);
    }

    for (const [sector, weight] of sectorWeights) {
      if (weight > 0.4) {
        // 单一赛道超过40%
        suggestions.push({
          type: 'diversify',
          positionId: '',
          stockCode: '',
          stockName: sector,
          currentWeight: weight,
          suggestedWeight: 0.3,
          reason: `${sector}赛道权重过高，建议适当分散到其他赛道`,
        });
      }
    }

    return Promise.resolve(suggestions);
  }

  // 获取投资组合表现数据
  async getPerformanceData(
    portfolioId: string,
    days: number = 30
  ): Promise<PerformanceData[]> {
    // 模拟历史表现数据
    const data: PerformanceData[] = [];
    const baseValue = 1200000;
    const baseDate = new Date('2024-01-01');

    for (let i = 0; i < days; i++) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + i);

      // 模拟价格波动
      const volatility = 0.02; // 2%日波动率
      const randomChange = (Math.random() - 0.5) * 2 * volatility;
      const value = baseValue * (1 + randomChange);
      const pnl = value - baseValue;
      const pnlPercent = (pnl / baseValue) * 100;
      const benchmark = pnlPercent * 0.8; // 基准指数表现

      data.push({
        date: date.toISOString().split('T')[0],
        totalValue: Math.round(value),
        totalPnL: Math.round(pnlPercent * 100) / 100,
        benchmark: Math.round(benchmark * 100) / 100,
      });
    }

    return Promise.resolve(data);
  }

  // 获取风险指标
  async getRiskMetrics(portfolioId: string): Promise<RiskMetrics[]> {
    const positions = await this.getPositions(portfolioId);

    // 计算风险指标
    const totalValue = positions.reduce((sum, p) => sum + p.marketValue, 0);
    const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

    // 模拟计算风险指标
    const metrics: RiskMetrics[] = [
      {
        metric: '夏普比率',
        value: 1.2,
        target: 1.0,
        status: 'good',
      },
      {
        metric: '最大回撤',
        value: 8.5,
        target: 10.0,
        status: 'good',
      },
      {
        metric: '波动率',
        value: 15.3,
        target: 12.0,
        status: 'warning',
      },
      {
        metric: '贝塔系数',
        value: 0.85,
        target: 1.0,
        status: 'good',
      },
    ];

    return Promise.resolve(metrics);
  }

  // 批量更新持仓价格
  async updatePositionPrices(
    updates: Array<{ stockCode: string; currentPrice: number }>
  ): Promise<void> {
    for (const update of updates) {
      const position = this.positions.find(
        (p) => p.stockCode === update.stockCode
      );
      if (position) {
        const newMarketValue = position.quantity * update.currentPrice;
        const newPnL = newMarketValue - position.costValue;
        const newPnLPercent =
          position.costValue > 0 ? (newPnL / position.costValue) * 100 : 0;

        await this.updatePosition(position.id, {
          currentPrice: update.currentPrice,
          marketValue: newMarketValue,
          pnl: newPnL,
          pnlPercent: newPnLPercent,
        });
      }
    }
  }

  // 导出投资组合报告
  async exportPortfolioReport(portfolioId: string): Promise<string> {
    const portfolio = await this.getPortfolio(portfolioId);
    const positions = await this.getPositions(portfolioId);
    const transactions = await this.getTransactions(portfolioId);
    const riskMetrics = await this.getRiskMetrics(portfolioId);

    if (!portfolio) {
      throw new Error('投资组合不存在');
    }

    // 生成CSV格式报告
    let csv = '投资组合报告\n';
    csv += `组合名称,${portfolio.name}\n`;
    csv += `总市值,${portfolio.totalValue}\n`;
    csv += `总成本,${portfolio.totalCost}\n`;
    csv += `总盈亏,${portfolio.totalPnL}\n`;
    csv += `盈亏比例,${portfolio.totalPnLPercent}%\n\n`;

    csv += '持仓明细\n';
    csv += '股票代码,股票名称,赛道,数量,成本价,现价,市值,盈亏,盈亏比例,权重\n';

    for (const position of positions) {
      csv += `${position.stockCode},${position.stockName},${position.sector},${
        position.quantity
      },${position.avgPrice},${position.currentPrice},${position.marketValue},${
        position.pnl
      },${position.pnlPercent}%,${(position.weight * 100).toFixed(2)}%\n`;
    }

    csv += '\n交易记录\n';
    csv += '日期,股票代码,股票名称,类型,数量,价格,金额,原因\n';

    for (const transaction of transactions) {
      csv += `${transaction.date},${transaction.stockCode},${
        transaction.stockName
      },${transaction.type === 'buy' ? '买入' : '卖出'},${
        transaction.quantity
      },${transaction.price},${transaction.amount},${transaction.reason}\n`;
    }

    return Promise.resolve(csv);
  }
}

// 导出单例实例
export const portfolioService = new PortfolioService();
