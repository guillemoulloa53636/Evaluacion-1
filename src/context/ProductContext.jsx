import { createContext, useContext, useEffect, useState } from 'react';
import { initialProducts } from '../data/catalog.js';
import { apiRequest } from '../lib/api.js';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('products.php')
      .then((data) => {
        if (active) {
          setProducts(data);
          setError('');
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function saveProduct(product, originalSlug = null) {
    const path = originalSlug ? `products.php?slug=${encodeURIComponent(originalSlug)}` : 'products.php';
    const result = await apiRequest(path, {
      method: originalSlug ? 'PUT' : 'POST',
      body: JSON.stringify(product)
    });
    setProducts((current) => originalSlug
      ? current.map((item) => item.slug === originalSlug ? result.product : item)
      : [...current, result.product]);
    return result.product;
  }

  async function deleteProduct(slug) {
    await apiRequest(`products.php?slug=${encodeURIComponent(slug)}`, { method: 'DELETE' });
    setProducts((current) => current.filter((product) => product.slug !== slug));
  }

  return <ProductContext.Provider value={{ products, loading, error, saveProduct, deleteProduct }}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts debe usarse dentro de ProductProvider');
  return context;
}