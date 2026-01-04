import { useState, useEffect, useCallback } from 'react';

// Last known price - update this periodically or when building
// As of January 3, 2026: $83.47
const FALLBACK_PRICE = 83.47;

interface StockPriceData {
  currentPrice: number;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isLive: boolean;
  setManualPrice: (price: number) => void;
}

// Hook to fetch current ASTS stock price
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
      // Try multiple API sources
      const apis = [
        // Finnhub (free tier, may have CORS issues)
        async () => {
          const res = await fetch(
            'https://finnhub.io/api/v1/quote?symbol=ASTS&token=demo',
            { mode: 'cors' }
          );
          const data = await res.json();
          if (data.c && data.c > 0) return data.c;
          throw new Error('No price');
        },
        // Try a CORS proxy as fallback (for demo purposes)
        async () => {
          const res = await fetch(
            'https://api.allorigins.win/raw?url=' +
            encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/ASTS?interval=1d&range=1d')
          );
          const data = await res.json();
          const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
          if (price && price > 0) return price;
          throw new Error('No price');
        },
      ];

      for (const apiFn of apis) {
        try {
          const price = await apiFn();
          if (price && price > 0) {
            setCurrentPrice(price);
            setIsLoading(false);
            setError(null);
            setLastUpdated(new Date());
            setIsLive(true);
            return;
          }
        } catch {
          // Try next API
          continue;
        }
      }

      // All APIs failed, use fallback
      console.warn('Could not fetch live price, using fallback: $' + FALLBACK_PRICE);
      setCurrentPrice(FALLBACK_PRICE);
      setIsLoading(false);
      setError('Using cached price (update: Jan 3, 2026)');
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

