import { Router } from 'express';

const router = Router();

// 获取所有投资组合
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: [],
    message: '投资组合列表',
  });
});

// 创建投资组合
router.post('/', (req, res) => {
  res.json({
    success: true,
    data: { id: 'temp-id', name: req.body.name },
    message: '投资组合创建成功',
  });
});

// 获取单个投资组合
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    data: { id: req.params.id, name: '示例组合' },
    message: '投资组合详情',
  });
});

export { router as portfolioRoutes };
