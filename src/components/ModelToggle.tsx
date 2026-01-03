import { ModelType } from '../types';

interface ModelToggleProps {
  activeModel: ModelType;
  onChange: (model: ModelType) => void;
}

export function ModelToggle({ activeModel, onChange }: ModelToggleProps) {
  const models: { value: ModelType; label: string; icon: string }[] = [
    { value: 'throughput', label: 'Throughput', icon: '📡' },
    { value: 'user-based', label: 'User-Based', icon: '👥' },
    { value: 'both', label: 'Combined', icon: '⚖️' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 inline-flex">
      {models.map((model) => (
        <button
          key={model.value}
          onClick={() => onChange(model.value)}
          className={`
            px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center gap-2
            ${activeModel === model.value
              ? 'bg-primary-500 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
            }
          `}
        >
          <span>{model.icon}</span>
          <span>{model.label}</span>
        </button>
      ))}
    </div>
  );
}

// Alternative pill-style toggle for smaller spaces
interface CompactToggleProps {
  activeModel: ModelType;
  onChange: (model: ModelType) => void;
}

export function CompactModelToggle({ activeModel, onChange }: CompactToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-full p-1">
      <button
        onClick={() => onChange('throughput')}
        className={`
          px-3 py-1 rounded-full text-xs font-medium transition-all
          ${activeModel === 'throughput'
            ? 'bg-primary-500 text-white'
            : 'text-slate-600 hover:text-slate-800'
          }
        `}
      >
        Throughput
      </button>
      <button
        onClick={() => onChange('user-based')}
        className={`
          px-3 py-1 rounded-full text-xs font-medium transition-all
          ${activeModel === 'user-based'
            ? 'bg-accent-500 text-white'
            : 'text-slate-600 hover:text-slate-800'
          }
        `}
      >
        User-Based
      </button>
      <button
        onClick={() => onChange('both')}
        className={`
          px-3 py-1 rounded-full text-xs font-medium transition-all
          ${activeModel === 'both'
            ? 'bg-slate-700 text-white'
            : 'text-slate-600 hover:text-slate-800'
          }
        `}
      >
        Both
      </button>
    </div>
  );
}

