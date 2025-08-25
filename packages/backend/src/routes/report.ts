import { Router } from 'express';

const router = Router();

// 获取所有报告
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: '报告列表',
  });
});

export { router as reportRoutes };
