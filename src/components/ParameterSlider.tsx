import { useMemo, useState, useEffect } from 'react';

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
  // Local state for the input field to allow free typing
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);

  // Sync input value with prop value when not focused
  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);

  // Calculate progress percentage for the gradient
  const progress = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const displayValue = formatter ? formatter(value) : `${prefix}${value}${suffix}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Parse and validate the value
    const parsed = parseFloat(newValue);
    if (!isNaN(parsed)) {
      // Clamp to min/max range
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // On blur, reset the input to the current valid value
    setInputValue(value.toString());
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  // Determine input width based on max value length
  const inputWidth = Math.max(String(max).length, String(min).length, 4) + 1;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        {formatter ? (
          <span className="text-sm font-mono font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
            {displayValue}
          </span>
        ) : (
          <div className="flex items-center gap-0.5 bg-primary-50 rounded px-1.5 py-0.5">
            {prefix && <span className="text-sm font-mono font-semibold text-primary-600">{prefix}</span>}
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              min={min}
              max={max}
              step={step}
              style={{ width: `${inputWidth}ch` }}
              className="text-sm font-mono font-semibold text-primary-600 bg-transparent border-none outline-none focus:ring-0 p-0 text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            {suffix && <span className="text-sm font-mono font-semibold text-primary-600">{suffix}</span>}
          </div>
        )}
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
  // Format value for display (e.g., 1500 -> "1.5B", 500 -> "500M")
  const formatValue = (val: number): string => {
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}B`;
    }
    return `${val}M`;
  };

  // Parse user input that may include B/M suffixes
  const parseValue = (input: string): number | null => {
    const trimmed = input.trim().toUpperCase();

    // Try to parse as billions (e.g., "1.5B" or "1.5")
    const billionMatch = trimmed.match(/^([\d.]+)\s*B$/);
    if (billionMatch) {
      const num = parseFloat(billionMatch[1]);
      return isNaN(num) ? null : num * 1000; // Convert to millions
    }

    // Try to parse as millions (e.g., "500M" or "500")
    const millionMatch = trimmed.match(/^([\d.]+)\s*M?$/);
    if (millionMatch) {
      const num = parseFloat(millionMatch[1]);
      return isNaN(num) ? null : num;
    }

    return null;
  };

  const [inputValue, setInputValue] = useState(formatValue(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync input value with prop value when not focused
  useEffect(() => {
    if (!isFocused) {
      setInputValue(formatValue(value));
    }
  }, [value, isFocused]);

  // Calculate progress percentage for the gradient
  const progress = useMemo(() => {
    return ((value - min) / (max - min)) * 100;
  }, [value, min, max]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Parse and validate the value
    const parsed = parseValue(newValue);
    if (parsed !== null) {
      // Clamp to min/max range
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // On blur, reset the input to the formatted value
    setInputValue(formatValue(value));
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Select all text on focus for easy editing
    e.target.select();
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </label>
        <div className="flex items-center gap-0.5 bg-primary-50 rounded px-1.5 py-0.5">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            style={{ width: '6ch' }}
            className="text-sm font-mono font-semibold text-primary-600 bg-transparent border-none outline-none focus:ring-0 p-0 text-center"
          />
        </div>
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
        <span className="text-xs text-slate-400">{formatValue(min)}</span>
        <span className="text-xs text-slate-400">{formatValue(max)}</span>
      </div>

      {description && (
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      )}
    </div>
  );
}

