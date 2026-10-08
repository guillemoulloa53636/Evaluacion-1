import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SiteLayout from './SiteLayout.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';

vi.mock('../context/CartContext.jsx', () => ({ useCart: vi.fn() }));
vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));

const firstItems = [
  { slug: 'alfa', title: 'Pasaje a Alfa', price: 10000, quantity: 1 },
  { slug: 'beta', title: 'Pasaje a Beta', price: 15000, quantity: 2 }
];

const updatedItems = [
  { slug: 'gamma', title: 'Pasaje a Gamma', price: 20000, quantity: 1 }
];

function renderSiteLayout() {
  return <MemoryRouter><SiteLayout /></MemoryRouter>;
}

describe('SiteLayout', () => {
  beforeEach(() => {
    useCart.mockReturnValue({
      items: firstItems,
      count: 3,
      total: 40000,
      removeItem: vi.fn(),
      clearCart: vi.fn()
    });
    useProducts.mockReturnValue({ error: '' });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('muestra todos los artículos del carrito y refleja los cambios al rerenderizar', () => {
    const view = render(renderSiteLayout());
    fireEvent.click(screen.getByRole('button', { name: /Abrir carrito/ }));

    const getCartLines = () => document.querySelectorAll('.cart-line');
    expect(getCartLines()).toHaveLength(firstItems.length);
    firstItems.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeTruthy();
    });

    useCart.mockReturnValue({
      items: updatedItems,
      count: 1,
      total: 20000,
      removeItem: vi.fn(),
      clearCart: vi.fn()
    });
    view.rerender(renderSiteLayout());

    expect(getCartLines()).toHaveLength(updatedItems.length);
    updatedItems.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeTruthy();
    });
    firstItems.forEach(({ title }) => {
      expect(screen.queryByText(title)).toBeNull();
    });
    expect(within(screen.getByRole('dialog')).getByRole('heading', { name: /Carrito/ })).toBeTruthy();
  });
});