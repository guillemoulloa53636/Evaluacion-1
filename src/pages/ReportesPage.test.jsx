import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ReportesPage from './ReportesPage.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

const report = {
  period: 'day',
  metrics: { totalSales: 70000, ticketsSold: 2, completedTrips: 1, cancellations: 1, complaints: 3, openFleetEvents: 1 },
  purchases: [{
    sale_code: 'a'.repeat(32), total_amount: 70000, status: 'pagada', created_at: '2026-10-28 10:00:00',
    tickets: [{ ticket_code: 'b'.repeat(32), passenger_name: 'Ana', trip_title: 'Santiago - Arica', seat_number: 3, price_paid: 35000, status: 'activo' }]
  }],
  cancellations: [{ ticket_code: 'c'.repeat(32), passenger_name: 'Luis', trip_title: 'Santiago - Talca', price_paid: 20000, cancelled_at: '2026-10-28 11:00:00', cancel_reason: 'Cambio de planes' }],
  fleetEvents: [{ id: 1, vehicle: 'Bus 12', description: 'Ruido en el motor', status: 'con_falla', admin_notes: '', reported_at: '2026-10-28 08:00:00', resolved_at: null }],
  activity: [{ id: 1, type: 'flota', description: 'Reporte de bus Bus 12', actor: 'Secretaria', created_at: '2026-10-28 08:00:00' }]
};

describe('ReportesPage', () => {
  beforeEach(() => {
    apiRequest.mockImplementation(async (path) => (path.startsWith('auth.php') ? { user: { role: 'admin' } } : report));
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('muestra métricas, compras, cancelaciones, flota y sucesos reales', async () => {
    render(<MemoryRouter><ReportesPage /></MemoryRouter>);

    await screen.findByRole('heading', { name: 'Detalle de compras' });
    expect(screen.getByLabelText('Período del reporte')).toHaveValue('day');
    expect(screen.getByText('Monto total de ventas').parentElement).toHaveTextContent('$70.000');
    expect(screen.getByText('Boletos vendidos').parentElement).toHaveTextContent('2');
    expect(screen.getByText(/Ana · Santiago - Arica/)).toBeInTheDocument();
    expect(screen.getByText('Cambio de planes')).toBeInTheDocument();
    expect(screen.getByLabelText('Estado de Bus 12')).toHaveValue('con_falla');
    expect(screen.getByText('Reporte de bus Bus 12')).toBeInTheDocument();
  });

  it('consulta el reporte del período elegido', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ReportesPage /></MemoryRouter>);

    await screen.findByRole('heading', { name: 'Detalle de compras' });
    await user.selectOptions(screen.getByLabelText('Período del reporte'), 'week');

    expect(apiRequest).toHaveBeenCalledWith('reports.php?period=week');
  });

  it('cambia el estado de un bus a reparado', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ReportesPage /></MemoryRouter>);

    await screen.findByLabelText('Estado de Bus 12');
    await user.selectOptions(screen.getByLabelText('Estado de Bus 12'), 'reparado');

    expect(apiRequest).toHaveBeenCalledWith('fleet.php?id=1', expect.objectContaining({
      method: 'PUT',
      body: JSON.stringify({ status: 'reparado' })
    }));
  });

  it('no muestra el reporte a una sesión que no es administradora', async () => {
    apiRequest.mockResolvedValue({ user: { role: 'customer' } });
    render(
      <MemoryRouter initialEntries={['/admin/reportes']}>
        <Routes>
          <Route path="/admin/reportes" element={<ReportesPage />} />
          <Route path="/" element={<p>Iniciar sesión</p>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Reportes de operación' })).not.toBeInTheDocument();
  });
});
