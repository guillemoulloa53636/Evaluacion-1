import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';

function itemLabel(item) {
  return item.title || item.nombre || item.name || item.id || 'Producto';
}

export default function ListaProductos() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest('productos')
      .then((result) => {
        if (active) setProducts(Array.isArray(result) ? result : []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  if (loading) return <p className="muted">Cargando productos…</p>;
  if (error) return <p className="form-error" role="alert">{error}</p>;

  return products.length ? (
    <ul className="role-data-list">
      {products.map((product, index) => (
        <li key={product.id || product.slug || index}>
          <strong>{itemLabel(product)}</strong>
          {product.price != null && <span>{product.price}</span>}
        </li>
      ))}
    </ul>
  ) : <p className="muted">No hay productos para mostrar.</p>;
}
