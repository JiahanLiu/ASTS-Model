import { useState, useEffect, useCallback } from 'react';

// Last known price - update this periodically or when building
// As of January 6, 2026: $83.25 (from Yahoo Finance)
const FALLBACK_PRICE = 83.25;

interface StockPriceData {
  currentPrice: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isLive: boolean;
  setManualPrice: (price: number) => void;
}

// Hook to fetch current ASTS stock price from Yahoo Finance
export function useCurrentStockPrice(): StockPriceData {
  const [currentPrice, setCurrentPrice] = useState<number>(FALLBACK_PRICE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);

  const setManualPrice = useCallback((price: number) => {
    setCurrentPrice(price);
    setIsLive(false);
    setError('Manual price set');
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    const fetchPrice = async () => {
      // Yahoo Finance API endpoints to try
      const yahooUrls = [
        'https://query1.finance.yahoo.com/v8/finance/chart/ASTS?interval=1d&range=1d',
        'https://query2.finance.yahoo.com/v8/finance/chart/ASTS?interval=1d&range=1d',
      ];

      // CORS proxies to try (for browser-based fetching)
      const corsProxies = [
        (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
        (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
        (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
      ];

      // Try each combination of proxy and Yahoo URL
      for (const proxy of corsProxies) {
        for (const yahooUrl of yahooUrls) {
          try {
            const proxyUrl = proxy(yahooUrl);
            const res = await fetch(proxyUrl, {
              headers: {
                'Accept': 'application/json',
              },
            });
            
            if (!res.ok) continue;
            
            const data = await res.json();
            
            // Try to extract price from Yahoo Finance response
            const price = 
              data?.chart?.result?.[0]?.meta?.regularMarketPrice ||
              data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close?.slice(-1)?.[0];
            
            if (price && price > 0) {
              setCurrentPrice(price);
              setIsLoading(false);
              setError(null);
              setLastUpdated(new Date());
              setIsLive(true);
              console.log('Live ASTS price fetched: $' + price);
              return;
            }
          } catch {
            // Try next combination
            continue;
          }
        }
      }

      // All APIs failed, use fallback
      console.warn('Could not fetch live ASTS price from Yahoo Finance, using fallback: $' + FALLBACK_PRICE);
      setCurrentPrice(FALLBACK_PRICE);
      setIsLoading(false);
      setError('Using cached price (update: Jan 6, 2026)');
      setIsLive(false);
    };

    fetchPrice();

    // Refresh every 5 minutes
    const interval = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    currentPrice,
    isLoading,
    error,
    lastUpdated,
    isLive,
    setManualPrice,
  };
}

// Calculate upside percentage
export function calculateUpside(currentPrice: number, targetPrice: number): number {
  if (currentPrice <= 0) return 0;
  return ((targetPrice - currentPrice) / currentPrice) * 100;
}

