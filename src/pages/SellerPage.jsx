import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, clearAuth } from '../lib/api.js';
import ListaProductos from '../components/ListaProductos.jsx';

function itemLabel(item) {
  return item.sale_code || item.orderCode || item.name || item.nombre || item.title || item.id || 'Orden';
}

export default function SellerPage() {
  const [orders, setOrders] = useState([]);
  const [ordersError, setOrdersError] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [logoutError, setLogoutError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    apiRequest('ordenes')
      .then((result) => {
        if (active) setOrders(Array.isArray(result) ? result : []);
      })
      .catch((requestError) => {
        if (active) setOrdersError(requestError.message);
      })
      .finally(() => {
        if (active) setLoadingOrders(false);
      });
    return () => { active = false; };
  }, []);

  async function logout() {
    setLogoutError('');
    try {
      await apiRequest('auth/logout', { method: 'POST' });
      clearAuth();
      navigate('/');
    } catch (requestError) {
      setLogoutError(requestError.message);
    }
  }

  return (
    <main className="role-dashboard container">
      <header className="admin-topline">
        <div><span className="eyebrow">VIAJES POR CHILE / VENDEDOR</span><h1>Panel de vendedor</h1></div>
        <button type="button" className="button button-dark" onClick={logout}>Cerrar sesión</button>
      </header>
      {logoutError && <p className="form-error" role="alert">{logoutError}</p>}
      <div className="role-dashboard-grid">
        <section className="role-data-card">
          <h2>Productos</h2>
          <ListaProductos />
        </section>
        <section className="role-data-card">
          <h2>Órdenes</h2>
          {loadingOrders ? <p className="muted">Cargando órdenes…</p>
            : ordersError ? <p className="form-error" role="alert">{ordersError}</p>
              : orders.length ? <ul className="role-data-list">{orders.map((order, index) => (
                <li key={order.id || order.sale_code || order.codigo || index}>
                  <strong>{itemLabel(order)}</strong>
                  {order.total_amount != null && <span>{order.total_amount}</span>}
                </li>
              ))}</ul> : <p className="muted">No hay órdenes para mostrar.</p>}
        </section>
      </div>
      <p className="demo-note">Este panel consulta GET /productos y GET /ordenes. El backend actual aún no expone esas rutas ni el rol vendedor.</p>
    </main>
  );
}
