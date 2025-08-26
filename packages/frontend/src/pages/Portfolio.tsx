import React, { useState } from 'react';
import { Plus, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import PortfolioCharts from '../components/PortfolioCharts';
import RiskManagementPanel from '../components/RiskManagementPanel';
import { usePortfolioBusiness } from '../hooks/usePortfolioBusiness';

const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'charts' | 'positions' | 'risk'
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

  // 处理风险刷新
  const handleRefreshRisk = async () => {
    await refreshRiskAssessment();
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-gray-500'>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-red-500'>错误: {error}</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* 页面标题和操作按钮 */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>投资组合管理</h1>
        <div className='flex items-center space-x-3'>
          <button className='btn btn-secondary'>
            <RefreshCw className='w-4 h-4 mr-2' />
            刷新数据
          </button>
          <button className='btn btn-primary'>
            <Plus className='w-4 h-4 mr-2' />
            新建组合
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className='border-b border-gray-200'>
        <nav className='flex space-x-8'>
          {[
            { id: 'overview', label: '概览' },
            { id: 'charts', label: '图表分析' },
            { id: 'positions', label: '持仓明细' },
            {
              id: 'risk',
              label: '风险管理',
              badge: stopLossAlerts.length + takeProfitAlerts.length,
            },
          ].map(({ id, label, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{label}</span>
              {badge !== undefined && badge > 0 && (
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* 概览标签页 */}
      {activeTab === 'overview' && (
        <div className='space-y-6'>
          {/* 投资组合概览卡片 */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='card'>
              <div className='flex items-center'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <div className='w-6 h-6 bg-blue-600 rounded'></div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>总市值</p>
                  <p className='text-2xl font-semibold text-gray-900'>
                    ¥{(currentPortfolio?.totalValue || 0) / 10000}万
                  </p>
                </div>
              </div>
            </div>

            <div className='card'>
              <div className='flex items-center'>
                <div className='p-2 bg-green-100 rounded-lg'>
                  <div className='w-6 h-6 bg-green-600 rounded'></div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>总盈亏</p>
                  <p
                    className={`text-2xl font-semibold ${
                      (currentPortfolio?.totalPnL || 0) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {currentPortfolio?.totalPnL
                      ? (currentPortfolio.totalPnL >= 0 ? '+' : '') +
                        (currentPortfolio.totalPnL / 1000).toFixed(1) +
                        'K'
                      : '0'}
                  </p>
                </div>
              </div>
            </div>

            <div className='card'>
              <div className='flex items-center'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <div className='w-6 h-6 bg-purple-600 rounded'></div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>持仓数量</p>
                  <p className='text-2xl font-semibold text-gray-900'>
                    {positions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className='card'>
              <div className='flex items-center'>
                <div className='p-2 bg-yellow-100 rounded-lg'>
                  <div className='w-6 h-6 bg-yellow-600 rounded'></div>
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>收益率</p>
                  <p
                    className={`text-2xl font-semibold ${
                      (currentPortfolio?.totalPnLPercent || 0) >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {currentPortfolio?.totalPnLPercent
                      ? (currentPortfolio.totalPnLPercent >= 0 ? '+' : '') +
                        currentPortfolio.totalPnLPercent.toFixed(2) +
                        '%'
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 赛道权重分布 */}
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              赛道权重分布
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {chartSectorData.map((sector, index) => (
                <div key={index} className='p-4 bg-gray-50 rounded-lg'>
                  <div className='flex items-center justify-between mb-2'>
                    <span className='font-medium text-gray-900'>
                      {sector.name}
                    </span>
                    <span className='text-sm text-gray-500'>
                      {(sector.weight * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>
                      ¥{(sector.value / 10000).toFixed(1)}万
                    </span>
                    <span
                      className={`text-sm ${
                        sector.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {sector.pnl >= 0 ? '+' : ''}
                      {sector.pnlPercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 快速操作 */}
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>快速操作</h3>
            <div className='flex flex-wrap gap-3'>
              <button className='btn btn-primary'>
                <Plus className='w-4 h-4 mr-2' />
                添加持仓
              </button>
              <button className='btn btn-secondary'>
                <Download className='w-4 h-4 mr-2' />
                导出报告
              </button>
              <button className='btn btn-secondary'>
                <AlertTriangle className='w-4 h-4 mr-2' />
                风险检查
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 图表分析标签页 */}
      {activeTab === 'charts' && (
        <PortfolioCharts
          sectorData={chartSectorData}
          performanceData={performanceData}
          riskMetrics={riskMetrics}
        />
      )}

      {/* 持仓明细标签页 */}
      {activeTab === 'positions' && (
        <div className='space-y-6'>
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>持仓明细</h3>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      股票信息
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      持仓数量
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      成本价
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      现价
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      市值
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      盈亏
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      权重
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {positions.map((position) => (
                    <tr key={position.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {position.stockName}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {position.stockCode} · {position.sector}
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {position.quantity.toLocaleString()}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ¥{position.avgCost.toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ¥{position.currentPrice.toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ¥{(position.marketValue / 10000).toFixed(1)}万
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`text-sm ${
                            position.unrealizedPnL >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {position.unrealizedPnL >= 0 ? '+' : ''}¥
                          {position.unrealizedPnL.toFixed(0)}
                        </span>
                        <div
                          className={`text-xs ${
                            position.unrealizedPnLPercent >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {position.unrealizedPnLPercent >= 0 ? '+' : ''}
                          {position.unrealizedPnLPercent.toFixed(1)}%
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {(position.weight * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 风险管理标签页 */}
      {activeTab === 'risk' && (
        <RiskManagementPanel
          riskAssessment={riskAssessment}
          stopLossAlerts={stopLossAlerts}
          takeProfitAlerts={takeProfitAlerts}
          rebalanceSuggestions={rebalanceSuggestions}
          onRefreshRisk={handleRefreshRisk}
          onGenerateReport={handleGenerateReport}
          onExportReport={handleExportReport}
        />
      )}
    </div>
  );
};

export default Portfolio;
