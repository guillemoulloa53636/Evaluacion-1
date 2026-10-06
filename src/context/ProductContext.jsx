import { createContext, useContext, useEffect, useState } from 'react';
import { initialProducts } from '../data/catalog.js';

const ProductContext = createContext(null);

function normalizeProduct(product) {
  const image = product.image || product.imagen || product.img || 'Buses.png';
  const title = product.title || product.titulo || product.breadcrumb || 'Ruta sin nombre';
  return {
    ...product,
    id: product.id || `PROD-${product.slug || Date.now()}`,
    slug: product.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    title,
    destination: product.destination || product.breadcrumb || title.replace(/^Pasaje\s+/i, '').replace(/^Santiago\s*[-a]\s*/i, ''),
    price: Number(product.price ?? product.precio ?? 0),
    type: product.type || product.tipo || 'Clásico',
    status: product.status || product.estado || 'Activo',
    image,
    description: product.description || product.descripcion || product.desc || '',
    gallery: product.gallery || product.galeria || [image]
  };
}

function readProducts() {
  try {
    const saved = JSON.parse(localStorage.getItem('productosDB') || 'null');
    return Array.isArray(saved) && saved.length ? saved.map(normalizeProduct) : initialProducts;
  } catch {
    return initialProducts;
  }
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(readProducts);

  useEffect(() => {
    localStorage.setItem('productosDB', JSON.stringify(products));
  }, [products]);

  return <ProductContext.Provider value={{ products, setProducts }}>{children}</ProductContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProducts debe usarse dentro de ProductProvider');
  return context;
}