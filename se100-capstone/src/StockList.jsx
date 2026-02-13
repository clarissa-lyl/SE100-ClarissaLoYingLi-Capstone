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

// Profit/Loss calculation function for a single stock
function calculateProfitLoss(qty, buy, current) {
  const q = Number(qty);
  const b = Number(buy);
  const c = Number(current);

  const canCalc = Number.isFinite(q) && Number.isFinite(b) && Number.isFinite(c);
  if (!canCalc) {
    return { pnl: null, pnlPct: null, pnlClass: "", arrow: "" };
  }

  const pnl = (c - b) * q;
  const pnlPct = b !== 0 ? ((c - b) / b) * 100 : null;

  const pnlClass = pnl >= 0 ? "pnl-positive" : "pnl-negative";
  const arrow = pnl >= 0 ? "↗" : "↘";

  return { pnl, pnlPct, pnlClass, arrow };
}

function StockList() {
  const ctx = useContext(StockContext);
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
              <th>Symbol</th>
              <th>Quantity</th>
              <th>
                Purchase
                <br />
                Price
              </th>
              <th>
                Current
                <br />
                Price
              </th>
              <th>Profit/Loss</th>
            </tr>
          </thead>

          <tbody>
            {stocks.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-row">
                  No stocks added yet.
                </td>
              </tr>
            ) : (
              stocks.map((stock) => {
                const qty = stock.quantity;
                const buy = stock.purchasePrice;
                const current = stock.currentPrice;

                // Use the dedicated function for Profit/Loss calculation
                const { pnl, pnlPct, pnlClass, arrow } = calculateProfitLoss(qty, buy, current);

                const badgeLetter = (stock.symbol || '?').slice(0, 1).toUpperCase();

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

                    <td>{Number.isFinite(Number(qty)) ? Number(qty) : '-'}</td>
                    <td>{formatMoney(Number(buy))}</td>
                    <td>{formatMoney(Number(current))}</td>

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