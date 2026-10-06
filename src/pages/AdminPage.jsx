import { useState } from 'react';
import { formatPrice, imageUrl } from '../data/catalog.js';
import { useProducts } from '../context/ProductContext.jsx';

const blankProduct = { id: '', slug: '', title: '', destination: '', price: '', type: 'Clásico', status: 'Activo', image: 'Buses.png', description: '', gallery: [] };

function readUsers() {
  try { const users = JSON.parse(localStorage.getItem('usuariosDB') || '[]'); return Array.isArray(users) ? users : []; }
  catch { return []; }
}

export default function AdminPage() {
  const { products, setProducts } = useProducts();
  const [users] = useState(readUsers);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(blankProduct);
  const [notice, setNotice] = useState('');

  function startNew() {
    setEditing('new');
    setForm({ ...blankProduct, id: `PROD-${String(products.length + 1).padStart(2, '0')}` });
  }

  function startEdit(product) {
    setEditing(product.slug);
    setForm({ ...product, price: String(product.price) });
  }

  function save(event) {
    event.preventDefault();
    const product = { ...form, slug: form.slug.trim().toLowerCase().replace(/\s+/g, '-'), price: Number(form.price), gallery: form.gallery?.length ? form.gallery : [form.image] };
    if (!product.slug || !product.title || !product.destination || !product.price) return;
    if (editing === 'new') setProducts((current) => [...current, product]);
    else setProducts((current) => current.map((item) => item.slug === editing ? product : item));
    setEditing(null);
    setNotice('Catálogo actualizado en este navegador.');
  }

  function remove(slug) {
    setProducts((current) => current.filter((product) => product.slug !== slug));
    setNotice('Ruta eliminada.');
  }

  return <div className="admin-content"><header className="admin-topline"><div><span className="eyebrow">VIAJES POR CHILE / ADMIN</span><h1>Panel de administración</h1></div><button className="button button-dark" onClick={startNew}><i className="bi bi-plus-lg" /> Nueva ruta</button></header>
    <div className="admin-stats"><article><span>RUTAS</span><strong>{products.length}</strong></article><article><span>DISPONIBLES</span><strong>{products.filter((product) => product.status === 'Activo').length}</strong></article><article><span>CLIENTES</span><strong>{users.length}</strong></article></div>
    {notice && <p className="form-success" role="status">{notice}</p>}
    {editing && <form className="admin-editor" onSubmit={save}><div className="section-heading"><div><span className="eyebrow">CATÁLOGO</span><h2>{editing === 'new' ? 'Crear ruta' : 'Editar ruta'}</h2></div><button type="button" className="icon-button" onClick={() => setEditing(null)} aria-label="Cerrar formulario"><i className="bi bi-x-lg" /></button></div><div className="form-two"><label>Identificador<input value={form.id} onChange={(event) => setForm({ ...form, id: event.target.value })} required /></label><label>Slug<input value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="ejemplo-destino" required /></label></div><div className="form-two"><label>Título<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required /></label><label>Destino<input value={form.destination} onChange={(event) => setForm({ ...form, destination: event.target.value })} required /></label></div><div className="form-three"><label>Precio<input type="number" min="1" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required /></label><label>Servicio<select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}><option>Clásico</option><option>Semi Cama</option><option>Salón Cama</option><option>Premium</option></select></label><label>Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>Activo</option><option>Agotado</option></select></label></div><label>Imagen (archivo en /Img)<input value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })} required /></label><label>Descripción<textarea rows="3" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><button className="button button-dark">Guardar ruta</button></form>}
    <section className="admin-table-wrap"><div className="section-heading"><div><span className="eyebrow">INVENTARIO</span><h2>Rutas y pasajes</h2></div></div><div className="table-responsive"><table className="table admin-table"><thead><tr><th>Destino</th><th>Servicio</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{products.map((product) => <tr key={product.slug}><td><div className="admin-product"><img src={imageUrl(product.image)} alt="" /><span><strong>{product.title}</strong><small>{product.id}</small></span></div></td><td>{product.type}</td><td>{formatPrice(product.price)}</td><td><span className={`table-status ${product.status === 'Activo' ? '' : 'is-off'}`}>{product.status}</span></td><td><button className="text-button" onClick={() => startEdit(product)}>Editar</button><button className="text-button danger-text" onClick={() => remove(product.slug)}>Eliminar</button></td></tr>)}</tbody></table></div></section>
    <section className="admin-table-wrap"><div className="section-heading"><div><span className="eyebrow">CUENTAS LOCALES</span><h2>Clientes registrados</h2></div></div>{users.length ? <div className="table-responsive"><table className="table admin-table"><thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th><th>Comuna</th></tr></thead><tbody>{users.map((user) => <tr key={user.correo}><td>{user.nombre}</td><td>{user.correo}</td><td>{user.telefono || '—'}</td><td>{user.comuna || '—'}</td></tr>)}</tbody></table></div> : <p className="muted">Todavía no hay cuentas registradas en este navegador.</p>}</section>
    <p className="demo-note">Panel de demostración sin control de acceso. Los cambios de catálogo solo se guardan en este navegador.</p>
  </div>;
}