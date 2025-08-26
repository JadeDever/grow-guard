import { Router } from 'express';
import { PortfolioService } from '../services/PortfolioService';
import { getDatabase } from '../database/init';

const router = Router();
const portfolioService = new PortfolioService(getDatabase());

// 获取所有投资组合
router.get('/', async (req, res) => {
  try {
    const portfolios = await portfolioService.getAllPortfolios();
    res.json({
      success: true,
      data: portfolios,
      message: '投资组合列表',
    });
  } catch (error) {
    console.error('获取投资组合列表失败:', error);
    res.status(500).json({
      success: false,
      error: '获取投资组合列表失败',
    });
  }
});

// 创建投资组合
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      totalValue,
      totalCost,
      totalPnL,
      totalPnLPercent,
      maxDrawdown,
    } = req.body;

    const portfolio = await portfolioService.createPortfolio({
      name,
      description,
      totalValue: totalValue || 0,
      totalCost: totalCost || 0,
      totalPnL: totalPnL || 0,
      totalPnLPercent: totalPnLPercent || 0,
      maxDrawdown: maxDrawdown || 0,
      positions: [],
      sectorWeights: {},
    });

    res.json({
      success: true,
      data: portfolio,
      message: '投资组合创建成功',
    });
  } catch (error) {
    console.error('创建投资组合失败:', error);
    res.status(500).json({
      success: false,
      error: '创建投资组合失败',
    });
  }
});

// 获取单个投资组合
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await portfolioService.getPortfolio(req.params.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: '投资组合不存在',
      });
    }

    res.json({
      success: true,
      data: portfolio,
      message: '投资组合详情',
    });
  } catch (error) {
    console.error('获取投资组合详情失败:', error);
    res.status(500).json({
      success: false,
      error: '获取投资组合详情失败',
    });
  }
});

// 更新投资组合
router.put('/:id', async (req, res) => {
  try {
    const portfolio = await portfolioService.updatePortfolio(
      req.params.id,
      req.body
    );
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        error: '投资组合不存在',
      });
    }

    res.json({
      success: true,
      data: portfolio,
      message: '投资组合更新成功',
    });
  } catch (error) {
    console.error('更新投资组合失败:', error);
    res.status(500).json({
      success: false,
      error: '更新投资组合失败',
    });
  }
});

// 删除投资组合
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await portfolioService.deletePortfolio(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: '投资组合不存在',
      });
    }

    res.json({
      success: true,
      message: '投资组合删除成功',
    });
  } catch (error) {
    console.error('删除投资组合失败:', error);
    res.status(500).json({
      success: false,
      error: '删除投资组合失败',
    });
  }
});

export { router as portfolioRoutes };
