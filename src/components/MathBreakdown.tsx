import { useState } from 'react';
import { ThroughputModelParams, UserBasedModelParams, FinancialParams, ValuationResult } from '../types';
import { formatCurrencyMillions, formatNumber, formatPercent } from '../constants/defaults';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: string;
  accentColor?: 'blue' | 'green';
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  icon = '📐',
  accentColor = 'blue'
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colors = {
    blue: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      hover: 'hover:bg-primary-100',
      text: 'text-primary-700',
      icon: 'text-primary-500',
    },
    green: {
      bg: 'bg-accent-50',
      border: 'border-accent-200',
      hover: 'hover:bg-accent-100',
      text: 'text-accent-700',
      icon: 'text-accent-500',
    },
  };

  const c = colors[accentColor];

  return (
    <div className={`rounded-xl border ${c.border} overflow-hidden`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 ${c.bg} ${c.hover} transition-colors`}
      >
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className={`font-medium text-sm ${c.text}`}>{title}</span>
        </div>
        <svg
          className={`w-5 h-5 ${c.icon} transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 bg-white border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  );
}

// Math step component for showing individual calculation steps
interface MathStepProps {
  step: number;
  label: string;
  formula: string;
  calculation: string;
  result: string;
  highlight?: boolean;
}

function MathStep({ step, label, formula, calculation, result, highlight = false }: MathStepProps) {
  return (
    <div className={`py-3 ${highlight ? 'bg-slate-50 -mx-4 px-4 rounded-lg' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-xs font-bold text-slate-600">
          {step}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-700 mb-1">{label}</div>
          <div className="font-mono text-xs text-slate-500 mb-1">{formula}</div>
          <div className="font-mono text-xs text-slate-600 bg-slate-100 rounded px-2 py-1 overflow-x-auto">
            {calculation}
          </div>
          <div className={`mt-1 font-mono text-sm font-semibold ${highlight ? 'text-primary-600' : 'text-slate-800'}`}>
            = {result}
          </div>
        </div>
      </div>
    </div>
  );
}

// Throughput Model Math Breakdown
interface ThroughputMathProps {
  params: ThroughputModelParams;
  financial: FinancialParams;
  result: ValuationResult;
}

export function ThroughputMathBreakdown({ params, financial, result: _result }: ThroughputMathProps) {
  // Note: We recalculate all values locally to show transparent math step by step
  void _result; // Result passed for interface consistency, but we show calculations
  const billableGB = params.grossGBPerSatellite * params.utilizationRate;
  const totalBillableGB = params.satellites * billableGB;
  const grossRevenue = totalBillableGB * params.pricePerGB;
  const revenueShare = 0.5;
  const netRevenue = grossRevenue * revenueShare;
  const ebitda = netRevenue * financial.ebitdaMargin;
  const ev = ebitda * financial.evEbitdaMultiple;
  const equityValue = ev - financial.netDebt;
  const stockPrice = equityValue / financial.sharesOutstanding;

  return (
    <CollapsibleSection
      title="Show Throughput-Yield Math"
      icon="🧮"
      accentColor="blue"
    >
      <div className="space-y-1 divide-y divide-slate-100">
        <MathStep
          step={1}
          label="Billable GB per Satellite (Annual)"
          formula="Gross_GB × Utilization_Rate"
          calculation={`${params.grossGBPerSatellite}M × ${formatPercent(params.utilizationRate)}`}
          result={`${billableGB.toFixed(1)}M GB/satellite/year`}
        />

        <MathStep
          step={2}
          label="Total Billable GB (Fleet)"
          formula="Satellites × Billable_GB_per_Sat"
          calculation={`${params.satellites} × ${billableGB.toFixed(1)}M`}
          result={`${formatNumber(totalBillableGB, 1)} GB/year`}
        />

        <MathStep
          step={3}
          label="Gross Revenue"
          formula="Total_Billable_GB × Price_per_GB"
          calculation={`${formatNumber(totalBillableGB, 1)} × $${params.pricePerGB}`}
          result={formatCurrencyMillions(grossRevenue, 1)}
        />

        <MathStep
          step={4}
          label="Net Revenue (ASTS Share)"
          formula="Gross_Revenue × Revenue_Share"
          calculation={`${formatCurrencyMillions(grossRevenue, 1)} × ${formatPercent(revenueShare)}`}
          result={formatCurrencyMillions(netRevenue, 1)}
        />

        <MathStep
          step={5}
          label="EBITDA"
          formula="Net_Revenue × EBITDA_Margin"
          calculation={`${formatCurrencyMillions(netRevenue, 1)} × ${formatPercent(financial.ebitdaMargin)}`}
          result={formatCurrencyMillions(ebitda, 1)}
        />

        <MathStep
          step={6}
          label="Enterprise Value"
          formula="EBITDA × EV/EBITDA_Multiple"
          calculation={`${formatCurrencyMillions(ebitda, 1)} × ${financial.evEbitdaMultiple}x`}
          result={formatCurrencyMillions(ev, 1)}
        />

        <MathStep
          step={7}
          label="Equity Value"
          formula="Enterprise_Value − Net_Debt"
          calculation={`${formatCurrencyMillions(ev, 1)} − ${formatCurrencyMillions(financial.netDebt, 0)}`}
          result={formatCurrencyMillions(equityValue, 1)}
        />

        <MathStep
          step={8}
          label="Stock Price"
          formula="Equity_Value ÷ Shares_Outstanding"
          calculation={`${formatCurrencyMillions(equityValue, 1)} ÷ ${financial.sharesOutstanding}M`}
          result={`$${stockPrice.toFixed(2)}`}
          highlight
        />
      </div>

      {/* Summary Formula */}
      <div className="mt-4 p-3 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-100">
        <div className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2">Complete Formula</div>
        <div className="font-mono text-xs text-slate-700 leading-relaxed">
          Stock Price = ((Satellites × GB × Utilization × Price/GB × 50%) × EBITDA% × Multiple − Debt) ÷ Shares
        </div>
      </div>
    </CollapsibleSection>
  );
}

// User-Based Model Math Breakdown
interface UserBasedMathProps {
  params: UserBasedModelParams;
  financial: FinancialParams;
  result: ValuationResult;
}

export function UserBasedMathBreakdown({ params, financial, result: _result }: UserBasedMathProps) {
  // Note: We recalculate all values locally to show transparent math step by step
  void _result; // Result passed for interface consistency, but we show calculations
  const activeSubscribers = params.totalSubscribers * params.attachmentRate;
  const annualRevenuePerSub = params.monthlyARPU * 12;
  const grossRevenue = activeSubscribers * annualRevenuePerSub;
  const netRevenue = grossRevenue * params.revenueShare;
  const ebitda = netRevenue * financial.ebitdaMargin;
  const ev = ebitda * financial.evEbitdaMultiple;
  const equityValue = ev - financial.netDebt;
  const stockPrice = equityValue / financial.sharesOutstanding;

  return (
    <CollapsibleSection
      title="Show User-Based Math"
      icon="🧮"
      accentColor="green"
    >
      <div className="space-y-1 divide-y divide-slate-100">
        <MathStep
          step={1}
          label="Active Subscribers"
          formula="Total_Subscribers × Attachment_Rate"
          calculation={`${formatNumber(params.totalSubscribers, 0)} × ${formatPercent(params.attachmentRate)}`}
          result={`${formatNumber(activeSubscribers, 0)} subscribers`}
        />

        <MathStep
          step={2}
          label="Annual Revenue per Subscriber"
          formula="Monthly_ARPU × 12"
          calculation={`$${params.monthlyARPU} × 12`}
          result={`$${annualRevenuePerSub}/year`}
        />

        <MathStep
          step={3}
          label="Gross Revenue"
          formula="Active_Subscribers × Annual_Revenue_per_Sub"
          calculation={`${formatNumber(activeSubscribers, 0)} × $${annualRevenuePerSub}`}
          result={formatCurrencyMillions(grossRevenue, 1)}
        />

        <MathStep
          step={4}
          label="Net Revenue (ASTS Share)"
          formula="Gross_Revenue × Revenue_Share"
          calculation={`${formatCurrencyMillions(grossRevenue, 1)} × ${formatPercent(params.revenueShare)}`}
          result={formatCurrencyMillions(netRevenue, 1)}
        />

        <MathStep
          step={5}
          label="EBITDA"
          formula="Net_Revenue × EBITDA_Margin"
          calculation={`${formatCurrencyMillions(netRevenue, 1)} × ${formatPercent(financial.ebitdaMargin)}`}
          result={formatCurrencyMillions(ebitda, 1)}
        />

        <MathStep
          step={6}
          label="Enterprise Value"
          formula="EBITDA × EV/EBITDA_Multiple"
          calculation={`${formatCurrencyMillions(ebitda, 1)} × ${financial.evEbitdaMultiple}x`}
          result={formatCurrencyMillions(ev, 1)}
        />

        <MathStep
          step={7}
          label="Equity Value"
          formula="Enterprise_Value − Net_Debt"
          calculation={`${formatCurrencyMillions(ev, 1)} − ${formatCurrencyMillions(financial.netDebt, 0)}`}
          result={formatCurrencyMillions(equityValue, 1)}
        />

        <MathStep
          step={8}
          label="Stock Price"
          formula="Equity_Value ÷ Shares_Outstanding"
          calculation={`${formatCurrencyMillions(equityValue, 1)} ÷ ${financial.sharesOutstanding}M`}
          result={`$${stockPrice.toFixed(2)}`}
          highlight
        />
      </div>

      {/* Summary Formula */}
      <div className="mt-4 p-3 bg-gradient-to-r from-accent-50 to-green-50 rounded-lg border border-accent-100">
        <div className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-2">Complete Formula</div>
        <div className="font-mono text-xs text-slate-700 leading-relaxed">
          Stock Price = ((Subscribers × Attach% × ARPU × 12 × RevShare%) × EBITDA% × Multiple − Debt) ÷ Shares
        </div>
      </div>
    </CollapsibleSection>
  );
}

// Comparison of both models side by side
interface ModelComparisonMathProps {
  throughputParams: ThroughputModelParams;
  userBasedParams: UserBasedModelParams;
  financial: FinancialParams;
  throughputResult: ValuationResult;
  userBasedResult: ValuationResult;
}

export function ModelComparisonMath({
  throughputParams,
  userBasedParams,
  financial: _financial,
  throughputResult,
  userBasedResult,
}: ModelComparisonMathProps) {
  void _financial; // Available for future use
  const avgPrice = (throughputResult.stockPrice + userBasedResult.stockPrice) / 2;
  const priceDiff = Math.abs(throughputResult.stockPrice - userBasedResult.stockPrice);
  const percentDiff = (priceDiff / avgPrice) * 100;

  return (
    <CollapsibleSection
      title="Model Comparison Analysis"
      icon="⚖️"
      accentColor="blue"
      defaultOpen={false}
    >
      <div className="space-y-4">
        {/* Side by side comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-primary-50 rounded-lg">
            <div className="text-xs font-semibold text-primary-600 uppercase mb-2">Throughput Model</div>
            <div className="text-2xl font-bold text-primary-700">${throughputResult.stockPrice.toFixed(2)}</div>
            <div className="text-xs text-primary-600 mt-1">
              Based on {throughputParams.satellites} satellites
            </div>
          </div>

          <div className="p-3 bg-accent-50 rounded-lg">
            <div className="text-xs font-semibold text-accent-600 uppercase mb-2">User-Based Model</div>
            <div className="text-2xl font-bold text-accent-700">${userBasedResult.stockPrice.toFixed(2)}</div>
            <div className="text-xs text-accent-600 mt-1">
              Based on {formatPercent(userBasedParams.attachmentRate)} attach rate
            </div>
          </div>
        </div>

        {/* Variance analysis */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <div className="text-xs font-semibold text-slate-600 uppercase mb-2">Variance Analysis</div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-slate-800">${priceDiff.toFixed(2)}</div>
              <div className="text-xs text-slate-500">Absolute Diff</div>
            </div>
            <div>
              <div className="text-lg font-bold text-slate-800">{percentDiff.toFixed(1)}%</div>
              <div className="text-xs text-slate-500">Relative Diff</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">${avgPrice.toFixed(2)}</div>
              <div className="text-xs text-slate-500">Average</div>
            </div>
          </div>
        </div>

        {/* Key driver differences */}
        <div className="text-sm text-slate-600">
          <div className="font-medium text-slate-700 mb-2">Key Driver Differences:</div>
          <ul className="space-y-1 text-xs">
            <li className="flex items-start gap-2">
              <span className="text-primary-500">•</span>
              <span><strong>Throughput:</strong> Capacity-constrained by satellite count & utilization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent-500">•</span>
              <span><strong>User-Based:</strong> Demand-driven by subscriber adoption & ARPU</span>
            </li>
          </ul>
        </div>
      </div>
    </CollapsibleSection>
  );
}

