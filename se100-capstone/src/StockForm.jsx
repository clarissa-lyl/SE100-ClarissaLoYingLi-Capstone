import './StockForm.css';

import { useState, useContext } from 'react';
import { StockContext } from './contexts/StockContext.jsx';

function StockForm() {
    const { addStock } = useContext(StockContext);

    const [formData, setFormData] = useState({
        symbol: '',
        quantity: '',
        purchasePrice: ''
    });

    // State to track error messages
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setError(''); // Clear error when user starts typing
        setFormData(prev => ({
            ...prev,
            [name]: name === "symbol" ? value.toUpperCase() : value // To auto-uppercase symbol as user types
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Parse data
        const parsedData = {
            symbol: formData.symbol.trim().toUpperCase(),
            quantity: parseInt(formData.quantity),
            purchasePrice: parseFloat(formData.purchasePrice)
        };

        // 2. Check if any field is empty or not a number
        // (!symbol catches "", isNaN catches failed number conversions but allows 0)
        if (!parsedData.symbol || !Number.isFinite(parsedData.quantity) || !Number.isFinite(parsedData.purchasePrice)) {
            setError('Please fill up all the fields.');
            return;
        }
        
        // 3. Final safety check (especially if browser min is bypassed)
        // Now that we know they ARE numbers, are they the RIGHT numbers?
        if (parsedData.quantity <= 0 || parsedData.purchasePrice <= 0) {
            setError('Quantity and Price must be greater than zero.');
            return;
        }

        // 4. Validate symbol via AlphaVantage and add stock if valid (handled in context)
        const ok = await addStock(parsedData);

        if (!ok) {
            setError('Invalid stock symbol or API temporarily unavailable (rate limit)');
            return;
        }

        // 5. Reset form upon successful submission
        setFormData({ symbol: '', quantity: '', purchasePrice: '' });
        setError('');
    };

    return (
        <form className="stock-form-container" onSubmit={handleSubmit}>

            <input
                type="text"
                className="input-field"
                name="symbol"
                placeholder="Stock Symbol"
                value={formData.symbol}
                onChange={handleChange}
            />
            <input
                type="number"
                className="input-field"
                name="quantity"
                min="1" // Prevents 0 and negative inputs via UI
                step="1"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={handleChange}
            />
            <input
                type="number"
                className="input-field"
                name="purchasePrice"
                min="0.01"
                step="0.01"
                placeholder="Purchase Price"
                value={formData.purchasePrice}
                onChange={handleChange}
            />
            <button type="submit" className="submit-button">
                Add Stock
            </button>

            {/* Display error message if it exists */}
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        </form>    
    );
}

export default StockForm;