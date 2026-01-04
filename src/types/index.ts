// Model type selection
export type ModelType = 'throughput' | 'user-based' | 'both';

// Throughput-Yield Model Parameters
export interface ThroughputModelParams {
  satellites: number;              // Number of satellites (10-200)
  grossGBPerSatellite: number;     // Gross GB per satellite per year (100M default)
  utilizationRate: number;         // Utilization rate as decimal (0.15-0.50)
  pricePerGB: number;              // Price per GB in USD ($1-10)
  spectralEfficiency: number;      // Bits per Hz (2.5-4.0)
}

// User-Based Model Parameters
export interface UserBasedModelParams {
  totalSubscribers: number;        // Total addressable subscribers (3B from MNOs)
  attachmentRate: number;          // Attachment rate as decimal (0.005-0.15)
  monthlyARPU: number;             // Monthly ARPU in USD ($5-20)
  revenueShare: number;            // Revenue share to ASTS as decimal (default 0.50)
}

// Common Financial Parameters
export interface FinancialParams {
  ebitdaMargin: number;            // EBITDA margin as decimal (default 0.85)
  evEbitdaMultiple: number;        // EV/EBITDA multiple (15-40x)
  sharesOutstanding: number;       // Shares outstanding in millions (~400M FD)
  netDebt: number;                 // Net debt in millions (positive = debt, negative = cash)
}

// Combined Model Parameters
export interface ModelParams {
  throughput: ThroughputModelParams;
  userBased: UserBasedModelParams;
  financial: FinancialParams;
  activeModel: ModelType;
}

// Valuation Results
export interface ValuationResult {
  grossRevenue: number;            // Gross revenue in millions
  netRevenue: number;              // Net revenue (after revenue share) in millions
  ebitda: number;                  // EBITDA in millions
  enterpriseValue: number;         // Enterprise value in millions
  equityValue: number;             // Equity value in millions
  stockPrice: number;              // Implied stock price
}

// Yearly Projection
export interface YearlyProjection {
  year: number;
  satellites: number;
  revenue: number;
  ebitda: number;
  stockPrice: number;
}

// Sensitivity Analysis Point
export interface SensitivityPoint {
  xValue: number;
  yValue: number;
  stockPrice: number;
}

// Chart Data for Revenue Projections
export interface RevenueChartData {
  year: string;
  throughputRevenue: number;
  userBasedRevenue: number;
  throughputPrice: number;
  userBasedPrice: number;
  averageRevenue: number;
  averagePrice: number;
}

// Parameter Slider Configuration
export interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  unit: string;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
}

// Default parameter values based on document
export const DEFAULT_PARAMS: ModelParams = {
  throughput: {
    satellites: 200,                // 2030 target constellation size
    grossGBPerSatellite: 150,       // 150M GB per year
    utilizationRate: 0.15,          // 15% utilization
    pricePerGB: 5,                  // $5 per GB - premium satellite data pricing
    spectralEfficiency: 3.0,        // 3 bits/Hz
  },
  userBased: {
    totalSubscribers: 3000,         // 3 billion (stored in millions)
    attachmentRate: 0.10,           // 10% - target attachment rate
    monthlyARPU: 8,                 // $8/month
    revenueShare: 0.50,             // 50% to ASTS
  },
  financial: {
    ebitdaMargin: 0.85,             // 85%
    evEbitdaMultiple: 15,           // 15x
    sharesOutstanding: 650,         // ~650M shares FD (diluted for capital raises)
    netDebt: 2000,                  // $2B net debt (constellation financing)
  },
  activeModel: 'both',
};

// Constellation build-out schedule (satellites per year)
export const CONSTELLATION_SCHEDULE: Record<number, number> = {
  2026: 45,   // Initial deployment
  2027: 90,   // Continued build-out
  2028: 135,  // Expansion
  2029: 170,  // Further expansion
  2030: 200,  // Full constellation
};

// Attachment rate growth assumptions
// Linear ramp to 10% by 2030
export const ATTACHMENT_RATE_SCHEDULE: Record<number, number> = {
  2026: 0.02,   // 2% - Initial coverage and early adopters
  2027: 0.04,   // 4% - Continuous coverage achieved
  2028: 0.06,   // 6% - Growing awareness and adoption
  2029: 0.08,   // 8% - Broader market penetration
  2030: 0.10,   // 10% - Target ceiling reached
};

// EV/EBITDA Multiple schedule
// Higher multiples early (growth phase), compressing as company matures
export const EV_EBITDA_SCHEDULE: Record<number, number> = {
  2026: 25,     // 25x - High growth phase, premium multiple
  2027: 22,     // 22x - Still rapid growth
  2028: 19,     // 19x - Growth moderating
  2029: 17,     // 17x - Approaching maturity
  2030: 15,     // 15x - Steady state multiple
};

