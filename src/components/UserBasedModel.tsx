import { UserBasedModelParams, FinancialParams, ValuationResult } from '../types';
import { PercentSlider, CurrencySlider, LargeNumberSlider } from './ParameterSlider';
import { formatCurrency, formatNumber } from '../constants/defaults';

interface UserBasedModelProps {
  params: UserBasedModelParams;
  financial: FinancialParams;
  result: ValuationResult;
  onParamChange: <K extends keyof UserBasedModelParams>(key: K, value: UserBasedModelParams[K]) => void;
  onFinancialChange: <K extends keyof FinancialParams>(key: K, value: FinancialParams[K]) => void;
}

export function UserBasedModel({
  params,
  financial,
  result,
  onParamChange,
  onFinancialChange,
}: UserBasedModelProps) {
  const activeSubscribers = params.totalSubscribers * params.attachmentRate;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-100 flex items-center justify-center">
          <span className="text-xl">👥</span>
        </div>
        <div>
          <h2 className="font-display font-semibold text-slate-800">User-Based Model</h2>
          <p className="text-sm text-slate-500">Revenue = Subscribers × Attach Rate × ARPU</p>
        </div>
      </div>

      {/* Subscriber Parameters */}
      <div className="space-y-1 mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Subscriber Parameters
        </h3>

        <LargeNumberSlider
          id="totalSubscribers"
          label="Total Addressable Subscribers"
          value={params.totalSubscribers}
          min={500}
          max={5000}
          step={100}
          onChange={(v) => onParamChange('totalSubscribers', v)}
          description="Combined subscriber base of MNO partners"
        />

        <PercentSlider
          id="attachmentRate"
          label="Attachment Rate"
          value={params.attachmentRate}
          min={0.05}
          max={0.50}
          step={0.01}
          onChange={(v) => onParamChange('attachmentRate', v)}
          description="% of subscribers opting into SpaceMobile"
        />

        <CurrencySlider
          id="monthlyARPU"
          label="Monthly ARPU"
          value={params.monthlyARPU}
          min={5}
          max={25}
          step={1}
          onChange={(v) => onParamChange('monthlyARPU', v)}
          description="Average revenue per user per month"
        />

        <PercentSlider
          id="revenueShare"
          label="Revenue Share to ASTS"
          value={params.revenueShare}
          min={0.40}
          max={0.60}
          step={0.01}
          onChange={(v) => onParamChange('revenueShare', v)}
          description="ASTS's share of subscription revenue"
        />
      </div>

      {/* Financial Parameters */}
      <div className="space-y-1 mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Financial Parameters
        </h3>

        <PercentSlider
          id="ebitdaMarginUB"
          label="EBITDA Margin"
          value={financial.ebitdaMargin}
          min={0.70}
          max={0.95}
          step={0.01}
          onChange={(v) => onFinancialChange('ebitdaMargin', v)}
        />

        <PercentSlider
          id="evMultipleUB"
          label="EV/EBITDA Multiple"
          value={financial.evEbitdaMultiple}
          min={10}
          max={50}
          step={1}
          onChange={(v) => onFinancialChange('evEbitdaMultiple', v)}
        />
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-gradient-to-br from-accent-50 to-green-50 rounded-xl p-4 border border-accent-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-600 mb-3">
          Calculation Breakdown
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Active Subscribers</span>
            <span className="font-mono font-medium text-slate-800">
              {formatNumber(activeSubscribers, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Annual Revenue/Sub</span>
            <span className="font-mono font-medium text-slate-800">
              ${params.monthlyARPU * 12}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Gross Revenue</span>
            <span className="font-mono font-medium text-slate-800">
              {formatCurrency(result.grossRevenue, 1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Net Revenue ({(params.revenueShare * 100).toFixed(0)}% share)</span>
            <span className="font-mono font-medium text-slate-800">
              {formatCurrency(result.netRevenue, 1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">EBITDA</span>
            <span className="font-mono font-medium text-slate-800">
              {formatCurrency(result.ebitda, 1)}
            </span>
          </div>
          <div className="border-t border-accent-200 pt-2 mt-2 flex justify-between">
            <span className="font-medium text-accent-700">Enterprise Value</span>
            <span className="font-mono font-bold text-accent-700">
              {formatCurrency(result.enterpriseValue, 1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

