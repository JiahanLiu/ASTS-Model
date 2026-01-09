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
import { formatCurrencyMillions } from '../constants/defaults';

interface RevenueChartProps {
  data: RevenueChartData[];
  activeModel: ModelType;
}

export function RevenueChart({ data, activeModel }: RevenueChartProps) {
  const showThroughput = activeModel === 'throughput' || activeModel === 'both';
  const showUserBased = activeModel === 'user-based' || activeModel === 'both';
  const showAverage = activeModel === 'both';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display font-semibold text-slate-800">Revenue Projections</h2>
          <p className="text-sm text-slate-500">Annual net revenue by valuation model (2026-2030)</p>
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
              <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
              tickFormatter={(value) => formatCurrencyMillions(value, 0)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [formatCurrencyMillions(value, 1), '']}
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
            {showAverage && (
              <Area
                type="monotone"
                dataKey="averageRevenue"
                name="Average"
                stroke="#8b5cf6"
                strokeWidth={3}
                strokeDasharray="5 5"
                fill="url(#averageGradient)"
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
  currentPrice?: number | null;
  isLivePrice?: boolean;
  onManualPriceChange?: (price: number) => void;
  fullyDilutedShares?: number;
}

export function StockPriceChart({ data, activeModel, currentPrice, isLivePrice, onManualPriceChange, fullyDilutedShares }: StockPriceChartProps) {
  const showThroughput = activeModel === 'throughput' || activeModel === 'both';
  const showUserBased = activeModel === 'user-based' || activeModel === 'both';
  const showAverage = activeModel === 'both';

  // Get 2030 implied price from chart data (last data point is 2030)
  const lastDataPoint = data[data.length - 1];
  const price2030 = (
    activeModel === 'throughput' ? lastDataPoint?.throughputPrice :
    activeModel === 'user-based' ? lastDataPoint?.userBasedPrice :
    lastDataPoint?.averagePrice
  ) ?? 0;

  // Calculate upside
  const upside = currentPrice && currentPrice > 0
    ? ((price2030 - currentPrice) / currentPrice) * 100
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header with big price display */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="font-display font-semibold text-slate-800">Stock Price Trajectory</h2>
          <p className="text-sm text-slate-500">Implied share price by year</p>
        </div>

        {/* Big 2030 Price Display */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">2030 Target</div>
            <div className="text-2xl font-display font-bold text-primary-600">
              ${price2030.toFixed(2)}
            </div>
          </div>
          {fullyDilutedShares && (
            <div className="text-right">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">2030 Mcap</div>
              <div className="text-2xl font-display font-bold text-accent-600">
                ${((price2030 * fullyDilutedShares) / 1000).toFixed(1)}B
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Current Price & Upside Row */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-gradient-to-r from-slate-50 to-primary-50 rounded-xl border border-slate-200">
        {currentPrice !== null && currentPrice !== undefined && (
          <div className="flex-1">
            <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
              Current Price
              {isLivePrice ? (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-green-100 text-green-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  LIVE
                </span>
              ) : (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-yellow-100 text-yellow-700">
                  UPDATING
                </span>
              )}
            </div>
            {isLivePrice ? (
              <div className="text-2xl font-bold text-slate-700">${currentPrice.toFixed(2)}</div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-slate-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentPrice}
                  onChange={(e) => onManualPriceChange?.(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 text-xl font-bold text-slate-700 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter price"
                />
              </div>
            )}
          </div>
        )}
        {upside !== null && (
          <div className="flex-1 text-right">
            <div className="text-xs text-slate-400 uppercase tracking-wider">2030 Upside</div>
            <div className={`text-2xl font-bold ${upside >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {upside >= 0 ? '+' : ''}{upside.toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      <div className="h-64">
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
              formatter={(value: number, name: string) => {
                const mcap = fullyDilutedShares ? (value * fullyDilutedShares) / 1000 : null;
                const mcapStr = mcap ? ` (Mcap: $${mcap.toFixed(1)}B)` : '';
                return [`$${value.toFixed(2)}${mcapStr}`, name];
              }}
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
            {showAverage && (
              <Line
                type="monotone"
                dataKey="averagePrice"
                name="Average"
                stroke="#8b5cf6"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#6d28d9' }}
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

