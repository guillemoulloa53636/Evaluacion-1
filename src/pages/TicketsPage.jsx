import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatPrice, imageUrl } from '../data/catalog.js';
import { apiRequest } from '../lib/api.js';

function ticketHtml(sale) {
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
  const tickets = sale.tickets.map((ticket) => `
    <article class="ticket">
      <header><img src="${escapeHtml(new URL(imageUrl('Buses.png'), window.location.href).href)}" alt="Viajes por Chile"><div><strong>VIAJES POR CHILE</strong><span>BOLETO DE BUS</span></div></header>
      <h1>${escapeHtml(ticket.trip_title)}</h1><p>Destino: <strong>${escapeHtml(ticket.destination)}</strong></p>
      <section><div><span>Pasajero</span><strong>${escapeHtml(ticket.passenger_name)}</strong></div><div><span>RUT</span><strong>${escapeHtml(ticket.passenger_rut)}</strong></div></section>
      <section><div><span>Fecha de viaje</span><strong>${escapeHtml(ticket.schedule_date)}</strong></div><div><span>Hora</span><strong>${escapeHtml(ticket.departure_time)}</strong></div></section>
      <section><div><span>Andén</span><strong>${escapeHtml(ticket.platform)}</strong></div><div><span>Asiento</span><strong>${escapeHtml(ticket.seat_number)}</strong></div></section>
      <section><div><span>Boleto</span><strong>${escapeHtml(ticket.ticket_code)}</strong></div><div><span>Precio pagado</span><strong>${escapeHtml(formatPrice(ticket.price_paid))}</strong></div></section>
      <p class="discount">${Number(ticket.discount_percent) > 0 ? `${escapeHtml(ticket.discount_percent)}% de descuento aplicado · Precio normal ${escapeHtml(formatPrice(ticket.original_price))}` : 'Tarifa normal'}</p>
    </article>`).join('');
  return `<!doctype html><html lang="es"><meta charset="utf-8"><title>Boletos Viajes por Chile</title><style>
    body{font:15px Arial,sans-serif;color:#17343b;background:#f5f7f4;margin:24px}.ticket{max-width:680px;margin:0 auto 24px;padding:28px;background:#fff;border:2px dashed #496064;page-break-inside:avoid}.ticket header{display:flex;align-items:center;gap:14px;border-bottom:2px solid #dbe3df;padding-bottom:14px}.ticket header img{width:70px;height:60px;object-fit:contain}.ticket header div,.ticket section div{display:grid;gap:6px}.ticket header span,.ticket section span{font-size:12px;color:#496064}.ticket h1{font-size:24px}.ticket section{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0}.discount{border-top:1px solid #dbe3df;padding-top:14px;color:#ad4528}@media print{body{background:white;margin:0}.ticket{margin:0 auto 18px}}
  </style><body>${tickets}</body></html>`;
}

export default function TicketsPage() {
  const { saleCode } = useParams();
  const [sale, setSale] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    apiRequest(`purchase.php?code=${encodeURIComponent(saleCode)}`)
      .then((result) => { if (active) setSale(result); })
      .catch((requestError) => { if (active) setError(requestError.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [saleCode]);

  function downloadTickets() {
    const file = new Blob([ticketHtml(sale)], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `boletos-${sale.sale_code}.html`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <section className="container page-section"><p role="status">Cargando boletos…</p></section>;
  if (error) return <section className="container page-section"><p className="form-error" role="alert">{error}</p><Link to="/menu">Volver a rutas</Link></section>;
  if (!sale) return null;

  return (
    <main className="container page-section tickets-page">
      <header className="ticket-confirmation">
        <span className="eyebrow">COMPRA CONFIRMADA</span>
        <h1>Tus boletos están listos</h1>
        <p>Compra <strong>{sale.sale_code}</strong> · Total {formatPrice(sale.total_amount)} · Compra simulada, sin cobro.</p>
        <div className="ticket-actions">
          <button className="button button-dark" onClick={() => window.print()}><i className="bi bi-printer" /> Imprimir / Guardar como PDF</button>
          <button className="button button-light" onClick={downloadTickets}><i className="bi bi-download" /> Descargar boletos</button>
        </div>
      </header>
      <section className="issued-tickets" aria-label="Boletos emitidos">
        {sale.tickets.map((ticket) => (
          <article className="issued-ticket" key={ticket.ticket_code}>
            <header><img src={imageUrl('Buses.png')} alt="Logo Viajes por Chile" /><div><strong>VIAJES POR CHILE</strong><span>BOLETO DE BUS</span></div><span className="ticket-code">{ticket.ticket_code}</span></header>
            <h2>{ticket.trip_title}</h2>
            <p className="ticket-destination">Destino: <strong>{ticket.destination}</strong></p>
            <div className="ticket-data">
              <div><span>Pasajero</span><strong>{ticket.passenger_name}</strong></div>
              <div><span>RUT</span><strong>{ticket.passenger_rut}</strong></div>
              <div><span>Fecha</span><strong>{ticket.schedule_date}</strong></div>
              <div><span>Hora</span><strong>{ticket.departure_time}</strong></div>
              <div><span>Andén</span><strong>{ticket.platform}</strong></div>
              <div><span>Asiento</span><strong>{ticket.seat_number}</strong></div>
            </div>
            <footer><span>{Number(ticket.discount_percent) > 0 ? `${ticket.discount_percent}% descuento · Normal ${formatPrice(ticket.original_price)}` : 'Tarifa normal'}</span><strong>{formatPrice(ticket.price_paid)}</strong></footer>
          </article>
        ))}
      </section>
      <Link to="/menu" className="button button-light">Volver a rutas</Link>
    </main>
  );
}
