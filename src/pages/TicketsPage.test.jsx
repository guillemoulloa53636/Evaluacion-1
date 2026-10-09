import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TicketsPage from './TicketsPage.jsx';
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
});
