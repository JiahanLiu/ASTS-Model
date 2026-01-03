import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  Bar,
} from 'recharts';
import { RevenueChartData, ModelType } from '../types';
import { formatCurrency } from '../constants/defaults';

interface RevenueChartProps {
  data: RevenueChartData[];
  activeModel: ModelType;
}

export function RevenueChart({ data, activeModel }: RevenueChartProps) {
  const showThroughput = activeModel === 'throughput' || activeModel === 'both';
  const showUserBased = activeModel === 'user-based' || activeModel === 'both';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-semibold text-slate-800">Revenue Projections</h2>
          <p className="text-sm text-slate-500">Annual net revenue by valuation model (2025-2030)</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="userBasedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => formatCurrency(value, 0)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [formatCurrency(value, 1), '']}
              labelStyle={{ color: '#1e293b', fontWeight: 600 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
            />
            {showThroughput && (
              <Area
                type="monotone"
                dataKey="throughputRevenue"
                name="Throughput Model"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#throughputGradient)"
              />
            )}
            {showUserBased && (
              <Area
                type="monotone"
                dataKey="userBasedRevenue"
                name="User-Based Model"
                stroke="#22c55e"
                strokeWidth={2}
                fill="url(#userBasedGradient)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Stock Price Projection Chart
interface StockPriceChartProps {
  data: RevenueChartData[];
  activeModel: ModelType;
}

export function StockPriceChart({ data, activeModel }: StockPriceChartProps) {
  const showThroughput = activeModel === 'throughput' || activeModel === 'both';
  const showUserBased = activeModel === 'user-based' || activeModel === 'both';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-semibold text-slate-800">Stock Price Trajectory</h2>
          <p className="text-sm text-slate-500">Implied share price by year</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, '']}
              labelStyle={{ color: '#1e293b', fontWeight: 600 }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
            />
            {showThroughput && (
              <Line
                type="monotone"
                dataKey="throughputPrice"
                name="Throughput Model"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#1d4ed8' }}
              />
            )}
            {showUserBased && (
              <Line
                type="monotone"
                dataKey="userBasedPrice"
                name="User-Based Model"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#15803d' }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Model Comparison Bar Chart
interface ModelComparisonProps {
  throughputResult: { netRevenue: number; stockPrice: number };
  userBasedResult: { netRevenue: number; stockPrice: number };
}

export function ModelComparisonChart({ throughputResult, userBasedResult }: ModelComparisonProps) {
  const priceData = [
    {
      model: 'Throughput',
      price: throughputResult.stockPrice,
      fill: '#3b82f6',
    },
    {
      model: 'User-Based',
      price: userBasedResult.stockPrice,
      fill: '#22c55e',
    },
    {
      model: 'Average',
      price: (throughputResult.stockPrice + userBasedResult.stockPrice) / 2,
      fill: '#6366f1',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="font-display font-semibold text-slate-800">Model Comparison</h2>
        <p className="text-sm text-slate-500">Side-by-side valuation comparison</p>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={priceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="model"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Stock Price']}
            />
            <Bar
              dataKey="price"
              radius={[8, 8, 0, 0]}
              maxBarSize={60}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

