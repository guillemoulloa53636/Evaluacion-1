import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
    await user.click(screen.getByRole('checkbox', { name: 'Reservar este viaje' }));
    await user.selectOptions(screen.getByLabelText('Cantidad de pasajes'), '2');
    fireEvent.change(screen.getAllByLabelText('Nombre completo')[0], { target: { value: 'Ana Pérez' } });
    fireEvent.change(screen.getAllByLabelText('RUT')[0], { target: { value: '12345678-9' } });
    fireEvent.change(screen.getAllByLabelText('Nombre completo')[1], { target: { value: 'Luis Soto' } });
    fireEvent.change(screen.getAllByLabelText('RUT')[1], { target: { value: '98765432-1' } });
    expect(screen.getAllByLabelText('RUT').every((field) => field.checkValidity())).toBe(true);
    await user.click(screen.getByRole('button', { name: /Añadir al carrito/ }));

    expect(addItem).toHaveBeenCalledWith(expect.objectContaining({
      slug: 'valparaiso',
      price: 8500,
      originalPrice: 10000,
      discountPercent: 15,
      scheduleId: 'departure-1',
      scheduleDate: '2099-04-20',
      departureTime: '09:30',
      platform: '4',
      passengers: [
        { name: 'Ana Pérez', rut: '12345678-9' },
        { name: 'Luis Soto', rut: '98765432-1' }
      ]
    }), 2);
  });

  it('explica cuándo no hay salidas publicadas para reservar', async () => {
    useProducts.mockReturnValue({ products: [{
      slug: 'valparaiso',
      title: 'Santiago - Valparaíso',
      destination: 'Valparaíso',
      price: 10000,
      status: 'Activo',
      schedules: []
    }] });
    useCart.mockReturnValue({ addItem: vi.fn() });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/viajes/valparaiso']}>
        <Routes><Route path="/viajes/:slug" element={<TripDetailPage />} /></Routes>
      </MemoryRouter>
    );

    await user.click(screen.getByRole('checkbox', { name: 'Reservar este viaje' }));
    expect(screen.getByRole('status')).toHaveTextContent('El administrador debe agregar una salida antes de reservar.');
    expect(screen.queryByRole('button', { name: /Añadir al carrito/ })).not.toBeInTheDocument();
  });
});
