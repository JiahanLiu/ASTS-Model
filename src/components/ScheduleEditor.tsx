import { useState } from 'react';

interface ScheduleEditorProps {
  title: string;
  icon: string;
  schedule: Record<number, number>;
  onChange: (year: number, value: number) => void;
  formatValue: (value: number) => string;
  parseValue: (input: string) => number;
  unit: string;
  color: 'blue' | 'green' | 'purple';
}

// Individual input component with local state for smooth editing
function ScheduleInput({
  year,
  value,
  onChange,
  formatValue,
  parseValue,
  inputClass,
}: {
  year: number;
  value: number;
  onChange: (year: number, value: number) => void;
  formatValue: (value: number) => string;
  parseValue: (input: string) => number;
  inputClass: string;
}) {
  const [localValue, setLocalValue] = useState(formatValue(value));
  const [isFocused, setIsFocused] = useState(false);

  // Update local value when external value changes (and not focused)
  if (!isFocused && formatValue(value) !== localValue) {
    setLocalValue(formatValue(value));
  }

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseValue(localValue);
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(year, parsed);
      setLocalValue(formatValue(parsed));
    } else {
      // Reset to current value if invalid
      setLocalValue(formatValue(value));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <input
      type="text"
      value={localValue}
      onFocus={() => setIsFocused(true)}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={inputClass}
    />
  );
}

export function ScheduleEditor({
  title,
  icon,
  schedule,
  onChange,
  formatValue,
  parseValue,
  unit,
  color,
}: ScheduleEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const years = Object.keys(schedule).map(Number).sort();

  const colors = {
    blue: {
      bg: 'bg-primary-50',
      border: 'border-primary-200',
      header: 'bg-primary-100',
      text: 'text-primary-700',
      input: 'focus:ring-primary-500 focus:border-primary-500',
    },
    green: {
      bg: 'bg-accent-50',
      border: 'border-accent-200',
      header: 'bg-accent-100',
      text: 'text-accent-700',
      input: 'focus:ring-accent-500 focus:border-accent-500',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      header: 'bg-purple-100',
      text: 'text-purple-700',
      input: 'focus:ring-purple-500 focus:border-purple-500',
    },
  };

  const c = colors[color];

  return (
    <div className={`rounded-xl border ${c.border} overflow-hidden mt-4`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-3 ${c.bg} hover:opacity-90 transition-opacity`}
      >
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className={`font-medium text-sm ${c.text}`}>{title}</span>
        </div>
        <svg
          className={`w-5 h-5 ${c.text} transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="p-4 bg-white">
          <div className="grid grid-cols-5 gap-2">
            {years.map((year) => (
              <div key={year} className="text-center">
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  {year}
                </label>
                <ScheduleInput
                  year={year}
                  value={schedule[year]}
                  onChange={onChange}
                  formatValue={formatValue}
                  parseValue={parseValue}
                  inputClass={`w-full px-2 py-1.5 text-center text-sm font-mono border border-slate-300 rounded-lg text-slate-800 ${c.input}`}
                />
                <span className="text-xs text-slate-400">{unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Constellation Schedule Editor
interface ConstellationScheduleEditorProps {
  schedule: Record<number, number>;
  onChange: (year: number, value: number) => void;
}

export function ConstellationScheduleEditor({ schedule, onChange }: ConstellationScheduleEditorProps) {
  return (
    <ScheduleEditor
      title="Yearly Satellite Schedule"
      icon="🛰️"
      schedule={schedule}
      onChange={onChange}
      formatValue={(v) => v.toString()}
      parseValue={(s) => parseInt(s, 10)}
      unit="sats"
      color="blue"
    />
  );
}

// Attachment Rate Schedule Editor
interface AttachmentScheduleEditorProps {
  schedule: Record<number, number>;
  onChange: (year: number, value: number) => void;
}

export function AttachmentScheduleEditor({ schedule, onChange }: AttachmentScheduleEditorProps) {
  return (
    <ScheduleEditor
      title="Yearly Attachment Rate Schedule"
      icon="📈"
      schedule={schedule}
      onChange={onChange}
      formatValue={(v) => (v * 100).toFixed(2)}
      parseValue={(s) => parseFloat(s) / 100}
      unit="%"
      color="green"
    />
  );
}

// EV/EBITDA Multiple Schedule Editor
interface EvEbitdaScheduleEditorProps {
  schedule: Record<number, number>;
  onChange: (year: number, value: number) => void;
}

export function EvEbitdaScheduleEditor({ schedule, onChange }: EvEbitdaScheduleEditorProps) {
  return (
    <ScheduleEditor
      title="Yearly EV/EBITDA Multiple Schedule"
      icon="📊"
      schedule={schedule}
      onChange={onChange}
      formatValue={(v) => v.toString()}
      parseValue={(s) => parseFloat(s)}
      unit="x"
      color="purple"
    />
  );
}

