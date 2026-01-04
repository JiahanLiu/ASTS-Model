// Re-export defaults from types for convenience
export {
  DEFAULT_PARAMS,
  CONSTELLATION_SCHEDULE,
  ATTACHMENT_RATE_SCHEDULE,
} from '../types';

// Formatting utilities
// Note: Most financial values in this model are stored in MILLIONS
// Use formatCurrencyMillions for those values

export const formatCurrency = (value: number, decimals = 0): string => {
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(decimals)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(decimals)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `$${(value / 1e3).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
};

// Format values that are already in millions (e.g., 2000 = $2,000M = $2B)
export const formatCurrencyMillions = (valueInMillions: number, decimals = 1): string => {
  if (Math.abs(valueInMillions) >= 1000) {
    return `$${(valueInMillions / 1000).toFixed(decimals)}B`;
  }
  if (Math.abs(valueInMillions) >= 1) {
    return `$${valueInMillions.toFixed(decimals)}M`;
  }
  if (Math.abs(valueInMillions) >= 0.001) {
    return `$${(valueInMillions * 1000).toFixed(0)}K`;
  }
  return `$${(valueInMillions * 1e6).toFixed(decimals)}`;
};

export const formatNumber = (value: number, decimals = 0): string => {
  if (Math.abs(value) >= 1e9) {
    return `${(value / 1e9).toFixed(decimals)}B`;
  }
  if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(decimals)}M`;
  }
  if (Math.abs(value) >= 1e3) {
    return `${(value / 1e3).toFixed(decimals)}K`;
  }
  return value.toFixed(decimals);
};

export const formatPercent = (value: number, decimals = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

// Color palette for charts
export const CHART_COLORS = {
  throughput: {
    primary: '#3b82f6',    // Blue
    secondary: '#93c5fd',
    gradient: ['#3b82f6', '#1d4ed8'],
  },
  userBased: {
    primary: '#22c55e',    // Green
    secondary: '#86efac',
    gradient: ['#22c55e', '#15803d'],
  },
  neutral: {
    grid: '#e2e8f0',
    text: '#64748b',
    axis: '#94a3b8',
  },
};

// Valuation regime thresholds (from document)
export const VALUATION_REGIMES = {
  nav: { min: 40, max: 50, label: 'NAV Floor' },
  coverage2026: { min: 73, max: 100, label: '2026 Coverage' },
  fullConstellation: { min: 100, max: 257, label: 'Full Constellation' },
  multiShell: { min: 250, max: 1000, label: 'Multi-Shell Upside' },
};

// Key MNO partners and their subscriber bases (millions)
export const MNO_PARTNERS = [
  { name: 'AT&T', subscribers: 200, region: 'US' },
  { name: 'Verizon', subscribers: 120, region: 'US' },
  { name: 'Vodafone', subscribers: 300, region: 'Global' },
  { name: 'Rakuten', subscribers: 5, region: 'Japan' },
  { name: 'stc', subscribers: 160, region: 'MENA' },
  { name: 'Other MNOs', subscribers: 2215, region: 'Global' },
];

// Document reference data points
export const DOCUMENT_BENCHMARKS = {
  // From Code Red document
  priceTargets: {
    nav: 50,
    coverage2026: 73,
    coverage2027: 257,
    multiShell: 250,
  },
  revenueTargets: {
    2026: 1037,   // $1.037B
    2027: 4443,   // $4.443B
  },
  ebitdaTargets: {
    2026: 736,    // $736M
    2027: 4142,   // $4.142B
  },
};

