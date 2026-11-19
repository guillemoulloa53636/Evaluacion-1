import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../lib/api.js';

const money = (value) => `$${Number(value || 0).toLocaleString('es-CL')}`;

export default function PurchaseHistory({ title = 'Historial de compras' }) {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('purchases/mine')
      .then((result) => { if (active) setOrders(Array.isArray(result) ? result : []); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, []);

  return <section className="form-panel purchase-history" aria-label={title}>
    <h2>{title}</h2>
    {error ? <p className="form-error" role="alert">{error}</p>
      : orders === null ? <p className="muted">Cargando historial…</p>
        : orders.length ? <div className="table-responsive"><table className="table admin-table">
          <thead><tr><th>Código</th><th>Fecha</th><th>Boletos</th><th>Total</th><th>Estado</th></tr></thead>
          <tbody>{orders.map((order) => <tr key={order.sale_code}>
            <td><Link to={`/boletos/${order.sale_code}`}>{order.sale_code.slice(0, 8)}</Link></td>
            <td>{order.created_at ? new Date(order.created_at).toLocaleDateString('es-CL') : '-'}</td>
            <td>{order.ticket_count}</td>
            <td>{money(order.total_amount)}</td>
            <td>{order.status}</td>
          </tr>)}</tbody>
        </table></div> : <p className="muted">Aún no tienes compras registradas con esta cuenta.</p>}
  </section>;
}
