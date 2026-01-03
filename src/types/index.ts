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
  attachmentRate: number;          // Attachment rate as decimal (0.05-0.50)
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
    satellites: 100,
    grossGBPerSatellite: 100,       // 100M GB per year
    utilizationRate: 0.20,          // 20% utilization
    pricePerGB: 2,                  // $2 per GB
    spectralEfficiency: 3.0,        // 3 bits/Hz
  },
  userBased: {
    totalSubscribers: 3000,         // 3 billion (stored in millions)
    attachmentRate: 0.25,           // 25%
    monthlyARPU: 10,                // $10/month
    revenueShare: 0.50,             // 50% to ASTS
  },
  financial: {
    ebitdaMargin: 0.85,             // 85%
    evEbitdaMultiple: 25,           // 25x
    sharesOutstanding: 402,         // ~402M shares FD
    netDebt: 50,                    // $50M net debt (after cash)
  },
  activeModel: 'both',
};

// Constellation build-out schedule (satellites per year)
export const CONSTELLATION_SCHEDULE: Record<number, number> = {
  2025: 6,    // Block 1 + FM-1
  2026: 45,   // Ramp up Block 2
  2027: 100,  // Full initial constellation
  2028: 150,  // Expansion
  2029: 180,  // Further expansion
  2030: 200,  // Multi-shell capability
};

// Attachment rate growth assumptions
export const ATTACHMENT_RATE_SCHEDULE: Record<number, number> = {
  2025: 0.05,
  2026: 0.15,
  2027: 0.25,
  2028: 0.30,
  2029: 0.35,
  2030: 0.40,
};

