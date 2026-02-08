import './StockList.css';

import { useContext } from "react";
import { StockContext } from "./contexts/StockContext.jsx";

function formatMoney(n) {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function StockList() {
    const ctx = useContext(StockContext);

    //Optional chaining
    //result: ctx = null or undefined -> stocks = []
    //       ctx = { stocks: [...] } -> stocks = [...] (result is the stocks array)
    // value ?? fallback meaning: if value is null or undefined, use fallback instead
    const stocks = ctx?.stocks ?? [];

    // Conditional rendering: show message when no stocks
    if (stocks.length === 0) {
        return (
            <div className="table-wrap">
                <h2>Stock List</h2>
                <p className="empty-state">No stocks added yet.</p>
            </div>
            );
    }

    return (
        <div className="table-wrap">
            <h2>Stock List</h2>

            <table className="stock-table">
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Quantity</th>
                        <th>Purchase Price</th>
                        <th>Current Price</th>
                        <th>Profit/Loss</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock) => {
                        //stock is an object
                        // stock.quantity, stock.purchasePrice, stock.currentPrice are properties
                        // qty, buy, current are just local variable names

                        const qty = Number(stock.quantity);
                        const buy = Number(stock.purchasePrice);
                        const current = Number(stock.currentPrice);

                        const canCalc =
                        Number.isFinite(qty) && Number.isFinite(buy) && Number.isFinite(current);

                        const pnl = canCalc ? (current - buy) * qty : null;
                        const pnlClass =
                        pnl == null ? "" : pnl >= 0 ? "pnl-positive" : "pnl-negative";

                        return (
                        <tr key={stock.id}>
                            <td>{stock.symbol}</td>
                            <td>{Number.isFinite(qty) ? qty : "-"}</td>
                            <td>{formatMoney(buy)}</td>
                            <td>{formatMoney(current)}</td>
                            <td className={pnlClass}>{pnl == null ? "-" : formatMoney(pnl)}</td>
                        </tr>
                        );
                })}
                </tbody>
            </table>
        </div>
    );
}

export default StockList;