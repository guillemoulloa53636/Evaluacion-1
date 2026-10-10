import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CheckoutForm from './CheckoutForm.jsx';
import { apiRequest } from '../lib/api.js';

vi.mock('../lib/api.js', () => ({ apiRequest: vi.fn() }));

describe('CheckoutForm', () => {
  afterEach(() => {
    cleanup();
    vi.resetAllMocks();
  });

  it('envía el horario, pasajero y precio acordado para emitir boletos', async () => {
    const onComplete = vi.fn();
    apiRequest.mockResolvedValue({ sale_code: 'sale-code' });
    const user = userEvent.setup();
    render(<CheckoutForm
      items={[{
        cartKey: 'valparaiso:departure-1',
        slug: 'valparaiso',
        title: 'Santiago - Valparaíso',
        price: 8500,
        originalPrice: 10000,
        discountPercent: 15,
        scheduleId: 'departure-1',
        scheduleDate: '2099-04-20',
        departureTime: '09:30',
        platform: '4',
        quantity: 1,
        passengers: [{ name: 'Ana Pérez', rut: '12345678-9' }]
      }]}
      onCancel={vi.fn()}
      onComplete={onComplete}
    />);

    expect(screen.getByLabelText('Nombre completo')).toHaveValue('Ana Pérez');
    expect(screen.getByLabelText('RUT')).toHaveValue('12345678-9');
    await user.click(screen.getByRole('button', { name: 'Confirmar compra y emitir boletos' }));

    expect(apiRequest).toHaveBeenCalledWith('purchase.php', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        items: [{
          slug: 'valparaiso',
          scheduleId: 'departure-1',
          customSchedule: false,
          scheduleDate: '2099-04-20',
          departureTime: '09:30',
          passengers: [{ name: 'Ana Pérez', rut: '12345678-9' }]
        }]
      })
    }));
    expect(onComplete).toHaveBeenCalledWith({ sale_code: 'sale-code' });
  });

  it('envía la fecha y hora elegidas para una ruta sin salida publicada', async () => {
    apiRequest.mockResolvedValue({ sale_code: 'sale-code' });
    const user = userEvent.setup();
    render(<CheckoutForm
      items={[{
        cartKey: 'valparaiso:custom:2099-04-20:09:00',
        slug: 'valparaiso',
        title: 'Santiago - Valparaíso',
        price: 10000,
        scheduleId: 'custom:2099-04-20:09:00',
        customSchedule: true,
        scheduleDate: '2099-04-20',
        departureTime: '09:00',
        platform: 'Por asignar',
        quantity: 1,
        passengers: [{ name: 'Ana Pérez', rut: '12345678-9' }]
      }]}
      onCancel={vi.fn()}
      onComplete={vi.fn()}
    />);

    await user.click(screen.getByRole('button', { name: 'Confirmar compra y emitir boletos' }));

    expect(apiRequest).toHaveBeenCalledWith('purchase.php', expect.objectContaining({
      body: JSON.stringify({
        items: [{
          slug: 'valparaiso',
          scheduleId: 'custom:2099-04-20:09:00',
          customSchedule: true,
          scheduleDate: '2099-04-20',
          departureTime: '09:00',
          passengers: [{ name: 'Ana Pérez', rut: '12345678-9' }]
        }]
      })
    }));
  });
});
