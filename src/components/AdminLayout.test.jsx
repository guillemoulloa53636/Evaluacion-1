import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminLayout from './AdminLayout.jsx';

describe('AdminLayout', () => {
  afterEach(cleanup);

  it('conserva todos los enlaces de navegación al rerenderizar', () => {
    const view = render(<MemoryRouter><AdminLayout /></MemoryRouter>);

    ['Panel', 'Usuarios', 'Ver sitio'].forEach((label) => {
      expect(screen.getByRole('link', { name: new RegExp(label) })).toBeTruthy();
    });

    view.rerender(<MemoryRouter><AdminLayout /></MemoryRouter>);

    ['Panel', 'Usuarios', 'Ver sitio'].forEach((label) => {
      expect(screen.getByRole('link', { name: new RegExp(label) })).toBeTruthy();
    });
  });
});