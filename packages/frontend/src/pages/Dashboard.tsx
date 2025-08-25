import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  // 模拟数据
  const portfolioStats = {
    totalValue: 1250000,
    totalCost: 1200000,
    totalPnL: 50000,
    totalPnLPercent: 4.17,
    maxDrawdown: 0.08,
    positions: 12,
    sectors: 6,
  };

  const recentAlerts = [
    {
      type: 'warning',
      message: '比亚迪(002594) 触发止损提醒',
      time: '2分钟前',
    },
    {
      type: 'success',
      message: '宁德时代(300750) 达到止盈目标',
      time: '15分钟前',
    },
    { type: 'warning', message: '军工板块权重超限提醒', time: '1小时前' },
  ];

  const sectorWeights = [
    { name: '车与智能驾驶', weight: 0.35, color: 'bg-blue-500' },
    { name: 'AI算力', weight: 0.25, color: 'bg-purple-500' },
    { name: '军工', weight: 0.2, color: 'bg-red-500' },
    { name: '高端制造', weight: 0.15, color: 'bg-green-500' },
    { name: '机器人', weight: 0.03, color: 'bg-yellow-500' },
    { name: '新能源', weight: 0.02, color: 'bg-cyan-500' },
  ];

  return (
    <div className='space-y-6'>
      {/* 页面标题 */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>投资仪表盘</h1>
          <p className='text-gray-600'>实时监控您的投资组合表现</p>
        </div>
        <div className='text-sm text-gray-500'>
          最后更新: {new Date().toLocaleString('zh-CN')}
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='card'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <DollarSign className='h-8 w-8 text-primary-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>总市值</p>
              <p className='text-2xl font-bold text-gray-900'>
                ¥{(portfolioStats.totalValue / 10000).toFixed(1)}万
              </p>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <TrendingUp className='h-8 w-8 text-green-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>总盈亏</p>
              <p className='text-2xl font-bold text-green-600'>
                +¥{(portfolioStats.totalPnL / 10000).toFixed(1)}万
              </p>
              <p className='text-sm text-green-600'>
                +{portfolioStats.totalPnLPercent}%
              </p>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <PieChart className='h-8 w-8 text-blue-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>持仓数量</p>
              <p className='text-2xl font-bold text-gray-900'>
                {portfolioStats.positions}
              </p>
              <p className='text-sm text-gray-600'>
                {portfolioStats.sectors}个赛道
              </p>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='flex items-center'>
            <div className='flex-shrink-0'>
              <TrendingDown className='h-8 w-8 text-red-600' />
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>最大回撤</p>
              <p className='text-2xl font-bold text-red-600'>
                -{(portfolioStats.maxDrawdown * 100).toFixed(1)}%
              </p>
              <p className='text-sm text-gray-600'>风险可控</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 赛道权重分布 */}
        <div className='lg:col-span-2 card'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>
            赛道权重分布
          </h3>
          <div className='space-y-3'>
            {sectorWeights.map((sector, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div
                    className={`w-4 h-4 rounded-full ${sector.color} mr-3`}
                  ></div>
                  <span className='text-sm font-medium text-gray-700'>
                    {sector.name}
                  </span>
                </div>
                <div className='flex items-center space-x-3'>
                  <div className='w-32 bg-gray-200 rounded-full h-2'>
                    <div
                      className={`${sector.color} h-2 rounded-full`}
                      style={{ width: `${sector.weight * 100}%` }}
                    ></div>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>
                    {(sector.weight * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 实时提醒 */}
        <div className='card'>
          <h3 className='text-lg font-medium text-gray-900 mb-4'>实时提醒</h3>
          <div className='space-y-3'>
            {recentAlerts.map((alert, index) => (
              <div
                key={index}
                className='flex items-start space-x-3 p-3 bg-gray-50 rounded-lg'
              >
                <div className='flex-shrink-0 mt-0.5'>
                  {alert.type === 'warning' ? (
                    <AlertTriangle className='h-4 w-4 text-yellow-600' />
                  ) : (
                    <CheckCircle className='h-4 w-4 text-green-600' />
                  )}
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm text-gray-900'>{alert.message}</p>
                  <p className='text-xs text-gray-500 mt-1'>{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className='mt-4'>
            <button className='w-full btn-secondary text-sm'>
              查看全部提醒
            </button>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>快速操作</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <button className='btn-primary'>添加持仓</button>
          <button className='btn-secondary'>调整仓位</button>
          <button className='btn-secondary'>生成报告</button>
          <button className='btn-secondary'>纪律设置</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
