import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminUsersPage from './AdminUsersPage.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

const users = [
  { id: 1, name: 'Ana Pérez', email: 'ana@example.com', telephone: '912345678', region: 'Metropolitana', commune: 'Santiago', created_at: '2025-01-10' },
  { id: 2, name: 'Luis Soto', email: 'luis@example.com', telephone: '987654321', region: 'Valparaíso', commune: 'Viña del Mar', created_at: '2025-02-20' },
  { id: 3, name: 'Camila Díaz', email: 'camila@example.com', telephone: '', region: '', commune: '', created_at: '2025-03-30' }
];

describe('AdminUsersPage', () => {
  beforeEach(() => {
    apiRequest.mockImplementation((path) => path === 'auth.php?action=me'
      ? Promise.resolve({ user: { role: 'admin' } })
      : Promise.resolve(users));
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('renderiza todas las cuentas recibidas desde la API', async () => {
    render(<MemoryRouter><AdminUsersPage /></MemoryRouter>);
    await screen.findByRole('heading', { name: 'Usuarios compradores' });

    const tableBody = document.querySelector('.admin-table tbody');
    expect(within(tableBody).getAllByRole('row')).toHaveLength(users.length);
    users.forEach(({ name, email }) => {
      expect(within(tableBody).getByText(name)).toBeTruthy();
      expect(within(tableBody).getByText(email)).toBeTruthy();
    });
  });
});
