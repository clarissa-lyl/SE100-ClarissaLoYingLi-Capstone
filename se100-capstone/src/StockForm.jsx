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

    //Handler for general input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setError(''); // Clear error when user starts typing
        setFormData(prev => ({
            ...prev,
            [name]: name === "symbol" ? value.toUpperCase() : value // To auto-uppercase symbol as user types
        }));
    };

    // Handler specifically for quantity to enforce whole numbers
    const handleQuantityChange = (e) => {
        const value = e.target.value;

        // Allow empty input (so user can backspace)
        if (value === '') {
            setFormData((prev) => ({ ...prev, quantity: '' }));
            return;
        }

        // Only allow whole numbers
        if (/^\d+$/.test(value)) {
            setFormData((prev) => ({ ...prev, quantity: value }));
        }
    };

    // Handler specifically for purchasePrice to enforce 2 decimal places
    const handlePriceChange = (e) => {
        const value = e.target.value;

        // Allow empty input
        if (value === '') {
            setFormData((prev) => ({ ...prev, purchasePrice: '' }));
            return;
        }

        // Allow numbers with up to 2 decimal places
        const priceRegex = /^\d+(\.\d{0,2})?$/;

        if (priceRegex.test(value)) {
            setFormData((prev) => ({ ...prev, purchasePrice: value }));
        }
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
        <div className="panel">
            <div className="panel-header">
                <h2 className="panel-title">Add a Stock</h2>
                <p className="panel-subtitle">Add stocks to your portfolio</p>
            </div>

            <form className="stock-form" onSubmit={handleSubmit}>
                <div className="field">
                <label className="label">Stock Symbol</label>
                <input
                    type="text"
                    className="input"
                    name="symbol"
                    placeholder="e.g., AAPL"
                    value={formData.symbol}
                    onChange={handleChange}
                    maxLength={5}
                />
                </div>

                <div className="field">
                <label className="label">Quantity</label>
                <input
                    type="text"
                    className="input"
                    name="quantity"
                    placeholder="0"
                    inputMode="numeric"
                    value={formData.quantity}
                    onChange={handleQuantityChange}
                    maxLength={7}
                />
                </div>

                <div className="field">
                <label className="label">Purchase Price</label>
                <input
                    type="text"
                    className="input"
                    name="purchasePrice"
                    placeholder="$ 0.00"
                    inputMode="decimal"
                    pattern="^\d+(\.\d{1,2})?$"                
                    value={formData.purchasePrice}
                    onChange={handlePriceChange}
                    maxLength={9}
                />
                </div>

                <button type="submit" className="primary-btn">
                <span className="btn-icon" aria-hidden>
                    ⊕
                </span>
                Add Stock
                </button>

                {error && <p className="error">{error}</p>}

            </form>
        </div> 
    );
}

export default StockForm;