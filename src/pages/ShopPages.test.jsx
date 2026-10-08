import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { MenuPage } from './ShopPages.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';

vi.mock('../context/CartContext.jsx', () => ({ useCart: vi.fn() }));
vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));

const firstProducts = [
  { slug: 'alfa', title: 'Santiago - Alfa', destination: 'Alfa', price: 10000, type: 'Clásico', image: 'alfa.jpg' },
  { slug: 'beta', title: 'Santiago - Beta', destination: 'Beta', price: 15000, type: 'Premium', image: 'beta.jpg' }
];

const updatedProducts = [
  { slug: 'gamma', title: 'Santiago - Gamma', destination: 'Gamma', price: 20000, type: 'Semi Cama', image: 'gamma.jpg' }
];

function renderMenuPage() {
  return <MemoryRouter><MenuPage /></MemoryRouter>;
}

describe('MenuPage', () => {
  beforeEach(() => {
    useProducts.mockReturnValue({ products: firstProducts });
    useCart.mockReturnValue({ addItem: vi.fn() });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('renderiza todos los productos y actualiza la lista al rerenderizar', () => {
    const view = render(renderMenuPage());

    expect(document.querySelectorAll('.route-card')).toHaveLength(firstProducts.length);
    firstProducts.forEach(({ destination }) => {
      expect(screen.getByRole('heading', { name: destination })).toBeTruthy();
    });

    useProducts.mockReturnValue({ products: updatedProducts });
    view.rerender(renderMenuPage());

    expect(document.querySelectorAll('.route-card')).toHaveLength(updatedProducts.length);
    updatedProducts.forEach(({ destination }) => {
      expect(screen.getByRole('heading', { name: destination })).toBeTruthy();
    });
    firstProducts.forEach(({ destination }) => {
      expect(screen.queryByRole('heading', { name: destination })).toBeNull();
    });
  });
});