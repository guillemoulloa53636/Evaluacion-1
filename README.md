# Viajes por Chile

SPA en React con Vite y React Router. La interfaz conserva las rutas de compra, el detalle de pasajes, el carrito, el panel de catálogo, registro, blog, nosotros y contacto.

## Desarrollo

```sh
npm install
npm run dev
```

## Producción

```sh
npm run build
npm run preview
```

Las imágenes se sirven desde `public/Img`. El catálogo, el carrito y las cuentas de demostración usan `localStorage`; los formularios no están conectados a un servidor. No se debe usar este prototipo para guardar contraseñas reales ni para proteger rutas administrativas en producción.