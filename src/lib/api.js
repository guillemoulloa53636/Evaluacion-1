export async function apiRequest(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api/${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers
      }
    });
  } catch {
    throw new Error('No se pudo conectar con XAMPP. Inicia Apache y MySQL desde el panel de control.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `La API respondió con estado ${response.status}.`);
  }
  return result;
}