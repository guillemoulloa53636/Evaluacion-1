import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { formatPrice, imageUrl } from '../data/catalog.js';
import { useProducts } from '../context/ProductContext.jsx';
import { apiRequest } from '../lib/api.js';

const blankProduct = {
  id: '', slug: '', title: '', destination: '', price: '', type: 'Clásico', status: 'Activo',
  image: 'Buses.png', description: '', gallery: [], discount_percent: 0, schedules: []
};

const blankSchedule = { date: '', time: '', platform: '', capacity: 40 };

export default function AdminPage() {
  const { products, saveProduct, deleteProduct, error: databaseError } = useProducts();
  const [users, setUsers] = useState([]);
  const [access, setAccess] = useState('checking');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankProduct);
  const [scheduleDraft, setScheduleDraft] = useState(blankSchedule);
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    let active = true;
    apiRequest('auth.php?action=me')
      .then(({ user }) => {
        if (!active) return;
        if (user?.role !== 'admin') {
          setAccess('denied');
          return;
        }
        setAccess('granted');
        return apiRequest('users.php').then(setUsers);
      })
      .catch(() => { if (active) setAccess('denied'); });
    return () => { active = false; };
  }, []);

  function startNew() {
    setEditing('new');
    const nextId = Math.max(0, ...products.map((product) => Number(String(product.id).replace(/\D/g, '')) || 0)) + 1;
    setForm({ ...blankProduct, id: `PROD-${String(nextId).padStart(2, '0')}` });
    setScheduleDraft(blankSchedule);
    setFormError('');
  }

  function startEdit(product) {
    setEditing(product.slug);
    setForm({
      ...blankProduct,
      ...product,
      price: String(product.price),
      discount_percent: Number(product.discount_percent || 0),
      schedules: Array.isArray(product.schedules) ? product.schedules : []
    });
    setScheduleDraft(blankSchedule);
    setFormError('');
  }

  function addSchedule() {
    if (!scheduleDraft.date || !scheduleDraft.time || !scheduleDraft.platform || Number(scheduleDraft.capacity) < 1) {
      setFormError('Completa fecha, hora, andén y cupos para agregar la salida.');
      return;
    }
    const id = `${scheduleDraft.date}-${scheduleDraft.time}-${Math.random().toString(36).slice(2, 8)}`;
    setForm((current) => ({ ...current, schedules: [...current.schedules, { ...scheduleDraft, id, capacity: Number(scheduleDraft.capacity) }] }));
    setScheduleDraft(blankSchedule);
    setFormError('');
  }

  function removeSchedule(id) {
    setForm((current) => ({ ...current, schedules: current.schedules.filter((schedule) => schedule.id !== id) }));
  }

  async function save(event) {
    event.preventDefault();
    const product = {
      ...form,
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'),
      price: Number(form.price),
      discount_percent: Number(form.discount_percent),
      gallery: form.gallery?.length ? form.gallery : [form.image]
    };
    if (!product.slug || !product.title || !product.destination || !product.price) return;
    setFormError('');
    try {
      await saveProduct(product, editing === 'new' ? null : editing);
      setEditing(null);
      setNotice('Ruta, descuento y salidas guardados en MariaDB.');
    } catch (requestError) {
      setFormError(requestError.message);
    }
  }

  async function remove(slug) {
    try {
      await deleteProduct(slug);
      setNotice('Ruta eliminada de MariaDB.');
    } catch (requestError) {
      setNotice(requestError.message);
    }
  }

  if (access === 'checking') return <div className="admin-content"><p className="muted">Verificando sesión de administrador…</p></div>;
  if (access === 'denied') return <Navigate to="/" replace />;

  return (
    <div className="admin-content">
      <header className="admin-topline">
        <div><span className="eyebrow">VIAJES POR CHILE / ADMIN</span><h1>Panel de administración</h1></div>
        <button className="button button-dark" onClick={startNew}><i className="bi bi-plus-lg" /> Nueva ruta</button>
      </header>
      <div className="admin-stats">
        <article><span>RUTAS</span><strong>{products.length}</strong></article>
        <article><span>DISPONIBLES</span><strong>{products.filter((product) => product.status === 'Activo').length}</strong></article>
        <article><span>CLIENTES</span><strong>{users.length}</strong></article>
      </div>
      {databaseError && <p className="form-error" role="alert">{databaseError}</p>}
      {notice && <p className="form-success" role="status">{notice}</p>}

      {editing && (
        <form className="admin-editor" onSubmit={save}>
          <div className="section-heading">
            <div><span className="eyebrow">CATÁLOGO</span><h2>{editing === 'new' ? 'Crear ruta' : 'Editar ruta'}</h2></div>
            <button type="button" className="icon-button" onClick={() => setEditing(null)} aria-label="Cerrar formulario"><i className="bi bi-x-lg" /></button>
          </div>
          <div className="form-two">
            <label>Identificador<input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} required /></label>
            <label>Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="ejemplo-destino" required /></label>
          </div>
          <div className="form-two">
            <label>Título<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label>
            <label>Destino<input value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} required /></label>
          </div>
          <div className="form-three">
            <label>Precio normal<input type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label>
            <label>Descuento (%)<input aria-label="Descuento (%)" type="number" min="0" max="90" value={form.discount_percent} onChange={(event) => setForm({ ...form, discount_percent: event.target.value })} /></label>
            <label>Servicio<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Clásico</option><option>Semi Cama</option><option>Salón Cama</option><option>Premium</option></select></label>
          </div>
          <div className="form-two">
            <label>Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Activo</option><option>Agotado</option></select></label>
            <label>Imagen (archivo en /Img)<input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} required /></label>
          </div>
          <label>Descripción<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>

          <fieldset className="schedule-editor">
            <legend>Salidas disponibles para reservar</legend>
            {form.schedules.map((schedule) => (
              <div className="schedule-row" key={schedule.id}>
                <span>{schedule.date} · {schedule.time} · Andén {schedule.platform} · {schedule.capacity} cupos</span>
                <button type="button" className="text-button danger-text" onClick={() => removeSchedule(schedule.id)}>Quitar</button>
              </div>
            ))}
            <div className="form-three">
              <label>Fecha<input type="date" min={new Date().toISOString().slice(0, 10)} value={scheduleDraft.date} onChange={(event) => setScheduleDraft({ ...scheduleDraft, date: event.target.value })} /></label>
              <label>Hora<input type="time" value={scheduleDraft.time} onChange={(event) => setScheduleDraft({ ...scheduleDraft, time: event.target.value })} /></label>
              <label>Andén<input value={scheduleDraft.platform} onChange={(event) => setScheduleDraft({ ...scheduleDraft, platform: event.target.value })} /></label>
            </div>
            <div className="form-two">
              <label>Cupos / asientos<input type="number" min="1" max="100" value={scheduleDraft.capacity} onChange={(event) => setScheduleDraft({ ...scheduleDraft, capacity: event.target.value })} /></label>
              <button type="button" className="button button-light add-schedule" onClick={addSchedule}>Agregar salida</button>
            </div>
          </fieldset>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <button className="button button-dark">Guardar ruta</button>
        </form>
      )}

      <section className="admin-table-wrap">
        <div className="section-heading"><div><span className="eyebrow">INVENTARIO</span><h2>Rutas y pasajes</h2></div></div>
        <div className="table-responsive"><table className="table admin-table">
          <thead><tr><th>Destino</th><th>Servicio</th><th>Precio</th><th>Descuento</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>{products.map((product) => (
            <tr key={product.slug}>
              <td><div className="admin-product"><img src={imageUrl(product.image)} alt="" /><span><strong>{product.title}</strong><small>{product.id}</small></span></div></td>
              <td>{product.type}</td><td>{formatPrice(product.price)}</td>
              <td>{Number(product.discount_percent || 0)}%</td>
              <td><span className={`table-status ${product.status === 'Activo' ? '' : 'is-off'}`}>{product.status}</span></td>
              <td><button className="text-button" onClick={() => startEdit(product)}>Editar</button><button className="text-button danger-text" onClick={() => remove(product.slug)}>Eliminar</button></td>
            </tr>
          ))}</tbody>
        </table></div>
      </section>
      <p className="demo-note">Configura el descuento y las salidas para cada ruta. El sistema asignará asientos de acuerdo con los cupos registrados.</p>
    </div>
  );
}
