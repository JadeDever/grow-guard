import React, { useState } from 'react';
import { usePortfolioBusiness } from '../hooks/usePortfolioBusiness';
import { Position } from '@shared/types';
import {
  Plus,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  FileText,
  Settings,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

const BusinessProcess: React.FC = () => {
  const {
    portfolios,
    currentPortfolio,
    positions,
    transactions,
    riskAssessment,
    loading,
    error,
    createPortfolio,
    selectPortfolio,
    addPosition,
    updatePosition,
    deletePosition,
    createTradeOrder,
    refreshRiskAssessment,
    generateReport,
    exportReport,
  } = usePortfolioBusiness();

  const [activeTab, setActiveTab] = useState('overview');
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [showAddPosition, setShowAddPosition] = useState(false);
  const [showTradeOrder, setShowTradeOrder] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  // 表单状态
  const [portfolioForm, setPortfolioForm] = useState({
    name: '',
    description: '',
    totalValue: 0,
    totalCost: 0,
  });

  const [positionForm, setPositionForm] = useState({
    stockCode: '',
    stockName: '',
    sector: 'AI_COMPUTING' as any,
    quantity: 0,
    avgCost: 0,
    currentPrice: 0,
  });

  const [tradeForm, setTradeForm] = useState({
    stockCode: '',
    stockName: '',
    type: 'BUY' as 'BUY' | 'SELL',
    quantity: 0,
    price: 0,
    reason: '',
  });

  // 创建投资组合
  const handleCreatePortfolio = async () => {
    try {
      await createPortfolio({
        ...portfolioForm,
        totalPnL: 0,
        totalPnLPercent: 0,
        maxDrawdown: 0,
        positions: [],
        sectorWeights: {},
      });
      setShowCreatePortfolio(false);
      setPortfolioForm({
        name: '',
        description: '',
        totalValue: 0,
        totalCost: 0,
      });
    } catch (error) {
      console.error('创建投资组合失败:', error);
    }
  };

  // 添加持仓
  const handleAddPosition = async () => {
    if (!currentPortfolio) return;

    try {
      const marketValue = positionForm.quantity * positionForm.currentPrice;
      const unrealizedPnL =
        marketValue - positionForm.quantity * positionForm.avgCost;
      const unrealizedPnLPercent =
        positionForm.avgCost > 0
          ? (unrealizedPnL / (positionForm.quantity * positionForm.avgCost)) *
            100
          : 0;

      await addPosition({
        ...positionForm,
        marketValue,
        unrealizedPnL,
        unrealizedPnLPercent,
        weight: marketValue / currentPortfolio.totalValue,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setShowAddPosition(false);
      setPositionForm({
        stockCode: '',
        stockName: '',
        sector: 'AI_COMPUTING',
        quantity: 0,
        avgCost: 0,
        currentPrice: 0,
      });
    } catch (error) {
      console.error('添加持仓失败:', error);
    }
  };

  // 执行交易
  const handleExecuteTrade = async () => {
    if (!currentPortfolio) return;

    try {
      await createTradeOrder({
        ...tradeForm,
        portfolioId: currentPortfolio.id,
        amount: tradeForm.quantity * tradeForm.price,
        commission: 0,
      });
      setShowTradeOrder(false);
      setTradeForm({
        stockCode: '',
        stockName: '',
        type: 'BUY',
        quantity: 0,
        price: 0,
        reason: '',
      });
    } catch (error) {
      console.error('执行交易失败:', error);
    }
  };

  // 生成报告
  const handleGenerateReport = async () => {
    if (!currentPortfolio) return;

    try {
      const report = await generateReport('comprehensive');
      console.log('生成的报告:', report);

      // 导出报告
      const exportedContent = await exportReport(report, 'json');
      console.log('导出的报告内容:', exportedContent);
    } catch (error) {
      console.error('生成报告失败:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: '概览', icon: BarChart3 },
    { id: 'positions', label: '持仓管理', icon: TrendingUp },
    { id: 'trading', label: '交易执行', icon: ArrowUpRight },
    { id: 'risk', label: '风险监控', icon: AlertTriangle },
    { id: 'reports', label: '报告生成', icon: FileText },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* 页面标题 */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>业务流程管理</h1>
          <p className='mt-2 text-gray-600'>
            管理投资组合的完整业务流程，从创建到监控的全流程操作
          </p>
        </div>

        {/* 投资组合选择 */}
        <div className='mb-6 bg-white rounded-lg shadow p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold text-gray-900'>投资组合</h2>
            <button
              onClick={() => setShowCreatePortfolio(true)}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
            >
              <Plus className='w-4 h-4 mr-2' />
              创建投资组合
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  currentPortfolio?.id === portfolio.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => selectPortfolio(portfolio.id)}
              >
                <h3 className='font-medium text-gray-900'>{portfolio.name}</h3>
                <p className='text-sm text-gray-500'>{portfolio.description}</p>
                <div className='mt-2 text-sm'>
                  <span className='text-gray-600'>总价值: </span>
                  <span className='font-medium'>
                    ¥{portfolio.totalValue.toLocaleString()}
                  </span>
                </div>
                <div className='mt-1 text-sm'>
                  <span className='text-gray-600'>盈亏: </span>
                  <span
                    className={`font-medium ${
                      portfolio.totalPnL >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {portfolio.totalPnL >= 0 ? '+' : ''}¥
                    {portfolio.totalPnL.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 当前投资组合信息 */}
        {currentPortfolio && (
          <div className='mb-6 bg-white rounded-lg shadow p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold text-gray-900'>
                当前投资组合: {currentPortfolio.name}
              </h2>
              <div className='flex space-x-2'>
                <button
                  onClick={() => setShowAddPosition(true)}
                  className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
                >
                  <Plus className='w-4 h-4 mr-2' />
                  添加持仓
                </button>
                <button
                  onClick={() => setShowTradeOrder(true)}
                  className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700'
                >
                  <ArrowUpRight className='w-4 h-4 mr-2' />
                  执行交易
                </button>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>
                  ¥{currentPortfolio.totalValue.toLocaleString()}
                </div>
                <div className='text-sm text-gray-500'>总价值</div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-gray-900'>
                  ¥{currentPortfolio.totalCost.toLocaleString()}
                </div>
                <div className='text-sm text-gray-500'>总成本</div>
              </div>
              <div className='text-center'>
                <div
                  className={`text-2xl font-bold ${
                    currentPortfolio.totalPnL >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {currentPortfolio.totalPnL >= 0 ? '+' : ''}¥
                  {currentPortfolio.totalPnL.toLocaleString()}
                </div>
                <div className='text-sm text-gray-500'>总盈亏</div>
              </div>
              <div className='text-center'>
                <div
                  className={`text-2xl font-bold ${
                    currentPortfolio.totalPnLPercent >= 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {currentPortfolio.totalPnLPercent >= 0 ? '+' : ''}
                  {currentPortfolio.totalPnLPercent.toFixed(2)}%
                </div>
                <div className='text-sm text-gray-500'>盈亏比例</div>
              </div>
            </div>
          </div>
        )}

        {/* 标签页导航 */}
        <div className='mb-6'>
          <nav className='flex space-x-8'>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className='w-4 h-4' />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 标签页内容 */}
        <div className='bg-white rounded-lg shadow'>
          {/* 概览标签页 */}
          {activeTab === 'overview' && (
            <div className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                投资组合概览
              </h3>
              {currentPortfolio ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                  <div className='bg-blue-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-blue-900'>持仓统计</h4>
                    <div className='mt-2 text-2xl font-bold text-blue-900'>
                      {positions.length}
                    </div>
                    <div className='text-sm text-blue-600'>总持仓数</div>
                  </div>
                  <div className='bg-green-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-green-900'>交易统计</h4>
                    <div className='mt-2 text-2xl font-bold text-green-900'>
                      {transactions.length}
                    </div>
                    <div className='text-sm text-green-600'>总交易数</div>
                  </div>
                  <div className='bg-purple-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-purple-900'>风险评分</h4>
                    <div className='mt-2 text-2xl font-bold text-purple-900'>
                      {riskAssessment?.totalRisk || 'N/A'}
                    </div>
                    <div className='text-sm text-purple-600'>风险等级</div>
                  </div>
                </div>
              ) : (
                <p className='text-gray-500'>请先选择一个投资组合</p>
              )}
            </div>
          )}

          {/* 持仓管理标签页 */}
          {activeTab === 'positions' && (
            <div className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                持仓管理
              </h3>
              {positions.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          股票代码
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          股票名称
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          数量
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          成本价
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          当前价
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          市值
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          盈亏
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {positions.map((position) => (
                        <tr key={position.id}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {position.stockCode}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {position.stockName}
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
                            ¥{position.marketValue.toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm'>
                            <span
                              className={`font-medium ${
                                position.unrealizedPnL >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {position.unrealizedPnL >= 0 ? '+' : ''}¥
                              {position.unrealizedPnL.toLocaleString()}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                            <div className='flex space-x-2'>
                              <button
                                onClick={() => setEditingPosition(position)}
                                className='text-blue-600 hover:text-blue-900'
                              >
                                <Edit className='w-4 h-4' />
                              </button>
                              <button
                                onClick={() => deletePosition(position.id)}
                                className='text-red-600 hover:text-red-900'
                              >
                                <Trash2 className='w-4 h-4' />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className='text-gray-500'>暂无持仓数据</p>
              )}
            </div>
          )}

          {/* 交易执行标签页 */}
          {activeTab === 'trading' && (
            <div className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                交易执行
              </h3>
              {transactions.length > 0 ? (
                <div className='overflow-x-auto'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          日期
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          股票代码
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          股票名称
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          类型
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          数量
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          价格
                        </th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          金额
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200'>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {transaction.date.toLocaleDateString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {transaction.stockCode}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {transaction.stockName}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm'>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                transaction.type === 'BUY'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {transaction.type === 'BUY' ? (
                                <ArrowUpRight className='w-3 h-3 mr-1' />
                              ) : (
                                <ArrowDownRight className='w-3 h-3 mr-1' />
                              )}
                              {transaction.type === 'BUY' ? '买入' : '卖出'}
                            </span>
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            {transaction.quantity.toLocaleString()}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            ¥{transaction.price.toFixed(2)}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                            ¥{transaction.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className='text-gray-500'>暂无交易记录</p>
              )}
            </div>
          )}

          {/* 风险监控标签页 */}
          {activeTab === 'risk' && (
            <div className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                风险监控
              </h3>
              <div className='flex justify-between items-center mb-4'>
                <p className='text-gray-600'>实时监控投资组合风险状况</p>
                <button
                  onClick={refreshRiskAssessment}
                  className='inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                >
                  <Eye className='w-4 h-4 mr-2' />
                  刷新风险评估
                </button>
              </div>

              {riskAssessment ? (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  <div className='bg-red-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-red-900'>总体风险</h4>
                    <div className='mt-2 text-2xl font-bold text-red-900'>
                      {riskAssessment.totalRisk}
                    </div>
                    <div className='text-sm text-red-600'>风险评分</div>
                  </div>
                  <div className='bg-yellow-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-yellow-900'>市场风险</h4>
                    <div className='mt-2 text-2xl font-bold text-yellow-900'>
                      {riskAssessment.marketRisk}
                    </div>
                    <div className='text-sm text-yellow-600'>风险评分</div>
                  </div>
                  <div className='bg-orange-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-orange-900'>集中度风险</h4>
                    <div className='mt-2 text-2xl font-bold text-orange-900'>
                      {riskAssessment.concentrationRisk}
                    </div>
                    <div className='text-sm text-orange-600'>风险评分</div>
                  </div>
                  <div className='bg-blue-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-blue-900'>流动性风险</h4>
                    <div className='mt-2 text-2xl font-bold text-blue-900'>
                      {riskAssessment.liquidityRisk}
                    </div>
                    <div className='text-sm text-blue-600'>风险评分</div>
                  </div>
                </div>
              ) : (
                <p className='text-gray-500'>暂无风险评估数据</p>
              )}
            </div>
          )}

          {/* 报告生成标签页 */}
          {activeTab === 'reports' && (
            <div className='p-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                报告生成
              </h3>
              <div className='flex justify-between items-center mb-4'>
                <p className='text-gray-600'>生成和导出投资组合分析报告</p>
                <button
                  onClick={handleGenerateReport}
                  className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
                >
                  <FileText className='w-4 h-4 mr-2' />
                  生成综合报告
                </button>
              </div>

              <div className='bg-gray-50 p-4 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>报告功能说明</h4>
                <ul className='text-sm text-gray-600 space-y-1'>
                  <li>
                    • 综合报告：包含投资组合概览、持仓分析、风险评估等完整信息
                  </li>
                  <li>• 晨报：每日开盘前的市场分析和投资建议</li>
                  <li>• 收盘报告：当日交易总结和明日展望</li>
                  <li>• 风险警报：异常风险状况的及时提醒</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className='mt-6 bg-red-50 border border-red-200 rounded-md p-4'>
            <div className='flex'>
              <AlertTriangle className='w-5 h-5 text-red-400' />
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>操作失败</h3>
                <div className='mt-2 text-sm text-red-700'>{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {loading && (
          <div className='mt-6 flex justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        )}
      </div>

      {/* 创建投资组合模态框 */}
      {showCreatePortfolio && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                创建投资组合
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    名称
                  </label>
                  <input
                    type='text'
                    value={portfolioForm.name}
                    onChange={(e) =>
                      setPortfolioForm({
                        ...portfolioForm,
                        name: e.target.value,
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    描述
                  </label>
                  <textarea
                    value={portfolioForm.description}
                    onChange={(e) =>
                      setPortfolioForm({
                        ...portfolioForm,
                        description: e.target.value,
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                    rows={3}
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    初始资金
                  </label>
                  <input
                    type='number'
                    value={portfolioForm.totalValue}
                    onChange={(e) =>
                      setPortfolioForm({
                        ...portfolioForm,
                        totalValue: Number(e.target.value),
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>
              <div className='flex justify-end space-x-3 mt-6'>
                <button
                  onClick={() => setShowCreatePortfolio(false)}
                  className='px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                >
                  取消
                </button>
                <button
                  onClick={handleCreatePortfolio}
                  className='px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 添加持仓模态框 */}
      {showAddPosition && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                添加持仓
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    股票代码
                  </label>
                  <input
                    type='text'
                    value={positionForm.stockCode}
                    onChange={(e) =>
                      setPositionForm({
                        ...positionForm,
                        stockCode: e.target.value,
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    股票名称
                  </label>
                  <input
                    type='text'
                    value={positionForm.stockName}
                    onChange={(e) =>
                      setPositionForm({
                        ...positionForm,
                        stockName: e.target.value,
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    数量
                  </label>
                  <input
                    type='number'
                    value={positionForm.quantity}
                    onChange={(e) =>
                      setPositionForm({
                        ...positionForm,
                        quantity: Number(e.target.value),
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    成本价
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={positionForm.avgCost}
                    onChange={(e) =>
                      setPositionForm({
                        ...positionForm,
                        avgCost: Number(e.target.value),
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    当前价
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={positionForm.currentPrice}
                    onChange={(e) =>
                      setPositionForm({
                        ...positionForm,
                        currentPrice: Number(e.target.value),
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
              </div>
              <div className='flex justify-end space-x-3 mt-6'>
                <button
                  onClick={() => setShowAddPosition(false)}
                  className='px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                >
                  取消
                </button>
                <button
                  onClick={handleAddPosition}
                  className='px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 执行交易模态框 */}
      {showTradeOrder && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50'>
          <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
            <div className='mt-3'>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                执行交易
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    股票代码
                  </label>
                  <input
                    type='text'
                    value={tradeForm.stockCode}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, stockCode: e.target.value })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    股票名称
                  </label>
                  <input
                    type='text'
                    value={tradeForm.stockName}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, stockName: e.target.value })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    交易类型
                  </label>
                  <select
                    value={tradeForm.type}
                    onChange={(e) =>
                      setTradeForm({
                        ...tradeForm,
                        type: e.target.value as 'BUY' | 'SELL',
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value='BUY'>买入</option>
                    <option value='SELL'>卖出</option>
                  </select>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    数量
                  </label>
                  <input
                    type='number'
                    value={tradeForm.quantity}
                    onChange={(e) =>
                      setTradeForm({
                        ...tradeForm,
                        quantity: Number(e.target.value),
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    价格
                  </label>
                  <input
                    type='number'
                    step='0.01'
                    value={tradeForm.price}
                    onChange={(e) =>
                      setTradeForm({
                        ...tradeForm,
                        price: Number(e.target.value),
                      })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700'>
                    交易原因
                  </label>
                  <textarea
                    value={tradeForm.reason}
                    onChange={(e) =>
                      setTradeForm({ ...tradeForm, reason: e.target.value })
                    }
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
                    rows={2}
                  />
                </div>
              </div>
              <div className='flex justify-end space-x-3 mt-6'>
                <button
                  onClick={() => setShowTradeOrder(false)}
                  className='px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
                >
                  取消
                </button>
                <button
                  onClick={handleExecuteTrade}
                  className='px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700'
                >
                  执行交易
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProcess;
