import * as XLSX from '@e965/xlsx';

const periodLabels = {
  day: 'Hoy (Día)',
  week: 'Esta Semana',
  month: 'Este Mes',
  year: 'Este Año'
};

const sheetDefinitions = {
  summary: {
    name: 'Resumen',
    headers: ['Indicador', 'Valor'],
    rows: (report) => [
      ['Período', periodLabels[report.period] || report.period],
      ['Monto total de ventas', report.metrics.totalSales],
      ['Boletos vendidos', report.metrics.ticketsSold],
      ['Viajes realizados', report.metrics.completedTrips],
      ['Cancelaciones', report.metrics.cancellations],
      ['Monto cancelado', report.metrics.cancelledAmount ?? 0],
      ['Reclamos recibidos', report.metrics.complaints],
      ['Mensajes de contacto', report.metrics.messages ?? 0],
      ['Mensajes sin leer', report.metrics.unreadMessages ?? 0],
      ['Cuentas nuevas', report.metrics.newUsers ?? 0],
      ['Buses con problemas', report.metrics.openFleetEvents]
    ]
  },
  sales: {
    name: 'Ventas',
    headers: ['Código de compra', 'Fecha', 'Estado', 'Monto total'],
    rows: (report) => report.purchases.map((sale) => [
      sale.sale_code, sale.created_at, sale.status, sale.total_amount
    ]),
    currencyColumns: [3]
  },
  purchases: {
    name: 'Compras',
    headers: ['Código de compra', 'Fecha de compra', 'Estado de compra', 'Código de boleto', 'Pasajero', 'Viaje', 'Destino', 'Fecha de viaje', 'Hora de salida', 'Asiento', 'Precio pagado', 'Estado del boleto'],
    rows: (report) => report.purchases.flatMap((sale) => sale.tickets.map((ticket) => [
      sale.sale_code, sale.created_at, sale.status, ticket.ticket_code, ticket.passenger_name,
      ticket.trip_title, ticket.destination, ticket.schedule_date, ticket.departure_time,
      ticket.seat_number, ticket.price_paid, ticket.status
    ])),
    currencyColumns: [10]
  },
  tickets: {
    name: 'Boletos',
    headers: ['Código de boleto', 'Código de compra', 'Pasajero', 'Viaje', 'Destino', 'Fecha de viaje', 'Hora de salida', 'Asiento', 'Precio pagado', 'Estado', 'Fecha de cancelación', 'Motivo de cancelación'],
    rows: (report) => report.purchases.flatMap((sale) => sale.tickets.map((ticket) => [
      ticket.ticket_code, sale.sale_code, ticket.passenger_name, ticket.trip_title,
      ticket.destination, ticket.schedule_date, ticket.departure_time, ticket.seat_number,
      ticket.price_paid, ticket.status, ticket.cancelled_at ?? '', ticket.cancel_reason ?? ''
    ])),
    currencyColumns: [8]
  },
  cancellations: {
    name: 'Cancelaciones',
    headers: ['Código de boleto', 'Fecha de cancelación', 'Pasajero', 'Viaje', 'Destino', 'Fecha de viaje', 'Asiento', 'Monto cancelado', 'Motivo'],
    rows: (report) => report.cancellations.map((ticket) => [
      ticket.ticket_code, ticket.cancelled_at, ticket.passenger_name, ticket.trip_title,
      ticket.destination, ticket.schedule_date, ticket.seat_number, ticket.price_paid,
      ticket.cancel_reason ?? ''
    ]),
    currencyColumns: [7]
  },
  fleet: {
    name: 'Flota',
    headers: ['Bus', 'Problema', 'Estado', 'Notas', 'Reportado', 'Resuelto'],
    rows: (report) => report.fleetEvents.map((event) => [
      event.vehicle, event.description, event.status, event.admin_notes ?? '',
      event.reported_at, event.resolved_at ?? ''
    ])
  },
  activity: {
    name: 'Sucesos',
    headers: ['Fecha', 'Tipo', 'Detalle', 'Responsable'],
    rows: (report) => report.activity.map((event) => [
      event.created_at, event.type, event.description, event.actor
    ])
  }
};

const exportFilters = {
  all: ['summary', 'sales', 'purchases', 'tickets', 'cancellations', 'fleet', 'activity'],
  sales: ['sales', 'purchases'],
  purchases: ['purchases'],
  tickets: ['tickets'],
  cancellations: ['cancellations'],
  fleet: ['fleet'],
  activity: ['activity']
};

function createSheet(definition, report) {
  const rows = definition.rows(report);
  const worksheet = XLSX.utils.aoa_to_sheet([definition.headers, ...rows]);
  worksheet['!cols'] = definition.headers.map((header) => ({ wch: Math.min(Math.max(header.length + 2, 14), 30) }));

  for (const column of definition.currencyColumns || []) {
    for (let row = 2; row <= rows.length + 1; row += 1) {
      const cell = worksheet[XLSX.utils.encode_cell({ r: row - 1, c: column })];
      if (cell) cell.z = '"$"#,##0';
    }
  }

  return worksheet;
}

export function createReportWorkbook(report, filter = 'all') {
  const selectedSheets = exportFilters[filter];
  if (!selectedSheets) throw new Error('El filtro de exportación no es válido.');

  const workbook = XLSX.utils.book_new();
  for (const key of selectedSheets) {
    const definition = sheetDefinitions[key];
    XLSX.utils.book_append_sheet(workbook, createSheet(definition, report), definition.name);
  }
  workbook.Props = {
    Title: 'Reportes de operación',
    Subject: `Período: ${periodLabels[report.period] || report.period}`
  };
  return workbook;
}

export function exportReportToExcel(report, filter = 'all') {
  const workbook = createReportWorkbook(report, filter);
  const now = new Date();
  const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
  XLSX.writeFile(workbook, `reportes-${report.period}-${date}.xlsx`);
}
