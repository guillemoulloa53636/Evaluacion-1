import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TicketsPage, { buildTicketHtml } from './TicketsPage.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

describe('TicketsPage', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('recupera y muestra el boleto emitido con descuento y datos de embarque', async () => {
    apiRequest.mockResolvedValue({
      sale_code: 'ab'.repeat(16),
      total_amount: 8500,
      tickets: [{
        ticket_code: 'cd'.repeat(16),
        trip_title: 'Santiago - Valparaíso',
        destination: 'Valparaíso',
        schedule_date: '2099-04-20',
        departure_time: '09:30:00',
        platform: '4',
        seat_number: 1,
        passenger_name: 'Ana Pérez',
        passenger_rut: '123456789',
        original_price: 10000,
        discount_percent: 15,
        price_paid: 8500
      }]
    });

    render(
      <MemoryRouter initialEntries={['/boletos/abababababababababababababababab']}>
        <Routes><Route path="/boletos/:saleCode" element={<TicketsPage />} /></Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: 'Tus boletos están listos' })).toBeInTheDocument();
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument();
    expect(screen.getByText('Valparaíso', { exact: true })).toBeInTheDocument();
    expect(screen.getByText('2099-04-20')).toBeInTheDocument();
    expect(screen.getByText('09:30:00')).toBeInTheDocument();
    expect(screen.getByText('15% descuento · Normal $10.000')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Imprimir/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Descargar boletos/ })).toBeInTheDocument();
  });

  it('genera un archivo HTML imprimible que escapa el contenido recibido', () => {
    const html = buildTicketHtml({
      tickets: [{
        trip_title: '<script>alert(1)</script>',
        destination: 'Valparaíso & alrededores',
        passenger_name: 'Ana <Pérez>',
        passenger_rut: '12345678-9',
        schedule_date: '2099-04-20',
        departure_time: '09:30',
        platform: '4',
        seat_number: 1,
        ticket_code: 'ticket-1',
        price_paid: 8500,
        original_price: 10000,
        discount_percent: 15
      }]
    });

    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('Valparaíso &amp; alrededores');
    expect(html).toContain('Ana &lt;Pérez&gt;');
    expect(html).toContain('15% de descuento aplicado');
  });

  it('muestra los errores al no encontrar un boleto', async () => {
    apiRequest.mockRejectedValue(new Error('Compra no encontrada.'));

    render(
      <MemoryRouter initialEntries={['/boletos/no-existe']}>
        <Routes><Route path="/boletos/:saleCode" element={<TicketsPage />} /></Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole('alert')).toHaveTextContent('Compra no encontrada.');
    expect(screen.getByRole('link', { name: 'Volver a rutas' })).toHaveAttribute('href', '/menu');
  });
});
