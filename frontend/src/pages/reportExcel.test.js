import * as XLSX from '@e965/xlsx';
import { describe, expect, it } from 'vitest';
import { createReportWorkbook } from './reportExcel.js';

const report = {
  period: 'month',
  metrics: {
    totalSales: 35000,
    ticketsSold: 1,
    completedTrips: 1,
    cancellations: 1,
    cancelledAmount: 12000,
    complaints: 2,
    messages: 3,
    unreadMessages: 1,
    newUsers: 4,
    openFleetEvents: 1
  },
  purchases: [{
    sale_code: 'sale-1',
    total_amount: 35000,
    status: 'parcial',
    created_at: '2026-11-18 10:00:00',
    tickets: [{
      ticket_code: 'ticket-1',
      passenger_name: 'Ana',
      trip_title: 'Santiago - Arica',
      destination: 'Arica',
      schedule_date: '2026-11-20',
      departure_time: '10:00',
      seat_number: 4,
      price_paid: 35000,
      status: 'activo',
      cancelled_at: null,
      cancel_reason: null
    }]
  }],
  cancellations: [{
    ticket_code: 'ticket-2',
    cancelled_at: '2026-11-18 11:00:00',
    passenger_name: 'Luis',
    trip_title: 'Santiago - Talca',
    destination: 'Talca',
    schedule_date: '2026-11-21',
    seat_number: 2,
    price_paid: 12000,
    cancel_reason: 'Cambio de planes'
  }],
  fleetEvents: [{
    vehicle: 'Bus 12',
    description: 'Revisión de motor',
    status: 'con_falla',
    admin_notes: '',
    reported_at: '2026-11-18 09:00:00',
    resolved_at: null
  }],
  activity: [{
    created_at: '2026-11-18 09:00:00',
    type: 'flota',
    description: 'Reporte de bus',
    actor: 'Admin'
  }]
};

function readWorkbook(workbook) {
  return XLSX.read(XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }), { type: 'array' });
}

describe('reportExcel', () => {
  it('exports all report categories in separate Excel sheets with cancellation details', () => {
    const exported = readWorkbook(createReportWorkbook(report));

    expect(exported.SheetNames).toEqual([
      'Resumen', 'Ventas', 'Compras', 'Boletos', 'Cancelaciones', 'Flota', 'Sucesos'
    ]);
    expect(XLSX.utils.sheet_to_json(exported.Sheets.Ventas, { header: 1 })[1]).toEqual([
      'sale-1', '2026-11-18 10:00:00', 'parcial', 35000
    ]);
    expect(XLSX.utils.sheet_to_json(exported.Sheets.Boletos, { header: 1 })[1][9]).toBe('activo');
    expect(XLSX.utils.sheet_to_json(exported.Sheets.Cancelaciones, { header: 1 })[1][8]).toBe('Cambio de planes');
    expect(XLSX.utils.sheet_to_json(exported.Sheets.Resumen, { header: 1 })[1]).toEqual(['Período', 'Este Mes']);
  });

  it('exports only the selected category and reports invalid filters', () => {
    const exported = readWorkbook(createReportWorkbook(report, 'cancellations'));

    expect(exported.SheetNames).toEqual(['Cancelaciones']);
    expect(() => createReportWorkbook(report, 'unknown')).toThrow('El filtro de exportación no es válido.');
  });
});
