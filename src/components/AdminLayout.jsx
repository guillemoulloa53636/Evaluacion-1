import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <NavLink to="/menu" className="admin-brand"><img src="/Img/Buses.png" alt="" /> Viajes por Chile</NavLink>
      <span className="eyebrow">GESTIÓN</span>
      <NavLink to="/admin" end><i className="bi bi-grid" /> Panel</NavLink>
      <NavLink to="/menu"><i className="bi bi-signpost-2" /> Ver sitio</NavLink>
      <NavLink to="/" className="admin-logout"><i className="bi bi-box-arrow-left" /> Volver a cuenta</NavLink>
    </aside>
    <main className="admin-main"><Outlet /></main>
  </div>;
}