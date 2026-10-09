import { useState } from 'react';
import { formatPrice } from '../data/catalog.js';
import { apiRequest } from '../lib/api.js';

export default function CheckoutForm({ items, onCancel, onComplete }) {
  const passengerFields = items.flatMap((item) => Array.from({ length: item.quantity }, (_, index) => ({
    cartKey: item.cartKey,
    index,
    item
  })));
  const [passengers, setPassengers] = useState(() => passengerFields.map(({ item, index }) => (
    item.passengers?.[index] || { name: '', rut: '' }
  )));
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function updatePassenger(index, field, value) {
    setPassengers((current) => current.map((passenger, position) => position === index
      ? { ...passenger, [field]: value }
      : passenger));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const purchase = await apiRequest('purchase.php', {
        method: 'POST',
        body: JSON.stringify({
          items: items.map((item) => ({
            slug: item.slug,
            scheduleId: item.scheduleId,
            passengers: passengerFields
              .map((field, index) => ({ field, passenger: passengers[index] }))
              .filter(({ field }) => field.cartKey === item.cartKey)
              .map(({ passenger }) => passenger)
          }))
        })
      });
      onComplete(purchase);
    } catch (purchaseError) {
      setError(purchaseError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="checkout-form" onSubmit={submit}>
      <div className="drawer-heading">
        <div><span className="eyebrow">COMPRA SIMULADA</span><h2>Datos de pasajeros</h2></div>
        <button type="button" className="icon-button" onClick={onCancel} aria-label="Volver al carrito"><i className="bi bi-arrow-left" /></button>
      </div>
      <p className="muted">No se realizará un cobro. Al confirmar, se reservarán los asientos y se emitirán los boletos.</p>
      {passengerFields.map(({ item }, index) => (
        <fieldset className="passenger-fields" key={`${item.cartKey}-${index}`}>
          <legend>Pasajero {index + 1} · {item.title}</legend>
          <p className="muted">{item.scheduleDate} · {item.departureTime} · Andén {item.platform} · Asiento asignado al confirmar</p>
          <label>Nombre completo<input autoComplete="name" value={passengers[index].name} onChange={(event) => updatePassenger(index, 'name', event.target.value)} required maxLength="150" /></label>
          <label>RUT<input value={passengers[index].rut} onChange={(event) => updatePassenger(index, 'rut', event.target.value)} placeholder="12345678-9" required pattern="(?:[0-9.kK]|-){8,12}" title="Ingresa un RUT chileno válido" /></label>
        </fieldset>
      ))}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="cart-total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
      <button className="button button-dark w-100" disabled={submitting}>{submitting ? 'Confirmando…' : 'Confirmar compra y emitir boletos'}</button>
    </form>
  );
}
