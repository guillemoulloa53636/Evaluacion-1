const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');
const TOKEN_KEY = 'viajes.jwt';

function isPublicRequest(path, method) {
  const endpoint = path.split('?')[0].replace(/^\/+/, '');
  if (['auth/login', 'auth/register', 'auth/google'].includes(endpoint)) return true;
  if (method === 'GET' && (endpoint === 'products' || endpoint.startsWith('products/') || endpoint.startsWith('purchases/'))) return true;
  return method === 'POST' && ['contact-messages', 'purchases'].includes(endpoint);
}

export async function apiRequest(path, options = {}) {
  let response;
  const method = (options.method || 'GET').toUpperCase();
  const endpoint = path.replace(/^\/+/, '');
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers
  };
  const token = globalThis.sessionStorage?.getItem(TOKEN_KEY);
  if (token && !isPublicRequest(endpoint, method)) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (endpoint === 'auth/logout') globalThis.sessionStorage?.removeItem(TOKEN_KEY);

  try {
    response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      method,
      headers
    });
  } catch {
    throw new Error('No se pudo conectar con Spring Boot. Inicia la API y verifica VITE_API_BASE_URL.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) globalThis.sessionStorage?.removeItem(TOKEN_KEY);
    throw new Error(result.error || `La API respondió con estado ${response.status}.`);
  }
  if (result.token) globalThis.sessionStorage?.setItem(TOKEN_KEY, result.token);
  return result;
}