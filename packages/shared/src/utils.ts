import { Position, Portfolio, InvestmentSector, Transaction } from './types';

/**
 * 计算投资组合总市值
 */
export function calculateTotalValue(positions: Position[]): number {
  return positions.reduce((total, position) => total + position.marketValue, 0);
}

/**
 * 计算投资组合总成本
 */
export function calculateTotalCost(positions: Position[]): number {
  return positions.reduce(
    (total, position) => total + position.avgCost * position.quantity,
    0
  );
}

/**
 * 计算投资组合总盈亏
 */
export function calculateTotalPnL(positions: Position[]): number {
  return positions.reduce(
    (total, position) => total + position.unrealizedPnL,
    0
  );
}

/**
 * 计算投资组合总盈亏比例
 */
export function calculateTotalPnLPercent(positions: Position[]): number {
  const totalCost = calculateTotalCost(positions);
  if (totalCost === 0) return 0;
  return (calculateTotalPnL(positions) / totalCost) * 100;
}

/**
 * 计算各赛道权重
 */
export function calculateSectorWeights(
  positions: Position[]
): Record<InvestmentSector, number> {
  const totalValue = calculateTotalValue(positions);
  if (totalValue === 0) {
    return Object.values(InvestmentSector).reduce((acc, sector) => {
      acc[sector] = 0;
      return acc;
    }, {} as Record<InvestmentSector, number>);
  }

  const sectorValues: Record<InvestmentSector, number> = Object.values(
    InvestmentSector
  ).reduce((acc, sector) => {
    acc[sector] = 0;
    return acc;
  }, {} as Record<InvestmentSector, number>);

  positions.forEach((position) => {
    sectorValues[position.sector] += position.marketValue;
  });

  const sectorWeights: Record<InvestmentSector, number> = {} as Record<
    InvestmentSector,
    number
  >;
  Object.entries(sectorValues).forEach(([sector, value]) => {
    sectorWeights[sector as InvestmentSector] = value / totalValue;
  });

  return sectorWeights;
}

/**
 * 计算最大回撤
 */
export function calculateMaxDrawdown(positions: Position[]): number {
  // 这里简化处理，实际应该基于历史价格数据计算
  // 暂时返回0，后续实现
  return 0;
}

/**
 * 格式化金额显示
 */
export function formatCurrency(
  amount: number,
  currency: string = 'CNY'
): string {
  if (currency === 'CNY') {
    return `¥${amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * 格式化百分比显示
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * 格式化数字显示（带千分位分隔符）
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * 检查是否触发止损
 */
export function checkStopLoss(
  position: Position,
  stopLossPercent: number
): boolean {
  return position.unrealizedPnLPercent <= -stopLossPercent;
}

/**
 * 检查是否触发止盈
 */
export function checkTakeProfit(
  position: Position,
  takeProfitPercent: number
): boolean {
  return position.unrealizedPnLPercent >= takeProfitPercent;
}

/**
 * 检查仓位是否超限
 */
export function checkPositionLimit(
  position: Position,
  maxWeight: number,
  totalValue: number
): boolean {
  const currentWeight = position.marketValue / totalValue;
  return currentWeight > maxWeight;
}

/**
 * 检查赛道权重是否超限
 */
export function checkSectorLimit(
  positions: Position[],
  sector: InvestmentSector,
  maxSectorWeight: number,
  totalValue: number
): boolean {
  const sectorValue = positions
    .filter((p) => p.sector === sector)
    .reduce((sum, p) => sum + p.marketValue, 0);
  const sectorWeight = sectorValue / totalValue;
  return sectorWeight > maxSectorWeight;
}

/**
 * 生成调仓建议
 */
export function generateRebalanceSuggestions(
  currentPositions: Position[],
  targetWeights: Record<string, number>,
  totalValue: number
): Array<{
  stockCode: string;
  action: 'BUY' | 'SELL';
  quantity: number;
  reason: string;
}> {
  const suggestions: Array<{
    stockCode: string;
    action: 'BUY' | 'SELL';
    quantity: number;
    reason: string;
  }> = [];

  currentPositions.forEach((position) => {
    const currentWeight = position.marketValue / totalValue;
    const targetWeight = targetWeights[position.stockCode] || 0;
    const weightDiff = targetWeight - currentWeight;

    if (Math.abs(weightDiff) > 0.01) {
      // 1%的阈值
      const targetValue = totalValue * targetWeight;
      const currentValue = position.marketValue;
      const valueDiff = targetValue - currentValue;

      if (valueDiff > 0) {
        // 需要买入
        const quantity =
          Math.floor(valueDiff / position.currentPrice / 100) * 100; // 按100股取整
        if (quantity > 0) {
          suggestions.push({
            stockCode: position.stockCode,
            action: 'BUY',
            quantity,
            reason: `调整仓位至目标权重 ${formatPercentage(targetWeight)}`,
          });
        }
      } else {
        // 需要卖出
        const quantity =
          Math.floor(Math.abs(valueDiff) / position.currentPrice / 100) * 100;
        if (quantity > 0) {
          suggestions.push({
            stockCode: position.stockCode,
            action: 'SELL',
            quantity,
            reason: `调整仓位至目标权重 ${formatPercentage(targetWeight)}`,
          });
        }
      }
    }
  });

  return suggestions;
}

/**
 * 计算持仓的加权平均成本
 */
export function calculateWeightedAverageCost(
  transactions: Transaction[]
): number {
  let totalQuantity = 0;
  let totalCost = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === 'BUY') {
      totalQuantity += transaction.quantity;
      totalCost += transaction.amount;
    } else if (transaction.type === 'SELL') {
      totalQuantity -= transaction.quantity;
      totalCost -= transaction.amount;
    }
  });

  if (totalQuantity <= 0) return 0;
  return totalCost / totalQuantity;
}

/**
 * 生成交易清单（按100股取整）
 */
export function generateTradeList(
  suggestions: Array<{
    stockCode: string;
    action: 'BUY' | 'SELL';
    quantity: number;
  }>
): string {
  return suggestions
    .map(
      (suggestion) =>
        `${suggestion.action === 'BUY' ? '买入' : '卖出'} ${
          suggestion.stockCode
        } ${suggestion.quantity}股`
    )
    .join('\n');
}

/**
 * 获取赛道颜色（用于图表显示）
 */
export function getSectorColor(sector: InvestmentSector): string {
  const colors: Record<InvestmentSector, string> = {
    [InvestmentSector.AUTO_DRIVING]: '#3B82F6', // 蓝色
    [InvestmentSector.AI_COMPUTING]: '#8B5CF6', // 紫色
    [InvestmentSector.MILITARY]: '#EF4444', // 红色
    [InvestmentSector.ADVANCED_MANUFACTURING]: '#10B981', // 绿色
    [InvestmentSector.ROBOTICS]: '#F59E0B', // 黄色
    [InvestmentSector.NEW_ENERGY]: '#06B6D4', // 青色
  };
  return colors[sector] || '#6B7280';
}

/**
 * 获取赛道图标（用于UI显示）
 */
export function getSectorIcon(sector: InvestmentSector): string {
  const icons: Record<InvestmentSector, string> = {
    [InvestmentSector.AUTO_DRIVING]: '🚗',
    [InvestmentSector.AI_COMPUTING]: '🤖',
    [InvestmentSector.MILITARY]: '🛡️',
    [InvestmentSector.ADVANCED_MANUFACTURING]: '⚙️',
    [InvestmentSector.ROBOTICS]: '🤖',
    [InvestmentSector.NEW_ENERGY]: '⚡',
  };
  return icons[sector] || '📊';
}
