import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useProducts } from '../context/ProductContext.jsx';
import { calculateTrip, cities, formatPrice, imageUrl } from '../data/catalog.js';

function ProductCard({ product }) {
  return <article className="route-card">
    <Link to={`/viajes/${product.slug}`} className="route-image"><img src={imageUrl(product.image)} alt={product.destination} loading="lazy" /><span className="route-type">{product.type}</span></Link>
    <div className="route-card-body"><div><span className="eyebrow">DESTINO</span><h3>{product.destination}</h3></div><div className="route-card-bottom"><span>desde <strong>{formatPrice(product.price)}</strong></span><Link className="round-arrow" to={`/viajes/${product.slug}`} aria-label={`Ver viaje a ${product.destination}`}><i className="bi bi-arrow-up-right" /></Link></div></div>
  </article>;
}

export function MenuPage() {
  const { products } = useProducts();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [quote, setQuote] = useState(null);
  const [query, setQuery] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const serviceTypes = useMemo(() => [...new Set(products.map((product) => product.type).filter(Boolean))].sort((left, right) => left.localeCompare(right, 'es')), [products]);
  const matchingProducts = useMemo(() => products.filter((product) => (
    `${product.title} ${product.destination}`.toLowerCase().includes(query.toLowerCase())
    && (!serviceType || product.type === serviceType)
  )), [products, query, serviceType]);

  function submitTrip(event) {
    event.preventDefault();
    const trip = calculateTrip(origin, destination);
    if (!trip) {
      setQuote(null);
      setError('Elige dos ciudades diferentes para calcular el viaje.');
      return;
    }
    setError('');
    setQuote(trip);
  }
  const reservableProduct = origin === 'santiago'
    ? products.find((product) => product.slug === destination)
    : null;

  return <>
    <section className="hero container">
      <div className="hero-copy"><span className="eyebrow">CHILE TE ESPERA</span><h1>El camino también es parte del destino.</h1><p>Encuentra tu próxima ruta, compara opciones y viaja a tu ritmo.</p><Link className="button button-light" to="#rutas">Ver destinos <i className="bi bi-arrow-down-right" /></Link></div>
      <div className="hero-art" aria-hidden="true"><img src={imageUrl('Aero.jpg')} alt="" /></div>
      <span className="hero-index">01 / 12</span>
    </section>

    <section className="trip-search container" aria-labelledby="search-title">
      <div className="section-kicker"><span>PLANIFICA TU VIAJE</span><h2 id="search-title">¿A dónde vamos?</h2></div>
      <form className="search-form" onSubmit={submitTrip}>
        <label>Origen<select value={origin} onChange={(event) => setOrigin(event.target.value)} required><option value="">Selecciona ciudad</option>{Object.entries(cities).map(([slug, city]) => <option key={slug} value={slug}>{city.name}</option>)}</select></label>
        <label>Destino<select value={destination} onChange={(event) => setDestination(event.target.value)} required><option value="">Selecciona ciudad</option>{Object.entries(cities).map(([slug, city]) => <option key={slug} value={slug}>{city.name}</option>)}</select></label>
        <label>Fecha de ida<input type="date" value={date} onChange={(event) => setDate(event.target.value)} min={new Date().toISOString().slice(0, 10)} /></label>
        <button className="button button-dark" type="submit">Calcular precio <i className="bi bi-arrow-right" /></button>
      </form>
      {error && <p className="form-error" role="alert">{error}</p>}
      {quote && <div className="quote-result"><div><span className="eyebrow">TU RUTA {date && `· ${date}`}</span><h3>{quote.from.name} <i className="bi bi-arrow-right" /> {quote.to.name}</h3><p>{quote.distance.toLocaleString('es-CL')} km aprox.</p></div><strong>{formatPrice(quote.price)}</strong>{reservableProduct ? <Link className="button button-accent" to={`/viajes/${reservableProduct.slug}`}>Elegir salida y reservar</Link> : <button className="button button-accent" onClick={() => navigate('/menu#rutas')}>Ver rutas disponibles</button>}</div>}
    </section>

    <section className="destinations container" id="rutas">
      <div className="section-heading"><div><span className="eyebrow">RUTAS SELECCIONADAS</span><h2>Tu próximo lugar</h2></div><div className="route-controls"><label className="route-filter"><i className="bi bi-search" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar destino" aria-label="Buscar destino" /></label><label className="route-category">Categoría<select value={serviceType} onChange={(event) => setServiceType(event.target.value)} aria-label="Filtrar por tipo de servicio"><option value="">Todos los servicios</option>{serviceTypes.map((type) => <option key={type} value={type}>{type}</option>)}</select></label></div></div>
      {matchingProducts.length ? <div className="route-grid">{matchingProducts.map((product) => <ProductCard product={product} key={product.slug} />)}</div> : <div className="empty-results">No encontramos rutas{serviceType ? ` del servicio ${serviceType}` : ''}{query ? ` con “${query}”` : ''}.</div>}
      <div className="text-center mt-4"><button className="text-button" onClick={() => navigate('/blog')}>Ideas para el viaje <i className="bi bi-arrow-up-right" /></button></div>
    </section>
  </>;
}

export function TripDetailPage() {
  const { slug } = useParams();
  const { products } = useProducts();
  const { addItem } = useCart();
  const [image, setImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [scheduleId, setScheduleId] = useState('');
  const [added, setAdded] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [passengers, setPassengers] = useState([{ name: '', rut: '' }]);
  const product = products.find((item) => item.slug === slug);

  if (!product) return <section className="container page-section"><h1>Ruta no encontrada</h1><Link to="/menu">Volver a destinos</Link></section>;

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const schedules = (product.schedules || []).filter((item) => item.date >= todayString);
  const departureDates = [...new Set(schedules.map((item) => item.date))];
  const selectedDate = schedules.find((item) => item.id === scheduleId)?.date || departureDates[0] || '';
  const dateSchedules = schedules.filter((item) => item.date === selectedDate);
  const schedule = dateSchedules.find((item) => item.id === scheduleId) || dateSchedules[0];
  const discountPercent = Number(product.discount_percent || 0);
  const discountedPrice = Math.round(Number(product.price) * (100 - discountPercent) / 100);
  const currentImage = gallery.includes(image) ? image : product.image;
  const related = products.filter((item) => item.slug !== product.slug).slice(0, 4);

  function changeQuantity(value) {
    setQuantity(value);
    setPassengers((current) => Array.from({ length: value }, (_, index) => current[index] || { name: '', rut: '' }));
    setAdded(false);
  }

  function updatePassenger(index, field, value) {
    setPassengers((current) => current.map((passenger, position) => position === index
      ? { ...passenger, [field]: value }
      : passenger));
  }

  function addBooking(event) {
    event.preventDefault();
    if (!schedule || product.status !== 'Activo') return;
    addItem({
      ...product,
      price: discountedPrice,
      originalPrice: product.price,
      discountPercent,
      scheduleId: schedule.id,
      scheduleDate: schedule.date,
      departureTime: schedule.time,
      platform: schedule.platform,
      passengers
    }, quantity);
    setAdded(true);
  }

  return <section className="container detail-page">
    <div className="breadcrumb-line"><Link to="/menu">Rutas</Link><i className="bi bi-chevron-right" /><span>{product.destination}</span></div>
    <div className="detail-grid">
      <div><div className="detail-image"><img src={imageUrl(currentImage)} alt={`Paisaje de ${product.destination}`} /></div><div className="detail-thumbs">{gallery.map((photo) => <button key={photo} className={currentImage === photo ? 'is-active' : ''} onClick={() => setImage(photo)} aria-label="Ver otra imagen"><img src={imageUrl(photo)} alt="" /></button>)}</div></div>
      <div className="detail-copy"><span className="eyebrow">VIAJE INTERURBANO · {product.type}</span><h1>{product.title}</h1><p>{product.description}</p><div className="availability"><span className={product.status === 'Activo' ? 'status-dot' : 'status-dot is-unavailable'} />{product.status === 'Activo' ? 'Disponible para reservar' : 'Agotado'}</div>{discountPercent > 0 ? <><del className="detail-original-price">{formatPrice(product.price)}</del><div className="detail-price">{formatPrice(discountedPrice)} <small>/ pasaje · {discountPercent}% de descuento</small></div></> : <div className="detail-price">{formatPrice(product.price)} <small>/ pasaje</small></div>}
        <label className="booking-toggle"><input type="checkbox" checked={bookingOpen} onChange={(event) => setBookingOpen(event.target.checked)} /> Reservar este viaje</label>
        {bookingOpen && <form className="booking-form" onSubmit={addBooking}>
          {schedules.length ? <>
            <label>Fecha de viaje<select value={selectedDate} onChange={(event) => { const nextSchedule = schedules.find((item) => item.date === event.target.value); setScheduleId(nextSchedule?.id || ''); setAdded(false); }} required>{departureDates.map((date) => <option key={date} value={date}>{date}</option>)}</select></label>
            <label>Horario disponible<select value={schedule?.id || ''} onChange={(event) => { setScheduleId(event.target.value); setAdded(false); }} required>{dateSchedules.map((item) => <option key={item.id} value={item.id}>{item.time} · Andén {item.platform} · {item.capacity} cupos</option>)}</select></label>
            <label>Cantidad de pasajes<select value={quantity} onChange={(event) => changeQuantity(Number(event.target.value))}>{[1, 2, 3, 4].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            {passengers.map((passenger, index) => <fieldset className="booking-passenger" key={index}>
              <legend>Pasajero {index + 1}</legend>
              <label>Nombre completo<input autoComplete="name" value={passenger.name} onChange={(event) => updatePassenger(index, 'name', event.target.value)} maxLength="150" required /></label>
              <label>RUT<input value={passenger.rut} onChange={(event) => updatePassenger(index, 'rut', event.target.value)} placeholder="12345678-9" pattern="(?:[0-9.kK]|-){8,12}" title="Ingresa un RUT chileno válido" required /></label>
            </fieldset>)}
            <button disabled={product.status !== 'Activo' || !schedule} className="button button-dark detail-add">{added ? 'Añadido al carrito' : 'Añadir al carrito'} <i className="bi bi-bag-plus" /></button>
            {added && <p className="form-success" role="status">Pasajes añadidos al carrito con sus datos de viaje.</p>}
          </> : <p className="form-error" role="status">Esta ruta no tiene horarios publicados. El administrador debe agregar una salida antes de reservar.</p>}
        </form>}
      </div>
    </div>
    <div className="related-section"><div className="section-heading"><div><span className="eyebrow">SIGUE EXPLORANDO</span><h2>Otras rutas</h2></div><Link className="text-button" to="/menu">Ver todas</Link></div><div className="route-grid related-grid">{related.map((item) => <ProductCard product={item} key={item.slug} />)}</div></div>
  </section>;
}

const ShopPages = { MenuPage, TripDetailPage };
export default ShopPages;