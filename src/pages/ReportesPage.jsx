import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { formatPrice } from '../data/catalog.js';
import { apiRequest } from '../lib/api.js';

const reports = {
  day: {
    totalSales: 70000,
    completedTrips: 2,
    cancellations: 0,
    complaints: 1,
    fleetEvents: [
      { id: 'day-1', vehicle: 'Bus 12', description: 'Revisión preventiva por ruido en el motor', status: 'En revisión' }
    ]
  },
  week: {
    totalSales: 420000,
    completedTrips: 12,
    cancellations: 2,
    complaints: 4,
    fleetEvents: [
      { id: 'week-1', vehicle: 'Bus 08', description: 'Neumático reemplazado antes de salida', status: 'Resuelto' },
      { id: 'week-2', vehicle: 'Bus 12', description: 'Revisión preventiva por ruido en el motor', status: 'En revisión' }
    ]
  },
  month: {
    totalSales: 1850000,
    completedTrips: 54,
    cancellations: 5,
    complaints: 13,
    fleetEvents: [
      { id: 'month-1', vehicle: 'Bus 03', description: 'Avería eléctrica durante inspección', status: 'Resuelto' },
      { id: 'month-2', vehicle: 'Bus 08', description: 'Neumático reemplazado antes de salida', status: 'Resuelto' },
      { id: 'month-3', vehicle: 'Bus 12', description: 'Revisión preventiva por ruido en el motor', status: 'En revisión' }
    ]
  },
  year: {
    totalSales: 21850000,
    completedTrips: 648,
    cancellations: 27,
    complaints: 97,
    fleetEvents: [
      { id: 'year-1', vehicle: 'Bus 03', description: 'Avería eléctrica durante inspección', status: 'Resuelto' },
      { id: 'year-2', vehicle: 'Bus 08', description: 'Neumático reemplazado antes de salida', status: 'Resuelto' },
      { id: 'year-3', vehicle: 'Bus 12', description: 'Revisión preventiva por ruido en el motor', status: 'En revisión' },
      { id: 'year-4', vehicle: 'Bus 15', description: 'Falla en sistema de climatización', status: 'Resuelto' }
    ]
  }
};

const periods = [
  ['day', 'Hoy (Día)'],
  ['week', 'Esta Semana'],
  ['month', 'Este Mes'],
  ['year', 'Este Año']
];

export default function ReportesPage() {
  const [period, setPeriod] = useState('day');
  const [access, setAccess] = useState('checking');
  const [accessError, setAccessError] = useState('');
  const report = reports[period];

  useEffect(() => {
    let active = true;

    apiRequest('auth.php?action=me')
      .then(({ user }) => {
        if (active) setAccess(user?.role === 'admin' ? 'granted' : 'denied');
      })
      .catch((error) => {
        if (active) {
          setAccessError(error.message);
          setAccess('error');
        }
      });

    return () => { active = false; };
  }, []);

  if (access === 'checking') return <div className="admin-content"><p className="muted" role="status">Verificando sesión de administrador…</p></div>;
  if (access === 'denied') return <Navigate to="/" replace />;
  if (access === 'error') return <div className="admin-content"><p className="form-error" role="alert">{accessError}</p></div>;

  const metrics = [
    { label: 'Monto total de ventas', value: formatPrice(report.totalSales), icon: 'bi-currency-dollar' },
    { label: 'Viajes realizados', value: report.completedTrips, icon: 'bi-bus-front' },
    { label: 'Cancelaciones', value: report.cancellations, icon: 'bi-x-circle' },
    { label: 'Reclamos recibidos', value: report.complaints, icon: 'bi-chat-left-text' }
  ];

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

      <p className="demo-note" role="note">
        Datos de demostración: estas cifras son ilustrativas y no representan registros reales del sistema.
      </p>

      <section className="admin-stats report-stats" aria-label={`Métricas del período: ${periods.find(([value]) => value === period)[1]}`}>
        {metrics.map((metric) => (
          <article key={metric.label}>
            <span><i className={`bi ${metric.icon}`} aria-hidden="true" /> {metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-table-wrap fleet-events">
        <div className="section-heading">
          <div>
            <span className="eyebrow">MANTENCIÓN</span>
            <h2>Eventos de flota</h2>
          </div>
          <span className="fleet-event-count">{report.fleetEvents.length} eventos</span>
        </div>
        {report.fleetEvents.length ? (
          <div className="table-responsive">
            <table className="table admin-table">
              <thead><tr><th>Vehículo</th><th>Evento</th><th>Estado</th></tr></thead>
              <tbody>
                {report.fleetEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.vehicle}</td>
                    <td>{event.description}</td>
                    <td><span className={`table-status ${event.status === 'En revisión' ? 'is-off' : ''}`}>{event.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="muted">No hay eventos de flota para este período.</p>}
      </section>
    </div>
  );
}
