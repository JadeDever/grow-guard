import { Router } from 'express';

const router = Router();

// 获取所有持仓
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: '持仓列表',
  });
});

export { router as positionRoutes };
