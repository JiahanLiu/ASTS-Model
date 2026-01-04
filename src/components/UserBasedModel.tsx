import { UserBasedModelParams, FinancialParams, ValuationResult } from '../types';
import { PercentSlider, CurrencySlider, LargeNumberSlider } from './ParameterSlider';
import { UserBasedMathBreakdown } from './MathBreakdown';
import { AttachmentScheduleEditor } from './ScheduleEditor';
import { formatCurrencyMillions } from '../constants/defaults';

interface UserBasedModelProps {
  params: UserBasedModelParams;
  financial: FinancialParams;
  result: ValuationResult;
  attachmentSchedule: Record<number, number>;
  onParamChange: <K extends keyof UserBasedModelParams>(key: K, value: UserBasedModelParams[K]) => void;
  onScheduleChange: (year: number, rate: number) => void;
}

export function UserBasedModel({
  params,
  financial,
  result,
  attachmentSchedule,
  onParamChange,
  onScheduleChange,
}: UserBasedModelProps) {
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
          min={0.005}
          max={0.15}
          step={0.005}
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

      {/* Quick Summary */}
      <div className="bg-gradient-to-br from-accent-50 to-green-50 rounded-xl p-4 border border-accent-100 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-600">
            Quick Summary
          </h3>
          <div className="text-lg font-bold text-accent-700">
            ${result.stockPrice.toFixed(2)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Net Revenue</span>
            <span className="font-mono font-medium text-slate-800">
              {formatCurrencyMillions(result.netRevenue, 1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">EBITDA</span>
            <span className="font-mono font-medium text-slate-800">
              {formatCurrencyMillions(result.ebitda, 1)}
            </span>
          </div>
        </div>
      </div>

      {/* Yearly Attachment Rate Schedule */}
      <AttachmentScheduleEditor
        schedule={attachmentSchedule}
        onChange={onScheduleChange}
      />

      {/* Collapsible Math Breakdown */}
      <UserBasedMathBreakdown
        params={params}
        financial={financial}
        result={result}
      />
    </div>
  );
}

