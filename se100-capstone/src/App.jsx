import './App.css';
import { useContext, useMemo } from 'react';
import StockForm from './StockForm.jsx';
import StockList from './StockList.jsx';
import { StockContext } from './contexts/StockContext.jsx';

function money(n) {
  if (!Number.isFinite(n)) return '$0.00';
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function pct(n) {
  if (!Number.isFinite(n)) return '0.00%';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}

function StatCard({ title, value, subtitle, variant, icon }) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-top">
        <div className="stat-title">{title}</div>
        <div className="stat-icon" aria-hidden>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-subtitle">{subtitle}</div>
    </div>
  );
}

function App() {
  const ctx = useContext(StockContext);
  const stocks = ctx?.stocks ?? [];

  const metrics = useMemo(() => {
    const totalValue = stocks.reduce(
      (sum, s) => sum + (Number(s.currentPrice) * Number(s.quantity) || 0),
      0
    );
    const totalInvested = stocks.reduce(
      (sum, s) => sum + (Number(s.purchasePrice) * Number(s.quantity) || 0),
      0
    );
    const profitLoss = totalValue - totalInvested;
    const performance = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

    return { totalValue, totalInvested, profitLoss, performance };
  }, [stocks]);

  const plIsPositive = metrics.profitLoss >= 0;
  const perfIsPositive = metrics.performance >= 0;

  return (
    <div className="app-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Finance Dashboard</h1>
        <p className="dashboard-subtitle">Track your stock portfolio performance</p>
      </header>

      {/* KPI cards */}
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
          variant='red'
          icon={plIsPositive ? '↗' : '↘'}
        />
        <StatCard
          title="Performance"
          value={pct(metrics.performance)}
          subtitle="Return on investment"
          variant='orange'
          icon={perfIsPositive ? '↗' : '↘'}
        />
      </section>

      {/* Main cards */}
      <main className="dashboard-grid">
        <section className="card">
          <StockForm />
        </section>

        <section className="card">
          <StockList />
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