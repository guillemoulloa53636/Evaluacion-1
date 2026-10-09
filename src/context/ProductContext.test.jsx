import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ProductProvider, useProducts } from './ProductContext.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

const wrapper = ({ children }) => <ProductProvider>{children}</ProductProvider>;

describe('ProductContext', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('carga los productos desde la API y finaliza el estado de carga', async () => {
    apiRequest.mockResolvedValue([{ slug: 'valparaiso', title: 'Santiago - Valparaíso' }]);

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.products).toEqual([{ slug: 'valparaiso', title: 'Santiago - Valparaíso' }]);
    expect(result.current.error).toBe('');
  });

  it('permite crear y editar una ruta reflejando la respuesta de la API', async () => {
    apiRequest
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce({ product: { slug: 'talca', title: 'Santiago - Talca' } })
      .mockResolvedValueOnce({ product: { slug: 'talca', title: 'Santiago - Talca actualizado' } });
    const { result } = renderHook(() => useProducts(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => result.current.saveProduct({ title: 'Santiago - Talca' }));
    expect(result.current.products).toEqual([{ slug: 'talca', title: 'Santiago - Talca' }]);
    await act(() => result.current.saveProduct({ title: 'Santiago - Talca actualizado' }, 'talca'));

    expect(apiRequest).toHaveBeenNthCalledWith(2, 'products.php', expect.objectContaining({ method: 'POST' }));
    expect(apiRequest).toHaveBeenNthCalledWith(3, 'products.php?slug=talca', expect.objectContaining({ method: 'PUT' }));
    expect(result.current.products[0].title).toBe('Santiago - Talca actualizado');
  });

  it('elimina una ruta y expone los errores de carga sin ocultarlos', async () => {
    apiRequest
      .mockResolvedValueOnce([{ slug: 'talca' }, { slug: 'arica' }])
      .mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useProducts(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(() => result.current.deleteProduct('talca'));
    expect(result.current.products).toEqual([{ slug: 'arica' }]);
    expect(apiRequest).toHaveBeenLastCalledWith('products.php?slug=talca', { method: 'DELETE' });

    cleanup();
    apiRequest.mockRejectedValueOnce(new Error('API no disponible'));
    const failedLoad = renderHook(() => useProducts(), { wrapper });
    await waitFor(() => expect(failedLoad.result.current.loading).toBe(false));
    expect(failedLoad.result.current.error).toBe('API no disponible');
  });

  it('requiere que el hook se use dentro de ProductProvider', () => {
    expect(() => renderHook(() => useProducts())).toThrow('useProducts debe usarse dentro de ProductProvider');
  });
});
