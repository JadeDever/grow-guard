import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

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
      id: 1,
      type: 'warning' as const,
      message: '比亚迪(002594) 触发止损提醒',
      time: '2分钟前',
      priority: 'high',
    },
    {
      id: 2,
      type: 'success' as const,
      message: '宁德时代(300750) 达到止盈目标',
      time: '15分钟前',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'warning' as const,
      message: '军工板块权重超限提醒',
      time: '1小时前',
      priority: 'high',
    },
  ];

  const sectorWeights = [
    { name: '车与智能驾驶', weight: 0.35, color: 'bg-blue-500', trend: 2.1 },
    { name: 'AI算力', weight: 0.25, color: 'bg-purple-500', trend: 1.8 },
    { name: '军工', weight: 0.2, color: 'bg-red-500', trend: -0.5 },
    { name: '高端制造', weight: 0.15, color: 'bg-green-500', trend: 0.9 },
    { name: '机器人', weight: 0.03, color: 'bg-yellow-500', trend: 0.3 },
    { name: '新能源', weight: 0.02, color: 'bg-cyan-500', trend: -0.2 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // 每30秒更新一次

    return () => clearInterval(timer);
  }, []);

  const formatCurrency = (value: number) => {
    return `¥${(value / 10000).toFixed(1)}万`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* 页面标题 */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-3xl font-bold text-gradient'>投资仪表盘</h1>
          <p className='text-gray-600 mt-1'>实时监控您的投资组合表现</p>
        </div>
        <div className='flex items-center space-x-3'>
          <div className='text-sm text-gray-500 bg-white/60 px-3 py-2 rounded-lg backdrop-blur-sm'>
            最后更新: {lastUpdate.toLocaleTimeString('zh-CN')}
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setLastUpdate(new Date())}
            loading={isLoading}
          >
            刷新
          </Button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard
          title='总市值'
          value={formatCurrency(portfolioStats.totalValue)}
          subtitle='当前投资组合总价值'
          icon={DollarSign}
          iconColor='text-primary-600'
          trend={{ value: 2.3, isPositive: true, label: '较昨日' }}
        />

        <StatCard
          title='总盈亏'
          value={formatCurrency(portfolioStats.totalPnL)}
          subtitle={`收益率 ${portfolioStats.totalPnLPercent}%`}
          icon={TrendingUp}
          iconColor='text-green-600'
          trend={{
            value: portfolioStats.totalPnLPercent,
            isPositive: true,
            label: '年化收益',
          }}
        />

        <StatCard
          title='持仓数量'
          value={portfolioStats.positions}
          subtitle={`${portfolioStats.sectors}个赛道`}
          icon={PieChart}
          iconColor='text-blue-600'
        />

        <StatCard
          title='最大回撤'
          value={`-${(portfolioStats.maxDrawdown * 100).toFixed(1)}%`}
          subtitle='风险可控'
          icon={TrendingDown}
          iconColor='text-red-600'
          trend={{ value: 0.5, isPositive: true, label: '较上月改善' }}
        />
      </div>

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 赛道权重分布 */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>赛道权重分布</CardTitle>
            <CardDescription>各行业板块的配置比例和趋势变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {sectorWeights.map((sector, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors'
                >
                  <div className='flex items-center space-x-3'>
                    <div
                      className={`w-4 h-4 rounded-full ${sector.color} shadow-sm`}
                    ></div>
                    <span className='text-sm font-medium text-gray-700'>
                      {sector.name}
                    </span>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='w-32 bg-gray-200 rounded-full h-2.5 overflow-hidden'>
                      <div
                        className={`${sector.color} h-2.5 rounded-full transition-all duration-300`}
                        style={{ width: `${sector.weight * 100}%` }}
                      ></div>
                    </div>
                    <div className='text-right'>
                      <div className='text-sm font-semibold text-gray-900'>
                        {(sector.weight * 100).toFixed(1)}%
                      </div>
                      <div
                        className={`text-xs ${
                          sector.trend >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {sector.trend >= 0 ? '+' : ''}
                        {sector.trend}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 实时提醒 */}
        <Card>
          <CardHeader>
            <CardTitle>实时提醒</CardTitle>
            <CardDescription>重要的投资提醒和通知</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className='flex items-start space-x-3 p-3 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors'
                >
                  <div className='flex-shrink-0 mt-0.5'>
                    {alert.type === 'warning' ? (
                      <AlertTriangle className='h-4 w-4 text-yellow-600' />
                    ) : (
                      <CheckCircle className='h-4 w-4 text-green-600' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <p className='text-sm text-gray-900'>{alert.message}</p>
                      <Button
                        variant={getPriorityColor(alert.priority)}
                        size='sm'
                      >
                        {alert.priority === 'high' ? '高' : '中'}
                      </Button>
                    </div>
                    <p className='text-xs text-gray-500'>{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant='secondary' className='w-full'>
              查看全部提醒
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
