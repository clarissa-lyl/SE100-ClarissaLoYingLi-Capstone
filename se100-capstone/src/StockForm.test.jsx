import { render, screen, fireEvent } from '@testing-library/react';
import StockForm from './StockForm.jsx';
import { StockContext } from '../contexts/StockContext.jsx';
import { vi } from 'vitest';

function renderForm({ addStockImpl } = {}) {
  const addStock = addStockImpl ?? vi.fn(async () => true);

  render(
    <StockContext.Provider value={{ stocks: [], addStock }}>
      <StockForm />
    </StockContext.Provider>
  );

  return { addStock };
}

describe('StockForm', () => {
  it('renders default UI elements', () => {
    renderForm();
    expect(screen.getByText('Add a Stock')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., AAPL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('$ 0.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add stock/i })).toBeInTheDocument();
  });

  it('shows error if submit with missing fields', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /add stock/i }));
    expect(await screen.findByText('Please fill up all the fields.')).toBeInTheDocument();
  });

  it('quantity input ignores decimals', () => {
    renderForm();
    const qty = screen.getByPlaceholderText('0');

    fireEvent.change(qty, { target: { value: '12' } });
    expect(qty).toHaveValue('12');

    // decimal should be ignored by your handler (value remains '12')
    fireEvent.change(qty, { target: { value: '12.5' } });
    expect(qty).toHaveValue('12');
  });

  it('purchase price input allows up to 2 decimals only', () => {
    renderForm();
    const price = screen.getByPlaceholderText('$ 0.00');

    fireEvent.change(price, { target: { value: '10.12' } });
    expect(price).toHaveValue('10.12');

    // should reject 3 decimals and keep previous value
    fireEvent.change(price, { target: { value: '10.123' } });
    expect(price).toHaveValue('10.12');
  });

  it('shows error when addStock returns false (invalid symbol / API issue)', async () => {
    const { addStock } = renderForm({ addStockImpl: vi.fn(async () => false) });

    fireEvent.change(screen.getByPlaceholderText('e.g., AAPL'), { target: { value: 'abcd' } });
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('$ 0.00'), { target: { value: '12.34' } });

    fireEvent.click(screen.getByRole('button', { name: /add stock/i }));

    expect(addStock).toHaveBeenCalled();
    expect(
      await screen.findByText('Invalid stock symbol or API temporarily unavailable (rate limit)')
    ).toBeInTheDocument();
  });

  it('resets inputs on successful submit', async () => {
    const { addStock } = renderForm({ addStockImpl: vi.fn(async () => true) });

    const symbol = screen.getByPlaceholderText('e.g., AAPL');
    const qty = screen.getByPlaceholderText('0');
    const price = screen.getByPlaceholderText('$ 0.00');

    fireEvent.change(symbol, { target: { value: 'aapl' } }); // should uppercase in state
    fireEvent.change(qty, { target: { value: '2' } });
    fireEvent.change(price, { target: { value: '100.00' } });

    fireEvent.click(screen.getByRole('button', { name: /add stock/i }));

    // Wait for submit to complete and state reset
    await screen.findByText(/add stocks to your portfolio/i);

    expect(addStock).toHaveBeenCalledWith({
      symbol: 'AAPL',
      quantity: 2,
      purchasePrice: 100,
    });

    expect(symbol).toHaveValue('');
    expect(qty).toHaveValue('');
    expect(price).toHaveValue('');
  });
});