import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import RoleRoute from './RoleRoute.jsx';

describe('RoleRoute', () => {
  afterEach(() => localStorage.clear());

  it('permite acceder a la ruta cuando el rol coincide', () => {
    localStorage.setItem('viajes.user', JSON.stringify({ role: 'seller' }));

    render(
      <MemoryRouter initialEntries={['/vendedor']}>
        <Routes>
          <Route element={<RoleRoute allowedRoles={['seller']} />}>
            <Route path="/vendedor" element={<p>Panel vendedor</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Panel vendedor')).toBeInTheDocument();
  });

  it('redirige si el rol no tiene acceso a la ruta', () => {
    localStorage.setItem('viajes.user', JSON.stringify({ role: 'customer' }));

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<p>Administración</p>} />
          </Route>
          <Route path="/menu" element={<p>Tienda</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Tienda')).toBeInTheDocument();
  });
});
