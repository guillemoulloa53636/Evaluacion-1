import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from './api.js';

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    sessionStorage.clear();
  });

  it('envía JSON y opciones del solicitante a la API de Spring Boot', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ saved: true })
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('products', {
      method: 'POST',
      body: JSON.stringify({ title: 'Ruta' }),
      headers: { 'X-Request-Id': 'test' }
    })).resolves.toEqual({ saved: true });

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/products', {
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

    await expect(apiRequest('private')).rejects.toThrow('Sesión requerida.');
    await expect(apiRequest('status')).resolves.toEqual({});
  });

  it('informa cuando no se puede conectar con la API', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    await expect(apiRequest('products')).rejects.toThrow('No se pudo conectar con Spring Boot.');
  });

  it('guarda el JWT al iniciar sesión y lo envía a rutas protegidas', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: 'jwt-de-prueba', user: { role: 'admin' } })
      })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ user: { role: 'admin' } }) });
    vi.stubGlobal('fetch', fetchMock);

    await apiRequest('auth/login', { method: 'POST', body: JSON.stringify({ email: 'admin@example.com' }) });
    await apiRequest('auth/me');

    expect(sessionStorage.getItem('viajes.jwt')).toBe('jwt-de-prueba');
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/v1/auth/me', {
      method: 'GET',
      headers: { Accept: 'application/json', Authorization: 'Bearer jwt-de-prueba' }
    });
  });
});
