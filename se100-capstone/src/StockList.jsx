import './StockList.css';

import { useContext } from "react";
import { StockContext } from "./contexts/StockContext.jsx";

function formatMoney(n) {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function formatPct(n) {
  if (!Number.isFinite(n)) return '-';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

function StockList() {
    const ctx = useContext(StockContext);

    //Optional chaining
    //result: ctx = null or undefined -> stocks = []
    //       ctx = { stocks: [...] } -> stocks = [...] (result is the stocks array)
    // value ?? fallback meaning: if value is null or undefined, use fallback instead
    const stocks = ctx?.stocks ?? [];

    const countText = `${stocks.length} stock${stocks.length === 1 ? '' : 's'} in your portfolio`;

    return (
        <div className="stock-list">
            <div className="panel-header panel-header--list">
                <div>
                <h2 className="panel-title">Stock List</h2>
                <p className="panel-subtitle">{countText}</p>
                </div>
            </div>

            <div className="table-surface">
                <table className="stock-table">
                    <thead>
                        <tr>
                        <th className="th-sort">
                            Symbol <span className="sort">↑↓</span>
                        </th>
                        <th className="th-sort">
                            Quantity <span className="sort">↑↓</span>
                        </th>
                        <th className="th-sort">
                            Purchase
                            <br />
                            Price <span className="sort">↑↓</span>
                        </th>
                        <th className="th-sort">
                            Current
                            <br />
                            Price <span className="sort">↑↓</span>
                        </th>
                        <th className="th-sort">
                            Profit/Loss <span className="sort">↑↓</span>
                        </th>
                        </tr>
                    </thead>

                    <tbody>
                    {stocks.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="empty-row">
                            No stocks added yet.
                            </td>
                        </tr>
                        ) : (
                        stocks.map((stock) => {
                            const qty = Number(stock.quantity);
                            const buy = Number(stock.purchasePrice);
                            const current = Number(stock.currentPrice);

                            const canCalc =
                            Number.isFinite(qty) && Number.isFinite(buy) && Number.isFinite(current);

                            const pnl = canCalc ? (current - buy) * qty : null;
                            const pnlPct = canCalc && buy !== 0 ? ((current - buy) / buy) * 100 : null;

                            const pnlClass = pnl == null ? '' : pnl >= 0 ? 'pnl-positive' : 'pnl-negative';
                            const badgeLetter = (stock.symbol || '?').slice(0, 1).toUpperCase();
                            const arrow = pnl == null ? '' : pnl >= 0 ? '↗' : '↘';

                            return (
                            <tr key={stock.id}>
                                <td>
                                <div className="symbol-cell">
                                    <span className="symbol-badge" aria-hidden>
                                    {badgeLetter}
                                    </span>
                                    <span className="symbol-text">{stock.symbol}</span>
                                </div>
                                </td>

                                <td>{Number.isFinite(qty) ? qty : '-'}</td>
                                <td>{formatMoney(buy)}</td>
                                <td>{formatMoney(current)}</td>

                                <td className={pnlClass}>
                                {pnl == null ? (
                                    '-'
                                ) : (
                                    <div className="pnl">
                                    <div className="pnl-amount">
                                        <span className="pnl-arrow" aria-hidden>
                                        {arrow}
                                        </span>
                                        {formatMoney(pnl)}
                                    </div>
                                    <div className="pnl-pct">{formatPct(pnlPct)}</div>
                                    </div>
                                )}
                                </td>
                            </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StockList;