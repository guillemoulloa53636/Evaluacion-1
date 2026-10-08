import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
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
});