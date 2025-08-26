import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Trash2,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import PortfolioCharts from '../components/PortfolioCharts';

interface Position {
  id: string;
  stockCode: string;
  stockName: string;
  sector: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  costValue: number;
  pnl: number;
  pnlPercent: number;
  weight: number;
}

const Portfolio: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'charts' | 'positions'
  >('overview');

  // 模拟数据
  const portfolioData = {
    totalValue: 1250000,
    totalCost: 1200000,
    totalPnL: 50000,
    totalPnLPercent: 4.17,
    positions: 12,
    sectors: 6,
  };

  const positions: Position[] = [
    {
      id: '1',
      stockCode: '002594',
      stockName: '比亚迪',
      sector: '车与智能驾驶',
      quantity: 1000,
      avgPrice: 180.5,
      currentPrice: 185.2,
      marketValue: 185200,
      costValue: 180500,
      pnl: 4700,
      pnlPercent: 2.6,
      weight: 0.148,
    },
    {
      id: '2',
      stockCode: '300750',
      stockName: '宁德时代',
      sector: '新能源',
      quantity: 800,
      avgPrice: 165.8,
      currentPrice: 172.5,
      marketValue: 138000,
      costValue: 132640,
      pnl: 5360,
      pnlPercent: 4.0,
      weight: 0.11,
    },
    {
      id: '3',
      stockCode: '002415',
      stockName: '海康威视',
      sector: 'AI算力',
      quantity: 1200,
      avgPrice: 28.5,
      currentPrice: 31.2,
      marketValue: 37440,
      costValue: 34200,
      pnl: 3240,
      pnlPercent: 9.5,
      weight: 0.03,
    },
  ];

  const sectorWeights = [
    { name: '车与智能驾驶', weight: 0.35, color: 'bg-blue-500' },
    { name: 'AI算力', weight: 0.25, color: 'bg-purple-500' },
    { name: '军工', weight: 0.2, color: 'bg-red-500' },
    { name: '高端制造', weight: 0.15, color: 'bg-green-500' },
    { name: '机器人', weight: 0.03, color: 'bg-yellow-500' },
    { name: '新能源', weight: 0.02, color: 'bg-cyan-500' },
  ];

  // 图表数据
  const chartSectorData = [
    {
      name: '车与智能驾驶',
      value: 437500,
      weight: 0.35,
      color: '#3B82F6',
      pnl: 16450,
      pnlPercent: 3.9,
    },
    {
      name: 'AI算力',
      value: 312500,
      weight: 0.25,
      color: '#8B5CF6',
      pnl: 12500,
      pnlPercent: 4.2,
    },
    {
      name: '军工',
      value: 250000,
      weight: 0.2,
      color: '#EF4444',
      pnl: 8000,
      pnlPercent: 3.3,
    },
    {
      name: '高端制造',
      value: 187500,
      weight: 0.15,
      color: '#10B981',
      pnl: 7500,
      pnlPercent: 4.2,
    },
    {
      name: '机器人',
      value: 37500,
      weight: 0.03,
      color: '#F59E0B',
      pnl: 1500,
      pnlPercent: 4.3,
    },
    {
      name: '新能源',
      value: 25000,
      weight: 0.02,
      color: '#06B6D4',
      pnl: 1050,
      pnlPercent: 4.4,
    },
  ];

  const performanceData = [
    { date: '1月1日', totalValue: 1200000, totalPnL: 0, benchmark: 0 },
    { date: '1月8日', totalValue: 1215000, totalPnL: 1.25, benchmark: 0.8 },
    { date: '1月15日', totalValue: 1230000, totalPnL: 2.5, benchmark: 1.2 },
    { date: '1月22日', totalValue: 1220000, totalPnL: 1.67, benchmark: 0.9 },
    { date: '1月29日', totalValue: 1240000, totalPnL: 3.33, benchmark: 1.5 },
    { date: '2月5日', totalValue: 1250000, totalPnL: 4.17, benchmark: 1.8 },
  ];

  const riskMetrics = [
    { metric: '夏普比率', value: 1.2, target: 1.0, status: 'good' as const },
    { metric: '最大回撤', value: 8.5, target: 10.0, status: 'good' as const },
    { metric: '波动率', value: 15.3, target: 12.0, status: 'warning' as const },
    { metric: '贝塔系数', value: 0.85, target: 1.0, status: 'good' as const },
  ];

  const handleAddPosition = () => {
    setShowAddModal(true);
  };

  const handleEditPosition = (position: Position) => {
    setEditingPosition(position);
    setShowAddModal(true);
  };

  const handleDeletePosition = (id: string) => {
    if (confirm('确定要删除这个持仓吗？')) {
      console.log('删除持仓:', id);
      // TODO: 调用API删除持仓
    }
  };

  const tabs = [
    { id: 'overview', name: '组合概览', icon: PieChart },
    { id: 'charts', name: '数据图表', icon: BarChart3 },
    { id: 'positions', name: '持仓管理', icon: TrendingUp },
  ];

  return (
    <div className='space-y-6'>
      {/* 页面标题和操作 */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>投资组合</h1>
          <p className='text-gray-600'>管理您的投资组合配置和持仓</p>
        </div>
        <button
          onClick={handleAddPosition}
          className='btn-primary flex items-center space-x-2'
        >
          <Plus className='h-4 w-4' />
          <span>添加持仓</span>
        </button>
      </div>

      {/* 标签页导航 */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {tabs.map((tab) => {
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

      {/* 组合概览标签页 */}
      {activeTab === 'overview' && (
        <>
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
                    ¥{(portfolioData.totalValue / 10000).toFixed(1)}万
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
                    +¥{(portfolioData.totalPnL / 10000).toFixed(1)}万
                  </p>
                  <p className='text-sm text-green-600'>
                    +{portfolioData.totalPnLPercent}%
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
                    {portfolioData.positions}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {portfolioData.sectors}个赛道
                  </p>
                </div>
              </div>
            </div>

            <div className='card'>
              <div className='flex items-center'>
                <div className='flex-shrink-0'>
                  <BarChart3 className='h-8 w-8 text-purple-600' />
                </div>
                <div className='ml-4'>
                  <p className='text-sm font-medium text-gray-600'>平均收益</p>
                  <p className='text-2xl font-bold text-purple-600'>
                    +{portfolioData.totalPnLPercent}%
                  </p>
                  <p className='text-sm text-gray-600'>年化收益</p>
                </div>
              </div>
            </div>
          </div>

          {/* 赛道权重分布 */}
          <div className='card'>
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

            <div className='mt-6 pt-4 border-t border-gray-200'>
              <h4 className='text-sm font-medium text-gray-900 mb-3'>
                组合分析
              </h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>集中度风险:</span>
                  <span className='text-yellow-600 font-medium'>中等</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>行业分散:</span>
                  <span className='text-green-600 font-medium'>良好</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>成长性:</span>
                  <span className='text-blue-600 font-medium'>优秀</span>
                </div>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>快速操作</h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <button className='btn-primary'>调整仓位</button>
              <button className='btn-secondary'>重新平衡</button>
              <button className='btn-secondary'>导出报告</button>
              <button className='btn-secondary'>风险分析</button>
            </div>
          </div>
        </>
      )}

      {/* 数据图表标签页 */}
      {activeTab === 'charts' && (
        <PortfolioCharts
          sectorData={chartSectorData}
          performanceData={performanceData}
          riskMetrics={riskMetrics}
        />
      )}

      {/* 持仓管理标签页 */}
      {activeTab === 'positions' && (
        <>
          {/* 持仓列表 */}
          <div className='card'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>持仓列表</h3>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-500'>
                  共 {positions.length} 只股票
                </span>
              </div>
            </div>

            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      股票信息
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      持仓
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      成本价
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      现价
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      盈亏
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      权重
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {positions.map((position) => (
                    <tr key={position.id} className='hover:bg-gray-50'>
                      <td className='px-3 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {position.stockName}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {position.stockCode} · {position.sector}
                          </div>
                        </div>
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          {position.quantity}
                        </div>
                        <div className='text-sm text-gray-500'>
                          ¥{(position.marketValue / 10000).toFixed(1)}万
                        </div>
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ¥{position.avgPrice.toFixed(2)}
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ¥{position.currentPrice.toFixed(2)}
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap'>
                        <div
                          className={`text-sm font-medium ${
                            position.pnl >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {position.pnl >= 0 ? '+' : ''}¥
                          {position.pnl.toFixed(0)}
                        </div>
                        <div
                          className={`text-sm ${
                            position.pnl >= 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {position.pnl >= 0 ? '+' : ''}
                          {position.pnlPercent.toFixed(1)}%
                        </div>
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {(position.weight * 100).toFixed(1)}%
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => handleEditPosition(position)}
                            className='text-primary-600 hover:text-primary-900'
                          >
                            <Edit3 className='h-4 w-4' />
                          </button>
                          <button
                            onClick={() => handleDeletePosition(position.id)}
                            className='text-red-600 hover:text-red-900'
                          >
                            <Trash2 className='h-4 w-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 添加/编辑持仓模态框 */}
      {showAddModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                {editingPosition ? '编辑持仓' : '添加持仓'}
              </h3>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    股票代码
                  </label>
                  <input
                    type='text'
                    className='input-field'
                    placeholder='如: 002594'
                    defaultValue={editingPosition?.stockCode || ''}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    股票名称
                  </label>
                  <input
                    type='text'
                    className='input-field'
                    placeholder='如: 比亚迪'
                    defaultValue={editingPosition?.stockName || ''}
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    投资赛道
                  </label>
                  <select className='input-field'>
                    <option value=''>选择赛道</option>
                    <option value='车与智能驾驶'>车与智能驾驶</option>
                    <option value='AI算力'>AI算力</option>
                    <option value='军工'>军工</option>
                    <option value='高端制造'>高端制造</option>
                    <option value='机器人'>机器人</option>
                    <option value='新能源'>新能源</option>
                  </select>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      持仓数量
                    </label>
                    <input
                      type='number'
                      className='input-field'
                      placeholder='1000'
                      defaultValue={editingPosition?.quantity || ''}
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                      平均成本
                    </label>
                    <input
                      type='number'
                      className='input-field'
                      placeholder='180.50'
                      step='0.01'
                      defaultValue={editingPosition?.avgPrice || ''}
                    />
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-end space-x-3 mt-6'>
                <button
                  onClick={() => setShowAddModal(false)}
                  className='btn-secondary'
                >
                  取消
                </button>
                <button className='btn-primary'>
                  {editingPosition ? '更新' : '添加'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
