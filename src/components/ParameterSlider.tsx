import { useRef, useEffect } from 'react';

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
  const sliderRef = useRef<HTMLInputElement>(null);

  // Calculate and set the CSS custom property for slider progress
  useEffect(() => {
    if (sliderRef.current) {
      const progress = ((value - min) / (max - min)) * 100;
      sliderRef.current.style.setProperty('--range-progress', `${progress}%`);
    }
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
        ref={sliderRef}
        type="range"
        id={id}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
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

