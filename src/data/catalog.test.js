import { describe, expect, it } from 'vitest';
import { calculateTrip, formatPrice, imageUrl } from './catalog.js';

describe('catálogo de rutas', () => {
  it('calcula distancia y tarifa para dos ciudades válidas', () => {
    expect(calculateTrip('santiago', 'valparaiso')).toMatchObject({
      distance: 120,
      price: 6000,
      from: { name: 'Santiago' },
      to: { name: 'Valparaíso' }
    });
  });

  it('usa la tarifa especial para una ruta definida', () => {
    expect(calculateTrip('arica', 'santiago').price).toBe(25000);
  });

  it('rechaza ciudades inexistentes y viajes al mismo origen', () => {
    expect(calculateTrip('ciudad-invalida', 'santiago')).toBeNull();
    expect(calculateTrip('santiago', 'santiago')).toBeNull();
  });

  it('formatea el precio en pesos chilenos y codifica nombres de imágenes', () => {
    expect(formatPrice(10000)).toBe('$10.000');
    expect(imageUrl('foto de bus.jpg')).toContain('foto%20de%20bus.jpg');
  });
});
