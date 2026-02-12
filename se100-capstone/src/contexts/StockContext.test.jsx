import { render, screen, fireEvent } from '@testing-library/react';
import { StockProvider, StockContext } from './StockContext.jsx';
import { vi } from 'vitest';
import { useContext } from 'react';
import { waitFor } from '@testing-library/react';

function Harness() {
  const ctx = useContext(StockContext);

  return (
    <div>
      <div data-testid="count">{(ctx?.stocks ?? []).length}</div>
      <button
        onClick={() =>
          ctx.addStock({ symbol: 'AAPL', quantity: 1, purchasePrice: 100 })
        }
      >
        Add
      </button>
    </div>
  );
}

describe('StockProvider', () => {
  it('adds a stock when API returns a valid price', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      json: async () => ({
        'Global Quote': { '05. price': '123.45' },
      }),
    })));

    render(
      <StockProvider apiKey="test-key">
        <Harness />
      </StockProvider>
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    fireEvent.click(screen.getByText('Add'));

    // stock added -> count becomes 1
    expect(await screen.findByText('Add')).toBeInTheDocument();
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('does not add when API is rate-limited', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      json: async () => ({ Note: 'rate limit' }),
    })));

    render(
      <StockProvider apiKey="test-key">
        <Harness />
      </StockProvider>
    );

    fireEvent.click(screen.getByText('Add'));
    
    // wait for any state updates/effects to finish
    await waitFor(() => {
        expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });
});