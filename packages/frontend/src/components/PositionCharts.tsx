import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ComposedChart,
  Area,
} from 'recharts';
import type { Position } from '@shared/types';

interface PositionChartsProps {
  positions: Position[];
}

const COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#06B6D4',
];
const RISK_COLORS = { low: '#10B981', medium: '#F59E0B', high: '#EF4444' };

const PositionCharts: React.FC<PositionChartsProps> = ({ positions }) => {
  // 按赛道分组数据
  const sectorData = positions.reduce(
    (acc, position) => {
      const existing = acc.find((s) => s.name === position.sector);
      if (existing) {
        existing.value += position.marketValue;
        existing.weight += position.weight;
        existing.pnl += position.unrealizedPnL;
        existing.count += 1;
      } else {
        acc.push({
          name: position.sector,
          value: position.marketValue,
          weight: position.weight,
          pnl: position.unrealizedPnL,
          count: 1,
          color: COLORS[acc.length % COLORS.length],
        });
      }
      return acc;
    },
    [] as Array<{
      name: string;
      value: number;
      weight: number;
      pnl: number;
      count: number;
      color: string;
    }>
  );

  // 按风险等级分组
  const riskData = positions.reduce(
    (acc, position) => {
      const riskLevel =
        position.unrealizedPnLPercent > 10
          ? 'high'
          : position.unrealizedPnLPercent > 5
          ? 'medium'
          : 'low';
      const existing = acc.find((r) => r.riskLevel === riskLevel);
      if (existing) {
        existing.value += position.marketValue;
        existing.count += 1;
      } else {
        acc.push({
          riskLevel: riskLevel,
          value: position.marketValue,
          count: 1,
          color: RISK_COLORS[riskLevel as keyof typeof RISK_COLORS],
        });
      }
      return acc;
    },
    [] as Array<{
      riskLevel: string;
      value: number;
      count: number;
      color: string;
    }>
  );

  // 盈亏分布数据
  const pnlData = positions.map((pos) => ({
    name: pos.stockName,
    pnl: pos.unrealizedPnL,
    pnlPercent: pos.unrealizedPnLPercent,
    marketValue: pos.marketValue,
    sector: pos.sector,
  }));

  // 持仓时间模拟数据（这里用随机数据演示）
  const timeData = positions.map((pos, index) => ({
    name: pos.stockName,
    days: Math.floor(Math.random() * 200) + 30,
    pnlPercent: pos.unrealizedPnLPercent,
    sector: pos.sector,
  }));

  // 自定义工具提示
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
          <p className='font-medium text-gray-900'>{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 饼图工具提示
  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
          <p className='font-medium text-gray-900'>{data.name}</p>
          <p className='text-gray-600'>
            市值: ¥{(data.value / 10000).toFixed(1)}万
          </p>
          <p className='text-gray-600'>
            权重: {(data.weight * 100).toFixed(1)}%
          </p>
          <p className='text-gray-600'>数量: {data.count}只</p>
          <p className={`${data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            盈亏: {data.pnl >= 0 ? '+' : ''}¥{data.pnl.toFixed(0)}
          </p>
        </div>
      );
    }
    return null;
  };

  const getRiskLevelText = (risk: string) => {
    switch (risk) {
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

  return (
    <div className='space-y-6'>
      {/* 持仓分布饼图 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>持仓分布分析</h3>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='h-80'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={sectorData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, weight }) =>
                    `${name} (${(weight * 100).toFixed(1)}%)`
                  }
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className='space-y-3'>
            {sectorData.map((sector, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
              >
                <div className='flex items-center'>
                  <div
                    className='w-4 h-4 rounded-full mr-3'
                    style={{ backgroundColor: sector.color }}
                  ></div>
                  <div>
                    <div className='font-medium text-gray-900'>
                      {sector.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {sector.count}只股票 · {(sector.weight * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className='text-right'>
                  <div className='font-medium text-gray-900'>
                    ¥{(sector.value / 10000).toFixed(1)}万
                  </div>
                  <div
                    className={`text-sm ${
                      sector.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {sector.pnl >= 0 ? '+' : ''}¥{sector.pnl.toFixed(0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 盈亏分布柱状图 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>盈亏分布分析</h3>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart data={pnlData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis
                dataKey='name'
                stroke='#6b7280'
                fontSize={12}
                angle={-45}
                textAnchor='end'
                height={80}
              />
              <YAxis
                yAxisId='left'
                stroke='#6b7280'
                fontSize={12}
                tickFormatter={(value) => `¥${(value / 1000).toFixed(0)}K`}
              />
              <YAxis
                yAxisId='right'
                orientation='right'
                stroke='#6b7280'
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Bar
                yAxisId='left'
                dataKey='pnl'
                fill='#10B981'
                name='盈亏金额'
                radius={[4, 4, 0, 0]}
              />

              <Line
                yAxisId='right'
                type='monotone'
                dataKey='pnlPercent'
                stroke='#8B5CF6'
                strokeWidth={2}
                name='盈亏比例'
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 风险分布分析 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>风险分布分析</h3>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={riskData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ riskLevel, count }) =>
                    `${getRiskLevelText(riskLevel)} (${count})`
                  }
                  outerRadius={60}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className='space-y-4'>
            <div>
              <h4 className='font-medium text-gray-900 mb-3'>风险统计</h4>
              <div className='space-y-3'>
                {riskData.map((risk, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
                  >
                    <div className='flex items-center'>
                      <div
                        className='w-4 h-4 rounded-full mr-3'
                        style={{ backgroundColor: risk.color }}
                      ></div>
                      <span className='font-medium text-gray-900'>
                        {getRiskLevelText(risk.riskLevel)}
                      </span>
                    </div>
                    <div className='text-right'>
                      <div className='font-medium text-gray-900'>
                        {risk.count}只股票
                      </div>
                      <div className='text-sm text-gray-500'>
                        ¥{(risk.value / 10000).toFixed(1)}万
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className='font-medium text-gray-900 mb-2'>风险建议</h4>
              <div className='space-y-2 text-sm text-gray-600'>
                {riskData.find((r) => r.riskLevel === 'high') && (
                  <div className='flex items-start space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0'></div>
                    <span>高风险股票较多，建议适当减仓或分散投资</span>
                  </div>
                )}
                {riskData.find((r) => r.riskLevel === 'medium') && (
                  <div className='flex items-start space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0'></div>
                    <span>中风险股票占比较高，注意控制仓位</span>
                  </div>
                )}
                {riskData.find((r) => r.riskLevel === 'low') && (
                  <div className='flex items-start space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0'></div>
                    <span>低风险股票配置合理，可作为稳定器</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 持仓时间与收益关系 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          持仓时间与收益关系
        </h3>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <ScatterChart data={timeData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis
                dataKey='days'
                stroke='#6b7280'
                fontSize={12}
                name='持仓天数'
                tickFormatter={(value) => `${value}天`}
              />
              <YAxis
                dataKey='pnlPercent'
                stroke='#6b7280'
                fontSize={12}
                name='收益率'
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
                        <p className='font-medium text-gray-900'>{data.name}</p>
                        <p className='text-gray-600'>持仓天数: {data.days}天</p>
                        <p className='text-gray-600'>
                          收益率: {data.pnlPercent.toFixed(1)}%
                        </p>
                        <p className='text-gray-600'>赛道: {data.sector}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />

              <Scatter dataKey='pnlPercent' fill='#3B82F6' name='股票' />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className='mt-4 text-sm text-gray-600'>
          <p>• 横轴表示持仓天数，纵轴表示收益率</p>
          <p>• 通过散点图可以分析持仓时间与收益的关系</p>
          <p>• 帮助识别最佳持仓周期和调仓时机</p>
        </div>
      </div>

      {/* 持仓集中度分析 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          持仓集中度分析
        </h3>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={positions} layout='horizontal'>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis
                  type='number'
                  stroke='#6b7280'
                  fontSize={12}
                  tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                />
                <YAxis
                  dataKey='stockName'
                  type='category'
                  stroke='#6b7280'
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className='bg-white p-3 border border-gray-200 rounded-lg shadow-lg'>
                          <p className='font-medium text-gray-900'>
                            {data.stockName}
                          </p>
                          <p className='text-gray-600'>
                            权重: {(data.weight * 100).toFixed(1)}%
                          </p>
                          <p className='text-gray-600'>
                            市值: ¥{(data.marketValue / 10000).toFixed(1)}万
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Bar
                  dataKey='weight'
                  fill='#8B5CF6'
                  name='权重'
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className='space-y-4'>
            <div>
              <h4 className='font-medium text-gray-900 mb-2'>集中度指标</h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>最大单一持仓权重:</span>
                  <span className='font-medium'>
                    {(
                      Math.max(...positions.map((p) => p.weight)) * 100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>前三大持仓权重:</span>
                  <span className='font-medium'>
                    {(
                      positions
                        .sort((a, b) => b.weight - a.weight)
                        .slice(0, 3)
                        .reduce((sum, p) => sum + p.weight, 0) * 100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>持仓数量:</span>
                  <span className='font-medium'>{positions.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-medium text-gray-900 mb-2'>集中度建议</h4>
              <div className='space-y-2 text-sm text-gray-600'>
                {positions
                  .filter((p) => p.weight > 0.15)
                  .map((position, index) => (
                    <div key={index} className='flex items-start space-x-2'>
                      <div className='w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0'></div>
                      <span>
                        {position.stockName} 权重较高 (
                        {(position.weight * 100).toFixed(1)}%)，建议适当减仓
                      </span>
                    </div>
                  ))}
                {positions.filter((p) => p.weight > 0.15).length === 0 && (
                  <div className='flex items-start space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0'></div>
                    <span>各持仓权重分布较为均衡，集中度风险较低</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionCharts;
