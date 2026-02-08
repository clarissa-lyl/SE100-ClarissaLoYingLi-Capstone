import { createContext, useState, useCallback, useEffect } from 'react';

export const StockContext = createContext(null);

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

export function StockProvider({ children }) {
    const [stocks, setStocks] = useState([]);

    const fetchCurrentPrice = useCallback(async (symbol) => {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data?.Note || data?.Information || data?.Error_Message) return null;

        const price = Number(data?.["Global Quote"]?.["05. price"]);
        if (!Number.isFinite(price) || price <= 0) return null;

        return price;
    }, []);

    const addStock = useCallback(
    async ({ symbol, quantity, purchasePrice }) => {
      try {
        const currentPrice = await fetchCurrentPrice(symbol);
        if (currentPrice == null) return false;

        const newStock = {
          id: crypto.randomUUID(),
          symbol,
          quantity,
          purchasePrice,
          currentPrice,
        };

        setStocks((prev) => [...prev, newStock]);
        return true;
      } catch (e) {
        console.error("Error fetching stock data:", e);
        return false;
      }
    },
    [fetchCurrentPrice]
  );

  // ✅ Fetch when component mounts + whenever stock list updates
  useEffect(() => {
    if (stocks.length === 0) return;

    let cancelled = false;

    (async () => {
      const updated = await Promise.all(
        stocks.map(async (s) => {
          const latest = await fetchCurrentPrice(s.symbol);
          return latest == null ? s : { ...s, currentPrice: latest };
        })
      );

      if (!cancelled) setStocks(updated);
    })();

    return () => {
      cancelled = true;
    };
  }, [stocks.length, fetchCurrentPrice]); // keep dependency light

    return (
        <StockContext.Provider value={{ stocks, addStock }}>
            {children}
        </StockContext.Provider>
    );
}