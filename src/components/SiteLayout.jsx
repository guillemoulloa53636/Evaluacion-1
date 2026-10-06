import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { formatPrice, imageUrl } from '../data/catalog.js';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';

const links = [
  ['/menu', 'Rutas'], ['/blog', 'Blog'], ['/nosotros', 'Nosotros'], ['/servicio', 'Ayuda']
];

export default function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { items, count, total, removeItem, clearCart } = useCart();
  const { error: databaseError } = useProducts();

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <NavLink className="brand" to="/menu" aria-label="Viajes por Chile, inicio">
            <img src={imageUrl('Buses.png')} alt="" />
            <span>VIAJES <b>POR CHILE</b></span>
          </NavLink>
          <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir navegación" aria-expanded={menuOpen}>
            <i className={`bi ${menuOpen ? 'bi-x-lg' : 'bi-list'}`} />
          </button>
          <nav className={`site-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
            {links.map(([to, label]) => <NavLink key={to} to={to} onClick={() => setMenuOpen(false)}>{label}</NavLink>)}
            <NavLink className="nav-account" to="/">Mi cuenta</NavLink>
            <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Abrir carrito, ${count} pasajes`}>
              <i className="bi bi-bag" /> <span>Carrito</span><b>{count}</b>
            </button>
          </nav>
        </div>
      </header>

      <main className="site-main">
        {databaseError && <div className="container database-alert" role="status"><i className="bi bi-database-exclamation" /> Base de datos desconectada: {databaseError}</div>}
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner"><span>Viajes por Chile</span><span>Recorre más, planifica mejor.</span><NavLink to="/servicio">Contacto</NavLink></div>
      </footer>

      {cartOpen && <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}>
        <section className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
          <div className="drawer-heading"><div><span className="eyebrow">TU VIAJE</span><h2 id="cart-title">Carrito <small>{count}</small></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Cerrar carrito"><i className="bi bi-x-lg" /></button></div>
          {items.length ? <>
            <div className="cart-lines">{items.map((item) => <article className="cart-line" key={item.slug}>
              <div><strong>{item.title || item.titulo}</strong><span>{item.quantity || item.cantidad} pasaje(s) · {formatPrice(item.price ?? item.precio)}</span></div>
              <button className="text-button" onClick={() => removeItem(item.slug)}>Quitar</button>
            </article>)}</div>
            <div className="cart-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
            <button className="button button-dark w-100" onClick={clearCart}>Vaciar carrito</button>
          </> : <div className="empty-state"><i className="bi bi-bag" /><p>Tu próximo destino empieza aquí.</p><NavLink to="/menu" className="button button-dark" onClick={() => setCartOpen(false)}>Explorar rutas</NavLink></div>}
        </section>
      </div>}
    </div>
  );
}