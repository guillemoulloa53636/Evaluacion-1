import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { CartProvider, useCart } from './CartContext.jsx';

function CartProbe() {
  const { items, total, addItem } = useCart();
  return (
    <>
      <p>{items.length} artículos · ${total}</p>
      <button onClick={() => addItem({
        slug: 'valparaiso',
        title: 'Santiago - Valparaíso',
        price: 8500,
        originalPrice: 10000,
        discountPercent: 15,
        scheduleId: 'departure-1',
        scheduleDate: '2099-04-20',
        departureTime: '09:30',
        platform: '4'
      })}>Agregar pasaje rebajado</button>
    </>
  );
}

describe('CartContext', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
  });

  it('mantiene precio descontado y salida seleccionada en el carrito', async () => {
    const user = userEvent.setup();
    render(<CartProvider><CartProbe /></CartProvider>);

    await user.click(screen.getByRole('button', { name: 'Agregar pasaje rebajado' }));

    expect(screen.getByText('1 artículos · $8500')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('carritoDB'))[0]).toMatchObject({
      price: 8500,
      originalPrice: 10000,
      discountPercent: 15,
      scheduleId: 'departure-1',
      platform: '4'
    });
  });
});
