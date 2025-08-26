import { z } from 'zod';

// 投资赛道枚举
export enum InvestmentSector {
  AI_COMPUTING = 'AI算力',
  NEW_ENERGY = '新能源',
  AUTO_DRIVING = '车与智能驾驶',
  MILITARY = '军工',
  ADVANCED_MANUFACTURING = '高端制造',
  ROBOTICS = '机器人',
}

// 投资组合Schema
export const PortfolioSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  totalValue: z.number().positive(),
  totalCost: z.number().positive(),
  totalPnL: z.number(),
  totalPnLPercent: z.number(),
  maxDrawdown: z.number().min(0).max(1),
  positions: z.array(z.any()).default([]),
  sectorWeights: z.record(z.string(), z.number()).default({}),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Portfolio = z.infer<typeof PortfolioSchema>;

// 持仓Schema
export const PositionSchema = z.object({
  id: z.string().uuid(),
  stockCode: z.string().length(6),
  stockName: z.string(),
  sector: z.nativeEnum(InvestmentSector),
  quantity: z.number().positive(),
  avgCost: z.number().positive(),
  currentPrice: z.number().positive(),
  marketValue: z.number().positive(),
  unrealizedPnL: z.number(),
  unrealizedPnLPercent: z.number(),
  weight: z.number().min(0).max(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Position = z.infer<typeof PositionSchema>;

// 交易记录Schema
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  portfolioId: z.string().uuid(),
  stockCode: z.string().length(6),
  stockName: z.string(),
  type: z.enum(['BUY', 'SELL']),
  quantity: z.number().positive(),
  price: z.number().positive(),
  amount: z.number().positive(),
  commission: z.number().min(0),
  date: z.date(),
  reason: z.string().optional(),
  createdAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// 纪律设置Schema
export const DisciplineSettingsSchema = z.object({
  id: z.string().uuid(),
  portfolioId: z.string().uuid(),
  stopLossPercent: z.number().min(0).max(1),
  takeProfitPercent: z.number().min(0).max(1),
  maxPositionWeight: z.number().min(0).max(1),
  maxSectorWeight: z.number().min(0).max(1),
  rebalanceThreshold: z.number().min(0).max(1),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DisciplineSettings = z.infer<typeof DisciplineSettingsSchema>;

// 数据库行类型接口
export interface PortfolioRow {
  id: string;
  name: string;
  description: string;
  total_value: number;
  total_cost: number;
  total_pnl: number;
  total_pnl_percent: number;
  max_drawdown: number;
  created_at: string;
  updated_at: string;
}

export interface PositionRow {
  id: string;
  stock_code: string;
  stock_name: string;
  sector: string;
  quantity: number;
  avg_cost: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_percent: number;
  weight: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionRow {
  id: string;
  portfolio_id: string;
  stock_code: string;
  stock_name: string;
  type: string;
  quantity: number;
  price: number;
  amount: number;
  commission: number;
  date: string;
  reason: string;
  created_at: string;
}

export interface DisciplineSettingsRow {
  id: string;
  portfolio_id: string;
  stop_loss_percent: number;
  take_profit_percent: number;
  max_position_weight: number;
  max_sector_weight: number;
  rebalance_threshold: number;
  created_at: string;
  updated_at: string;
}
