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
        quantity: 1
      }]}
      onCancel={vi.fn()}
      onComplete={onComplete}
    />);

    await user.type(screen.getByLabelText('Nombre completo'), 'Ana Pérez');
    await user.type(screen.getByLabelText('RUT'), '12345678-9');
    await user.click(screen.getByRole('button', { name: 'Confirmar compra y emitir boletos' }));

    expect(apiRequest).toHaveBeenCalledWith('purchase.php', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        items: [{
          slug: 'valparaiso',
          scheduleId: 'departure-1',
          passengers: [{ name: 'Ana Pérez', rut: '12345678-9' }]
        }]
      })
    }));
    expect(onComplete).toHaveBeenCalledWith({ sale_code: 'sale-code' });
  });
});
