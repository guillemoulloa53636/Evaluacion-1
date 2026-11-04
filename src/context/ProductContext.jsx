import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';


const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await apiRequest('products.php');
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
    const { product: saved } = await apiRequest(originalSlug ? `products.php?slug=${encodeURIComponent(originalSlug)}` : 'products.php', {
      method: originalSlug ? 'PUT' : 'POST',
      body: JSON.stringify(product)
    });
    setProducts((current) => originalSlug
      ? current.map((item) => item.slug === originalSlug ? saved : item)
      : [...current, saved]);
    return saved;
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
