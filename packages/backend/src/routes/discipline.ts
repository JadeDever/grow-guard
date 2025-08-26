import { Router } from 'express';
import { PortfolioService } from '../services/PortfolioService';
import { getDatabase } from '../database/init';

const router = Router();
const portfolioService = new PortfolioService(getDatabase());

// 获取纪律设置
router.get('/:portfolioId', async (req, res) => {
  try {
    const settings = await portfolioService.getDisciplineSettings(
      req.params.portfolioId
    );
    res.json({
      success: true,
      data: settings,
      message: '纪律设置',
    });
  } catch (error) {
    console.error('获取纪律设置失败:', error);
    res.status(500).json({
      success: false,
      error: '获取纪律设置失败',
    });
  }
});

// 更新纪律设置
router.put('/:portfolioId', async (req, res) => {
  try {
    const settings = await portfolioService.updateDisciplineSettings(
      req.params.portfolioId,
      req.body
    );
    res.json({
      success: true,
      data: settings,
      message: '纪律设置更新成功',
    });
  } catch (error) {
    console.error('更新纪律设置失败:', error);
    res.status(500).json({
      success: false,
      error: '更新纪律设置失败',
    });
  }
});

export { router as disciplineRoutes };
