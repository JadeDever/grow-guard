import { Router } from 'express';
import { PortfolioService } from '../services/PortfolioService';
import { getDatabase } from '../database/init';

const router = Router();
const portfolioService = new PortfolioService(getDatabase());

// 获取所有交易记录
router.get('/', async (req, res) => {
  try {
    const { portfolioId } = req.query;
    const transactions = await portfolioService.getTransactions(
      portfolioId as string
    );

    res.json({
      success: true,
      data: transactions,
      message: '交易记录列表',
    });
  } catch (error) {
    console.error('获取交易记录列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取交易记录列表失败',
    });
  }
});

// 创建交易记录
router.post('/', async (req, res) => {
  try {
    const transaction = await portfolioService.createTransaction(req.body);
    res.json({
      success: true,
      data: transaction,
      message: '交易记录创建成功',
    });
  } catch (error) {
    console.error('创建交易记录失败:', error);
    res.status(500).json({
      success: false,
      error: '创建交易记录失败',
    });
  }
});

export { router as transactionRoutes };
