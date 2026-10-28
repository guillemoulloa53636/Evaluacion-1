import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiRequest } from '../lib/api.js';

export const MESSAGE_STATUSES = {
  no_leido: 'No leído',
  leido: 'Leído',
  aplicado: 'Aplicado',
  archivado: 'Archivado',
  eliminado: 'Eliminado'
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('');
  const [access, setAccess] = useState('checking');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const { user } = await apiRequest('auth.php?action=me');
        if (!active) return;
        if (user?.role !== 'admin') {
          setAccess('denied');
          return;
        }
        setAccess('granted');
        setLoading(true);
        const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
        const data = await apiRequest(`contact.php${query}`);
        if (active) {
          setMessages(data);
          setError('');
        }
      } catch (requestError) {
        if (active) setError(requestError.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, [filter]);

  async function update(id, changes) {
    try {
      const { message } = await apiRequest(`contact.php?id=${id}`, { method: 'PUT', body: JSON.stringify(changes) });
      setMessages((current) => current
        .map((item) => (item.id === id ? message : item))
        .filter((item) => (filter ? item.status === filter : item.status !== 'eliminado')));
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function remove(id, permanent = false) {
    if (permanent && !window.confirm('¿Eliminar definitivamente este mensaje? No se puede deshacer.')) return;
    try {
      await apiRequest(`contact.php?id=${id}${permanent ? '&permanent=1' : ''}`, { method: 'DELETE' });
      setMessages((current) => current.filter((item) => item.id !== id));
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (access === 'checking') {
    if (error) return <div className="admin-content"><p className="form-error" role="alert">{error}</p></div>;
    return <div className="admin-content"><p className="muted">Verificando sesión de administrador…</p></div>;
  }
  if (access === 'denied') return <Navigate to="/" replace />;

  const unread = messages.filter((item) => item.status === 'no_leido').length;

  return <div className="admin-content">
    <header className="admin-topline">
      <div><span className="eyebrow">GESTIÓN / MENSAJES</span><h1>Mensajes de contacto</h1></div>
    </header>
    <section className="admin-table-wrap">
      <div className="section-heading">
        <div><span className="eyebrow">{unread} SIN LEER</span><h2>Bandeja de entrada</h2></div>
        <label>Estado
          <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filtrar por estado">
            <option value="">Todos (sin eliminados)</option>
            {Object.entries(MESSAGE_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {loading ? <p className="muted">Cargando mensajes…</p> : messages.length ? <div className="table-responsive"><table className="table admin-table">
        <thead><tr><th>Fecha</th><th>Nombre</th><th>Correo</th><th>Mensaje</th><th>Estado</th><th>Notas</th><th>Acciones</th></tr></thead>
        <tbody>{messages.map((item) => <tr key={item.id} style={item.status === 'no_leido' ? { fontWeight: 600 } : undefined}>
          <td>{new Date(item.created_at).toLocaleString('es-CL')}</td>
          <td>{item.name}</td>
          <td><a href={`mailto:${item.email}`}>{item.email}</a></td>
          <td style={{ whiteSpace: 'pre-wrap', maxWidth: 320 }}>{item.message}</td>
          <td>
            <select value={item.status} onChange={(event) => update(item.id, { status: event.target.value })} aria-label={`Estado del mensaje de ${item.name}`}>
              {Object.entries(MESSAGE_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </td>
          <td>
            <textarea defaultValue={item.admin_notes || ''} rows="2" aria-label={`Notas para ${item.name}`}
              onBlur={(event) => event.target.value !== (item.admin_notes || '') && update(item.id, { admin_notes: event.target.value })} />
          </td>
          <td>
            {item.status !== 'eliminado' && <button type="button" onClick={() => remove(item.id)}>Eliminar</button>}
            {item.status === 'eliminado' && <button type="button" onClick={() => remove(item.id, true)}>Borrar definitivo</button>}
          </td>
        </tr>)}</tbody>
      </table></div> : !error && <p className="muted">No hay mensajes en esta vista.</p>}
    </section>
  </div>;
}
