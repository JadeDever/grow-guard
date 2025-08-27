import React, { useState } from 'react';
import { Download, RefreshCw, AlertTriangle, BarChart3, PieChart, TrendingUp, Shield } from 'lucide-react';
import PortfolioCharts from '../components/PortfolioCharts';
import RiskManagementPanel from '../components/RiskManagementPanel';
import { usePortfolioBusiness } from '../hooks/usePortfolioBusiness';
import Card, { CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'charts' | 'allocation' | 'risk'
  >('overview');

  // 使用业务逻辑Hook
  const {
    currentPortfolio,
    positions,
    riskAssessment,
    stopLossAlerts,
    takeProfitAlerts,
    rebalanceSuggestions,
    loading,
    error,
    refreshRiskAssessment,
    generateReport,
    exportReport,
  } = usePortfolioBusiness();

  // 图表数据
  const chartSectorData = [
    {
      name: '车与智能驾驶',
      value: 185200,
      weight: 0.148,
      color: '#3B82F6',
      pnl: 4700,
      pnlPercent: 2.6,
    },
    {
      name: '新能源',
      value: 138000,
      weight: 0.11,
      color: '#8B5CF6',
      pnl: 5360,
      pnlPercent: 4.0,
    },
    {
      name: 'AI算力',
      value: 37440,
      weight: 0.03,
      color: '#EF4444',
      pnl: 3240,
      pnlPercent: 9.5,
    },
  ];

  const performanceData = [
    { date: '01-01', totalValue: 1200000, totalPnL: 0, benchmark: 0 },
    { date: '01-05', totalValue: 1215000, totalPnL: 1.25, benchmark: 0.8 },
    { date: '01-10', totalValue: 1230000, totalPnL: 2.5, benchmark: 2.0 },
    { date: '01-15', totalValue: 1250000, totalPnL: 4.17, benchmark: 3.2 },
  ];

  const riskMetrics = [
    { metric: '夏普比率', value: 1.2, target: 1.0, status: 'good' as const },
    { metric: '最大回撤', value: 8.5, target: 10.0, status: 'good' as const },
    { metric: '波动率', value: 15.3, target: 12.0, status: 'warning' as const },
    { metric: '贝塔系数', value: 0.85, target: 1.0, status: 'good' as const },
  ];

  // 处理报告生成
  const handleGenerateReport = async () => {
    try {
      await generateReport('comprehensive');
    } catch (error) {
      console.error('生成报告失败:', error);
    }
  };

  // 处理报告导出
  const handleExportReport = async (format: string) => {
    try {
      const report = await generateReport('comprehensive');
      const exportedContent = await exportReport(report, format);

      // 创建下载链接
      const blob = new Blob([exportedContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `投资组合报告_${
        new Date().toISOString().split('T')[0]
      }.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('导出报告失败:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <RefreshCw className='h-8 w-8 animate-spin text-primary-600 mx-auto mb-4' />
          <p className='text-gray-600'>加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <AlertTriangle className='h-8 w-8 text-red-600 mx-auto mb-4' />
          <p className='text-red-600'>加载失败: {error}</p>
        </div>
      </div>
    );
  }

  if (!currentPortfolio) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <BarChart3 className='h-8 w-8 text-gray-400 mx-auto mb-4' />
          <p className='text-gray-600'>请先创建或选择投资组合</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* 页面标题和面包屑 */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-3xl font-bold text-gradient'>投资组合管理</h1>
          <p className='text-gray-600 mt-1'>管理您的投资组合配置和权重</p>
        </div>
        <div className='flex items-center space-x-3'>
          <Button
            variant='secondary'
            size='sm'
            onClick={refreshRiskAssessment}
            loading={loading}
          >
            <RefreshCw className='h-4 w-4 mr-2' />
            刷新风控
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={handleGenerateReport}
          >
            生成报告
          </Button>
        </div>
      </div>

      <Breadcrumb />

      {/* 组合概览卡片 */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <BarChart3 className='h-5 w-5 mr-2 text-blue-600' />
              组合总览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>总市值</span>
                <span className='font-semibold'>¥{currentPortfolio.totalValue.toLocaleString()}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>总成本</span>
                <span className='font-semibold'>¥{currentPortfolio.totalCost.toLocaleString()}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>总盈亏</span>
                <span className={`font-semibold ${currentPortfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ¥{currentPortfolio.totalPnL.toLocaleString()}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>收益率</span>
                <span className={`font-semibold ${currentPortfolio.totalPnLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currentPortfolio.totalPnLPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <PieChart className='h-5 w-5 mr-2 text-purple-600' />
              持仓统计
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>持仓数量</span>
                <span className='font-semibold'>{positions.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>赛道数量</span>
                <span className='font-semibold'>{Object.keys(currentPortfolio.sectorWeights).length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>最大回撤</span>
                <span className='font-semibold text-red-600'>
                  {(currentPortfolio.maxDrawdown * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center'>
              <Shield className='h-5 w-5 mr-2 text-green-600' />
              风控状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>止损提醒</span>
                <span className='font-semibold text-red-600'>{stopLossAlerts.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>止盈提醒</span>
                <span className='font-semibold text-green-600'>{takeProfitAlerts.length}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>调仓建议</span>
                <span className='font-semibold text-blue-600'>{rebalanceSuggestions.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 标签页导航 */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {[
            { id: 'overview', name: '概览', icon: BarChart3 },
            { id: 'charts', name: '图表分析', icon: TrendingUp },
            { id: 'allocation', name: '权重配置', icon: PieChart },
            { id: 'risk', name: '风险管理', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className='h-4 w-4' />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 标签页内容 */}
      <div className='min-h-96'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            <PortfolioCharts
              sectorData={chartSectorData}
              performanceData={performanceData}
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Card>
                <CardHeader>
                  <CardTitle>风险指标</CardTitle>
                  <CardDescription>关键风险指标监控</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {riskMetrics.map((metric, index) => (
                      <div key={index} className='flex items-center justify-between'>
                        <span className='text-sm text-gray-600'>{metric.metric}</span>
                        <div className='flex items-center space-x-3'>
                          <span className='font-semibold'>{metric.value}</span>
                          <span className='text-xs text-gray-400'>目标: {metric.target}</span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              metric.status === 'good'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {metric.status === 'good' ? '良好' : '注意'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>快速操作</CardTitle>
                  <CardDescription>常用功能快捷入口</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <Button variant='primary' className='w-full' onClick={() => window.location.href = '/positions'}>
                      管理持仓
                    </Button>
                    <Button variant='secondary' className='w-full' onClick={() => window.location.href = '/business-process'}>
                      风控设置
                    </Button>
                    <Button variant='secondary' className='w-full' onClick={() => window.location.href = '/reports'}>
                      查看报告
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'charts' && (
          <PortfolioCharts
            sectorData={chartSectorData}
            performanceData={performanceData}
          />
        )}

        {activeTab === 'allocation' && (
          <Card>
            <CardHeader>
              <CardTitle>权重配置</CardTitle>
              <CardDescription>调整各赛道权重分配</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {chartSectorData.map((sector, index) => (
                  <div key={index} className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                    <div className='flex items-center space-x-3'>
                      <div
                        className='w-4 h-4 rounded-full'
                        style={{ backgroundColor: sector.color }}
                      ></div>
                      <span className='font-medium'>{sector.name}</span>
                    </div>
                    <div className='flex items-center space-x-4'>
                      <div className='w-32 bg-gray-200 rounded-full h-2 overflow-hidden'>
                        <div
                          className='h-2 rounded-full'
                          style={{
                            width: `${sector.weight * 100}%`,
                            backgroundColor: sector.color,
                          }}
                        ></div>
                      </div>
                      <span className='font-semibold'>{(sector.weight * 100).toFixed(1)}%</span>
                      <Button variant='ghost' size='sm'>
                        调整
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'risk' && (
          <RiskManagementPanel
            riskAssessment={riskAssessment}
            stopLossAlerts={stopLossAlerts}
            takeProfitAlerts={takeProfitAlerts}
            rebalanceSuggestions={rebalanceSuggestions}
          />
        )}
      </div>
    </div>
  );
};

export default Portfolio;
