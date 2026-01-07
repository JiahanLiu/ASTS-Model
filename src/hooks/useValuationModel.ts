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
  EV_EBITDA_SCHEDULE,
  getFullyDilutedShares,
} from '../types';

// Type for exported configuration
export interface ExportedConfig {
  version: string;
  exportedAt: string;
  params: ModelParams;
  constellationSchedule: Record<number, number>;
  attachmentSchedule: Record<number, number>;
  evEbitdaSchedule: Record<number, number>;
}

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

  // Stock Price (using fully diluted shares)
  const fullyDilutedShares = getFullyDilutedShares(financial);
  const stockPrice = equityValue / fullyDilutedShares;

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
  // Main MNO Revenue = Subscribers x Attachment_Rate x ARPU x 12 months
  // Subscribers stored in millions, ARPU in dollars
  const subscribersInMillions = userBased.totalSubscribers;
  const activeSubscribers = subscribersInMillions * userBased.attachmentRate;
  const annualRevenuePerSub = userBased.monthlyARPU * 12;

  // Main gross revenue in millions
  const mainGrossRevenue = activeSubscribers * annualRevenuePerSub;
  const mainNetRevenue = mainGrossRevenue * userBased.revenueShare;

  // FirstNet Revenue (if enabled)
  let firstNetGrossRevenue = 0;
  let firstNetNetRevenue = 0;
  if (userBased.firstNetEnabled) {
    // FirstNet subscribers are stored in millions, 100% attachment (dedicated network)
    const firstNetAnnualRevenue = userBased.firstNetSubscribers * userBased.firstNetARPU * 12;
    firstNetGrossRevenue = firstNetAnnualRevenue;
    firstNetNetRevenue = firstNetGrossRevenue * userBased.firstNetRevenueShare;
  }

  // Combined revenue
  const grossRevenue = mainGrossRevenue + firstNetGrossRevenue;
  const netRevenue = mainNetRevenue + firstNetNetRevenue;

  // EBITDA calculation
  const ebitda = netRevenue * financial.ebitdaMargin;

  // Enterprise Value
  const enterpriseValue = ebitda * financial.evEbitdaMultiple;

  // Equity Value
  const equityValue = enterpriseValue - financial.netDebt;

  // Stock Price (using fully diluted shares)
  const fullyDilutedShares = getFullyDilutedShares(financial);
  const stockPrice = equityValue / fullyDilutedShares;

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
  params: ModelParams,
  constellationSchedule: Record<number, number>,
  attachmentSchedule: Record<number, number>,
  evEbitdaSchedule: Record<number, number>
): RevenueChartData[] {
  const years = [2026, 2027, 2028, 2029, 2030];

  return years.map(year => {
    // Get year-specific EV/EBITDA multiple
    const evEbitdaMultiple = evEbitdaSchedule[year] || params.financial.evEbitdaMultiple;
    const yearFinancial: FinancialParams = {
      ...params.financial,
      evEbitdaMultiple,
    };

    // Throughput model with constellation schedule
    const satellites = constellationSchedule[year] || params.throughput.satellites;
    const throughputParams: ThroughputModelParams = {
      ...params.throughput,
      satellites,
    };
    const throughputResult = calculateThroughputModel(throughputParams, yearFinancial);

    // User-based model with attachment rate schedule
    const attachmentRate = attachmentSchedule[year] || params.userBased.attachmentRate;
    const userBasedParams: UserBasedModelParams = {
      ...params.userBased,
      attachmentRate,
    };
    const userBasedResult = calculateUserBasedModel(userBasedParams, yearFinancial);

    return {
      year: year.toString(),
      throughputRevenue: throughputResult.netRevenue,
      userBasedRevenue: userBasedResult.netRevenue,
      throughputPrice: throughputResult.stockPrice,
      userBasedPrice: userBasedResult.stockPrice,
      averageRevenue: (throughputResult.netRevenue + userBasedResult.netRevenue) / 2,
      averagePrice: (throughputResult.stockPrice + userBasedResult.stockPrice) / 2,
    };
  });
}

// Custom hook for valuation model
export function useValuationModel() {
  const [params, setParams] = useState<ModelParams>(DEFAULT_PARAMS);
  const [constellationSchedule, setConstellationSchedule] = useState<Record<number, number>>(
    { ...CONSTELLATION_SCHEDULE }
  );
  const [attachmentSchedule, setAttachmentSchedule] = useState<Record<number, number>>(
    { ...ATTACHMENT_RATE_SCHEDULE }
  );
  const [evEbitdaSchedule, setEvEbitdaSchedule] = useState<Record<number, number>>(
    { ...EV_EBITDA_SCHEDULE }
  );

  // Calculate results for both models using 2030 scheduled values
  const throughputResult = useMemo(() => {
    const throughputParams: ThroughputModelParams = {
      ...params.throughput,
      satellites: constellationSchedule[2030] ?? params.throughput.satellites,
    };
    const financialParams: FinancialParams = {
      ...params.financial,
      evEbitdaMultiple: evEbitdaSchedule[2030] ?? params.financial.evEbitdaMultiple,
    };
    return calculateThroughputModel(throughputParams, financialParams);
  }, [params.throughput, params.financial, constellationSchedule, evEbitdaSchedule]);

  const userBasedResult = useMemo(() => {
    const userBasedParams: UserBasedModelParams = {
      ...params.userBased,
      attachmentRate: attachmentSchedule[2030] ?? params.userBased.attachmentRate,
    };
    const financialParams: FinancialParams = {
      ...params.financial,
      evEbitdaMultiple: evEbitdaSchedule[2030] ?? params.financial.evEbitdaMultiple,
    };
    return calculateUserBasedModel(userBasedParams, financialParams);
  }, [params.userBased, params.financial, attachmentSchedule, evEbitdaSchedule]);

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
    () => generateYearlyProjections(params, constellationSchedule, attachmentSchedule, evEbitdaSchedule),
    [params, constellationSchedule, attachmentSchedule, evEbitdaSchedule]
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
      // Sync attachmentRate with 2030 schedule value
      if (key === 'attachmentRate') {
        setAttachmentSchedule(prev => ({
          ...prev,
          [2030]: value as number,
        }));
      }
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
    setConstellationSchedule({ ...CONSTELLATION_SCHEDULE });
    setAttachmentSchedule({ ...ATTACHMENT_RATE_SCHEDULE });
    setEvEbitdaSchedule({ ...EV_EBITDA_SCHEDULE });
  }, []);

  const updateConstellationSchedule = useCallback((year: number, satellites: number) => {
    setConstellationSchedule(prev => ({
      ...prev,
      [year]: satellites,
    }));
  }, []);

  const updateAttachmentSchedule = useCallback((year: number, rate: number) => {
    setAttachmentSchedule(prev => ({
      ...prev,
      [year]: rate,
    }));
    // Sync 2030 value with userBased.attachmentRate
    if (year === 2030) {
      setParams(prev => ({
        ...prev,
        userBased: {
          ...prev.userBased,
          attachmentRate: rate,
        },
      }));
    }
  }, []);

  const updateEvEbitdaSchedule = useCallback((year: number, multiple: number) => {
    setEvEbitdaSchedule(prev => ({
      ...prev,
      [year]: multiple,
    }));
    // Sync 2030 value with financial.evEbitdaMultiple
    if (year === 2030) {
      setParams(prev => ({
        ...prev,
        financial: {
          ...prev.financial,
          evEbitdaMultiple: multiple,
        },
      }));
    }
  }, []);

  // Export configuration as JSON
  const exportConfig = useCallback(() => {
    const config: ExportedConfig = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      params,
      constellationSchedule,
      attachmentSchedule,
      evEbitdaSchedule,
    };
    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asts-model-config-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [params, constellationSchedule, attachmentSchedule, evEbitdaSchedule]);

  // Import configuration from JSON
  const importConfig = useCallback((file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const config: ExportedConfig = JSON.parse(content);

          // Validate the config structure
          if (!config.params || !config.constellationSchedule ||
              !config.attachmentSchedule || !config.evEbitdaSchedule) {
            throw new Error('Invalid configuration file format');
          }

          // Apply the configuration
          setParams(config.params);
          setConstellationSchedule(config.constellationSchedule);
          setAttachmentSchedule(config.attachmentSchedule);
          setEvEbitdaSchedule(config.evEbitdaSchedule);

          resolve();
        } catch {
          reject(new Error('Failed to parse configuration file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  return {
    params,
    throughputResult,
    userBasedResult,
    activeResult,
    yearlyProjections,
    constellationSchedule,
    attachmentSchedule,
    evEbitdaSchedule,
    updateThroughputParam,
    updateUserBasedParam,
    updateFinancialParam,
    updateConstellationSchedule,
    updateAttachmentSchedule,
    updateEvEbitdaSchedule,
    setActiveModel,
    resetToDefaults,
    exportConfig,
    importConfig,
  };
}

export type UseValuationModelReturn = ReturnType<typeof useValuationModel>;

