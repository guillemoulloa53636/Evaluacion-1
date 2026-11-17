# Documentación de la API REST – Viajes por Chile

Base: `/api/v1` (Spring Boot, puerto 8080). Formato JSON. Autenticación: `Authorization: Bearer <JWT>`; el refresh token viaja en la cookie httpOnly `viajes_refresh`.
Swagger UI: `/swagger-ui.html` · OpenAPI: `/v3/api-docs`.

Códigos comunes: **200** éxito · **201** creado · **204** sin contenido · **400** datos inválidos (validación de campos) · **422** regla de negocio incumplida (compras/cancelaciones) · **401** token ausente/inválido o credenciales incorrectas · **403** rol sin permiso · **404** no existe · **409** conflicto (duplicado) · **500** error del servidor.

Leyenda de acceso: **Pública** = sin token; **Privada** = requiere JWT. Rol `SELLER` queda excluido de las rutas públicas de auth/compra/contacto y solo puede leer órdenes y productos.

## 1. Autenticación y cuenta (`/auth`)

| Método | Endpoint | Descripción | Datos de entrada | Respuestas | Acceso | Autenticación | Roles | Observaciones |
|---|---|---|---|---|---|---|---|---|
| POST | `/auth/login` | Inicia sesión con correo y contraseña. | Body: `email`, `password` | 200 `{token, tokenType, expiresIn, user}` + cookie refresh; 400; 401 credenciales; 500 | Pública | No | Todos (excepto seller) | Contraseña verificada con BCrypt. |
| POST | `/auth/register` | Crea una cuenta de cliente. | Body: `name`, `email`, `password`(8-72), `telephone?`, `region`, `commune` | 201 `{created:true}`; 400; 409 correo existente; 500 | Pública | No | Todos | El rol asignado siempre es `customer`. |
| POST | `/auth/google` | Inicia sesión con Google Identity. | Body: `credential` (ID token) | 200 igual a login; 401 credencial inválida; 500 | Pública | No | Todos | Crea la cuenta si no existe; valida audiencia y correo verificado. |
| POST | `/auth/refresh` | Renueva el JWT. | Cookie `viajes_refresh` | 200 nuevo token + cookie rotada; 401 refresh inválido/expirado; 500 | Pública | No (cookie) | Todos | Rotación de refresh token. |
| POST | `/auth/change-password` | Cambia la contraseña con sesión iniciada. | Body: `currentPassword`, `newPassword`(8-72) | 200 `{ok:true}`; 400 actual incorrecta; 401 | Privada | Sí (Bearer) | Todos los autenticados | Exige la contraseña actual. |
| POST | `/auth/forgot-password` | Envía enlace de recuperación al correo. | Body: `email` | 200 `{ok:true}` siempre | Pública | No | Todos | No revela si el correo existe. |
| POST | `/auth/reset-password` | Define nueva contraseña con el token del correo. | Body: `token`, `newPassword`(8-72) | 200 `{ok:true}`; 400 enlace inválido o expirado | Pública | No | Todos | Token de un solo uso, 30 min. |
| GET | `/auth/me` | Devuelve el usuario autenticado. | Header Bearer | 200 `{user}`; 401; 403 | Privada | Sí | customer, admin | Seller denegado. |
| PUT | `/auth/me` | Actualiza los datos del perfil propio. | Body: `name`, `telephone?`, `region`, `commune` | 200 `{user}`; 400; 401; 500 | Privada | Sí | customer, admin | Correo y rol no se modifican. Sirve para cuentas Google. |
| POST | `/auth/logout` | Cierra sesión y revoca el refresh token. | Header Bearer + cookie | 200 `{ok:true}`; 401 | Privada | Sí | Todos | Limpia la cookie. |

## 2. Rutas / productos (`/products`, alias `/productos`)

| Método | Endpoint | Descripción | Datos de entrada | Respuestas | Acceso | Autenticación | Roles | Observaciones |
|---|---|---|---|---|---|---|---|---|
| GET | `/products` | Lista todas las rutas. | — | 200 lista; 500 | Pública | No | Todos | Versión completa con descuentos y salidas. |
| GET | `/products/{slug}` | Detalle de una ruta. | Path: `slug` | 200; 404 | Pública | No | Todos | |
| POST | `/products` | Crea una ruta. | Body: producto (slug, título, precio, tipo, salidas, descuento…) | 201; 400; 401; 403; 409 slug/id duplicado | Privada | Sí | ADMIN | Genera `id` `PROD-XXXX` si no se envía. |
| PUT | `/products/{slug}` | Actualiza una ruta. | Path `slug` + Body producto | 200; 400; 404; 409; 401; 403 | Privada | Sí | ADMIN | Conserva el id original. |
| DELETE | `/products/{slug}` | Elimina una ruta. | Path `slug` | 204; 404; 401; 403 | Privada | Sí | ADMIN | Eliminación física. |

## 3. Usuarios (`/users`)

| Método | Endpoint | Descripción | Datos de entrada | Respuestas | Acceso | Autenticación | Roles | Observaciones |
|---|---|---|---|---|---|---|---|---|
| GET | `/users` | Lista todos los usuarios. | — | 200 lista; 401; 403 | Privada | Sí | ADMIN | Nunca expone `password_hash`. |
| GET | `/users/{id}` | Obtiene un usuario. | Path `id` | 200; 404; 401; 403 | Privada | Sí | ADMIN | |
| POST | `/users` | Crea un usuario con rol. | Body: `name`, `email`, `password`, `telephone?`, `region?`, `commune?`, `role` | 201 + `Location`; 400; 409 | Privada | Sí | ADMIN | Único modo de crear admin/seller. |
| PUT | `/users/{id}` | Actualiza datos y rol. | Path `id` + Body: `name`, `email`, `telephone`, `region`, `commune`, `role` | 200; 400; 404; 409 | Privada | Sí | ADMIN | No permite quitar el último administrador. |
| DELETE | `/users/{id}` | Elimina un usuario. | Path `id` | 204; 404; 409 | Privada | Sí | ADMIN | No permite eliminar la propia cuenta. |

## 4. Compras y boletos (`/purchases`)

| Método | Endpoint | Descripción | Datos de entrada | Respuestas | Acceso | Autenticación | Roles | Observaciones |
|---|---|---|---|---|---|---|---|---|
| POST | `/purchases` | Registra una compra simulada y emite boletos. | Body: `items` (lista no vacía). Cada item: `slug`, `scheduleId`, `customSchedule` (boolean), `scheduleDate`, `departureTime`, `seatClass`, `passengers[]` con `name` y `rut` | 201 `{sale_code, total_amount, tickets[]}` (cada boleto: `ticket_code`, `trip_title`, `destination`, `schedule_date`, `departure_time`, `platform`, `seat_number`, `passenger_name`, `passenger_rut`, `original_price`, `discount_percent`, `price_paid`, `status`); 400 cuerpo inválido; 409 conflicto (p. ej. asiento/cupo); 422 regla de negocio incumplida; 500 | Pública | No | Todos (excepto seller) | El servidor recalcula precio, descuento y asientos; no confía en precios del navegador. Sin cobro real. |
| GET | `/purchases/mine` | Historial de compras del usuario con sesión. | — | 200 lista de `{sale_code, total_amount, status, created_at, ticket_count}`; 401 | Privada | Sí (Bearer) | Todos los autenticados | Solo compras hechas con sesión iniciada. |
| GET | `/purchases/{saleCode}` | Consulta una compra y sus boletos. | Path `saleCode` | 200 detalle de la venta y boletos; 404 "No se encontró la compra solicitada" | Pública | No | Todos (excepto seller) | Acceso por código de compra. |

## 5. Mensajes de contacto (`/contact-messages`)

| Método | Endpoint | Descripción | Datos de entrada | Respuestas | Acceso | Autenticación | Roles | Observaciones |
|---|---|---|---|---|---|---|---|---|
| POST | `/contact-messages` | Envía consulta o reclamo. | Body: `name`, `email`, `message`, `isComplaint` | 201 `{sent:true}`; 400 | Pública | No | Todos (excepto seller) | |
| GET | `/contact-messages` | Lista mensajes. | Query: `status?`, `type?` | 200; 401; 403 | Privada | Sí | ADMIN | Filtros opcionales. |
| PUT | `/contact-messages/{id}` | Cambia estado/notas. | Path `id` + Body: estado, notas | 200 `{message}`; 404 | Privada | Sí | ADMIN | |
| DELETE | `/contact-messages/{id}` | Elimina un mensaje. | Path `id`; Query `permanent=false` | 200 `{deleted:true}`; 404 | Privada | Sí | ADMIN | **Eliminación segura:** por defecto marca `eliminado`; `permanent=true` borra definitivamente. |

## 6. Operación: ventas, flota y reportes

| Método | Endpoint | Descripción | Datos de entrada | Respuestas | Acceso | Autenticación | Roles | Observaciones |
|---|---|---|---|---|---|---|---|---|
| POST | `/sales/cancellations` | Cancela un boleto o una compra completa. | Body: `ticket_code` **o** `sale_code` (al menos uno), `reason?` (máx. 300) | 200 `{cancelled:true, sale_status}` donde `sale_status` = `pagada`\|`parcial`\|`anulada`; 404 boleto/compra no encontrado; 409 ya cancelado; 422 no se indicó boleto ni compra; 401; 403 | Privada | Sí | ADMIN | Cancelación lógica (boleto `cancelado`, conserva historial); libera el asiento y recalcula el estado de la venta. |
| GET | `/fleet-events` | Lista eventos de flota. | — | 200; 401; 403 | Privada | Sí | ADMIN | |
| POST | `/fleet-events` | Registra un evento de flota. | Body: `vehicle`, `description`… | 201; 400 | Privada | Sí | ADMIN | |
| PUT | `/fleet-events/{id}` | Actualiza un evento. | Path `id` + Body | 200 `{updated:true}`; 404 | Privada | Sí | ADMIN | |
| DELETE | `/fleet-events/{id}` | Elimina un evento. | Path `id` | 200 `{deleted:true}`; 404 | Privada | Sí | ADMIN | |
| GET | `/reports` | Métricas operativas. | Query: `period` = day\|week\|month\|year (def. `day`) | 200 `{monto, viajes, cancelaciones, reclamos, flota}`; 401; 403 | Privada | Sí | ADMIN | Calculado desde MariaDB. |
| GET | `/ordenes` | Lista órdenes (resumen de ventas). | — | 200 lista de `{sale_code, total_amount, status, created_at, ticket_count}`; 401; 403 | Privada | Sí | SELLER, ADMIN | Resumen de ventas. El vendedor ve la lista y el detalle. |
| GET | `/ordenes/{saleCode}` | Detalle de una orden con sus boletos. | Path `saleCode` | 200 `{sale_code, total_amount, status, created_at, tickets[]}`; 401; 403; 404 | Privada | Sí | SELLER, ADMIN | Pensado para el panel del vendedor. |

## 7. Matriz resumen de roles

| Recurso | Anónimo | CUSTOMER | SELLER | ADMIN |
|---|---|---|---|---|
| auth login/register/google/refresh/change-password | ✔ | ✔ | ✘ | ✔ |
| auth me / logout | ✘ | ✔ | logout ✔ | ✔ |
| GET products | ✔ | ✔ | ✔ | ✔ |
| CRUD products, users, reports, fleet, sales, contact (gestión) | ✘ | ✘ | ✘ | ✔ |
| POST purchases / contact-messages, GET purchases | ✔ | ✔ | ✘ | ✔ |
| GET ordenes | ✘ | ✘ | ✔ | ✔ |

Cualquier otra ruta no listada está denegada (`denyAll`).
