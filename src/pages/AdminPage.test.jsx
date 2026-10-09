import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../context/ProductContext.jsx', () => ({ useProducts: vi.fn() }));
vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

const firstProducts = [
  { id: 'PROD-01', slug: 'alfa', title: 'Santiago - Alfa', destination: 'Alfa', price: 10000, type: 'Clásico', status: 'Activo', image: 'alfa.jpg' },
  { id: 'PROD-02', slug: 'beta', title: 'Santiago - Beta', destination: 'Beta', price: 15000, type: 'Premium', status: 'Agotado', image: 'beta.jpg' }
];

const updatedProducts = [
  { id: 'PROD-03', slug: 'gamma', title: 'Santiago - Gamma', destination: 'Gamma', price: 20000, type: 'Semi Cama', status: 'Activo', image: 'gamma.jpg' }
];

function renderAdminPage() {
  return <MemoryRouter><AdminPage /></MemoryRouter>;
}

describe('AdminPage', () => {
  beforeEach(() => {
    useProducts.mockReturnValue({
      products: firstProducts,
      saveProduct: vi.fn(),
      deleteProduct: vi.fn(),
      error: ''
    });
    apiRequest.mockImplementation((path) => path === 'auth.php?action=me'
      ? Promise.resolve({ user: { role: 'admin' } })
      : Promise.resolve([]));
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('renderiza todas las rutas del inventario y refleja los datos nuevos al rerenderizar', async () => {
    const view = render(renderAdminPage());
    await screen.findByRole('heading', { name: 'Panel de administración' });

    const getRows = () => within(document.querySelector('.admin-table tbody')).getAllByRole('row');
    await waitFor(() => expect(getRows()).toHaveLength(firstProducts.length));
    firstProducts.forEach(({ title }) => {
      expect(within(document.querySelector('.admin-table tbody')).getByText(title)).toBeTruthy();
    });

    useProducts.mockReturnValue({
      products: updatedProducts,
      saveProduct: vi.fn(),
      deleteProduct: vi.fn(),
      error: ''
    });
    view.rerender(renderAdminPage());

    expect(getRows()).toHaveLength(updatedProducts.length);
    updatedProducts.forEach(({ title }) => {
      expect(within(document.querySelector('.admin-table tbody')).getByText(title)).toBeTruthy();
    });
    firstProducts.forEach(({ title }) => {
      expect(within(document.querySelector('.admin-table tbody')).queryByText(title)).toBeNull();
    });
  });

  it('permite configurar porcentaje de descuento y salidas al editar una ruta', async () => {
      const saveProduct = vi.fn().mockResolvedValue({});
      useProducts.mockReturnValue({
        products: [{ ...firstProducts[0], discount_percent: 15, schedules: [] }],
        saveProduct,
        deleteProduct: vi.fn(),
        error: ''
      });
      const user = userEvent.setup();
      render(renderAdminPage());
      await screen.findByRole('heading', { name: 'Panel de administración' });
      await user.click(screen.getByRole('button', { name: 'Editar' }));

      expect(screen.getByLabelText('Descuento (%)')).toHaveValue(15);
      await user.clear(screen.getByLabelText('Descuento (%)'));
      await user.type(screen.getByLabelText('Descuento (%)'), '20');
      fireEvent.change(screen.getByLabelText('Fecha'), { target: { value: '2099-04-20' } });
      fireEvent.change(screen.getByLabelText('Hora'), { target: { value: '09:30' } });
      await user.type(screen.getByLabelText('Andén'), '4');
      await user.click(screen.getByRole('button', { name: 'Agregar salida' }));
      await user.click(screen.getByRole('button', { name: 'Guardar ruta' }));

      await waitFor(() => expect(saveProduct).toHaveBeenCalledWith(expect.objectContaining({
        discount_percent: 20,
        schedules: [expect.objectContaining({
          date: '2099-04-20',
          time: '09:30',
          platform: '4',
          capacity: 40
        })]
      }), 'alfa'));
  });
});