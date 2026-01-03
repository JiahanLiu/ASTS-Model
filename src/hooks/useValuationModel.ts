import { useMemo, useState, useCallback } from 'react';
import {
  ModelParams,
  ThroughputModelParams,
  UserBasedModelParams,
  FinancialParams,
  ValuationResult,
  RevenueChartData,
  ModelType,
  DEFAULT_PARAMS,
  CONSTELLATION_SCHEDULE,
  ATTACHMENT_RATE_SCHEDULE,
} from '../types';

// Calculate valuation using Throughput-Yield Model
function calculateThroughputModel(
  throughput: ThroughputModelParams,
  financial: FinancialParams
): ValuationResult {
  // Revenue = Satellites x (GB_per_sat x Utilization) x Price_per_GB
  // All values in millions
  const billableGBPerSatellite = throughput.grossGBPerSatellite * throughput.utilizationRate;
  const grossRevenue = throughput.satellites * billableGBPerSatellite * throughput.pricePerGB;

  // ASTS reports net revenue (50% share), but for throughput we use gross
  const netRevenue = grossRevenue * 0.5; // 50/50 revenue share with MNOs

  // EBITDA calculation
  const ebitda = netRevenue * financial.ebitdaMargin;

  // Enterprise Value
  const enterpriseValue = ebitda * financial.evEbitdaMultiple;

  // Equity Value (EV - Net Debt)
  const equityValue = enterpriseValue - financial.netDebt;

  // Stock Price
  const stockPrice = equityValue / financial.sharesOutstanding;

  return {
    grossRevenue,
    netRevenue,
    ebitda,
    enterpriseValue,
    equityValue,
    stockPrice: Math.max(0, stockPrice),
  };
}

// Calculate valuation using User-Based Model
function calculateUserBasedModel(
  userBased: UserBasedModelParams,
  financial: FinancialParams
): ValuationResult {
  // Gross Revenue = Subscribers x Attachment_Rate x ARPU x 12 months
  // Subscribers stored in millions, ARPU in dollars
  const subscribersInMillions = userBased.totalSubscribers;
  const activeSubscribers = subscribersInMillions * userBased.attachmentRate;
  const annualRevenuePerSub = userBased.monthlyARPU * 12;

  // Gross revenue in millions
  const grossRevenue = activeSubscribers * annualRevenuePerSub;

  // Net Revenue (after revenue share)
  const netRevenue = grossRevenue * userBased.revenueShare;

  // EBITDA calculation
  const ebitda = netRevenue * financial.ebitdaMargin;

  // Enterprise Value
  const enterpriseValue = ebitda * financial.evEbitdaMultiple;

  // Equity Value
  const equityValue = enterpriseValue - financial.netDebt;

  // Stock Price
  const stockPrice = equityValue / financial.sharesOutstanding;

  return {
    grossRevenue,
    netRevenue,
    ebitda,
    enterpriseValue,
    equityValue,
    stockPrice: Math.max(0, stockPrice),
  };
}

// Generate yearly projections
function generateYearlyProjections(
  params: ModelParams
): RevenueChartData[] {
  const years = [2025, 2026, 2027, 2028, 2029, 2030];

  return years.map(year => {
    // Throughput model with constellation schedule
    const satellites = CONSTELLATION_SCHEDULE[year] || params.throughput.satellites;
    const throughputParams: ThroughputModelParams = {
      ...params.throughput,
      satellites,
    };
    const throughputResult = calculateThroughputModel(throughputParams, params.financial);

    // User-based model with attachment rate schedule
    const attachmentRate = ATTACHMENT_RATE_SCHEDULE[year] || params.userBased.attachmentRate;
    const userBasedParams: UserBasedModelParams = {
      ...params.userBased,
      attachmentRate,
    };
    const userBasedResult = calculateUserBasedModel(userBasedParams, params.financial);

    return {
      year: year.toString(),
      throughputRevenue: throughputResult.netRevenue,
      userBasedRevenue: userBasedResult.netRevenue,
      throughputPrice: throughputResult.stockPrice,
      userBasedPrice: userBasedResult.stockPrice,
    };
  });
}

// Custom hook for valuation model
export function useValuationModel() {
  const [params, setParams] = useState<ModelParams>(DEFAULT_PARAMS);

  // Calculate results for both models
  const throughputResult = useMemo(
    () => calculateThroughputModel(params.throughput, params.financial),
    [params.throughput, params.financial]
  );

  const userBasedResult = useMemo(
    () => calculateUserBasedModel(params.userBased, params.financial),
    [params.userBased, params.financial]
  );

  // Get the active result based on model selection
  const activeResult = useMemo(() => {
    switch (params.activeModel) {
      case 'throughput':
        return throughputResult;
      case 'user-based':
        return userBasedResult;
      case 'both':
      default:
        // Average of both models
        return {
          grossRevenue: (throughputResult.grossRevenue + userBasedResult.grossRevenue) / 2,
          netRevenue: (throughputResult.netRevenue + userBasedResult.netRevenue) / 2,
          ebitda: (throughputResult.ebitda + userBasedResult.ebitda) / 2,
          enterpriseValue: (throughputResult.enterpriseValue + userBasedResult.enterpriseValue) / 2,
          equityValue: (throughputResult.equityValue + userBasedResult.equityValue) / 2,
          stockPrice: (throughputResult.stockPrice + userBasedResult.stockPrice) / 2,
        };
    }
  }, [params.activeModel, throughputResult, userBasedResult]);

  // Generate yearly projections
  const yearlyProjections = useMemo(
    () => generateYearlyProjections(params),
    [params]
  );

  // Update functions
  const updateThroughputParam = useCallback(
    <K extends keyof ThroughputModelParams>(key: K, value: ThroughputModelParams[K]) => {
      setParams(prev => ({
        ...prev,
        throughput: {
          ...prev.throughput,
          [key]: value,
        },
      }));
    },
    []
  );

  const updateUserBasedParam = useCallback(
    <K extends keyof UserBasedModelParams>(key: K, value: UserBasedModelParams[K]) => {
      setParams(prev => ({
        ...prev,
        userBased: {
          ...prev.userBased,
          [key]: value,
        },
      }));
    },
    []
  );

  const updateFinancialParam = useCallback(
    <K extends keyof FinancialParams>(key: K, value: FinancialParams[K]) => {
      setParams(prev => ({
        ...prev,
        financial: {
          ...prev.financial,
          [key]: value,
        },
      }));
    },
    []
  );

  const setActiveModel = useCallback((model: ModelType) => {
    setParams(prev => ({
      ...prev,
      activeModel: model,
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setParams(DEFAULT_PARAMS);
  }, []);

  return {
    params,
    throughputResult,
    userBasedResult,
    activeResult,
    yearlyProjections,
    updateThroughputParam,
    updateUserBasedParam,
    updateFinancialParam,
    setActiveModel,
    resetToDefaults,
  };
}

export type UseValuationModelReturn = ReturnType<typeof useValuationModel>;

