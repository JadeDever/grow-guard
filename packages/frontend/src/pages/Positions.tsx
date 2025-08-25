import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Download, 
  Eye, 
  Edit3, 
  Trash2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';

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
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdate: string;
}

interface Transaction {
  id: string;
  stockCode: string;
  stockName: string;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  amount: number;
  date: string;
  reason: string;
}

const Positions: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterSector, setFilterSector] = useState('');
  const [filterRisk, setFilterRisk] = useState('');

  // 模拟数据
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
      riskLevel: 'medium',
      lastUpdate: '2024-01-15 14:30'
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
      weight: 0.110,
      riskLevel: 'low',
      lastUpdate: '2024-01-15 14:30'
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
      weight: 0.030,
      riskLevel: 'high',
      lastUpdate: '2024-01-15 14:30'
    }
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      stockCode: '002594',
      stockName: '比亚迪',
      type: 'buy',
      quantity: 500,
      price: 175.0,
      amount: 87500,
      date: '2024-01-10',
      reason: '建仓'
    },
    {
      id: '2',
      stockCode: '002594',
      stockName: '比亚迪',
      type: 'buy',
      quantity: 500,
      price: 186.0,
      amount: 93000,
      date: '2024-01-12',
      reason: '加仓'
    },
    {
      id: '3',
      stockCode: '300750',
      stockName: '宁德时代',
      type: 'buy',
      quantity: 800,
      price: 165.8,
      amount: 132640,
      date: '2024-01-08',
      reason: '建仓'
    }
  ];

  const getRiskLevelColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelText = (risk: string) => {
    switch (risk) {
      case 'low': return '低风险';
      case 'medium': return '中风险';
      case 'high': return '高风险';
      default: return '未知';
    }
  };

  const filteredPositions = positions.filter(position => {
    if (filterSector && position.sector !== filterSector) return false;
    if (filterRisk && position.riskLevel !== filterRisk) return false;
    return true;
  });

  return (
    <div className='space-y-6'>
      {/* 页面标题和操作 */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>持仓管理</h1>
          <p className='text-gray-600'>查看和管理您的股票持仓</p>
        </div>
        <div className='flex items-center space-x-3'>
          <button className='btn-secondary flex items-center space-x-2'>
            <Download className='h-4 w-4' />
            <span>导出</span>
          </button>
          <button className='btn-primary flex items-center space-x-2'>
            <Plus className='h-4 w-4' />
            <span>添加持仓</span>
          </button>
        </div>
      </div>

      {/* 筛选器 */}
      <div className='card'>
        <div className='flex items-center justify-between mb-4'>
          <h3 className='text-lg font-medium text-gray-900'>筛选条件</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='btn-secondary flex items-center space-x-2'
          >
            <Filter className='h-4 w-4' />
            <span>{showFilters ? '隐藏' : '显示'}筛选</span>
          </button>
        </div>
        
        {showFilters && (
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                投资赛道
              </label>
              <select 
                className='input-field'
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
              >
                <option value=''>全部赛道</option>
                <option value='车与智能驾驶'>车与智能驾驶</option>
                <option value='AI算力'>AI算力</option>
                <option value='军工'>军工</option>
                <option value='高端制造'>高端制造</option>
                <option value='机器人'>机器人</option>
                <option value='新能源'>新能源</option>
              </select>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                风险等级
              </label>
              <select 
                className='input-field'
                value={filterRisk}
                onChange={(e) => setFilterRisk(e.target.value)}
              >
                <option value=''>全部风险等级</option>
                <option value='low'>低风险</option>
                <option value='medium'>中风险</option>
                <option value='high'>高风险</option>
              </select>
            </div>
            
            <div className='flex items-end'>
              <button 
                onClick={() => {
                  setFilterSector('');
                  setFilterRisk('');
                }}
                className='btn-secondary w-full'
              >
                清除筛选
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 主要内容区域 */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* 持仓列表 */}
        <div className='lg:col-span-2 space-y-6'>
          {/* 持仓概览 */}
          <div className='card'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-900'>持仓概览</h3>
              <span className='text-sm text-gray-500'>
                共 {filteredPositions.length} 只股票
              </span>
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
                      盈亏
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      风险等级
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredPositions.map((position) => (
                    <tr key={position.id} className='hover:bg-gray-50'>
                      <td className='px-3 py-4 whitespace-nowrap'>
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            {position.stockName}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {position.stockCode} · {position.sector}
                          </div>
                          <div className='text-xs text-gray-400'>
                            最后更新: {position.lastUpdate}
                          </div>
                        </div>
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>{position.quantity}</div>
                        <div className='text-sm text-gray-500'>
                          ¥{(position.marketValue / 10000).toFixed(1)}万
                        </div>
                        <div className='text-xs text-gray-400'>
                          权重: {(position.weight * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap'>
                        <div className={`text-sm font-medium ${
                          position.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {position.pnl >= 0 ? '+' : ''}¥{position.pnl.toFixed(0)}
                        </div>
                        <div className={`text-sm ${
                          position.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {position.pnl >= 0 ? '+' : ''}{position.pnlPercent.toFixed(1)}%
                        </div>
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap'>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(position.riskLevel)}`}>
                          {getRiskLevelText(position.riskLevel)}
                        </span>
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex items-center space-x-2'>
                          <button
                            onClick={() => setSelectedPosition(position)}
                            className='text-blue-600 hover:text-blue-900'
                            title='查看详情'
                          >
                            <Eye className='h-4 w-4' />
                          </button>
                          <button
                            className='text-primary-600 hover:text-primary-900'
                            title='编辑'
                          >
                            <Edit3 className='h-4 w-4' />
                          </button>
                          <button
                            className='text-red-600 hover:text-red-900'
                            title='删除'
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

          {/* 交易记录 */}
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>最近交易记录</h3>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      交易信息
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      数量
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      价格
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      金额
                    </th>
                    <th className='px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      日期
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className='hover:bg-gray-50'>
                      <td className='px-3 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            transaction.type === 'buy' ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <div>
                            <div className='text-sm font-medium text-gray-900'>
                              {transaction.stockName}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {transaction.stockCode} · {transaction.reason}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {transaction.quantity}
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ¥{transaction.price.toFixed(2)}
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-900'>
                        ¥{(transaction.amount / 10000).toFixed(1)}万
                      </td>
                      <td className='px-3 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {transaction.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 右侧信息面板 */}
        <div className='space-y-6'>
          {/* 风险分析 */}
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>风险分析</h3>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>整体风险等级:</span>
                <span className='text-yellow-600 font-medium'>中等</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>最大回撤:</span>
                <span className='text-red-600 font-medium'>-8.5%</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>夏普比率:</span>
                <span className='text-green-600 font-medium'>1.2</span>
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>波动率:</span>
                <span className='text-blue-600 font-medium'>15.3%</span>
              </div>
            </div>
            
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <h4 className='text-sm font-medium text-gray-900 mb-2'>风险提示</h4>
              <div className='space-y-2 text-sm text-gray-600'>
                <div className='flex items-start space-x-2'>
                  <AlertTriangle className='h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0' />
                  <span>军工板块权重较高，建议适当分散</span>
                </div>
                <div className='flex items-start space-x-2'>
                  <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                  <span>新能源和AI算力配置合理</span>
                </div>
              </div>
            </div>
          </div>

          {/* 持仓统计 */}
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>持仓统计</h3>
            <div className='space-y-3'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>总持仓数:</span>
                <span className='font-medium'>{positions.length}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>盈利股票:</span>
                <span className='font-medium text-green-600'>
                  {positions.filter(p => p.pnl > 0).length}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>亏损股票:</span>
                <span className='font-medium text-red-600'>
                  {positions.filter(p => p.pnl < 0).length}
                </span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>平均持仓时间:</span>
                <span className='font-medium'>45天</span>
              </div>
            </div>
          </div>

          {/* 快速操作 */}
          <div className='card'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>快速操作</h3>
            <div className='space-y-3'>
              <button className='w-full btn-primary'>
                调整仓位
              </button>
              <button className='w-full btn-secondary'>
                风险再平衡
              </button>
              <button className='w-full btn-secondary'>
                生成持仓报告
              </button>
              <button className='w-full btn-secondary'>
                设置止盈止损
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 持仓详情模态框 */}
      {selectedPosition && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-2xl shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-medium text-gray-900'>
                  {selectedPosition.stockName} 持仓详情
                </h3>
                <button
                  onClick={() => setSelectedPosition(null)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  ✕
                </button>
              </div>
              
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <h4 className='font-medium text-gray-900 mb-3'>基本信息</h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>股票代码:</span>
                      <span className='font-medium'>{selectedPosition.stockCode}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>投资赛道:</span>
                      <span className='font-medium'>{selectedPosition.sector}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>持仓数量:</span>
                      <span className='font-medium'>{selectedPosition.quantity}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>平均成本:</span>
                      <span className='font-medium'>¥{selectedPosition.avgPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className='font-medium text-gray-900 mb-3'>收益情况</h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>当前价格:</span>
                      <span className='font-medium'>¥{selectedPosition.currentPrice.toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>市值:</span>
                      <span className='font-medium'>¥{(selectedPosition.marketValue / 10000).toFixed(1)}万</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>盈亏:</span>
                      <span className={`font-medium ${
                        selectedPosition.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedPosition.pnl >= 0 ? '+' : ''}¥{selectedPosition.pnl.toFixed(0)}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>盈亏比例:</span>
                      <span className={`font-medium ${
                        selectedPosition.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {selectedPosition.pnl >= 0 ? '+' : ''}{selectedPosition.pnlPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className='mt-6 pt-4 border-t border-gray-200'>
                <div className='flex items-center justify-end space-x-3'>
                  <button
                    onClick={() => setSelectedPosition(null)}
                    className='btn-secondary'
                  >
                    关闭
                  </button>
                  <button className='btn-primary'>
                    编辑持仓
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Positions;
