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
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts';

interface SectorData {
  name: string;
  value: number;
  weight: number;
  color: string;
  pnl: number;
  pnlPercent: number;
}

interface PerformanceData {
  date: string;
  totalValue: number;
  totalPnL: number;
  benchmark: number;
}

interface RiskMetrics {
  metric: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'danger';
}

interface PortfolioChartsProps {
  sectorData: SectorData[];
  performanceData: PerformanceData[];
  riskMetrics: RiskMetrics[];
}

const COLORS = [
  '#3B82F6',
  '#8B5CF6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#06B6D4',
];

const PortfolioCharts: React.FC<PortfolioChartsProps> = ({
  sectorData,
  performanceData,
  riskMetrics,
}) => {
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
            权重: {(data.weight * 100).toFixed(1)}%
          </p>
          <p className='text-gray-600'>
            市值: ¥{(data.value / 10000).toFixed(1)}万
          </p>
          <p className={`${data.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            盈亏: {data.pnl >= 0 ? '+' : ''}¥{data.pnl.toFixed(0)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className='space-y-6'>
      {/* 赛道权重分布饼图 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>赛道权重分布</h3>
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
                      权重: {(sector.weight * 100).toFixed(1)}%
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
                    {sector.pnl >= 0 ? '+' : ''}
                    {sector.pnlPercent.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 组合表现趋势图 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>组合表现趋势</h3>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <ComposedChart data={performanceData}>
              <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
              <XAxis dataKey='date' stroke='#6b7280' fontSize={12} />
              <YAxis
                yAxisId='left'
                stroke='#6b7280'
                fontSize={12}
                tickFormatter={(value) => `¥${(value / 10000).toFixed(0)}万`}
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

              <Area
                yAxisId='left'
                type='monotone'
                dataKey='totalValue'
                stroke='#3B82F6'
                fill='#3B82F6'
                fillOpacity={0.1}
                name='总市值'
              />

              <Line
                yAxisId='right'
                type='monotone'
                dataKey='totalPnL'
                stroke='#10B981'
                strokeWidth={2}
                name='总盈亏'
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />

              <Line
                yAxisId='right'
                type='monotone'
                dataKey='benchmark'
                stroke='#6B7280'
                strokeWidth={2}
                strokeDasharray='5 5'
                name='基准指数'
                dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 赛道表现对比柱状图 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>赛道表现对比</h3>
        <div className='h-80'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={sectorData}>
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
                stroke='#6b7280'
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(1)}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              <Bar
                dataKey='pnlPercent'
                fill='#10B981'
                name='收益率'
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 风险指标仪表板 */}
      <div className='card'>
        <h3 className='text-lg font-medium text-gray-900 mb-4'>
          风险指标仪表板
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {riskMetrics.map((metric, index) => (
            <div key={index} className='text-center p-4 bg-gray-50 rounded-lg'>
              <div className='text-2xl font-bold text-gray-900 mb-2'>
                {metric.value.toFixed(2)}
              </div>
              <div className='text-sm text-gray-600 mb-2'>{metric.metric}</div>
              <div className='text-xs text-gray-500'>
                目标: {metric.target.toFixed(2)}
              </div>
              <div
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  metric.status === 'good'
                    ? 'bg-green-100 text-green-800'
                    : metric.status === 'warning'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {metric.status === 'good'
                  ? '良好'
                  : metric.status === 'warning'
                  ? '注意'
                  : '风险'}
              </div>
            </div>
          ))}
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
              <BarChart data={sectorData} layout='horizontal'>
                <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
                <XAxis
                  type='number'
                  stroke='#6b7280'
                  fontSize={12}
                  tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                />
                <YAxis
                  dataKey='name'
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
                            {data.name}
                          </p>
                          <p className='text-gray-600'>
                            权重: {(data.weight * 100).toFixed(1)}%
                          </p>
                          <p className='text-gray-600'>
                            市值: ¥{(data.value / 10000).toFixed(1)}万
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
              <h4 className='font-medium text-gray-900 mb-2'>集中度分析</h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>最大单一赛道权重:</span>
                  <span className='font-medium'>
                    {(
                      Math.max(...sectorData.map((s) => s.weight)) * 100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>前三大赛道权重:</span>
                  <span className='font-medium'>
                    {(
                      sectorData
                        .sort((a, b) => b.weight - a.weight)
                        .slice(0, 3)
                        .reduce((sum, s) => sum + s.weight, 0) * 100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>赛道数量:</span>
                  <span className='font-medium'>{sectorData.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className='font-medium text-gray-900 mb-2'>风险提示</h4>
              <div className='space-y-2 text-sm text-gray-600'>
                {sectorData
                  .filter((s) => s.weight > 0.3)
                  .map((sector, index) => (
                    <div key={index} className='flex items-start space-x-2'>
                      <div className='w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0'></div>
                      <span>
                        {sector.name} 权重较高 (
                        {(sector.weight * 100).toFixed(1)}%)，建议适当分散
                      </span>
                    </div>
                  ))}
                {sectorData.filter((s) => s.weight > 0.3).length === 0 && (
                  <div className='flex items-start space-x-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0'></div>
                    <span>各赛道权重分布较为均衡，风险分散良好</span>
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

export default PortfolioCharts;
