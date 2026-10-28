import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { formatPrice } from '../data/catalog.js';
import { apiRequest } from '../lib/api.js';

export const FLEET_STATUSES = {
  con_falla: 'Con falla',
  en_servicio_tecnico: 'En servicio técnico',
  reparado: 'Reparado',
  fuera_de_servicio: 'Fuera de servicio'
};

const periods = [
  ['day', 'Hoy (Día)'],
  ['week', 'Esta Semana'],
  ['month', 'Este Mes'],
  ['year', 'Este Año']
];

const SALE_STATUS = { pagada: 'Pagada', parcial: 'Cancelada parcial', anulada: 'Anulada' };
const formatDate = (value) => (value ? new Date(value.replace(' ', 'T')).toLocaleString('es-CL') : '—');

export default function ReportesPage() {
  const [period, setPeriod] = useState('day');
  const [access, setAccess] = useState('checking');
  const [accessError, setAccessError] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newEvent, setNewEvent] = useState({ vehicle: '', description: '', status: 'con_falla' });

  useEffect(() => {
    let active = true;
    apiRequest('auth.php?action=me')
      .then(({ user }) => { if (active) setAccess(user?.role === 'admin' ? 'granted' : 'denied'); })
      .catch((requestError) => {
        if (active) {
          setAccessError(requestError.message);
          setAccess('error');
        }
      });
    return () => { active = false; };
  }, []);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiRequest(`reports.php?period=${period}`);
      setReport(data);
      setError('');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (access === 'granted') loadReport();
  }, [access, loadReport]);

  async function run(action) {
    try {
      await action();
      setError('');
      await loadReport();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const changeFleet = (id, changes) => run(() => apiRequest(`fleet.php?id=${id}`, { method: 'PUT', body: JSON.stringify(changes) }));
  const deleteFleet = (id) => window.confirm('¿Eliminar este evento de flota?') && run(() => apiRequest(`fleet.php?id=${id}`, { method: 'DELETE' }));
  const addFleet = (event) => {
    event.preventDefault();
    return run(async () => {
      await apiRequest('fleet.php', { method: 'POST', body: JSON.stringify(newEvent) });
      setNewEvent({ vehicle: '', description: '', status: 'con_falla' });
    });
  };
  const cancel = (payload, label) => {
    if (!window.confirm(`¿Cancelar ${label}? Los asientos quedarán disponibles.`)) return;
    const reason = window.prompt('Motivo de la cancelación (opcional):') ?? '';
    return run(() => apiRequest('sales.php', { method: 'PUT', body: JSON.stringify({ ...payload, reason }) }));
  };

  if (access === 'checking') return <div className="admin-content"><p className="muted" role="status">Verificando sesión de administrador…</p></div>;
  if (access === 'denied') return <Navigate to="/" replace />;
  if (access === 'error') return <div className="admin-content"><p className="form-error" role="alert">{accessError}</p></div>;

  const metrics = report ? [
    { label: 'Monto total de ventas', value: formatPrice(report.metrics.totalSales), icon: 'bi-currency-dollar' },
    { label: 'Boletos vendidos', value: report.metrics.ticketsSold, icon: 'bi-ticket-perforated' },
    { label: 'Viajes realizados', value: report.metrics.completedTrips, icon: 'bi-bus-front' },
    { label: 'Cancelaciones', value: report.metrics.cancellations, icon: 'bi-x-circle' },
    { label: 'Reclamos recibidos', value: report.metrics.complaints, icon: 'bi-chat-left-text' },
    { label: 'Mensajes de contacto', value: report.metrics.messages ?? 0, icon: 'bi-envelope' },
    { label: 'Cuentas nuevas', value: report.metrics.newUsers ?? 0, icon: 'bi-person-plus' },
    { label: 'Buses con problemas', value: report.metrics.openFleetEvents, icon: 'bi-tools' }
  ] : [];

  return (
    <div className="admin-content reports-page">
      <header className="admin-topline">
        <div>
          <span className="eyebrow">GESTIÓN / REPORTES</span>
          <h1>Reportes de operación</h1>
        </div>
        <label className="report-period">
          Período del reporte
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            {periods.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </header>

      {error && <p className="form-error" role="alert">{error}</p>}
      {loading && !report && <p className="muted" role="status">Cargando reporte…</p>}

      {report && <>
        <section className="admin-stats report-stats" aria-label="Métricas del período">
          {metrics.map((metric) => (
            <article key={metric.label}>
              <span><i className={`bi ${metric.icon}`} aria-hidden="true" /> {metric.label}</span>
              <strong>{metric.value}</strong>
            </article>
          ))}
        </section>

        <section className="admin-table-wrap fleet-events">
          <div className="section-heading">
            <div><span className="eyebrow">MANTENCIÓN</span><h2>Estado de la flota</h2></div>
            <span className="fleet-event-count">{report.fleetEvents.length} eventos</span>
          </div>
          <form className="stack-form" onSubmit={addFleet} aria-label="Reportar problema de un bus">
            <input placeholder="Bus (ej: Bus 12)" value={newEvent.vehicle} onChange={(event) => setNewEvent({ ...newEvent, vehicle: event.target.value })} required />
            <input placeholder="Problema detectado" value={newEvent.description} onChange={(event) => setNewEvent({ ...newEvent, description: event.target.value })} required />
            <select value={newEvent.status} onChange={(event) => setNewEvent({ ...newEvent, status: event.target.value })} aria-label="Estado inicial">
              {Object.entries(FLEET_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <button type="submit">Reportar</button>
          </form>
          {report.fleetEvents.length ? <div className="table-responsive"><table className="table admin-table">
            <thead><tr><th>Bus</th><th>Problema</th><th>Reportado</th><th>Estado</th><th>Notas</th><th>Acciones</th></tr></thead>
            <tbody>{report.fleetEvents.map((event) => <tr key={event.id}>
              <td>{event.vehicle}</td>
              <td>{event.description}</td>
              <td>{formatDate(event.reported_at)}</td>
              <td><select value={event.status} onChange={(change) => changeFleet(event.id, { status: change.target.value })} aria-label={`Estado de ${event.vehicle}`}>
                {Object.entries(FLEET_STATUSES).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select></td>
              <td><textarea rows="2" defaultValue={event.admin_notes || ''} aria-label={`Notas de ${event.vehicle}`}
                onBlur={(blur) => blur.target.value !== (event.admin_notes || '') && changeFleet(event.id, { admin_notes: blur.target.value })} /></td>
              <td><button type="button" onClick={() => deleteFleet(event.id)}>Eliminar</button></td>
            </tr>)}</tbody>
          </table></div> : <p className="muted">No hay eventos de flota para este período.</p>}
        </section>

        <section className="admin-table-wrap">
          <div className="section-heading"><div><span className="eyebrow">VENTAS</span><h2>Detalle de compras</h2></div></div>
          {report.purchases.length ? <div className="table-responsive"><table className="table admin-table">
            <thead><tr><th>Fecha</th><th>Compra</th><th>Boletos</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>{report.purchases.map((sale) => <tr key={sale.sale_code}>
              <td>{formatDate(sale.created_at)}</td>
              <td>{sale.sale_code.slice(0, 8)}</td>
              <td>{sale.tickets.map((ticket) => <div key={ticket.ticket_code}>
                {ticket.passenger_name} · {ticket.trip_title} · asiento {ticket.seat_number} · {formatPrice(ticket.price_paid)}
                {ticket.status === 'cancelado' ? ' (cancelado)' : <> <button type="button" className="btn btn-outline-danger btn-sm py-0 px-2 ms-1" style={{ fontSize: '0.75rem' }} onClick={() => cancel({ ticket_code: ticket.ticket_code }, `el asiento ${ticket.seat_number} de ${ticket.passenger_name}`)}>Cancelar asiento</button></>}
              </div>)}</td>
              <td>{formatPrice(sale.total_amount)}</td>
              <td><span className={`table-status ${sale.status !== 'pagada' ? 'is-off' : ''}`}>{SALE_STATUS[sale.status] || sale.status}</span></td>
              <td>{sale.status !== 'anulada' && sale.tickets.filter((t) => t.status !== 'cancelado').length > 1 && <button type="button" className="btn btn-outline-danger btn-sm py-0 px-2" style={{ fontSize: '0.75rem' }} onClick={() => cancel({ sale_code: sale.sale_code }, 'toda la compra')}>Cancelar todos</button>}</td>
            </tr>)}</tbody>
          </table></div> : <p className="muted">No hay compras en este período.</p>}
        </section>

        <section className="admin-table-wrap">
          <div className="section-heading"><div><span className="eyebrow">CANCELACIONES</span><h2>Detalle de cancelaciones</h2></div></div>
          {report.cancellations.length ? <div className="table-responsive"><table className="table admin-table">
            <thead><tr><th>Fecha</th><th>Pasajero</th><th>Viaje</th><th>Monto</th><th>Motivo</th></tr></thead>
            <tbody>{report.cancellations.map((item) => <tr key={item.ticket_code}>
              <td>{formatDate(item.cancelled_at)}</td><td>{item.passenger_name}</td><td>{item.trip_title}</td>
              <td>{formatPrice(item.price_paid)}</td><td>{item.cancel_reason || '—'}</td>
            </tr>)}</tbody>
          </table></div> : <p className="muted">No hay cancelaciones en este período.</p>}
        </section>

        <section className="admin-table-wrap">
          <div className="section-heading"><div><span className="eyebrow">HISTORIAL</span><h2>Registro de sucesos</h2></div></div>
          {report.activity.length ? <div className="table-responsive"><table className="table admin-table">
            <thead><tr><th>Fecha</th><th>Tipo</th><th>Detalle</th><th>Responsable</th></tr></thead>
            <tbody>{report.activity.map((item) => <tr key={item.id}>
              <td>{formatDate(item.created_at)}</td><td>{item.type}</td><td>{item.description}</td><td>{item.actor}</td>
            </tr>)}</tbody>
          </table></div> : <p className="muted">No hay sucesos registrados en este período.</p>}
        </section>
      </>}
    </div>
  );
}
