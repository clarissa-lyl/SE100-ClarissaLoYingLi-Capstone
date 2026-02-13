import { render, screen, fireEvent } from '@testing-library/react';
import StockForm from './StockForm.jsx';
import { vi } from 'vitest';

describe('StockForm', () => {
  it('renders default UI elements', () => {
    render(<StockForm onAddStock={vi.fn()} />);

    expect(screen.getByText('Add a Stock')).toBeInTheDocument();
    expect(screen.getByText('Add stocks to your portfolio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., AAPL')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('$ 0.00')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add stock/i })).toBeInTheDocument();
  });

  it('shows error if submit with missing fields', async () => {
    render(<StockForm onAddStock={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /add stock/i }));
    expect(await screen.findByText('Please fill up all the fields.')).toBeInTheDocument();
  });

  it('shows error if quantity or price is 0 or negative', async () => {
    render(<StockForm onAddStock={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('e.g., AAPL'), { target: { value: 'AAPL' } });
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '0' } });
    fireEvent.change(screen.getByPlaceholderText('$ 0.00'), { target: { value: '10.00' } });

    fireEvent.click(screen.getByRole('button', { name: /add stock/i }));

    expect(
      await screen.findByText('Quantity and Price must be greater than zero.')
    ).toBeInTheDocument();
  });

  it('quantity input ignores decimals (whole numbers only)', () => {
    render(<StockForm onAddStock={vi.fn()} />);

    const qty = screen.getByPlaceholderText('0');

    fireEvent.change(qty, { target: { value: '12' } });
    expect(qty).toHaveValue('12');

    // should reject decimals and keep previous value
    fireEvent.change(qty, { target: { value: '12.5' } });
    expect(qty).toHaveValue('12');
  });

  it('purchase price input allows up to 2 decimals only', () => {
    render(<StockForm onAddStock={vi.fn()} />);

    const price = screen.getByPlaceholderText('$ 0.00');

    fireEvent.change(price, { target: { value: '10.12' } });
    expect(price).toHaveValue('10.12');

    // reject 3 decimals, keep previous value
    fireEvent.change(price, { target: { value: '10.123' } });
    expect(price).toHaveValue('10.12');
  });

  it('shows error when onAddStock returns false (invalid symbol / API issue)', async () => {
    const onAddStock = vi.fn(async () => false);
    render(<StockForm onAddStock={onAddStock} />);

    fireEvent.change(screen.getByPlaceholderText('e.g., AAPL'), { target: { value: 'abcd' } });
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('$ 0.00'), { target: { value: '12.34' } });

    fireEvent.click(screen.getByRole('button', { name: /add stock/i }));

    await waitFor(() => expect(onAddStock).toHaveBeenCalledTimes(1));

    expect(onAddStock).toHaveBeenCalledWith({
      symbol: 'ABCD',
      quantity: 10,
      purchasePrice: 12.34,
    });

    expect(
      await screen.findByText('Invalid stock symbol or API temporarily unavailable (rate limit)')
    ).toBeInTheDocument();
  });

  it('resets inputs on successful submit', async () => {
    const onAddStock = vi.fn(async () => true);
    render(<StockForm onAddStock={onAddStock} />);

    const symbol = screen.getByPlaceholderText('e.g., AAPL');
    const qty = screen.getByPlaceholderText('0');
    const price = screen.getByPlaceholderText('$ 0.00');

    fireEvent.change(symbol, { target: { value: 'aapl' } });
    fireEvent.change(qty, { target: { value: '2' } });
    fireEvent.change(price, { target: { value: '100.00' } });

    fireEvent.click(screen.getByRole('button', { name: /add stock/i }));

    await waitFor(() => expect(onAddStock).toHaveBeenCalledTimes(1));

    await waitFor(() => {
      expect(symbol).toHaveValue('');
      expect(qty).toHaveValue('');
      expect(price).toHaveValue('');
    });
  });
});