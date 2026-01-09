import { ValuationResult, FinancialParams, ModelType, getFullyDilutedShares } from '../types';
import { formatCurrencyMillions } from '../constants/defaults';
import { EvEbitdaScheduleEditor } from './ScheduleEditor';

interface ValuationSummaryProps {
  throughputResult: ValuationResult;
  userBasedResult: ValuationResult;
  activeResult: ValuationResult;
  activeModel: ModelType;
  financial: FinancialParams;
  evEbitdaSchedule: Record<number, number>;
  currentPrice?: number | null;
  upside?: number | null;
  onFinancialChange: <K extends keyof FinancialParams>(key: K, value: FinancialParams[K]) => void;
  onEvEbitdaScheduleChange: (year: number, multiple: number) => void;
  onReset: () => void;
}

export function ValuationSummary({
  throughputResult,
  userBasedResult,
  activeResult,
  activeModel,
  financial,
  evEbitdaSchedule,
  currentPrice,
  upside,
  onFinancialChange,
  onEvEbitdaScheduleChange,
  onReset,
}: ValuationSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 text-white">
      {/* Header with stock ticker style */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg">
            <span className="font-display font-bold text-lg">ASTS</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl">AST SpaceMobile</h2>
            <p className="text-slate-400 text-sm">Stock Price Valuation</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
        >
          Reset to Defaults
        </button>
      </div>

      {/* Main Stock Price Display */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-8 mb-4">
          {/* Implied Stock Price */}
          <div>
            <div className="text-lg font-display font-semibold text-slate-300 tracking-wide mb-1">
              2030 Implied Stock Price
            </div>
            <div className="text-5xl font-display font-bold bg-gradient-to-r from-primary-300 via-primary-400 to-accent-400 bg-clip-text text-transparent">
              ${activeResult.stockPrice.toFixed(2)}
            </div>
          </div>

          {/* Divider */}
          <div className="h-16 w-px bg-slate-600"></div>

          {/* Market Cap */}
          <div>
            <div className="text-lg font-display font-semibold text-slate-300 tracking-wide mb-1">
              Market Cap
            </div>
            <div className="text-5xl font-display font-bold bg-gradient-to-r from-accent-300 via-accent-400 to-primary-400 bg-clip-text text-transparent">
              ${((activeResult.stockPrice * getFullyDilutedShares(financial)) / 1000).toFixed(1)}B
            </div>
          </div>
        </div>

        {/* Upside Display */}
        {upside !== null && upside !== undefined && (
          <div className="mt-3 flex items-center justify-center gap-3">
            {currentPrice !== null && currentPrice !== undefined && (
              <div className="text-sm text-slate-400">
                Current: <span className="text-white font-semibold">${currentPrice.toFixed(2)}</span>
              </div>
            )}
            <div className={`text-lg font-bold px-3 py-1 rounded-full ${
              upside >= 0
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {upside >= 0 ? '↑' : '↓'} {Math.abs(upside).toFixed(0)}% Upside
            </div>
          </div>
        )}
      </div>

      {/* Model Comparison Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`p-4 rounded-xl ${activeModel === 'throughput' || activeModel === 'both' ? 'bg-primary-500/20 border border-primary-500/30' : 'bg-slate-700/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span>📡</span>
            <span className="text-sm font-medium text-slate-300">Throughput</span>
          </div>
          <div className="text-2xl font-bold text-white">${throughputResult.stockPrice.toFixed(2)}</div>
          <div className="text-xs text-slate-400 mt-1">
            Revenue: {formatCurrencyMillions(throughputResult.netRevenue, 1)}
          </div>
        </div>

        <div className={`p-4 rounded-xl ${activeModel === 'user-based' || activeModel === 'both' ? 'bg-accent-500/20 border border-accent-500/30' : 'bg-slate-700/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span>👥</span>
            <span className="text-sm font-medium text-slate-300">User-Based</span>
          </div>
          <div className="text-2xl font-bold text-white">${userBasedResult.stockPrice.toFixed(2)}</div>
          <div className="text-xs text-slate-400 mt-1">
            Revenue: {formatCurrencyMillions(userBasedResult.netRevenue, 1)}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">Net Revenue</div>
          <div className="text-lg font-bold">{formatCurrencyMillions(activeResult.netRevenue, 1)}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">EBITDA</div>
          <div className="text-lg font-bold">{formatCurrencyMillions(activeResult.ebitda, 1)}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">Enterprise Value</div>
          <div className="text-lg font-bold">{formatCurrencyMillions(activeResult.enterpriseValue, 1)}</div>
        </div>
      </div>

      {/* Common Financial Parameters */}
      <div className="bg-slate-700/30 rounded-xl p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Financial Parameters
        </h3>

        <div className="space-y-4">
          {/* EBITDA Margin */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">EBITDA Margin</span>
              <span className="font-mono text-white">{(financial.ebitdaMargin * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={financial.ebitdaMargin * 100}
              onChange={(e) => onFinancialChange('ebitdaMargin', parseFloat(e.target.value) / 100)}
              className="w-full slider-progress"
              style={{ '--range-progress': `${(financial.ebitdaMargin / 0.95) * 100}%` } as React.CSSProperties}
            />
          </div>

          {/* EV/EBITDA Multiple */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">EV/EBITDA Multiple (2030)</span>
              <span className="font-mono text-white">{evEbitdaSchedule[2030]}x</span>
            </div>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={evEbitdaSchedule[2030]}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                onFinancialChange('evEbitdaMultiple', value);
                onEvEbitdaScheduleChange(2030, value);
              }}
              className="w-full slider-progress"
              style={{ '--range-progress': `${((evEbitdaSchedule[2030] - 5) / 45) * 100}%` } as React.CSSProperties}
            />
          </div>

          {/* Current Shares */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Current Shares Outstanding</span>
              <span className="font-mono text-white">{financial.currentShares}M</span>
            </div>
            <input
              type="range"
              min={200}
              max={500}
              step={5}
              value={financial.currentShares}
              onChange={(e) => onFinancialChange('currentShares', parseFloat(e.target.value))}
              className="w-full slider-progress"
              style={{ '--range-progress': `${((financial.currentShares - 200) / 300) * 100}%` } as React.CSSProperties}
            />
          </div>

          {/* Expected Dilution */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Expected Dilution (by 2030)</span>
              <span className="font-mono text-white">{(financial.expectedDilution * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={0.1}
              value={financial.expectedDilution * 100}
              onChange={(e) => onFinancialChange('expectedDilution', parseFloat(e.target.value) / 100)}
              className="w-full slider-progress"
              style={{ '--range-progress': `${(financial.expectedDilution / 0.5) * 100}%` } as React.CSSProperties}
            />
          </div>

          {/* Fully Diluted Shares (Calculated) */}
          <div className="bg-slate-600/30 rounded-lg p-3 mt-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Fully Diluted Shares</span>
              <span className="font-mono text-primary-300 font-semibold">
                {getFullyDilutedShares(financial).toFixed(0)}M
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              = {financial.currentShares}M × (1 + {(financial.expectedDilution * 100).toFixed(1)}%)
            </div>
          </div>

          {/* Net Debt */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Net Debt</span>
              <span className="font-mono text-white">
                {financial.netDebt >= 1000
                  ? `$${(financial.netDebt / 1000).toFixed(1)}B`
                  : `$${financial.netDebt}M`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={5000}
              step={100}
              value={financial.netDebt}
              onChange={(e) => onFinancialChange('netDebt', parseFloat(e.target.value))}
              className="w-full slider-progress"
              style={{ '--range-progress': `${(financial.netDebt / 5000) * 100}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* EV/EBITDA Schedule */}
        <div className="mt-4">
          <EvEbitdaScheduleEditor
            schedule={evEbitdaSchedule}
            onChange={onEvEbitdaScheduleChange}
          />
        </div>
      </div>
    </div>
  );
}

// Compact version for mobile or smaller displays
export function CompactValuationSummary({
  activeResult,
  activeModel,
}: {
  activeResult: ValuationResult;
  activeModel: ModelType;
}) {
  const modelLabel = activeModel === 'both' ? 'Combined' :
    activeModel === 'throughput' ? 'Throughput' : 'User-Based';

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-4 text-white flex items-center justify-between">
      <div>
        <span className="text-xs text-slate-400">{modelLabel} Model</span>
        <div className="text-2xl font-display font-bold">${activeResult.stockPrice.toFixed(2)}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-slate-400">EBITDA</div>
        <div className="text-lg font-semibold">{formatCurrencyMillions(activeResult.ebitda, 1)}</div>
      </div>
    </div>
  );
}

