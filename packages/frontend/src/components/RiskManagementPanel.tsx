import React, { useState } from 'react';
import {
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
} from 'lucide-react';
import {
  RiskAssessment,
  StopLossAlert,
  TakeProfitAlert,
  RebalanceSuggestion,
} from '@shared/types';

interface RiskManagementPanelProps {
  riskAssessment: RiskAssessment | null;
  stopLossAlerts: StopLossAlert[];
  takeProfitAlerts: TakeProfitAlert[];
  rebalanceSuggestions: RebalanceSuggestion[];
  onRefreshRisk: () => void;
  onGenerateReport: () => void;
  onExportReport: (format: string) => void;
}

const RiskManagementPanel: React.FC<RiskManagementPanelProps> = ({
  riskAssessment,
  stopLossAlerts,
  takeProfitAlerts,
  rebalanceSuggestions,
  onRefreshRisk,
  onGenerateReport,
  onExportReport,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'alerts' | 'suggestions' | 'reports'
  >('overview');

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'low':
        return '低风险';
      case 'medium':
        return '中风险';
      case 'high':
        return '高风险';
      default:
        return '未知';
    }
  };

  if (!riskAssessment) {
    return (
      <div className='card'>
        <div className='flex items-center justify-center h-32'>
          <div className='text-gray-500'>暂无风险评估数据</div>
        </div>
      </div>
    );
  }

  return (
    <div className='card'>
      {/* 标题和操作按钮 */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center space-x-2'>
          <Shield className='w-6 h-6 text-blue-600' />
          <h2 className='text-xl font-semibold text-gray-900'>风险管理</h2>
        </div>
        <div className='flex items-center space-x-2'>
          <button onClick={onRefreshRisk} className='btn btn-secondary btn-sm'>
            <RefreshCw className='w-4 h-4' />
            刷新
          </button>
          <button onClick={onGenerateReport} className='btn btn-primary btn-sm'>
            <Download className='w-4 h-4' />
            生成报告
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className='border-b border-gray-200 mb-6'>
        <nav className='flex space-x-8'>
          {[
            { id: 'overview', label: '风险概览', icon: BarChart3 },
            {
              id: 'alerts',
              label: '风险警报',
              icon: AlertTriangle,
              count: stopLossAlerts.length + takeProfitAlerts.length,
            },
            {
              id: 'suggestions',
              label: '调仓建议',
              icon: TrendingUp,
              count: rebalanceSuggestions.length,
            },
            { id: 'reports', label: '报告导出', icon: Download },
          ].map(({ id, label, icon: Icon, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className='w-4 h-4' />
              <span>{label}</span>
              {count !== undefined && count > 0 && (
                <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
                  {count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* 风险概览 */}
      {activeTab === 'overview' && (
        <div className='space-y-6'>
          {/* 整体风险等级 */}
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  整体风险等级
                </h3>
                <div className='flex items-center space-x-3'>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(
                      riskAssessment.overallRiskLevel
                    )}`}
                  >
                    {getRiskLevelText(riskAssessment.overallRiskLevel)}
                  </span>
                  <span className='text-2xl font-bold text-gray-900'>
                    {riskAssessment.weightedRiskScore}/100
                  </span>
                  <span className='text-sm text-gray-500'>风险评分</span>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-gray-500'>评估时间</div>
                <div className='text-sm font-medium text-gray-900'>
                  {new Date(riskAssessment.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* 风险分布 */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='text-center p-4 bg-green-50 rounded-lg'>
              <div className='text-2xl font-bold text-green-600 mb-1'>
                {riskAssessment.riskDistribution.low}
              </div>
              <div className='text-sm text-green-700'>低风险持仓</div>
            </div>
            <div className='text-center p-4 bg-yellow-50 rounded-lg'>
              <div className='text-2xl font-bold text-yellow-600 mb-1'>
                {riskAssessment.riskDistribution.medium}
              </div>
              <div className='text-sm text-yellow-700'>中风险持仓</div>
            </div>
            <div className='text-center p-4 bg-red-50 rounded-lg'>
              <div className='text-2xl font-bold text-red-600 mb-1'>
                {riskAssessment.riskDistribution.high}
              </div>
              <div className='text-sm text-red-700'>高风险持仓</div>
            </div>
          </div>

          {/* 赛道风险分析 */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              赛道风险分析
            </h3>
            <div className='space-y-3'>
              {riskAssessment.sectorRisks.map((sector, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(
                        sector.riskLevel
                      )}`}
                    >
                      {getRiskLevelText(sector.riskLevel)}
                    </span>
                    <span className='font-medium text-gray-900'>
                      {sector.sector}
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-medium text-gray-900'>
                      {sector.avgRiskScore}/100
                    </div>
                    <div className='text-xs text-gray-500'>
                      {sector.positionCount}只股票 ·{' '}
                      {(sector.totalWeight * 100).toFixed(1)}%权重
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 风险建议 */}
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>
              主要风险建议
            </h3>
            <div className='space-y-2'>
              {riskAssessment.recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className='flex items-start space-x-2 p-3 bg-blue-50 rounded-lg'
                >
                  <div className='w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0'></div>
                  <span className='text-sm text-blue-800'>
                    {recommendation}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 风险警报 */}
      {activeTab === 'alerts' && (
        <div className='space-y-6'>
          {/* 止损警报 */}
          {stopLossAlerts.length > 0 && (
            <div>
              <h3 className='text-lg font-medium text-red-700 mb-4 flex items-center'>
                <TrendingDown className='w-5 h-5 mr-2' />
                止损警报 ({stopLossAlerts.length})
              </h3>
              <div className='space-y-3'>
                {stopLossAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className='p-4 bg-red-50 border border-red-200 rounded-lg'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div className='font-medium text-red-900'>
                        {alert.stockName}
                      </div>
                      <span className='text-sm text-red-600'>
                        {alert.lossPercent.toFixed(2)}% 亏损
                      </span>
                    </div>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-red-600'>当前价格:</span>
                        <span className='ml-2 font-medium'>
                          ¥{alert.currentPrice}
                        </span>
                      </div>
                      <div>
                        <span className='text-red-600'>止损价格:</span>
                        <span className='ml-2 font-medium'>
                          ¥{alert.stopLossPrice}
                        </span>
                      </div>
                    </div>
                    <div className='mt-2 text-sm text-red-700'>
                      <strong>建议:</strong> {alert.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 止盈警报 */}
          {takeProfitAlerts.length > 0 && (
            <div>
              <h3 className='text-lg font-medium text-green-700 mb-4 flex items-center'>
                <TrendingUp className='w-5 h-5 mr-2' />
                止盈警报 ({takeProfitAlerts.length})
              </h3>
              <div className='space-y-3'>
                {takeProfitAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className='p-4 bg-green-50 border border-green-200 rounded-lg'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div className='font-medium text-green-900'>
                        {alert.stockName}
                      </div>
                      <span className='text-sm text-green-600'>
                        +{alert.profitPercent.toFixed(2)}% 盈利
                      </span>
                    </div>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <span className='text-green-600'>当前价格:</span>
                        <span className='ml-2 font-medium'>
                          ¥{alert.currentPrice}
                        </span>
                      </div>
                      <div>
                        <span className='text-green-600'>止盈价格:</span>
                        <span className='ml-2 font-medium'>
                          ¥{alert.takeProfitPrice}
                        </span>
                      </div>
                    </div>
                    <div className='mt-2 text-sm text-green-700'>
                      <strong>建议:</strong> {alert.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stopLossAlerts.length === 0 && takeProfitAlerts.length === 0 && (
            <div className='text-center py-8'>
              <Shield className='w-12 h-12 text-green-500 mx-auto mb-3' />
              <div className='text-gray-500'>暂无风险警报</div>
              <div className='text-sm text-gray-400'>
                当前所有持仓都在安全范围内
              </div>
            </div>
          )}
        </div>
      )}

      {/* 调仓建议 */}
      {activeTab === 'suggestions' && (
        <div className='space-y-6'>
          {rebalanceSuggestions.length > 0 ? (
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                再平衡建议
              </h3>
              <div className='space-y-4'>
                {rebalanceSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'
                  >
                    <div className='flex items-center justify-between mb-2'>
                      <div className='font-medium text-yellow-900'>
                        {suggestion.stockName || suggestion.sector}
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          suggestion.type === 'reduce'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {suggestion.type === 'reduce' ? '减仓' : '分散'}
                      </span>
                    </div>
                    <div className='grid grid-cols-2 gap-4 text-sm mb-2'>
                      <div>
                        <span className='text-yellow-600'>当前权重:</span>
                        <span className='ml-2 font-medium'>
                          {(suggestion.currentWeight * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className='text-yellow-600'>建议权重:</span>
                        <span className='ml-2 font-medium'>
                          {(suggestion.suggestedWeight * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className='text-sm text-yellow-700'>
                      <strong>原因:</strong> {suggestion.reason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='text-center py-8'>
              <TrendingUp className='w-12 h-12 text-green-500 mx-auto mb-3' />
              <div className='text-gray-500'>暂无调仓建议</div>
              <div className='text-sm text-gray-400'>
                当前持仓结构合理，无需调整
              </div>
            </div>
          )}
        </div>
      )}

      {/* 报告导出 */}
      {activeTab === 'reports' && (
        <div className='space-y-6'>
          <div>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>风险报告</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>综合风险报告</h4>
                <p className='text-sm text-gray-600 mb-3'>
                  包含风险评估、警报汇总、调仓建议等完整信息
                </p>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => onExportReport('html')}
                    className='btn btn-secondary btn-sm'
                  >
                    导出HTML
                  </button>
                  <button
                    onClick={() => onExportReport('pdf')}
                    className='btn btn-secondary btn-sm'
                  >
                    导出PDF
                  </button>
                </div>
              </div>

              <div className='p-4 border border-gray-200 rounded-lg'>
                <h4 className='font-medium text-gray-900 mb-2'>风险指标报告</h4>
                <p className='text-sm text-gray-600 mb-3'>
                  专注于风险指标分析和趋势变化
                </p>
                <div className='flex space-x-2'>
                  <button
                    onClick={() => onExportReport('csv')}
                    className='btn btn-secondary btn-sm'
                  >
                    导出CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className='p-4 bg-blue-50 border border-blue-200 rounded-lg'>
            <h4 className='font-medium text-blue-900 mb-2'>实时监控</h4>
            <p className='text-sm text-blue-700 mb-3'>
              系统会定期检查风险指标，发现异常时及时发出警报
            </p>
            <div className='text-xs text-blue-600'>
              • 每5分钟检查一次止损止盈触发情况
              <br />
              • 实时监控持仓集中度变化
              <br />• 自动计算风险评分和等级
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskManagementPanel;
