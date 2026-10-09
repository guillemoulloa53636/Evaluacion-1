import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from './api.js';

describe('apiRequest', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('envía credenciales, encabezados JSON y opciones del solicitante', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ saved: true })
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('products.php', {
      method: 'POST',
      body: JSON.stringify({ title: 'Ruta' }),
      headers: { 'X-Request-Id': 'test' }
    })).resolves.toEqual({ saved: true });

    expect(fetchMock).toHaveBeenCalledWith('/api/products.php', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify({ title: 'Ruta' }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Request-Id': 'test'
      }
    });
  });

  it('convierte errores HTTP y respuestas sin JSON en errores legibles', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: false, status: 401, json: () => Promise.resolve({ error: 'Sesión requerida.' }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.reject(new Error('JSON inválido')) }));

    await expect(apiRequest('auth.php')).rejects.toThrow('Sesión requerida.');
    await expect(apiRequest('status.php')).resolves.toEqual({});
  });

  it('informa cuando no se puede conectar con la API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(apiRequest('products.php')).rejects.toThrow('No se pudo conectar con XAMPP.');
  });
});
