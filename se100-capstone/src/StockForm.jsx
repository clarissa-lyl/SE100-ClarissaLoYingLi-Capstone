import './StockForm.css';

import { useState } from 'react';

function StockForm() {
    const [symbol, setSymbol] = useState("");
    const [quantity, setQuantity] = useState("");
    const [stockPrice, setStockPrice] = useState("");

    return (
        <>
        <div className="container">
            <input
                type="text"
                id="input-field"
                name="stockSymbol"
                placeholder="Stock Symbol"
                value={symbol}
                onChange={(event) => setSymbol(event.target.value.toUpperCase())}
            />

            <input
                type="number"
                id="input-field"
                name="stockQuantity"
                placeholder="Stock Quantity"
                min="1"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
            />

            <input
                type="text"
                id="input-field"
                name="stockPrice"
                placeholder="Stock Price"
                value={stockPrice}
                onChange={(event) => setStockPrice(event.target.value)}
            />

            <button className="add-stock-button" type="submit">Add Stock</button>
        </div>
        </>
);
}

export default StockForm;