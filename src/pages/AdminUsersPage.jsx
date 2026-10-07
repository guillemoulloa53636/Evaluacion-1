import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiRequest } from '../lib/api.js';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [access, setAccess] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const { user } = await apiRequest('auth.php?action=me');
        if (!active) return;
        if (user?.role !== 'admin') {
          setAccess('denied');
          return;
        }
        setAccess('granted');
        const buyerUsers = await apiRequest('users.php');
        if (active) setUsers(buyerUsers);
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUsers();
    return () => { active = false; };
  }, []);

  if (access === 'checking') {
    if (error) return <div className="admin-content"><p className="form-error" role="alert">{error}</p></div>;
    return <div className="admin-content"><p className="muted">Verificando sesión de administrador…</p></div>;
  }
  if (access === 'denied') return <Navigate to="/" replace />;

  return <div className="admin-content">
    <header className="admin-topline">
      <div><span className="eyebrow">GESTIÓN / USUARIOS</span><h1>Usuarios compradores</h1></div>
    </header>
    <section className="admin-table-wrap">
      <div className="section-heading"><div><span className="eyebrow">CUENTAS COMPRADORAS</span><h2>Compradores registrados</h2></div></div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <p className="muted">Cargando compradores…</p> : users.length ? <div className="table-responsive"><table className="table admin-table">
        <thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Región</th><th>Comuna</th><th>Fecha de registro</th></tr></thead>
        <tbody>{users.map((user) => <tr key={user.id}>
          <td>{user.name}</td><td>{user.email}</td><td>{user.telephone || '—'}</td><td>{user.region || '—'}</td><td>{user.commune || '—'}</td>
          <td>{new Date(user.created_at).toLocaleDateString('es-CL')}</td>
        </tr>)}</tbody>
      </table></div> : !error && <p className="muted">Todavía no hay usuarios compradores registrados.</p>}
    </section>
  </div>;
}
