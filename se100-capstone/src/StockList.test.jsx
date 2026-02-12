import { render, screen } from '@testing-library/react';
import StockList from './StockList.jsx';
import { StockContext } from '../contexts/StockContext.jsx';

function renderList(stocks = []) {
  return render(
    <StockContext.Provider value={{ stocks, addStock: async () => true }}>
      <StockList />
    </StockContext.Provider>
  );
}

describe('StockList', () => {
  it('shows empty message when there are no stocks', () => {
    renderList([]);
    expect(screen.getByText('No stocks added yet.')).toBeInTheDocument();
    expect(screen.getByText('0 stocks in your portfolio')).toBeInTheDocument();
  });

  it('renders rows when stocks exist', () => {
    renderList([
      { id: '1', symbol: 'AAPL', quantity: 2, purchasePrice: 100, currentPrice: 110 },
      { id: '2', symbol: 'TSLA', quantity: 1, purchasePrice: 200, currentPrice: 150 },
    ]);

    expect(screen.getByText('2 stocks in your portfolio')).toBeInTheDocument();
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('applies positive/negative pnl classes when calculable', () => {
    const { container } = renderList([
      { id: '1', symbol: 'AAPL', quantity: 2, purchasePrice: 100, currentPrice: 110 }, // positive
      { id: '2', symbol: 'TSLA', quantity: 1, purchasePrice: 200, currentPrice: 150 }, // negative
    ]);

    // There should be at least one cell with each class
    expect(container.querySelector('.pnl-positive')).toBeTruthy();
    expect(container.querySelector('.pnl-negative')).toBeTruthy();
  });
});