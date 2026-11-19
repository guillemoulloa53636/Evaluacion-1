import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from '../lib/api.js';
import ListaProductos from './ListaProductos.jsx';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

describe('ListaProductos', () => {
  afterEach(() => vi.clearAllMocks());

  it('carga y muestra los productos desde la API', async () => {
    apiRequest.mockResolvedValue([{ id: 'prod-1', title: 'Ruta al sur', price: 12000 }]);

    render(<ListaProductos />);

    expect(await screen.findByText('Ruta al sur')).toBeInTheDocument();
    expect(screen.getByText('12000')).toBeInTheDocument();
    expect(apiRequest).toHaveBeenCalledWith('productos');
  });
});
