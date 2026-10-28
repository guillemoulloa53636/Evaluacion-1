import { createContext, useContext, useEffect, useState } from 'react';

// Configurable con VITE_API_URL; por defecto usa el mismo host desde el que se abre la app
// (así funciona desde otros dispositivos de la red, no solo en localhost).
const API_BASE = import.meta.env?.VITE_API_URL || `http://${window.location.hostname}:8080`;
const API_URL = `${API_BASE}/api/products`;

const ProductContext = createContext(null);

async function request(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
  return response.status === 204 ? null : response.json();
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await request(API_URL);
        if (active) {
          setProducts(data);
          setError('');
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadProducts();
    return () => { active = false; };
  }, []);

  async function saveProduct(product, originalSlug = null) {
    const saved = await request(originalSlug ? `${API_URL}/${encodeURIComponent(originalSlug)}` : API_URL, {
      method: originalSlug ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    setProducts((current) => originalSlug
      ? current.map((item) => item.slug === originalSlug ? saved : item)
      : [...current, saved]);
    return saved;
  }

  async function deleteProduct(slug) {
    await request(`${API_URL}/${encodeURIComponent(slug)}`, { method: 'DELETE' });
    setProducts((current) => current.filter((product) => product.slug !== slug));
  }

  return <ProductContext.Provider value={{ products, loading, error, saveProduct, deleteProduct }}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts debe usarse dentro de ProductProvider');
  return context;
}