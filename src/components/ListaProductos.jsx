import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api.js';

function itemLabel(item) {
  return item.title || item.nombre || item.name || item.id || 'Producto';
}

export default function ListaProductos() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

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
          <button type="button" className="button" onClick={() => setSelected(selected === product ? null : product)}>
            {selected === product ? 'Ocultar detalle' : 'Ver detalle'}
          </button>
          {selected === product && <dl className="role-detail">
            {product.destination && <><dt>Destino</dt><dd>{product.destination}</dd></>}
            {product.type && <><dt>Tipo</dt><dd>{product.type}</dd></>}
            {product.status && <><dt>Estado</dt><dd>{product.status}</dd></>}
            {product.discountPercent != null && <><dt>Descuento</dt><dd>{product.discountPercent}%</dd></>}
            {product.description && <><dt>Descripción</dt><dd>{product.description}</dd></>}
          </dl>}
        </li>
      ))}
    </ul>
  ) : <p className="muted">No hay productos para mostrar.</p>;
}
