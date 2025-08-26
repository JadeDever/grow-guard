import { PortfolioService } from '../services/PortfolioService';
import { getDatabase } from '../database/init';
import { InvestmentSector } from '../types';

async function seedData() {
  const portfolioService = new PortfolioService(getDatabase());

  try {
    console.log('🌱 开始初始化示例数据...');

    // 创建示例投资组合
    const portfolio = await portfolioService.createPortfolio({
      name: '长盈智投组合',
      description: '专注于AI、新能源、军工等成长赛道的投资组合',
      totalValue: 1250000,
      totalCost: 1200000,
      totalPnL: 50000,
      totalPnLPercent: 4.17,
      maxDrawdown: 0.08,
      positions: [],
      sectorWeights: {},
    });

    console.log('✅ 投资组合创建成功:', portfolio.name);

    // 创建示例持仓
    const positions = [
      {
        stockCode: '002594',
        stockName: '比亚迪',
        sector: InvestmentSector.AUTO_DRIVING,
        quantity: 1000,
        avgCost: 180.5,
        currentPrice: 185.2,
        marketValue: 185200,
        unrealizedPnL: 4700,
        unrealizedPnLPercent: 2.6,
        weight: 0.148,
      },
      {
        stockCode: '300750',
        stockName: '宁德时代',
        sector: InvestmentSector.NEW_ENERGY,
        quantity: 800,
        avgCost: 165.8,
        currentPrice: 172.5,
        marketValue: 138000,
        unrealizedPnL: 5360,
        unrealizedPnLPercent: 4.0,
        weight: 0.11,
      },
      {
        stockCode: '002415',
        stockName: '海康威视',
        sector: InvestmentSector.AI_COMPUTING,
        quantity: 1200,
        avgCost: 28.5,
        currentPrice: 31.2,
        marketValue: 37440,
        unrealizedPnL: 3240,
        unrealizedPnLPercent: 9.5,
        weight: 0.03,
      },
      {
        stockCode: '000858',
        stockName: '五粮液',
        sector: InvestmentSector.ADVANCED_MANUFACTURING,
        quantity: 500,
        avgCost: 150.0,
        currentPrice: 145.0,
        marketValue: 72500,
        unrealizedPnL: -2500,
        unrealizedPnLPercent: -3.3,
        weight: 0.058,
      },
      {
        stockCode: '600519',
        stockName: '贵州茅台',
        sector: InvestmentSector.ADVANCED_MANUFACTURING,
        quantity: 200,
        avgCost: 1800.0,
        currentPrice: 1850.0,
        marketValue: 370000,
        unrealizedPnL: 10000,
        unrealizedPnLPercent: 2.8,
        weight: 0.296,
      },
    ];

    for (const positionData of positions) {
      const position = await portfolioService.createPosition(positionData);
      console.log('✅ 持仓创建成功:', position.stockName);
    }

    // 创建示例交易记录
    const transactions = [
      {
        portfolioId: portfolio.id,
        stockCode: '002594',
        stockName: '比亚迪',
        type: 'BUY' as const,
        quantity: 1000,
        price: 180.5,
        amount: 180500,
        commission: 90.25,
        date: new Date('2024-01-10'),
        reason: '建仓',
      },
      {
        portfolioId: portfolio.id,
        stockCode: '300750',
        stockName: '宁德时代',
        type: 'BUY' as const,
        quantity: 800,
        price: 165.8,
        amount: 132640,
        commission: 66.32,
        date: new Date('2024-01-08'),
        reason: '建仓',
      },
      {
        portfolioId: portfolio.id,
        stockCode: '002415',
        stockName: '海康威视',
        type: 'BUY' as const,
        quantity: 1200,
        price: 28.5,
        amount: 34200,
        commission: 17.1,
        date: new Date('2024-01-05'),
        reason: '建仓',
      },
    ];

    for (const transactionData of transactions) {
      const transaction = await portfolioService.createTransaction(
        transactionData
      );
      console.log(
        '✅ 交易记录创建成功:',
        transaction.stockName,
        transaction.type
      );
    }

    // 创建纪律设置
    const disciplineSettings = await portfolioService.updateDisciplineSettings(
      portfolio.id,
      {
        stopLossPercent: 0.1,
        takeProfitPercent: 0.2,
        maxPositionWeight: 0.3,
        maxSectorWeight: 0.4,
        rebalanceThreshold: 0.05,
      }
    );

    console.log('✅ 纪律设置创建成功');

    console.log('🎉 示例数据初始化完成！');
    console.log(`📊 投资组合: ${portfolio.name}`);
    console.log(`📈 持仓数量: ${positions.length}`);
    console.log(`💰 总市值: ¥${(portfolio.totalValue / 10000).toFixed(1)}万`);
    console.log(
      `📊 总盈亏: ¥${(portfolio.totalPnL / 1000).toFixed(
        1
      )}K (${portfolio.totalPnLPercent.toFixed(2)}%)`
    );
  } catch (error) {
    console.error('❌ 数据初始化失败:', error);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('🏁 脚本执行完成');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 脚本执行失败:', error);
      process.exit(1);
    });
}

export { seedData };
