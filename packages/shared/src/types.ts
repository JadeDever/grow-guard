import { z } from 'zod';

// 投资赛道枚举
export enum InvestmentSector {
  AUTO_DRIVING = '车与智能驾驶',
  AI_COMPUTING = 'AI算力',
  MILITARY = '军工',
  ADVANCED_MANUFACTURING = '高端制造',
  ROBOTICS = '机器人',
  NEW_ENERGY = '新能源',
}

// 股票信息
export const StockSchema = z.object({
  code: z.string().length(6), // 股票代码
  name: z.string().min(1), // 股票名称
  sector: z.nativeEnum(InvestmentSector), // 所属赛道
  currentPrice: z.number().positive(), // 当前价格
  changePercent: z.number(), // 涨跌幅
  marketCap: z.number().positive(), // 市值
  pe: z.number().optional(), // 市盈率
  pb: z.number().optional(), // 市净率
});

export type Stock = z.infer<typeof StockSchema>;

// 持仓信息
export const PositionSchema = z.object({
  id: z.string().uuid(),
  stockCode: z.string().length(6),
  stockName: z.string(),
  sector: z.nativeEnum(InvestmentSector),
  quantity: z.number().positive(), // 持股数量
  avgCost: z.number().positive(), // 平均成本
  currentPrice: z.number().positive(),
  marketValue: z.number().positive(), // 市值
  unrealizedPnL: z.number(), // 未实现盈亏
  unrealizedPnLPercent: z.number(), // 未实现盈亏比例
  weight: z.number().min(0).max(1), // 仓位权重
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Position = z.infer<typeof PositionSchema>;

// 投资组合
export const PortfolioSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  totalValue: z.number().positive(), // 总市值
  totalCost: z.number().positive(), // 总成本
  totalPnL: z.number(), // 总盈亏
  totalPnLPercent: z.number(), // 总盈亏比例
  maxDrawdown: z.number().min(0).max(1), // 最大回撤
  positions: z.array(PositionSchema),
  sectorWeights: z.record(z.nativeEnum(InvestmentSector), z.number()), // 赛道权重
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Portfolio = z.infer<typeof PortfolioSchema>;

// 纪律设置
export const DisciplineSettingsSchema = z.object({
  id: z.string().uuid(),
  portfolioId: z.string().uuid(),
  stopLossPercent: z.number().min(0).max(1), // 止损比例
  takeProfitPercent: z.number().min(0).max(1), // 止盈比例
  maxPositionWeight: z.number().min(0).max(1), // 单股最大仓位
  maxSectorWeight: z.number().min(0).max(1), // 单赛道最大仓位
  rebalanceThreshold: z.number().min(0).max(1), // 再平衡阈值
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DisciplineSettings = z.infer<typeof DisciplineSettingsSchema>;

// 交易记录
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  portfolioId: z.string().uuid(),
  stockCode: z.string().length(6),
  stockName: z.string(),
  type: z.enum(['BUY', 'SELL']), // 交易类型
  quantity: z.number().positive(), // 交易数量
  price: z.number().positive(), // 交易价格
  amount: z.number().positive(), // 交易金额
  commission: z.number().min(0), // 手续费
  date: z.date(),
  reason: z.string().optional(), // 交易原因
  createdAt: z.date(),
});

export type Transaction = z.infer<typeof TransactionSchema>;

// 报告类型
export const ReportTypeSchema = z.enum(['MORNING', 'CLOSING', 'ALERT']);
export type ReportType = z.infer<typeof ReportTypeSchema>;

// 报告内容
export const ReportSchema = z.object({
  id: z.string().uuid(),
  portfolioId: z.string().uuid(),
  type: ReportTypeSchema,
  title: z.string(),
  content: z.string(),
  summary: z.string(),
  keyMetrics: z.record(z.string(), z.union([z.string(), z.number()])),
  recommendations: z.array(z.string()),
  createdAt: z.date(),
});

export type Report = z.infer<typeof ReportSchema>;

// 用户设置
export const UserSettingsSchema = z.object({
  id: z.string().uuid(),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.enum(['zh-CN', 'en-US']).default('zh-CN'),
  notifications: z.object({
    dailyReport: z.boolean().default(true),
    priceAlert: z.boolean().default(true),
    disciplineReminder: z.boolean().default(true),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

// API响应类型
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.unknown().optional(),
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};

// 分页参数
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  total: z.number().min(0).optional(),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// 分页响应
export const PaginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  pagination: PaginationSchema,
});

export type PaginatedResponse<T> = {
  data: T[];
  pagination: Pagination;
};
