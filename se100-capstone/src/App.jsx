import './App.css';
import StockForm from './StockForm.jsx';
import StockList from './StockList.jsx';

function App() {
  return (
    <div className="app-shell">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Finance Dashboard</h1>
        <p className="dashboard-subtitle">Manage your stock portfolio</p>
      </header>

      <main className="dashboard-grid">
        <section className="card">
          <StockForm />
        </section>

        <section className="card">
          <StockList />
        </section>
      </main>
      
      <footer className="app-footer-note">
        Powered by Alpha Vantage (Free Tier)
      </footer>
    </div>
  );
}

export default App;