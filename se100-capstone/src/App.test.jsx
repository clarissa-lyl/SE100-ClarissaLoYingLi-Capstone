import { render, screen } from '@testing-library/react';
import App from './App.jsx';
import { StockContext } from './contexts/StockContext.jsx';

function renderWithStocks(stocks = []) {
  return render(
    <StockContext.Provider value={{ stocks, addStock: async () => true }}>
      <App />
    </StockContext.Provider>
  );
}

describe('App', () => {
  it('renders the dashboard header', () => {
    renderWithStocks([]);
    expect(screen.getByText('Finance Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Track your stock portfolio performance')).toBeInTheDocument();
  });

  it('renders KPI titles (note: Profit/Loss appears twice on the page)', () => {
    renderWithStocks([]);
    expect(screen.getByText('Total Value')).toBeInTheDocument();
    expect(screen.getByText('Total Invested')).toBeInTheDocument();

    // Profit/Loss appears in KPI card AND in StockList table header
    expect(screen.getAllByText('Profit/Loss').length).toBeGreaterThan(0);

    expect(screen.getByText('Performance')).toBeInTheDocument();
  });

  it('renders footer note', () => {
    renderWithStocks([]);
    expect(screen.getByText('Powered by Alpha Vantage (Free Tier)')).toBeInTheDocument();
  });
});