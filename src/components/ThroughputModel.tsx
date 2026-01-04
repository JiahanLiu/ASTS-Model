import { ThroughputModelParams, FinancialParams, ValuationResult } from '../types';
import { ParameterSlider, PercentSlider, CurrencySlider } from './ParameterSlider';
import { ThroughputMathBreakdown } from './MathBreakdown';
import { ConstellationScheduleEditor } from './ScheduleEditor';
import { formatCurrencyMillions } from '../constants/defaults';

interface ThroughputModelProps {
  params: ThroughputModelParams;
  financial: FinancialParams;
  result: ValuationResult;
  constellationSchedule: Record<number, number>;
  onParamChange: <K extends keyof ThroughputModelParams>(key: K, value: ThroughputModelParams[K]) => void;
  onScheduleChange: (year: number, satellites: number) => void;
}

export function ThroughputModel({
  params,
  financial,
  result,
  constellationSchedule,
  onParamChange,
  onScheduleChange,
}: ThroughputModelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <span className="text-xl">📡</span>
        </div>
        <div>
          <h2 className="font-display font-semibold text-slate-800">Throughput-Yield Model</h2>
          <p className="text-sm text-slate-500">Revenue = Satellites × GB × Price/GB</p>
        </div>
      </div>

      {/* Satellite Parameters */}
      <div className="space-y-1 mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Constellation Parameters
        </h3>

        <ParameterSlider
          id="satellites"
          label="Number of Satellites"
          value={params.satellites}
          min={10}
          max={200}
          step={5}
          onChange={(v) => onParamChange('satellites', v)}
          description="Block 2 Bluebird satellites in constellation"
        />

        <ParameterSlider
          id="grossGB"
          label="Gross GB per Satellite/Year"
          value={params.grossGBPerSatellite}
          min={50}
          max={150}
          step={10}
          onChange={(v) => onParamChange('grossGBPerSatellite', v)}
          suffix="M"
          description="Maximum theoretical data capacity"
        />

        <PercentSlider
          id="utilization"
          label="Utilization Rate"
          value={params.utilizationRate}
          min={0.10}
          max={0.60}
          step={0.05}
          onChange={(v) => onParamChange('utilizationRate', v)}
          description="Expected billable data as % of gross capacity"
        />

        <CurrencySlider
          id="pricePerGB"
          label="Price per GB"
          value={params.pricePerGB}
          min={1}
          max={20}
          step={0.5}
          onChange={(v) => onParamChange('pricePerGB', v)}
          description="Wholesale price ASTS receives per GB (US avg $6)"
        />

        <ParameterSlider
          id="spectral"
          label="Spectral Efficiency"
          value={params.spectralEfficiency}
          min={2.0}
          max={4.0}
          step={0.1}
          onChange={(v) => onParamChange('spectralEfficiency', v)}
          suffix=" bits/Hz"
          description="Higher = more data per bandwidth unit"
        />
      </div>

      {/* Quick Summary */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-100 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-600">
            Quick Summary
          </h3>
          <div className="text-lg font-bold text-primary-700">
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

      {/* Yearly Satellite Schedule */}
      <ConstellationScheduleEditor
        schedule={constellationSchedule}
        onChange={onScheduleChange}
      />

      {/* Collapsible Math Breakdown */}
      <ThroughputMathBreakdown
        params={params}
        financial={financial}
        result={result}
      />
    </div>
  );
}

