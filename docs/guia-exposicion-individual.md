# Guía de estudio y exposición individual

## Objetivo de la presentación

Explicar con palabras propias qué problema resuelve Viajes por Chile, cómo se conectan la interfaz React y la API PHP/MariaDB, cómo funciona una reserva y qué evidencia ofrecen las pruebas. La guía es material de preparación: practica el flujo y adapta el guion a lo que realmente entiendes y puedes mostrar.

## Presentación sugerida de 15 minutos

### 0:00–1:00 — Introducción

> “Viajes por Chile es una aplicación web para explorar rutas de bus, comparar tarifas y preparar una compra simulada. El cliente puede seleccionar una salida, conservar sus pasajes en un carrito y recibir un boleto. La administración mantiene el catálogo, los descuentos y las salidas.”

Explica que el alcance es una demostración académica, no una plataforma de cobro en producción.

### 1:00–3:00 — Tecnologías y arquitectura

Muestra [App.jsx](../src/App.jsx), [main.jsx](../src/main.jsx) y [vite.config.js](../vite.config.js).

- **React** organiza la interfaz en páginas y componentes.
- **React Router** resuelve rutas públicas y rutas del espacio administrativo.
- **Vite** ofrece servidor de desarrollo y build de producción; su proxy reenvía `/api` a Apache.
- **PHP** publica endpoints JSON y **PDO** consulta la base MariaDB.
- **Vitest y React Testing Library** comprueban lógica y comportamiento de interfaz en jsdom.
- El carrito vive en `localStorage`; ventas y boletos se guardan mediante la API.

La conexión local usa `127.0.0.1:3308`, base `viajes_chile` y usuario `root`. La contraseña se obtiene de `DB_PASSWORD` si existe; de lo contrario se usa vacía para el entorno XAMPP local.

### 3:00–5:00 — Usuarios y requisitos

Explica los dos perfiles principales:

- **Cliente/visitante:** rutas, búsqueda por destino, filtro por tipo de servicio, descuentos, registro, ayuda y carrito.
- **Administrador:** catálogo, porcentajes de descuento, horarios/andenes/cupos, cuentas compradoras y reportes.

Muestra [ERS-viajes-por-chile.md](./ERS-viajes-por-chile.md) para señalar requisitos funcionales, restricciones y límites. Reportes son solo para administrador. El proyecto respeta esa separación de navegación y realiza comprobaciones del rol.

### 5:00–8:30 — Demostración del flujo cliente

1. En `/menu`, busca un destino y filtra, por ejemplo, por “Salón Cama”.
2. Abre una ruta y explica precio normal, descuento y salida.
3. Completa fecha/salida y pasajeros, añade al carrito y confirma que la tarifa descontada se mantiene.
4. Avanza al checkout y explica que se trata de una **compra simulada**, sin cobro.
5. Abre `/boletos/:saleCode` y muestra destino, pasajero, fecha/hora, andén, asiento, código y precio.
6. Señala las acciones para imprimir/guardar como PDF y descargar el HTML.

**Preparación:** inicia Apache y MySQL en XAMPP; carga esquema, migración y, si sus horarios aún están vigentes, el seed de demostración. Si las fechas seed ya pasaron, configura salidas futuras desde el panel antes de hacer la exposición. No publiques ni incluyas contraseñas reales en capturas o diapositivas.

### 8:30–10:30 — Administración

Muestra cómo editar una ruta para cambiar su porcentaje de descuento y añadir fecha, hora, andén y cupos. Explica que las ofertas se calculan usando el precio normal y el porcentaje. Si el ambiente lo permite, muestra el listado de usuarios compradores.

### 10:30–11:30 — Reportes y honestidad sobre los datos

Muestra el selector Día/Semana/Mes/Año. Explica cada indicador. Después señala la advertencia visible en la página: las cifras y eventos de flota son **ilustrativos** y no se calculan desde ventas reales ni se guardan en la base. No presentes estos valores como analítica de producción.

### 11:30–13:30 — Pruebas y calidad

Ejecuta `npm test -- --run`; explica que usa Vitest, React Testing Library y `user-event`. Muestra [cobertura-de-pruebas.md](./cobertura-de-pruebas.md):

- 15 archivos de test y 38 casos aprobados en la última validación documentada.
- 80,41% de líneas y 62,68% de ramas.
- Los tests de descuentos y reportes también pasan ejecutados por separado.
- Cobertura no equivale a probar cada función ni el sistema con base de datos real; las brechas de Admin/SiteLayout y los límites de integración están informados.

Puedes ejecutar `npm run coverage` para regenerar los porcentajes y abrir el informe local `coverage/index.html`.

### 13:30–15:00 — Cierre

Resume el valor principal (descubrir y preparar una reserva con descuento), la evidencia (pruebas y documentación) y los próximos pasos reales: agregar integración de navegador/PHP y convertir los reportes ilustrativos en métricas persistidas. Invita a preguntas.

## Mapa rápido del código

| Responsabilidad | Archivo para estudiar |
|---|---|
| Declaración de rutas | [App.jsx](../src/App.jsx) |
| Shell público, navegación y carrito | [SiteLayout.jsx](../src/components/SiteLayout.jsx) |
| Catálogo, búsqueda, detalle y reserva | [ShopPages.jsx](../src/pages/ShopPages.jsx) |
| Aplicación de descuentos en la vista | [DescuentosPage.jsx](../src/pages/DescuentosPage.jsx) |
| Estado compartido de productos | [ProductContext.jsx](../src/context/ProductContext.jsx) |
| Carrito y almacenamiento local | [CartContext.jsx](../src/context/CartContext.jsx) |
| Formulario de checkout y llamada de compra | [CheckoutForm.jsx](../src/components/CheckoutForm.jsx) |
| Vista y HTML de boletos | [TicketsPage.jsx](../src/pages/TicketsPage.jsx) |
| Operaciones del administrador | [AdminPage.jsx](../src/pages/AdminPage.jsx) |
| Métricas ilustrativas restringidas a admin | [ReportesPage.jsx](../src/pages/ReportesPage.jsx) |
| Acceso común a la API | [api.js](../src/lib/api.js) |
| Rutas y precios base | [catalog.js](../src/data/catalog.js) |
| Conexión MariaDB y sesión | [bootstrap.php](../api/bootstrap.php) |
| Persistencia de compra y emisión | [purchase.php](../api/purchase.php) |

## Conceptos que debes poder explicar

### Componentes, props y estado

Un componente representa una parte de la pantalla. Las **props** entregan datos/comportamientos entre componentes; el **estado** (`useState`) conserva una selección local, como el período del reporte o el formulario. Los contextos React permiten compartir productos y carrito sin pasar las mismas props por muchos niveles.

### Flujo de datos de una compra

`TripDetailPage` reúne ruta, salida y pasajeros → `CartContext` conserva el carrito → `CheckoutForm` llama `apiRequest` → `purchase.php` valida y persiste la compra/boletos → la app navega al código de compra → `TicketsPage` recupera y presenta los boletos.

### Qué valida una prueba unitaria/de componente

Una prueba prepara entradas o respuestas simuladas, renderiza una función o componente, realiza una acción y verifica el resultado observable. `user-event` simula interacciones de usuario. Los mocks de API hacen que esas pruebas sean repetibles e independientes de XAMPP, pero por sí solos no demuestran que PHP o MariaDB respondan correctamente.

## Preguntas posibles y respuestas honestas

**¿La aplicación cobra el pasaje?**

No. La compra es simulada; no hay pasarela de pago ni cobro financiero.

**¿Los reportes muestran las ventas reales de MariaDB?**

No. Los valores son ilustrativos, y la interfaz lo informa. Una mejora pendiente es construir endpoints y persistencia para ventas, cancelaciones, reclamos y eventos de flota.

**¿Qué se guarda en el navegador y qué en la base?**

El carrito se guarda en `localStorage`. La API PHP/MariaDB gestiona las cuentas, el catálogo, los mensajes y las compras/boletos emitidos.

**¿Por qué el cliente no puede ver reportes?**

Porque `/admin/reportes` pertenece al árbol de rutas de administración y valida el rol. La autorización no debe depender solo de ocultar un enlace; los endpoints también deben proteger las operaciones administrativas.

**¿80,41% de cobertura quiere decir que el proyecto está 80% correcto?**

No. Es una medición de líneas ejecutadas, no una medida de calidad, requisitos satisfechos ni ausencia de defectos. También hay ramas y módulos menos cubiertos.

**¿Los tests se conectan a MySQL?**

Los tests frontend documentados simulan la API para aislar la interfaz. En esa ejecución no se corrió una suite de integración PHP/MariaDB ni Playwright; por eso la cobertura de persistencia real queda como límite.

**¿Por qué se usa Vitest en vez de Jasmine/Karma?**

El proyecto se construye con Vite y su entorno de prueba configurado es Vitest + React Testing Library. Jasmine/Karma se omiten conforme al alcance acordado para esta evaluación.

## Comandos para practicar

```powershell
# Terminal 1: iniciar Apache y MySQL desde XAMPP antes de empezar
npm run dev

# Terminal 2, en la raíz del proyecto
npm test -- --run
npm test -- --run src/pages/DescuentosPage.test.jsx
npm test -- --run src/pages/ReportesPage.test.jsx
npm run coverage
npm run build
```

Prepara la demo antes de presentar: verifica sesión de admin, disponibilidad de la ruta y fecha futura, que el carrito esté limpio y que Apache/MariaDB estén disponibles. No dependas de una compra improvisada si la API o la base no están listas; puedes explicar el flujo desde el código y la evidencia de pruebas sin afirmar que una compra real se procesó.
