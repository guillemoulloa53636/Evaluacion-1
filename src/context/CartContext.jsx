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
    const cartKey = product.scheduleId ? `${product.slug}:${product.scheduleId}` : product.slug;
    setItems((current) => {
      const exists = current.some((item) => (item.cartKey || item.slug) === cartKey);
      return exists
        ? current.map((item) => (item.cartKey || item.slug) === cartKey ? { ...item, quantity: (item.quantity || item.cantidad || 0) + quantity } : item)
        : [...current, {
          cartKey,
          slug: product.slug,
          title: product.title || product.titulo,
          price: Number(product.price ?? product.precio),
          originalPrice: Number(product.originalPrice ?? product.price ?? product.precio),
          discountPercent: Number(product.discountPercent ?? product.discount_percent ?? 0),
          scheduleId: product.scheduleId || '',
          scheduleDate: product.scheduleDate || '',
          departureTime: product.departureTime || '',
          platform: product.platform || '',
          quantity
        }];
    });
  }

  function removeItem(cartKey) {
    setItems((current) => current.filter((item) => (item.cartKey || item.slug) !== cartKey));
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