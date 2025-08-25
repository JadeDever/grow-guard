import { Router } from 'express';

const router = Router();

// 获取所有交易记录
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: '交易记录列表',
  });
});

export { router as transactionRoutes };
