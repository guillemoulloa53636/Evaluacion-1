export const initialProducts = [
  { id: 'PROD-01', slug: 'puertomontt', title: 'Santiago - Puerto Montt', destination: 'Puerto Montt', price: 35000, type: 'Salón Cama', status: 'Activo', image: 'Mont.jpg', description: 'La puerta de entrada a la Patagonia chilena y la Región de Los Lagos. Viaje directo con Wi-Fi y puertos USB.', gallery: ['Mont.jpg', 'Mont2.jpg'] },
  { id: 'PROD-02', slug: 'valparaiso', title: 'Santiago - Valparaíso', destination: 'Valparaíso', price: 10000, type: 'Clásico', status: 'Activo', image: 'Valpo.webp', description: 'Un destino bohemio e histórico, lleno de cerros con murales, arquitectura colorida y miradores al Pacífico.', gallery: ['Valpo.webp', 'valpo2.jpg'] },
  { id: 'PROD-03', slug: 'laserena', title: 'Santiago - La Serena', destination: 'La Serena', price: 18500, type: 'Semi Cama', status: 'Activo', image: 'Serena.webp', description: 'Destino costero de ritmo sereno, famoso por su arquitectura neocolonial y el icónico Faro Monumental.', gallery: ['Serena.webp', 'faro.jpg'] },
  { id: 'PROD-04', slug: 'concepcion', title: 'Santiago - Concepción', destination: 'Concepción', price: 22000, type: 'Salón Cama', status: 'Activo', image: 'Gran_Concepcion.jpg', description: 'La capital universitaria y del rock chileno, con servicios diurnos y nocturnos.', gallery: ['Gran_Concepcion.jpg', 'Conce2.jpg'] },
  { id: 'PROD-05', slug: 'pucon', title: 'Santiago - Pucón', destination: 'Pucón', price: 28000, type: 'Salón Cama', status: 'Agotado', image: 'Temuco.jpg', description: 'El epicentro del turismo de aventura en la Región de La Araucanía.', gallery: ['Temuco.jpg', 'Pucon2.jpg'] },
  { id: 'PROD-06', slug: 'chiloe', title: 'Santiago - Chiloé', destination: 'Chiloé', price: 25000, type: 'Salón Cama', status: 'Activo', image: 'Chilote.webp', description: 'Un viaje entre mitología, paisajes insulares verdes y una identidad cultural única.', gallery: ['Chilote.webp', 'Chiloe2.jpg'] },
  { id: 'PROD-07', slug: 'talca', title: 'Santiago - Talca', destination: 'Talca', price: 20000, type: 'Semi Cama', status: 'Activo', image: 'Talca.jpg', description: 'Corazón histórico y administrativo de la Región del Maule. Viaje rápido por la Ruta 5 Sur.', gallery: ['Talca.jpg', 'TalcaGod.jpg'] },
  { id: 'PROD-08', slug: 'pichilemu', title: 'Santiago - Pichilemu', destination: 'Pichilemu', price: 20000, type: 'Clásico', status: 'Activo', image: 'Pichilemu.jpg', description: 'La capital chilena del surf, reconocida mundialmente. Ideal para escapadas de fin de semana.', gallery: ['Pichilemu.jpg', 'Pichilemu2.jpg'] },
  { id: 'PROD-09', slug: 'quintero', title: 'Santiago - Quintero', destination: 'Quintero', price: 15000, type: 'Clásico', status: 'Activo', image: 'quintero.jpg', description: 'Tradicional ciudad costera de la zona central, conocida por sus numerosas playas.', gallery: ['quintero.jpg', 'quintero2.jpg'] },
  { id: 'PROD-10', slug: 'vina', title: 'Santiago - Viña del Mar', destination: 'Viña del Mar', price: 15000, type: 'Semi Cama', status: 'Activo', image: 'Vinia.jpg', description: 'La popular Ciudad Jardín, reconocida por su amplia infraestructura turística.', gallery: ['Vinia.jpg', 'Flores.jpg'] },
  { id: 'PROD-11', slug: 'antofagasta', title: 'Santiago - Antofagasta', destination: 'Antofagasta', price: 30000, type: 'Premium', status: 'Activo', image: 'Antofa.jpg', description: 'La Perla del Norte: ciudad costera e industrial con servicio a bordo.', gallery: ['Antofa.jpg', 'Anto2.jpg'] },
  { id: 'PROD-12', slug: 'arica', title: 'Santiago - Arica', destination: 'Arica', price: 35000, type: 'Premium', status: 'Activo', image: 'Arica.jpg', description: 'La Ciudad de la Eterna Primavera, con clima templado y asientos cama de 180°.', gallery: ['Arica.jpg', 'Arica2.jpg'] }
];

export const cities = {
  santiago: { name: 'Santiago', distance: 0 }, valparaiso: { name: 'Valparaíso', distance: 120 }, vina: { name: 'Viña del Mar', distance: 130 },
  quintero: { name: 'Quintero', distance: 160 }, talca: { name: 'Talca', distance: 255 }, pichilemu: { name: 'Pichilemu', distance: 210 },
  concepcion: { name: 'Concepción', distance: 500 }, pucon: { name: 'Pucón', distance: 785 }, puertomontt: { name: 'Puerto Montt', distance: 1030 },
  chiloe: { name: 'Chiloé', distance: 1150 }, laserena: { name: 'La Serena', distance: 475 }, antofagasta: { name: 'Antofagasta', distance: 1365 }, arica: { name: 'Arica', distance: 2050 }
};

const specialFares = {
  'antofagasta-arica': 15000, 'arica-laserena': 15000, 'arica-pichilemu': 25000, 'arica-quintero': 25000,
  'arica-santiago': 25000, 'arica-vina': 25000, 'arica-chiloe': 45000, 'arica-concepcion': 45000,
  'arica-pucon': 45000, 'arica-puertomontt': 45000, 'arica-talca': 45000
};

export function calculateTrip(origin, destination) {
  const from = cities[origin];
  const to = cities[destination];
  if (!from || !to || origin === destination) return null;
  const distance = Math.abs(to.distance - from.distance);
  const fare = specialFares[[origin, destination].sort().join('-')];
  const price = fare || Math.max(4500, Math.round((4500 + distance * 12) / 500) * 500);
  return { distance, price, from, to };
}

export const imageUrl = (filename) => `${import.meta.env.BASE_URL}Img/${encodeURIComponent(filename)}`;
export const formatPrice = (price) => `$${Number(price).toLocaleString('es-CL')}`;