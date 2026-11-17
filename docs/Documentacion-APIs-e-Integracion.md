# Documento de APIs e Integración – Viajes por Chile

**Versión del documento:** 1.0
**Fecha de creación:** 17/11/2026

## Descripción general

Este documento describe la API REST de Viajes por Chile (venta de boletos de bus y administración de rutas, ventas, flota y usuarios), el modelo de datos, cómo el frontend la consume, las pruebas realizadas y los resultados de la comunicación. Está dirigido a desarrolladores y administradores del sistema.

## Información general

| Elemento | Valor |
|---|---|
| URL de la API | `http://localhost:8080/api/v1` |
| URL de Swagger | `http://localhost:8080/swagger-ui.html` |
| Especificación OpenAPI | `http://localhost:8080/v3/api-docs` |
| Frontend | `http://localhost:5173` (Vite, con proxy de `/api` hacia el puerto 8080) |
| Base de datos | MariaDB, base `viajes_chile`, puerto 3308 |
| Versionado | Todas las rutas cuelgan de `/api/v1` |

## Modelo de datos

El diagrama entidad-relación y la arquitectura están en `docs/diagrama-mer-arquitectura.md`. Relación con las 5 entidades de la propuesta:

| Entidad de la propuesta | Tabla en el sistema | Nota |
|---|---|---|
| USUARIO | `users` | Roles `customer`, `seller`, `admin`. |
| PRODUCTO | `products` | Ruta, destino, precio, descuento, salidas y andén. |
| BOLETA | `sales` | Código de venta, total, estado; `user_id` del comprador. |
| DETALLE_BOLETA | `tickets` | Un registro por pasajero y asiento, con su precio pagado. |
| CATEGORIA | `products.type` | Hoy es un campo de texto, no una tabla. |

Tablas de apoyo y descripción de cada una:

| Tabla | Propósito |
|---|---|
| `users` | Cuentas con rol `customer`, `seller` o `admin`. |
| `refresh_tokens` | Tokens de renovación de sesión (guardados con hash). |
| `password_reset_tokens` | Enlaces de recuperación de contraseña (hash, vencimiento de 30 min). |
| `products` | Rutas de bus: destino, tipo, precio, descuento, salidas. |
| `sales` | Compras; `user_id` enlaza con el comprador si tenía sesión. |
| `tickets` | Boletos de cada venta (pasajero, asiento, fecha, precio pagado). |
| `contact_messages` | Mensajes y reclamos de clientes. |
| `fleet_events` y registro de actividad | Operación: buses, incidentes y sucesos. |

## Documentación de endpoints

El detalle completo (método, entradas, respuestas, acceso, autenticación, roles y observaciones) está en `docs/documentacion-api.md`. Resumen por recurso:

| Recurso | Endpoints | Quién accede |
|---|---|---|
| Autenticación | `POST /auth/login`, `/register`, `/google`, `/refresh`, `/forgot-password`, `/reset-password`, `/logout`; `GET/PUT /auth/me`; `POST /auth/change-password` | Público (login, registro, recuperación); autenticado (me, cambio de clave, logout) |
| Productos | `GET /productos`, `GET /productos/{slug}`, `POST`, `PUT /{slug}`, `DELETE /{slug}` | Lectura pública; escritura ADMIN |
| Usuarios | `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` en `/users` | ADMIN |
| Compras | `POST /purchases`, `GET /purchases/{código}`, `GET /purchases/mine` | Público; `mine` autenticado |
| Órdenes | `GET /ordenes`, `GET /ordenes/{código}` | SELLER y ADMIN |
| Mensajes | `POST /contact-messages`; `GET`, `PUT /{id}`, `DELETE /{id}` | Crear público; resto ADMIN |
| Flota | `GET`, `POST`, `PUT /{id}`, `DELETE /{id}` en `/fleet-events` | ADMIN |
| Ventas | `POST /sales/cancellations` | ADMIN |
| Reportes | `GET /reports` | ADMIN |

### Ejemplos de entrada

Login:

```json
POST /api/v1/auth/login
{ "email": "cote@gmail.com", "password": "Cote1234" }
```

Recuperar contraseña (solo correo):

```json
POST /api/v1/auth/forgot-password
{ "email": "cote@gmail.com" }
```

Cambiar contraseña (con sesión):

```json
POST /api/v1/auth/change-password
{ "currentPassword": "Cote1234", "newPassword": "Nueva12345" }
```

Códigos de respuesta usados: 200, 201, 400 (dato inválido), 401 (sin sesión o credenciales incorrectas), 403 (sin permiso), 404, 409 (conflicto), 422 (validación), 429 (demasiados intentos) y 500.

## Seguridad

- **JWT de acceso:** vence en 15 minutos y viaja en `Authorization: Bearer`.
- **Refresh token:** cookie `httpOnly` y `SameSite=Strict`; se rota en cada renovación y se guarda con hash.
- **Roles:** Spring Security restringe cada ruta por rol (`SecurityConfig`).
- **Contraseñas:** BCrypt.
- **Fuerza bruta:** límite de 10 intentos cada 5 minutos por IP en login, Google y recuperación (responde 429).
- **Swagger:** botón *Authorize* para pegar el token y probar endpoints protegidos.

## Integración con el frontend

### Flujo de datos

1. El componente React llama a `apiRequest('ruta', opciones)` (`src/lib/api.js`).
2. `apiRequest` agrega `Authorization: Bearer <token>` y envía `fetch` a `/api/v1/...` con `credentials: include`.
3. Vite reenvía la llamada al backend (puerto 8080).
4. El filtro JWT valida el token, el controlador responde JSON y el frontend actualiza la interfaz.
5. Si la respuesta es 401 en una ruta protegida, `apiRequest` pide `POST /auth/refresh`, guarda el nuevo token y repite la llamada una vez.

### Sesión y recarga de página

- El token de acceso vive solo en memoria (no en `localStorage`), para reducir el robo por XSS.
- El usuario (sin datos sensibles) se guarda en `localStorage` con la clave `viajes.user`.
- Al recargar, la primera llamada protegida recibe 401, se renueva con la cookie de refresh y la sesión continúa.
- Al cerrar sesión se revoca el refresh token y se limpia el estado.

### Restricciones de acceso en el frontend

`RoleRoute` (`src/components/RoleRoute.jsx`) protege las rutas por rol:

| Ruta | Roles permitidos |
|---|---|
| `/admin`, `/admin/usuarios`, `/admin/mensajes`, reportes, flota | admin |
| `/vendedor` | seller (lista y detalle de productos y órdenes) |
| `/perfil` | customer, seller, admin |
| `/menu`, `/viajes/:slug`, `/boletos/:código` | público |

Un usuario sin el rol adecuado es redirigido a su página de inicio. El backend aplica la misma restricción, así que ocultar una vista no es la única defensa.

### Capturas de pantalla

*(Insertar cada captura con borde de 1 px negro, número, título y nota, y una descripción debajo.)*

| N.º | Título | Qué debe mostrar |
|---|---|---|
| 1 | Swagger con todos los endpoints | `swagger-ui.html` con las etiquetas por recurso. |
| 2 | Botón Authorize | Cuadro para pegar el token JWT. |
| 3 | Login exitoso en Swagger | Respuesta 200 de `/auth/login` con el token. |
| 4 | Login con error | Mensaje "El correo o la contraseña no son correctos" (401). |
| 5 | Lista de rutas en el frontend | Pantalla `/menu` con las rutas cargadas desde `GET /productos`. |
| 6 | Pestaña Network | Llamada `GET /api/v1/productos` con estado 200. |
| 7 | Compra exitosa | Boletos tras `POST /purchases` (201). |
| 8 | Historial de compras | Sección en `/perfil` con `GET /purchases/mine`. |
| 9 | Panel de vendedor | Productos y órdenes, con "Ver detalle". |
| 10 | Acceso denegado | Un cliente que intenta abrir `/admin` y es redirigido. |

## Pruebas y resultados

| Tipo | Herramienta | Cobertura |
|---|---|---|
| Frontend | Vitest y Testing Library (`npx vitest run`) | Componentes, páginas, contextos, `api.js`, rutas por rol, recuperación y cambio de contraseña, perfil. |
| Backend | JUnit 5 y Mockito (`mvn test`) | `AuthServiceTest`, `PasswordResetServiceTest`, `AuthRateLimitFilterTest`. |
| Manual | Swagger y navegador | Login con correo y con Google, recuperación de contraseña, compra, historial, accesos por rol. |

**Resultado de la comunicación:** completar tras ejecutar las pruebas (cantidad de pruebas pasadas y fallidas en frontend y backend, y verificación manual de las capturas).
