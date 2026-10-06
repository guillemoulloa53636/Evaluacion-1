import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('carritoDB') || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    localStorage.setItem('carritoDB', JSON.stringify(items));
  }, [items]);

  function addItem(product, quantity = 1) {
    setItems((current) => {
      const exists = current.some((item) => item.slug === product.slug);
      return exists
        ? current.map((item) => item.slug === product.slug ? { ...item, quantity: (item.quantity || item.cantidad || 0) + quantity } : item)
        : [...current, { slug: product.slug, title: product.title || product.titulo, price: Number(product.price ?? product.precio), quantity }];
    });
  }

  function removeItem(slug) {
    setItems((current) => current.filter((item) => item.slug !== slug));
  }

  function clearCart() {
    setItems([]);
  }

  const count = items.reduce((total, item) => total + Number(item.quantity || item.cantidad || 0), 0);
  const total = items.reduce((sum, item) => sum + Number(item.price ?? item.precio ?? 0) * Number(item.quantity || item.cantidad || 0), 0);

  return <CartContext.Provider value={{ items, count, total, addItem, removeItem, clearCart }}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider');
  return context;
}