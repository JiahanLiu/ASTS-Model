import { ThroughputModelParams, FinancialParams, ValuationResult } from '../types';
import { ParameterSlider, PercentSlider, CurrencySlider } from './ParameterSlider';
import { formatCurrency } from '../constants/defaults';

interface ThroughputModelProps {
  params: ThroughputModelParams;
  financial: FinancialParams;
  result: ValuationResult;
  onParamChange: <K extends keyof ThroughputModelParams>(key: K, value: ThroughputModelParams[K]) => void;
  onFinancialChange: <K extends keyof FinancialParams>(key: K, value: FinancialParams[K]) => void;
}

export function ThroughputModel({
  params,
  financial,
  result,
  onParamChange,
  onFinancialChange,
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
          max={0.50}
          step={0.01}
          onChange={(v) => onParamChange('utilizationRate', v)}
          description="Expected billable data as % of gross capacity"
        />

        <CurrencySlider
          id="pricePerGB"
          label="Price per GB"
          value={params.pricePerGB}
          min={1}
          max={10}
          step={0.5}
          onChange={(v) => onParamChange('pricePerGB', v)}
          description="Wholesale price ASTS receives per GB"
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

      {/* Financial Parameters */}
      <div className="space-y-1 mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Financial Parameters
        </h3>

        <PercentSlider
          id="ebitdaMargin"
          label="EBITDA Margin"
          value={financial.ebitdaMargin}
          min={0.70}
          max={0.95}
          step={0.01}
          onChange={(v) => onFinancialChange('ebitdaMargin', v)}
        />

        <ParameterSlider
          id="evMultiple"
          label="EV/EBITDA Multiple"
          value={financial.evEbitdaMultiple}
          min={10}
          max={50}
          step={1}
          onChange={(v) => onFinancialChange('evEbitdaMultiple', v)}
          suffix="x"
        />
      </div>

      {/* Calculation Breakdown */}
      <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl p-4 border border-primary-100">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-3">
          Calculation Breakdown
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Billable GB/Satellite</span>
            <span className="font-mono font-medium text-slate-800">
              {(params.grossGBPerSatellite * params.utilizationRate).toFixed(0)}M
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Total Billable GB</span>
            <span className="font-mono font-medium text-slate-800">
              {((params.satellites * params.grossGBPerSatellite * params.utilizationRate) / 1000).toFixed(1)}B
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Gross Revenue</span>
            <span className="font-mono font-medium text-slate-800">
              {formatCurrency(result.grossRevenue, 1)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Net Revenue (50% share)</span>
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
          <div className="border-t border-primary-200 pt-2 mt-2 flex justify-between">
            <span className="font-medium text-primary-700">Enterprise Value</span>
            <span className="font-mono font-bold text-primary-700">
              {formatCurrency(result.enterpriseValue, 1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

