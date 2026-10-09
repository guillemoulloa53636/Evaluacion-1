import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TripDetailPage } from './ShopPages.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';

vi.mock('../context/CartContext.jsx', () => ({ useCart: vi.fn() }));
vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));

describe('TripDetailPage con descuento', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('muestra el precio rebajado y conserva el descuento al agregar al carrito', async () => {
    const addItem = vi.fn();
    const product = {
      id: 'PROD-02',
      slug: 'valparaiso',
      title: 'Santiago - Valparaíso',
      destination: 'Valparaíso',
      price: 10000,
      discount_percent: 15,
      type: 'Clásico',
      status: 'Activo',
      image: 'Valpo.webp',
      description: 'Ruta a Valparaíso',
      gallery: ['Valpo.webp'],
      schedules: [{ id: 'departure-1', date: '2099-04-20', time: '09:30', platform: '4', capacity: 20 }]
    };
    useProducts.mockReturnValue({ products: [product] });
    useCart.mockReturnValue({ addItem });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/viajes/valparaiso']}>
        <Routes><Route path="/viajes/:slug" element={<TripDetailPage />} /></Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('$8.500')).toBeInTheDocument();
    expect(screen.getByText(/15\s*%\s*de descuento/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Añadir al carrito/ }));

    expect(addItem).toHaveBeenCalledWith(expect.objectContaining({
      slug: 'valparaiso',
      price: 8500,
      originalPrice: 10000,
      discountPercent: 15,
      scheduleId: 'departure-1',
      scheduleDate: '2099-04-20',
      departureTime: '09:30',
      platform: '4'
    }), 1);
  });
});
