const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');
const USER_KEY = 'viajes.user';
const LEGACY_TOKEN_KEY = 'viajes.jwt';
let accessToken = null;
let refreshPromise = null;
globalThis.localStorage?.removeItem(LEGACY_TOKEN_KEY);

function isAuthenticationRequest(path) {
  const endpoint = path.split('?')[0].replace(/^\/+/, '');
  return ['auth/login', 'auth/register', 'auth/google', 'auth/refresh'].includes(endpoint);
}

function shouldRefresh(path) {
  const endpoint = path.split('?')[0].replace(/^\/+/, '');
  return !['auth/login', 'auth/register', 'auth/google', 'auth/refresh'].includes(endpoint);
}

function saveAuth(result) {
  if (result.token) accessToken = result.token;
  if (result.user) globalThis.localStorage?.setItem(USER_KEY, JSON.stringify(result.user));
}

async function readJson(response) {
  return response.json().catch(() => ({}));
}

async function sendRequest(path, options) {
  const method = (options.method || 'GET').toUpperCase();
  const endpoint = path.replace(/^\/+/, '');
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers
  };
  if (accessToken && !isAuthenticationRequest(endpoint)) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    return await fetch(`${API_BASE_URL}/${endpoint}`, {
      ...options,
      method,
      headers,
      credentials: 'include'
    });
  } catch {
    throw new Error('No se pudo conectar con Spring Boot. Inicia la API y verifica VITE_API_BASE_URL.');
  }
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await sendRequest('auth/refresh', { method: 'POST' });
      const result = await readJson(response);
      if (!response.ok || !result.token || !result.user) {
        clearAuth();
        throw new Error(result.error || 'No se pudo renovar la sesión. Inicia sesión nuevamente.');
      }
      saveAuth(result);
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const endpoint = path.replace(/^\/+/, '');
  let response = await sendRequest(endpoint, options);
  if (response.status === 401 && shouldRefresh(endpoint)) {
    try {
      await refreshAccessToken();
    } catch (refreshError) {
      clearAuth();
      throw refreshError;
    }
    response = await sendRequest(endpoint, options);
  }

  const result = await readJson(response);
  if (!response.ok) {
    if (response.status === 401) clearAuth();
    throw new Error(result.error || `La API respondió con estado ${response.status}.`);
  }
  saveAuth(result);
  if (endpoint === 'auth/logout') clearAuth();
  return result;
}

export function getStoredUser() {
  try {
    const user = globalThis.localStorage?.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  accessToken = null;
  globalThis.localStorage?.removeItem(LEGACY_TOKEN_KEY);
  globalThis.localStorage?.removeItem(USER_KEY);
}