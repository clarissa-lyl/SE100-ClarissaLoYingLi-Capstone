import './App.css';
import { useContext, useMemo } from 'react';
import StockForm from './StockForm.jsx';
import StockList from './StockList.jsx';
import { StockContext } from './contexts/StockContext.jsx';

/* ================================
   Utility Format Functions
================================ */
function money(n) {
  if (!Number.isFinite(n)) return '$0.00';
  return n.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD'
  });
}

function pct(n) {
  if (!Number.isFinite(n)) return '0.00%';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

/* ================================
   Portfolio Calculation Functions
================================ */

// Calculate total invested
function calculateTotalInvested(stocks) {
  return stocks.reduce((sum, s) => {
    const qty = Number(s.quantity);
    const buy = Number(s.purchasePrice);

    if (!Number.isFinite(qty) || !Number.isFinite(buy)) return sum;

    return sum + qty * buy;
  }, 0);
}

// Calculate total current value
function calculateTotalValue(stocks) {
  return stocks.reduce((sum, s) => {
    const qty = Number(s.quantity);
    const current = Number(s.currentPrice);

    if (!Number.isFinite(qty) || !Number.isFinite(current)) return sum;

    return sum + qty * current;
  }, 0);
}

// Calculate portfolio profit/loss
function calculatePortfolioProfitLoss(totalValue, totalInvested) {
  const profitLoss = totalValue - totalInvested; // Profit/Loss formula

  const performance =
    totalInvested > 0
      ? (profitLoss / totalInvested) * 100
      : 0;

  return { profitLoss, performance };
}

/* ================================
   Reusable Stat Card Component
================================ */

function StatCard({ title, value, subtitle, variant, icon }) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-top">
        <div className="stat-title">{title}</div>
        <div className="stat-icon" aria-hidden>
          {icon}
        </div>
      </div>

      <div className="stat-value">{value}</div>
      <div className="stat-subtitle">{subtitle}</div>
    </div>
  );
}

/* ================================
   Main App Component (Parent)
================================ */

function App() {
  const ctx = useContext(StockContext);

  const stocks = ctx?.stocks ?? [];
  const addStock = ctx?.addStock;

  // Use abstracted calculation functions
  const metrics = useMemo(() => {
    const totalInvested = calculateTotalInvested(stocks);
    const totalValue = calculateTotalValue(stocks);

    const { profitLoss, performance } =
      calculatePortfolioProfitLoss(totalValue, totalInvested);

    return { totalValue, totalInvested, profitLoss, performance };
  }, [stocks]);

  const plIsPositive = metrics.profitLoss >= 0;
  const perfIsPositive = metrics.performance >= 0;

  return (
    <div className="app-shell">

      {/* Header */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Finance Dashboard</h1>
        <p className="dashboard-subtitle">
          Track your stock portfolio performance
        </p>
      </header>

      {/* KPI Cards */}
      <section className="stats-grid">
        <StatCard
          title="Total Value"
          value={money(metrics.totalValue)}
          subtitle="Current portfolio value"
          variant="blue"
          icon="$"
        />

        <StatCard
          title="Total Invested"
          value={money(metrics.totalInvested)}
          subtitle="Initial investment"
          variant="purple"
          icon="◷"
        />

        <StatCard
          title="Profit/Loss"
          value={money(metrics.profitLoss)}
          subtitle="Total gains/losses"
          variant="red"
          icon={plIsPositive ? '↗' : '↘'}
        />

        <StatCard
          title="Performance"
          value={pct(metrics.performance)}
          subtitle="Return on investment"
          variant="orange"
          icon={perfIsPositive ? '↗' : '↘'}
        />
      </section>

      {/* Main Layout */}
      <main className="dashboard-grid">
        <section className="card">
          {/* Parent passes function via props */}
          <StockForm onAddStock={addStock} />
        </section>

        <section className="card">
          {/* Parent passes data via props */}
          <StockList stocks={stocks} />
        </section>
      </main>

      <div className="footer-divider" />

      <footer className="app-footer-note">
        Powered by Alpha Vantage (Free Tier)
      </footer>
    </div>
  );
}

export default App;