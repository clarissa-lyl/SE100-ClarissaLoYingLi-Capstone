import { render, screen } from '@testing-library/react';
import StockList from './StockList.jsx';
import { StockContext } from '../contexts/StockContext.jsx';

function renderWithStocks(stocks = []) {
  return render(
    <StockContext.Provider value={{ stocks }}>
      <StockList />
    </StockContext.Provider>
  );
}

describe('StockList', () => {
  it('shows empty message when there are no stocks', () => {
    renderWithStocks([]);
    expect(screen.getByText('No stocks added yet.')).toBeInTheDocument();
    expect(screen.getByText('0 stocks in your portfolio')).toBeInTheDocument();
  });

  it('renders rows when stocks exist and shows correct portfolio count', () => {
    renderWithStocks([
      { id: '1', symbol: 'AAPL', quantity: 2, purchasePrice: 100, currentPrice: 110 },
      { id: '2', symbol: 'TSLA', quantity: 1, purchasePrice: 200, currentPrice: 150 },
    ]);

    expect(screen.getByText('2 stocks in your portfolio')).toBeInTheDocument();

    // Symbol text appears in the cell
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('TSLA')).toBeInTheDocument();
  });

  it('applies positive/negative pnl classes when calculable', () => {
    const { container } = renderWithStocks([
      { id: '1', symbol: 'AAPL', quantity: 2, purchasePrice: 100, currentPrice: 110 }, // +20
      { id: '2', symbol: 'TSLA', quantity: 1, purchasePrice: 200, currentPrice: 150 }, // -50
    ]);

    expect(container.querySelector('.pnl-positive')).toBeTruthy();
    expect(container.querySelector('.pnl-negative')).toBeTruthy();
  });
});