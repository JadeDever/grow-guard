import React, { useState } from 'react';
import { usePortfolioBusiness } from '../hooks/usePortfolioBusiness';
import { Position } from '@shared/types';
import {
  Shield,
  AlertTriangle,
  FileText,
  Settings,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Target,
  Workflow,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import Card, {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '../components/ui/Card';
import Button from '../components/ui/Button';
import Breadcrumb from '../components/ui/Breadcrumb';

const BusinessProcess: React.FC = () => {
  const {
    portfolios,
    currentPortfolio,
    positions,
    transactions,
    riskAssessment,
    loading,
    error,
    refreshRiskAssessment,
    generateReport,
    exportReport,
  } = usePortfolioBusiness();

  const [activeTab, setActiveTab] = useState('overview');
  const [showRiskSettings, setShowRiskSettings] = useState(false);
  const [showProcessConfig, setShowProcessConfig] = useState(false);

  // 风控设置表单状态
  const [riskForm, setRiskForm] = useState({
    maxDrawdown: 10,
    stopLossPercent: 5,
    takeProfitPercent: 20,
    maxSectorWeight: 30,
    maxSingleWeight: 15,
  });

  // 流程配置表单状态
  const [processForm, setProcessForm] = useState({
    requireApproval: true,
    approvalThreshold: 100000,
    autoRebalance: false,
    rebalanceFrequency: 'weekly',
    riskCheckInterval: 'daily',
  });

  // 风控指标数据
  const riskMetrics = [
    { metric: '夏普比率', value: 1.2, target: 1.0, status: 'good' as const },
    { metric: '最大回撤', value: 8.5, target: 10.0, status: 'good' as const },
    { metric: '波动率', value: 15.3, target: 12.0, status: 'warning' as const },
    { metric: '贝塔系数', value: 0.85, target: 1.0, status: 'good' as const },
    { metric: 'VaR (95%)', value: 2.1, target: 3.0, status: 'good' as const },
    { metric: '信息比率', value: 0.8, target: 1.0, status: 'warning' as const },
  ];

  // 风控提醒数据
  const riskAlerts = [
    {
      id: 1,
      type: 'stopLoss',
      message: '比亚迪(002594) 触发止损提醒',
      stock: '比亚迪',
      code: '002594',
      currentPrice: 180.5,
      stopPrice: 175.0,
      time: '2分钟前',
      priority: 'high',
    },
    {
      id: 2,
      type: 'takeProfit',
      message: '宁德时代(300750) 达到止盈目标',
      stock: '宁德时代',
      code: '300750',
      currentPrice: 245.8,
      targetPrice: 240.0,
      time: '15分钟前',
      priority: 'medium',
    },
    {
      id: 3,
      type: 'weightLimit',
      message: '军工板块权重超限提醒',
      sector: '军工',
      currentWeight: 25.5,
      maxWeight: 20.0,
      time: '1小时前',
      priority: 'high',
    },
  ];

  // 流程审批数据
  const approvalProcesses = [
    {
      id: 1,
      type: 'position',
      description: '新增比亚迪持仓',
      amount: 50000,
      requester: '张三',
      status: 'pending',
      createTime: '2024-01-15 10:30',
    },
    {
      id: 2,
      type: 'rebalance',
      description: '调整AI算力权重',
      amount: 80000,
      requester: '李四',
      status: 'approved',
      createTime: '2024-01-15 09:15',
    },
    {
      id: 3,
      type: 'risk',
      description: '风控参数调整',
      amount: 0,
      requester: '王五',
      status: 'rejected',
      createTime: '2024-01-15 08:45',
    },
  ];

  // 保存风控设置
  const handleSaveRiskSettings = async () => {
    try {
      // 这里应该调用API保存风控设置
      console.log('保存风控设置:', riskForm);
      setShowRiskSettings(false);
    } catch (error) {
      console.error('保存风控设置失败:', error);
    }
  };

  // 保存流程配置
  const handleSaveProcessConfig = async () => {
    try {
      // 这里应该调用API保存流程配置
      console.log('保存流程配置:', processForm);
      setShowProcessConfig(false);
    } catch (error) {
      console.error('保存流程配置失败:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4'></div>
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

  return (
    <div className='space-y-6 animate-fade-in'>
      {/* 页面标题和面包屑 */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
        <div>
          <h1 className='text-3xl font-bold text-gradient'>风控合规管理</h1>
          <p className='text-gray-600 mt-1'>风险控制和业务流程管理</p>
        </div>
        <div className='flex items-center space-x-3'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => setShowProcessConfig(true)}
          >
            <Workflow className='h-4 w-4 mr-2' />
            流程配置
          </Button>
          <Button
            variant='primary'
            size='sm'
            onClick={() => setShowRiskSettings(true)}
          >
            <Shield className='h-4 w-4 mr-2' />
            风控设置
          </Button>
        </div>
      </div>

      <Breadcrumb />

      {/* 风控概览卡片 */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-sm'>
              <Shield className='h-4 w-4 mr-2 text-blue-600' />
              风控状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>正常</div>
            <p className='text-xs text-gray-500 mt-1'>风险可控</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-sm'>
              <AlertTriangle className='h-4 w-4 mr-2 text-red-600' />
              风险提醒
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              {riskAlerts.length}
            </div>
            <p className='text-xs text-gray-500 mt-1'>需要关注</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-sm'>
              <Workflow className='h-4 w-4 mr-2 text-purple-600' />
              待审批
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-600'>
              {approvalProcesses.filter((p) => p.status === 'pending').length}
            </div>
            <p className='text-xs text-gray-500 mt-1'>等待处理</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center text-sm'>
              <Target className='h-4 w-4 mr-2 text-green-600' />
              合规率
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>98.5%</div>
            <p className='text-xs text-gray-500 mt-1'>符合要求</p>
          </CardContent>
        </Card>
      </div>

      {/* 标签页导航 */}
      <div className='border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          {[
            { id: 'overview', name: '概览', icon: Shield },
            { id: 'alerts', name: '风险提醒', icon: AlertTriangle },
            { id: 'approval', name: '流程审批', icon: Workflow },
            { id: 'compliance', name: '合规检查', icon: CheckCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
            {/* 风控指标 */}
            <Card>
              <CardHeader>
                <CardTitle>风控指标监控</CardTitle>
                <CardDescription>关键风险指标实时监控</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {riskMetrics.map((metric, index) => (
                    <div key={index} className='p-4 bg-gray-50 rounded-lg'>
                      <div className='flex items-center justify-between mb-2'>
                        <span className='text-sm font-medium text-gray-700'>
                          {metric.metric}
                        </span>
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
                      <div className='flex items-baseline space-x-2'>
                        <span className='text-2xl font-bold text-gray-900'>
                          {metric.value}
                        </span>
                        <span className='text-sm text-gray-500'>
                          目标: {metric.target}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 快速操作 */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
                <CardDescription>常用功能快捷入口</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <Button
                    variant='primary'
                    className='w-full'
                    onClick={() => setShowRiskSettings(true)}
                  >
                    <Shield className='h-4 w-4 mr-2' />
                    风控设置
                  </Button>
                  <Button
                    variant='secondary'
                    className='w-full'
                    onClick={() => setShowProcessConfig(true)}
                  >
                    <Workflow className='h-4 w-4 mr-2' />
                    流程配置
                  </Button>
                  <Button
                    variant='secondary'
                    className='w-full'
                    onClick={() => (window.location.href = '/reports')}
                  >
                    <FileText className='h-4 w-4 mr-2' />
                    合规报告
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'alerts' && (
          <Card>
            <CardHeader>
              <CardTitle>风险提醒</CardTitle>
              <CardDescription>实时风险监控和提醒</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {riskAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className='flex items-start space-x-3 p-4 bg-gray-50 rounded-lg'
                  >
                    <div className='flex-shrink-0 mt-1'>
                      {alert.type === 'stopLoss' ? (
                        <AlertTriangle className='h-5 w-5 text-red-600' />
                      ) : alert.type === 'takeProfit' ? (
                        <CheckCircle className='h-5 w-5 text-green-600' />
                      ) : (
                        <Bell className='h-5 w-5 text-yellow-600' />
                      )}
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center space-x-2 mb-1'>
                        <p className='text-sm font-medium text-gray-900'>
                          {alert.message}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            alert.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {alert.priority === 'high' ? '高' : '中'}
                        </span>
                      </div>
                      <div className='text-sm text-gray-600'>
                        {alert.stock && `${alert.stock}(${alert.code})`}
                        {alert.sector && `${alert.sector}板块`}
                        {alert.currentWeight &&
                          `当前权重: ${alert.currentWeight}%`}
                        {alert.maxWeight && `最大权重: ${alert.maxWeight}%`}
                      </div>
                      <p className='text-xs text-gray-500 mt-1'>{alert.time}</p>
                    </div>
                    <Button variant='ghost' size='sm'>
                      处理
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'approval' && (
          <Card>
            <CardHeader>
              <CardTitle>流程审批</CardTitle>
              <CardDescription>投资决策审批流程管理</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        申请信息
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        金额
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        申请人
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        状态
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {approvalProcesses.map((process) => (
                      <tr key={process.id}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <div>
                            <div className='text-sm font-medium text-gray-900'>
                              {process.description}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {process.createTime}
                            </div>
                          </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {process.amount > 0
                            ? `¥${process.amount.toLocaleString()}`
                            : '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {process.requester}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              process.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : process.status === 'approved'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {process.status === 'pending'
                              ? '待审批'
                              : process.status === 'approved'
                              ? '已通过'
                              : '已拒绝'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                          {process.status === 'pending' && (
                            <div className='flex space-x-2'>
                              <Button variant='success' size='sm'>
                                <CheckCircle className='h-3 w-3 mr-1' />
                                通过
                              </Button>
                              <Button variant='danger' size='sm'>
                                <XCircle className='h-3 w-3 mr-1' />
                                拒绝
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'compliance' && (
          <Card>
            <CardHeader>
              <CardTitle>合规检查</CardTitle>
              <CardDescription>系统合规性检查和报告</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='p-4 bg-green-50 border border-green-200 rounded-lg'>
                  <div className='flex items-center'>
                    <CheckCircle className='h-5 w-5 text-green-600 mr-3' />
                    <div>
                      <h4 className='text-sm font-medium text-green-800'>
                        合规检查通过
                      </h4>
                      <p className='text-sm text-green-700 mt-1'>
                        所有风控指标均在合规范围内
                      </p>
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Button
                    variant='secondary'
                    className='w-full'
                    onClick={() => (window.location.href = '/reports')}
                  >
                    <FileText className='h-4 w-4 mr-2' />
                    生成合规报告
                  </Button>
                  <Button variant='secondary' className='w-full'>
                    <Settings className='h-4 w-4 mr-2' />
                    合规设置
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 风控设置弹窗 */}
      {showRiskSettings && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium'>风控设置</h3>
              <button
                onClick={() => setShowRiskSettings(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <XCircle className='h-5 w-5' />
              </button>
            </div>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  最大回撤限制 (%)
                </label>
                <input
                  type='number'
                  value={riskForm.maxDrawdown}
                  onChange={(e) =>
                    setRiskForm({
                      ...riskForm,
                      maxDrawdown: Number(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  止损比例 (%)
                </label>
                <input
                  type='number'
                  value={riskForm.stopLossPercent}
                  onChange={(e) =>
                    setRiskForm({
                      ...riskForm,
                      stopLossPercent: Number(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  止盈比例 (%)
                </label>
                <input
                  type='number'
                  value={riskForm.takeProfitPercent}
                  onChange={(e) =>
                    setRiskForm({
                      ...riskForm,
                      takeProfitPercent: Number(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
              </div>
            </div>
            <div className='flex space-x-3 mt-6'>
              <Button
                variant='secondary'
                className='flex-1'
                onClick={() => setShowRiskSettings(false)}
              >
                取消
              </Button>
              <Button
                variant='primary'
                className='flex-1'
                onClick={handleSaveRiskSettings}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 流程配置弹窗 */}
      {showProcessConfig && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium'>流程配置</h3>
              <button
                onClick={() => setShowProcessConfig(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <XCircle className='h-5 w-5' />
              </button>
            </div>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700'>
                  需要审批
                </label>
                <input
                  type='checkbox'
                  checked={processForm.requireApproval}
                  onChange={(e) =>
                    setProcessForm({
                      ...processForm,
                      requireApproval: e.target.checked,
                    })
                  }
                  className='rounded border-gray-300 text-primary-600 focus:ring-primary-500'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  审批阈值 (¥)
                </label>
                <input
                  type='number'
                  value={processForm.approvalThreshold}
                  onChange={(e) =>
                    setProcessForm({
                      ...processForm,
                      approvalThreshold: Number(e.target.value),
                    })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500'
                />
              </div>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium text-gray-700'>
                  自动调仓
                </label>
                <input
                  type='checkbox'
                  checked={processForm.autoRebalance}
                  onChange={(e) =>
                    setProcessForm({
                      ...processForm,
                      autoRebalance: e.target.checked,
                    })
                  }
                  className='rounded border-gray-300 text-primary-600 focus:ring-primary-500'
                />
              </div>
            </div>
            <div className='flex space-x-3 mt-6'>
              <Button
                variant='secondary'
                className='flex-1'
                onClick={() => setShowProcessConfig(false)}
              >
                取消
              </Button>
              <Button
                variant='primary'
                className='flex-1'
                onClick={handleSaveProcessConfig}
              >
                保存
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessProcess;
