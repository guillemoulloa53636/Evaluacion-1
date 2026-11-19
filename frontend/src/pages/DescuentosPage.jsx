import { formatPrice, imageUrl } from '../data/catalog.js';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext.jsx';

export function aplicarDescuento(precio, porcentaje = 15) {
  return Math.round(Number(precio) * (1 - Number(porcentaje) / 100));
}

export default function DescuentosPage() {
  const { products, loading, error } = useProducts();
  const discountedProducts = products.filter((product) => Number(product.discount_percent) > 0);

  return (
    <main className="container page-section">
      <header className="page-heading">
        <span className="eyebrow">OFERTAS / VIAJES POR CHILE</span>
        <h1>Descuentos para tu próximo viaje</h1>
        <p>Revisa las rutas que tienen descuentos activos y reserva tu próximo viaje.</p>
      </header>
      {loading && <p className="muted" role="status">Cargando viajes…</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      {!loading && !error && discountedProducts.length === 0 && <p className="empty-results">No hay viajes con descuento por el momento.</p>}
      {!loading && !error && discountedProducts.length > 0 && (
        <section className="route-grid discount-grid" aria-label="Viajes con descuento">
          {discountedProducts.map((product) => (
            <Link className="route-card discount-card" to={`/viajes/${product.slug}`} key={product.slug} aria-label={`Ver viaje a ${product.destination}`}>
              <img className="route-image" src={imageUrl(product.image)} alt={product.destination} />
              <div className="route-card-body">
                <span className="eyebrow">{product.discount_percent}% DE DESCUENTO</span>
                <h2>{product.title}</h2>
                <div className="discount-prices"><del aria-label="Precio original">{formatPrice(product.price)}</del><strong aria-label="Precio con descuento">{formatPrice(aplicarDescuento(product.price, product.discount_percent))}</strong></div>
                <span className="text-button">Ver viaje <i className="bi bi-arrow-right" /></span>
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
