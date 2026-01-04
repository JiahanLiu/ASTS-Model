import { useMemo } from 'react';

interface ParameterSliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatter?: (value: number) => string;
  prefix?: string;
  suffix?: string;
  description?: string;
}

export function ParameterSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatter,
  prefix = '',
  suffix = '',
  description,
}: ParameterSliderProps) {
  // Calculate progress percentage for the gradient
  const progress = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const displayValue = formatter ? formatter(value) : `${prefix}${value}${suffix}`;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        <span className="text-sm font-mono font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
          {displayValue}
        </span>
      </div>

      <input
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-progress w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{ '--range-progress': `${progress}%` } as React.CSSProperties}
      />

      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-400">{prefix}{min}{suffix}</span>
        <span className="text-xs text-slate-400">{prefix}{max}{suffix}</span>
      </div>

      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
}

// Specialized slider for percentages
interface PercentSliderProps {
  id: string;
  label: string;
  value: number; // as decimal (0.25 = 25%)
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description?: string;
}

export function PercentSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  description,
}: PercentSliderProps) {
  return (
    <ParameterSlider
      id={id}
      label={label}
      value={value * 100}
      min={min * 100}
      max={max * 100}
      step={step * 100}
      onChange={(v) => onChange(v / 100)}
      suffix="%"
      description={description}
    />
  );
}

// Specialized slider for currency
interface CurrencySliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description?: string;
}

export function CurrencySlider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  description,
}: CurrencySliderProps) {
  return (
    <ParameterSlider
      id={id}
      label={label}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      prefix="$"
      description={description}
    />
  );
}

// Specialized slider for large numbers (billions/millions)
interface LargeNumberSliderProps {
  id: string;
  label: string;
  value: number; // in millions
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  description?: string;
}

export function LargeNumberSlider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  description,
}: LargeNumberSliderProps) {
  const formatter = (val: number) => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}B`;
    }
    return `${val}M`;
  };

  return (
    <ParameterSlider
      id={id}
      label={label}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={onChange}
      formatter={formatter}
      description={description}
    />
  );
}

