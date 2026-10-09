import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
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

  it('filtra rutas por tipo de servicio y permite volver a mostrar todos', async () => {
    const user = userEvent.setup();
    render(renderMenuPage());

    await user.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por tipo de servicio' }), 'Premium');

    expect(screen.getByRole('heading', { name: 'Beta' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Alfa' })).not.toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Filtrar por tipo de servicio' }), '');

    expect(screen.getByRole('heading', { name: 'Alfa' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Beta' })).toBeInTheDocument();
  });
});