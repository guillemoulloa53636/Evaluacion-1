import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { apiRequest } from '../lib/api.js';
import { imageUrl } from '../data/catalog.js';

export default function AdminLayout() {
  const navigate = useNavigate();
  async function logout() {
    await apiRequest('auth.php?action=logout', { method: 'POST' }).catch(() => {});
    navigate('/');
  }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <NavLink to="/menu" className="admin-brand"><img src={imageUrl('Buses.png')} alt="" /> Viajes por Chile</NavLink>
      <span className="eyebrow">GESTIÓN</span>
      <NavLink to="/admin" end><i className="bi bi-grid" /> Panel</NavLink>
      <NavLink to="/admin/usuarios"><i className="bi bi-people" /> Usuarios</NavLink>
      <NavLink to="/menu"><i className="bi bi-signpost-2" /> Ver sitio</NavLink>
      <button type="button" className="admin-logout" onClick={logout}><i className="bi bi-box-arrow-left" /> Cerrar sesión</button>
    </aside>
    <main className="admin-main"><Outlet /></main>
  </div>;
}