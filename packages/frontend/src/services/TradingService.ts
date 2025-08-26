import { 
  Transaction, 
  Position, 
  Portfolio,
  TradeOrder,
  TradeExecution,
  TradeAnalysis,
  TradeStrategy
} from '@shared/types';

export class TradingService {
  private transactions: Transaction[] = [];
  private tradeOrders: TradeOrder[] = [];
  private tradeExecutions: TradeExecution[] = [];

  constructor() {
    this.initializeMockData();
  }

  // 初始化模拟数据
  private initializeMockData() {
    // 模拟交易订单
    this.tradeOrders = [
      {
        id: '1',
        portfolioId: '1',
        stockCode: '002594',
        stockName: '比亚迪',
        orderType: 'buy',
        quantity: 500,
        price: 185.0,
        orderStatus: 'filled',
        orderTime: '2024-01-15 09:30:00',
        filledTime: '2024-01-15 09:31:15',
        filledPrice: 185.2,
        filledQuantity: 500,
        commission: 25,
        reason: '技术面突破，加仓',
        strategy: 'momentum'
      },
      {
        id: '2',
        portfolioId: '1',
        stockCode: '300750',
        stockName: '宁德时代',
        orderType: 'sell',
        quantity: 200,
        price: 175.0,
        orderStatus: 'pending',
        orderTime: '2024-01-15 14:00:00',
        filledTime: null,
        filledPrice: null,
        filledQuantity: 0,
        commission: 0,
        reason: '止盈减仓',
        strategy: 'take_profit'
      }
    ];

    // 模拟交易执行记录
    this.tradeExecutions = [
      {
        id: '1',
        orderId: '1',
        executionTime: '2024-01-15 09:31:15',
        price: 185.2,
        quantity: 500,
        marketImpact: 0.1,
        slippage: 0.2,
        executionQuality: 'good'
      }
    ];
  }

  // 创建交易订单
  async createTradeOrder(order: Omit<TradeOrder, 'id' | 'orderTime'>): Promise<TradeOrder> {
    const newOrder: TradeOrder = {
      ...order,
      id: Date.now().toString(),
      orderTime: new Date().toISOString()
    };

    this.tradeOrders.push(newOrder);

    // 如果是市价单，立即执行
    if (order.orderType === 'market') {
      await this.executeMarketOrder(newOrder);
    }

    return Promise.resolve(newOrder);
  }

  // 执行市价单
  private async executeMarketOrder(order: TradeOrder): Promise<void> {
    // 模拟市价单执行
    const executionPrice = this.getMarketPrice(order.stockCode);
    const execution: TradeExecution = {
      id: Date.now().toString(),
      orderId: order.id,
      executionTime: new Date().toISOString(),
      price: executionPrice,
      quantity: order.quantity,
      marketImpact: this.calculateMarketImpact(order.quantity, executionPrice),
      slippage: Math.abs(executionPrice - order.price) / order.price,
      executionQuality: this.assessExecutionQuality(order, executionPrice)
    };

    this.tradeExecutions.push(execution);

    // 更新订单状态
    const orderIndex = this.tradeOrders.findIndex(o => o.id === order.id);
    if (orderIndex !== -1) {
      this.tradeOrders[orderIndex] = {
        ...this.tradeOrders[orderIndex],
        orderStatus: 'filled',
        filledTime: execution.executionTime,
        filledPrice: execution.price,
        filledQuantity: execution.quantity
      };
    }
  }

  // 获取市价（模拟）
  private getMarketPrice(stockCode: string): number {
    // 模拟不同股票的市价
    const priceMap: { [key: string]: number } = {
      '002594': 185.2, // 比亚迪
      '300750': 172.5, // 宁德时代
      '002415': 31.2   // 海康威视
    };
    return priceMap[stockCode] || 100;
  }

  // 计算市场冲击
  private calculateMarketImpact(quantity: number, price: number): number {
    // 基于交易量计算市场冲击
    const tradeValue = quantity * price;
    if (tradeValue > 1000000) { // 100万以上
      return 0.3;
    } else if (tradeValue > 500000) { // 50万以上
      return 0.2;
    } else {
      return 0.1;
    }
  }

  // 评估执行质量
  private assessExecutionQuality(order: TradeOrder, executionPrice: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (order.orderType === 'market') {
      return 'good'; // 市价单通常执行质量较好
    }

    const priceDiff = Math.abs(executionPrice - order.price) / order.price;
    if (priceDiff < 0.001) {
      return 'excellent';
    } else if (priceDiff < 0.005) {
      return 'good';
    } else if (priceDiff < 0.01) {
      return 'fair';
    } else {
      return 'poor';
    }
  }

  // 获取交易订单列表
  async getTradeOrders(portfolioId?: string): Promise<TradeOrder[]> {
    if (portfolioId) {
      return Promise.resolve(this.tradeOrders.filter(o => o.portfolioId === portfolioId));
    }
    return Promise.resolve(this.tradeOrders);
  }

  // 获取交易订单详情
  async getTradeOrder(id: string): Promise<TradeOrder | null> {
    const order = this.tradeOrders.find(o => o.id === id);
    return Promise.resolve(order || null);
  }

  // 更新交易订单
  async updateTradeOrder(id: string, updates: Partial<TradeOrder>): Promise<TradeOrder | null> {
    const index = this.tradeOrders.findIndex(o => o.id === id);
    if (index === -1) return null;

    this.tradeOrders[index] = {
      ...this.tradeOrders[index],
      ...updates
    };

    return Promise.resolve(this.tradeOrders[index]);
  }

  // 取消交易订单
  async cancelTradeOrder(id: string): Promise<boolean> {
    const index = this.tradeOrders.findIndex(o => o.id === id);
    if (index === -1) return false;

    if (this.tradeOrders[index].orderStatus === 'pending') {
      this.tradeOrders[index].orderStatus = 'cancelled';
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  // 获取交易执行记录
  async getTradeExecutions(orderId?: string): Promise<TradeExecution[]> {
    if (orderId) {
      return Promise.resolve(this.tradeExecutions.filter(e => e.orderId === orderId));
    }
    return Promise.resolve(this.tradeExecutions);
  }

  // 分析交易表现
  async analyzeTradingPerformance(portfolioId: string, period: '1d' | '1w' | '1m' | '3m' | '1y' = '1m'): Promise<TradeAnalysis> {
    const orders = await this.getTradeOrders(portfolioId);
    const executions = await this.getTradeExecutions();
    
    // 过滤指定时间段的交易
    const periodStart = this.getPeriodStart(period);
    const periodOrders = orders.filter(o => new Date(o.orderTime) >= periodStart);
    const periodExecutions = executions.filter(e => {
      const order = orders.find(o => o.id === e.orderId);
      return order && new Date(order.orderTime) >= periodStart;
    });

    // 计算交易统计
    const totalTrades = periodOrders.length;
    const filledTrades = periodOrders.filter(o => o.orderStatus === 'filled').length;
    const cancelledTrades = periodOrders.filter(o => o.orderStatus === 'cancelled').length;
    
    // 计算交易成本
    const totalCommission = periodExecutions.reduce((sum, e) => {
      const order = orders.find(o => o.id === e.orderId);
      return sum + (order?.commission || 0);
    }, 0);

    // 计算平均滑点
    const totalSlippage = periodExecutions.reduce((sum, e) => sum + e.slippage, 0);
    const avgSlippage = periodExecutions.length > 0 ? totalSlippage / periodExecutions.length : 0;

    // 计算执行质量分布
    const executionQuality = {
      excellent: periodExecutions.filter(e => e.executionQuality === 'excellent').length,
      good: periodExecutions.filter(e => e.executionQuality === 'good').length,
      fair: periodExecutions.filter(e => e.executionQuality === 'fair').length,
      poor: periodExecutions.filter(e => e.executionQuality === 'poor').length
    };

    // 按策略分析
    const strategyAnalysis = this.analyzeTradingByStrategy(periodOrders);

    return {
      portfolioId,
      period,
      totalTrades,
      filledTrades,
      cancelledTrades,
      fillRate: totalTrades > 0 ? (filledTrades / totalTrades) * 100 : 0,
      totalCommission,
      avgSlippage: avgSlippage * 100, // 转换为百分比
      executionQuality,
      strategyAnalysis,
      recommendations: this.generateTradingRecommendations({
        fillRate: totalTrades > 0 ? (filledTrades / totalTrades) * 100 : 0,
        avgSlippage: avgSlippage * 100,
        executionQuality,
        strategyAnalysis
      })
    };
  }

  // 获取时间段开始时间
  private getPeriodStart(period: string): Date {
    const now = new Date();
    switch (period) {
      case '1d':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);
      case '1w':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '1m':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '3m':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  // 按策略分析交易
  private analyzeTradingByStrategy(orders: TradeOrder[]): TradeStrategy[] {
    const strategyMap = new Map<string, {
      totalTrades: number;
      filledTrades: number;
      totalValue: number;
      avgSlippage: number;
    }>();

    for (const order of orders) {
      const existing = strategyMap.get(order.strategy) || {
        totalTrades: 0,
        filledTrades: 0,
        totalValue: 0,
        avgSlippage: 0
      };

      existing.totalTrades += 1;
      if (order.orderStatus === 'filled') {
        existing.filledTrades += 1;
        existing.totalValue += (order.filledPrice || 0) * (order.filledQuantity || 0);
      }

      strategyMap.set(order.strategy, existing);
    }

    return Array.from(strategyMap.entries()).map(([strategy, data]) => ({
      strategy,
      totalTrades: data.totalTrades,
      filledTrades: data.filledTrades,
      fillRate: data.totalTrades > 0 ? (data.filledTrades / data.totalTrades) * 100 : 0,
      totalValue: data.totalValue,
      avgSlippage: data.avgSlippage * 100
    }));
  }

  // 生成交易建议
  private generateTradingRecommendations(data: {
    fillRate: number;
    avgSlippage: number;
    executionQuality: { excellent: number; good: number; fair: number; poor: number };
    strategyAnalysis: TradeStrategy[];
  }): string[] {
    const recommendations: string[] = [];

    // 基于成交率
    if (data.fillRate < 80) {
      recommendations.push('成交率较低，建议检查订单价格设置，考虑使用市价单提高成交率');
    }

    // 基于滑点
    if (data.avgSlippage > 0.5) {
      recommendations.push('平均滑点较高，建议优化交易时机，避免在波动较大时段交易');
    }

    // 基于执行质量
    const poorExecutions = data.executionQuality.poor;
    if (poorExecutions > 0) {
      recommendations.push('存在执行质量较差的交易，建议检查交易策略和时机选择');
    }

    // 基于策略分析
    const lowFillRateStrategies = data.strategyAnalysis.filter(s => s.fillRate < 70);
    if (lowFillRateStrategies.length > 0) {
      recommendations.push(`策略 ${lowFillRateStrategies.map(s => s.strategy).join(', ')} 成交率较低，建议优化策略参数`);
    }

    if (recommendations.length === 0) {
      recommendations.push('交易表现良好，继续保持现有策略');
    }

    return recommendations;
  }

  // 创建批量交易订单
  async createBatchTradeOrders(orders: Omit<TradeOrder, 'id' | 'orderTime'>[]): Promise<TradeOrder[]> {
    const createdOrders: TradeOrder[] = [];
    
    for (const order of orders) {
      const createdOrder = await this.createTradeOrder(order);
      createdOrders.push(createdOrder);
    }

    return Promise.resolve(createdOrders);
  }

  // 获取交易历史
  async getTradeHistory(portfolioId: string, startDate?: string, endDate?: string): Promise<Transaction[]> {
    let filteredTransactions = this.transactions.filter(t => t.portfolioId === portfolioId);
    
    if (startDate) {
      filteredTransactions = filteredTransactions.filter(t => t.date >= startDate);
    }
    
    if (endDate) {
      filteredTransactions = filteredTransactions.filter(t => t.date <= endDate);
    }

    // 按日期排序
    filteredTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return Promise.resolve(filteredTransactions);
  }

  // 计算交易成本
  calculateTradingCosts(transactions: Transaction[]): {
    totalCommission: number;
    totalTax: number;
    totalCosts: number;
    costBreakdown: { commission: number; tax: number; other: number };
  } {
    const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);
    const totalTax = transactions.reduce((sum, t) => sum + t.tax, 0);
    const totalCosts = totalCommission + totalTax;

    return {
      totalCommission,
      totalTax,
      totalCosts,
      costBreakdown: {
        commission: totalCommission,
        tax: totalTax,
        other: 0
      }
    };
  }

  // 导出交易报告
  async exportTradeReport(portfolioId: string, period: string): Promise<string> {
    const analysis = await this.analyzeTradingPerformance(portfolioId, period as any);
    const orders = await this.getTradeOrders(portfolioId);
    const executions = await this.getTradeExecutions();

    let report = `交易报告\n`;
    report += `投资组合ID: ${portfolioId}\n`;
    report += `报告期间: ${period}\n`;
    report += `生成时间: ${new Date().toLocaleString()}\n\n`;

    report += `交易概览:\n`;
    report += `- 总交易次数: ${analysis.totalTrades}\n`;
    report += `- 成交次数: ${analysis.filledTrades}\n`;
    report += `- 成交率: ${analysis.fillRate.toFixed(2)}%\n`;
    report += `- 总手续费: ¥${analysis.totalCommission}\n`;
    report += `- 平均滑点: ${analysis.avgSlippage.toFixed(2)}%\n\n`;

    report += `执行质量分布:\n`;
    report += `- 优秀: ${analysis.executionQuality.excellent}\n`;
    report += `- 良好: ${analysis.executionQuality.good}\n`;
    report += `- 一般: ${analysis.executionQuality.fair}\n`;
    report += `- 较差: ${analysis.executionQuality.poor}\n\n`;

    report += `策略分析:\n`;
    for (const strategy of analysis.strategyAnalysis) {
      report += `- ${strategy.strategy}: 成交率${strategy.fillRate.toFixed(1)}%, 交易${strategy.totalTrades}次\n`;
    }

    report += `\n主要建议:\n`;
    for (const recommendation of analysis.recommendations) {
      report += `- ${recommendation}\n`;
    }

    return report;
  }

  // 模拟实时交易监控
  startTradeMonitoring(portfolioId: string, callback: (alerts: any) => void): () => void {
    // 模拟每1分钟检查一次交易状态
    const interval = setInterval(() => {
      // 检查是否有新的交易执行
      const mockAlerts = {
        timestamp: new Date().toISOString(),
        portfolioId,
        alerts: [
          {
            type: 'trade_execution',
            message: '有新的交易执行完成',
            level: 'info'
          }
        ]
      };
      
      callback(mockAlerts);
    }, 60 * 1000);
    
    // 返回停止监控的函数
    return () => clearInterval(interval);
  }
}

// 导出单例实例
export const tradingService = new TradingService();
