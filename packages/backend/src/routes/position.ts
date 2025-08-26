import { Router } from 'express';
import { PortfolioService } from '../services/PortfolioService';
import { getDatabase } from '../database/init';

const router = Router();
const portfolioService = new PortfolioService(getDatabase());

// 获取所有持仓
router.get('/', async (req, res) => {
  try {
    const { portfolioId } = req.query;
    const positions = await portfolioService.getPositions(
      portfolioId as string
    );

    res.json({
      success: true,
      data: positions,
      message: '持仓列表',
    });
  } catch (error) {
    console.error('获取持仓列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取持仓列表失败',
    });
  }
});

// 创建持仓
router.post('/', async (req, res) => {
  try {
    const position = await portfolioService.createPosition(req.body);
    res.json({
      success: true,
      data: position,
      message: '持仓创建成功',
    });
  } catch (error) {
    console.error('创建持仓失败:', error);
    res.status(500).json({
      success: false,
      error: '创建持仓失败',
    });
  }
});

// 更新持仓
router.put('/:id', async (req, res) => {
  try {
    const position = await portfolioService.updatePosition(
      req.params.id,
      req.body
    );
    if (!position) {
      return res.status(404).json({
        success: false,
        error: '持仓不存在',
      });
    }

    res.json({
      success: true,
      data: position,
      message: '持仓更新成功',
    });
  } catch (error) {
    console.error('更新持仓失败:', error);
    res.status(500).json({
      success: false,
      error: '更新持仓失败',
    });
  }
});

// 删除持仓
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await portfolioService.deletePosition(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: '持仓不存在',
      });
    }

    res.json({
      success: true,
      message: '持仓删除成功',
    });
  } catch (error) {
    console.error('删除持仓失败:', error);
    res.status(500).json({
      success: false,
      error: '删除持仓失败',
    });
  }
});

export { router as positionRoutes };
