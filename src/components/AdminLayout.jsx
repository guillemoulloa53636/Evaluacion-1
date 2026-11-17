import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { apiRequest, clearAuth } from '../lib/api.js';
import { imageUrl } from '../data/catalog.js';

export default function AdminLayout() {
  const [logoutError, setLogoutError] = useState('');
  const navigate = useNavigate();
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

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <NavLink to="/menu" className="admin-brand"><img src={imageUrl('Buses.png')} alt="" /> Viajes por Chile</NavLink>
      <span className="eyebrow">GESTIÓN</span>
      <NavLink to="/admin" end><i className="bi bi-grid" /> Panel</NavLink>
      <NavLink to="/admin/usuarios"><i className="bi bi-people" /> Usuarios</NavLink>
      <NavLink to="/admin/mensajes"><i className="bi bi-envelope" /> Mensajes</NavLink>
      <NavLink to="/admin/reportes"><i className="bi bi-bar-chart" /> Reportes</NavLink>
      <NavLink to="/admin/perfil"><i className="bi bi-person-gear" /> Mis datos</NavLink>
      <NavLink to="/menu"><i className="bi bi-signpost-2" /> Ver sitio</NavLink>
      {logoutError && <p className="form-error" role="alert">{logoutError}</p>}
      <button type="button" className="admin-logout" onClick={logout}><i className="bi bi-box-arrow-left" /> Cerrar sesión</button>
    </aside>
    <main className="admin-main"><Outlet /></main>
  </div>;
}