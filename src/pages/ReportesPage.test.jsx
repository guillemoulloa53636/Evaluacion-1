import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ReportesPage from './ReportesPage.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

describe('ReportesPage', () => {
  beforeEach(() => {
    apiRequest.mockResolvedValue({ user: { role: 'admin' } });
  });

  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('muestra el reporte del día como período predeterminado', async () => {
    render(<MemoryRouter><ReportesPage /></MemoryRouter>);

    await screen.findByRole('heading', { name: 'Reportes de operación' });
    expect(screen.getByLabelText('Período del reporte')).toHaveValue('day');
    expect(screen.getByRole('option', { name: 'Hoy (Día)' })).toBeInTheDocument();
    expect(screen.getByText('Monto total de ventas').parentElement).toHaveTextContent('$70.000');
    expect(screen.getByText('Viajes realizados').parentElement).toHaveTextContent('2');
    expect(screen.getByText('Eventos de flota').closest('section')).toHaveTextContent('Bus 12');
    expect(screen.getByRole('note')).toHaveTextContent('Datos de demostración');
  });

  it('actualiza las métricas y los eventos al cambiar el período', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ReportesPage /></MemoryRouter>);

    await screen.findByRole('heading', { name: 'Reportes de operación' });
    await user.selectOptions(screen.getByLabelText('Período del reporte'), 'week');

    expect(screen.getByLabelText('Período del reporte')).toHaveValue('week');
    expect(screen.getByText('Monto total de ventas').parentElement).toHaveTextContent('$420.000');
    expect(screen.getByText('Viajes realizados').parentElement).toHaveTextContent('12');
    expect(screen.getByText('Cancelaciones').parentElement).toHaveTextContent('2');
    expect(screen.getByText('Eventos de flota').closest('section')).toHaveTextContent('Bus 08');
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
