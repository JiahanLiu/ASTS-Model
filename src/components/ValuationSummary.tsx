import { ValuationResult, FinancialParams, ModelType } from '../types';
import { formatCurrency, VALUATION_REGIMES, DOCUMENT_BENCHMARKS } from '../constants/defaults';

interface ValuationSummaryProps {
  throughputResult: ValuationResult;
  userBasedResult: ValuationResult;
  activeResult: ValuationResult;
  activeModel: ModelType;
  financial: FinancialParams;
  onFinancialChange: <K extends keyof FinancialParams>(key: K, value: FinancialParams[K]) => void;
  onReset: () => void;
}

export function ValuationSummary({
  throughputResult,
  userBasedResult,
  activeResult,
  activeModel,
  financial,
  onFinancialChange,
  onReset,
}: ValuationSummaryProps) {
  // Determine valuation regime
  const getValuationRegime = (price: number) => {
    if (price >= VALUATION_REGIMES.multiShell.min) return 'multiShell';
    if (price >= VALUATION_REGIMES.fullConstellation.min) return 'fullConstellation';
    if (price >= VALUATION_REGIMES.coverage2026.min) return 'coverage2026';
    return 'nav';
  };

  const regime = getValuationRegime(activeResult.stockPrice);
  const regimeInfo = VALUATION_REGIMES[regime];

  // Price indicator position (0-100%)
  const pricePosition = Math.min(100, Math.max(0, (activeResult.stockPrice / 300) * 100));

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
        <div className="text-sm text-slate-400 mb-1">Implied Stock Price</div>
        <div className="text-6xl font-display font-bold bg-gradient-to-r from-primary-300 via-primary-400 to-accent-400 bg-clip-text text-transparent">
          ${activeResult.stockPrice.toFixed(2)}
        </div>
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-700/50 text-sm">
          <span className={`w-2 h-2 rounded-full ${
            regime === 'multiShell' ? 'bg-purple-400' :
            regime === 'fullConstellation' ? 'bg-accent-400' :
            regime === 'coverage2026' ? 'bg-primary-400' : 'bg-slate-400'
          }`} />
          <span className="text-slate-300">{regimeInfo.label}</span>
        </div>
      </div>

      {/* Price Range Indicator */}
      <div className="mb-8">
        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-[16.6%] bg-slate-600" />
          <div className="absolute inset-y-0 left-[16.6%] w-[16.6%] bg-primary-600" />
          <div className="absolute inset-y-0 left-[33.2%] w-[33.4%] bg-accent-600" />
          <div className="absolute inset-y-0 left-[66.6%] w-[33.4%] bg-purple-600" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-primary-400"
            style={{ left: `calc(${pricePosition}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>$0</span>
          <span>$50 NAV</span>
          <span>$100 Coverage</span>
          <span>$250 Full</span>
          <span>$300+</span>
        </div>
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
            Revenue: {formatCurrency(throughputResult.netRevenue, 1)}
          </div>
        </div>

        <div className={`p-4 rounded-xl ${activeModel === 'user-based' || activeModel === 'both' ? 'bg-accent-500/20 border border-accent-500/30' : 'bg-slate-700/50'}`}>
          <div className="flex items-center gap-2 mb-2">
            <span>👥</span>
            <span className="text-sm font-medium text-slate-300">User-Based</span>
          </div>
          <div className="text-2xl font-bold text-white">${userBasedResult.stockPrice.toFixed(2)}</div>
          <div className="text-xs text-slate-400 mt-1">
            Revenue: {formatCurrency(userBasedResult.netRevenue, 1)}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">Net Revenue</div>
          <div className="text-lg font-bold">{formatCurrency(activeResult.netRevenue, 1)}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">EBITDA</div>
          <div className="text-lg font-bold">{formatCurrency(activeResult.ebitda, 1)}</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400">Enterprise Value</div>
          <div className="text-lg font-bold">{formatCurrency(activeResult.enterpriseValue, 1)}</div>
        </div>
      </div>

      {/* Common Financial Parameters */}
      <div className="bg-slate-700/30 rounded-xl p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Common Parameters
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Shares Outstanding (FD)</span>
              <span className="font-mono text-white">{financial.sharesOutstanding}M</span>
            </div>
            <input
              type="range"
              min={350}
              max={500}
              step={1}
              value={financial.sharesOutstanding}
              onChange={(e) => onFinancialChange('sharesOutstanding', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Net Debt</span>
              <span className="font-mono text-white">${financial.netDebt}M</span>
            </div>
            <input
              type="range"
              min={-500}
              max={500}
              step={10}
              value={financial.netDebt}
              onChange={(e) => onFinancialChange('netDebt', parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="mt-6 pt-4 border-t border-slate-700">
        <div className="text-xs text-slate-500 mb-2">Code Red Price Targets</div>
        <div className="flex gap-2">
          {Object.entries(DOCUMENT_BENCHMARKS.priceTargets).map(([key, value]) => (
            <div
              key={key}
              className={`px-2 py-1 rounded text-xs ${
                Math.abs(activeResult.stockPrice - value) < 10
                  ? 'bg-accent-500/20 text-accent-300 border border-accent-500/30'
                  : 'bg-slate-700/50 text-slate-400'
              }`}
            >
              ${value}
            </div>
          ))}
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
        <div className="text-lg font-semibold">{formatCurrency(activeResult.ebitda, 1)}</div>
      </div>
    </div>
  );
}

