import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DescuentosPage, { aplicarDescuento } from './DescuentosPage.jsx';
import { ProductProvider } from '../context/ProductContext.jsx';

const products = [
  { slug: 'valparaiso', title: 'Santiago - Valparaíso', destination: 'Valparaíso', price: 10000, discount_percent: 15, image: 'Valpo.webp' },
  { slug: 'puertomontt', title: 'Santiago - Puerto Montt', destination: 'Puerto Montt', price: 35000, discount_percent: 15, image: 'Mont.jpg' }
];

describe('aplicarDescuento', () => {
  it('aplica el 15% predeterminado y redondea el precio', () => {
    expect(aplicarDescuento(10000)).toBe(8500);
    expect(aplicarDescuento(99)).toBe(84);
  });

  it('permite indicar un porcentaje distinto', () => {
    expect(aplicarDescuento(10000, 20)).toBe(8000);
  });
});

describe('DescuentosPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => products
    }));
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('consulta la API y muestra precios originales y rebajados', async () => {
    render(<MemoryRouter><ProductProvider><DescuentosPage /></ProductProvider></MemoryRouter>);

    expect(await screen.findByRole('heading', { name: 'Santiago - Valparaíso' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Santiago - Puerto Montt' })).toBeInTheDocument();
    expect(screen.getAllByLabelText('Precio original').map((price) => price.textContent)).toEqual(['$10.000', '$35.000']);
    expect(screen.getAllByLabelText('Precio con descuento').map((price) => price.textContent)).toEqual(['$8.500', '$29.750']);
    expect(screen.getByRole('link', { name: 'Ver viaje a Valparaíso' })).toHaveAttribute('href', '/viajes/valparaiso');
    expect(fetch).toHaveBeenCalledWith('/api/products.php', expect.objectContaining({
      credentials: 'include'
    }));
  });
});
