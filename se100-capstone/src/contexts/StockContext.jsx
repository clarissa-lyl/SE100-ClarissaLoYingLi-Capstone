import { createContext, useState, useCallback, useEffect } from 'react';

export const StockContext = createContext(null);

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

const hasApiKey = typeof API_KEY === "string" && API_KEY.trim().length > 0;

export function StockProvider({ children }) {
    const [stocks, setStocks] = useState([]);

    const fetchCurrentPrice = useCallback(async (symbol) => {

        // Defensive guard to block calls if key missing
        if (!hasApiKey) {
            console.warn(
                "Missing VITE_ALPHA_VANTAGE_KEY. Alpha Vantage request skipped."
            );
            return null;
        }

        try {
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            // Handle API rate limit & errors
            if (data?.Note || data?.Information || data?.Error_Message) return null;

            const priceStr = data?.["Global Quote"]?.["05. price"];
            const price = Number(priceStr);

            if (!Number.isFinite(price) || price <= 0) return null;

            return price;
        } catch (e) {
            console.error("Error fetching stock data:", e);
            return null;
        }

    }, []);

    const addStock = useCallback(
        async ({ symbol, quantity, purchasePrice }) => {
            // Defensive guard to block calls if key missing
            if (!hasApiKey) {
                console.warn(
                    "Missing VITE_ALPHA_VANTAGE_KEY. Alpha Vantage request skipped."
                );
                return false;
            }

            const currentPrice = await fetchCurrentPrice(symbol);
            if (currentPrice == null) return false;

            const newStock = {
                id: crypto.randomUUID(),
                symbol: symbol.toUpperCase(),
                quantity,
                purchasePrice,
                currentPrice,
            };

            setStocks((prev) => [...prev, newStock]);
            return true;

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