import { createContext, useState, useCallback } from 'react';

export const StockContext = createContext(null);

const API_KEY = "L7I0SF4AEOYJHQPB";

export function StockProvider({ children }) {
    const [stocks, setStocks] = useState([]);

    // addStock: validates symbol via AlphaVantage and adds to shared stock list state
    const addStock = useCallback(async ({ symbol, quantity, purchasePrice }) => {
        try {

            // 1. Build API URL (GLOBAL_QUOTE gives current price; can infer symbol validity)
            const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
            
            // 2. Fetch data from AlphaVantage
            const response = await fetch(url);
            const data = await response.json();

            // 3. Guard clause: handle AlphaVantage meta responses (e.g., rate limit / invalid request)
            if (data?.Note || data?.Information || data?.Error_Message) {
                return false;
            }
            
            // 4. Retrieve price from API response
            const currentPrice = Number(data?.["Global Quote"]?.["05. price"]);

            // 5. Guard clause: infer invalid symbol / unusable quote if price is not a valid positive number
            if (!Number.isFinite(currentPrice) || currentPrice <= 0) {
                return false;
            }

            // 6a. Success path: Define new stock object to add
            const newStock = {
                id: crypto.randomUUID(),    // Unique identifier (Date.now() timestamp not suitable for rapid calls)
                symbol,                     // Stock ticker (e.g., AAPL)
                quantity,                   // Number of shares
                purchasePrice,              // Price at time of buy
                currentPrice               // Latest market price from API
            };

            // 6b. Success path: 
            // Update state immutably: keep existing stock entries and append the new one at the end
            setStocks(prevStocks => [
                ...prevStocks,
                newStock
            ]);

            // 7. Indicate to caller (StockForm) that stock was added successfully
            return true; 
            
        } catch (error) {
            // 9) Guard clause: network/API errors mean we cannot validate symbol → do not add
            console.error("Error fetching stock data:", error);
            // 10. Indicate failure to caller (StockForm)
            return false; 
        }
    }, []);

    return (
        <StockContext.Provider value={{ stocks, addStock }}>
            {children}
        </StockContext.Provider>
    );
}