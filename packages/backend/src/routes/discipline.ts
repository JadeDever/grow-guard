import { Router } from 'express';

const router = Router();

// 获取纪律设置
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: '纪律设置列表',
  });
});

export { router as disciplineRoutes };
