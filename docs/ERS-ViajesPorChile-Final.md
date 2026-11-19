# Especificación de Requisitos de Software (ERS) – Versión final

**Proyecto:** Viajes por Chile
**Versión del documento:** 2.0
**Fecha:** 17/11/2026
**Asignatura:** DSY1104 – Evaluación Parcial N° 3

## 1. Propósito y alcance

Aplicación web para vender boletos de bus a destinos de Chile y administrar rutas, ventas, flota, usuarios y mensajes. Consta de un frontend React + Vite, un backend Spring Boot con API REST versionada (`/api/v1`) y una base de datos relacional MariaDB. La compra es simulada: no hay cobro real.

## 2. Herramientas y tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | React, React Router, Vite, Bootstrap, Vitest y Testing Library |
| Backend | Java 17, Spring Boot, Spring Web, Spring Data JPA, Spring Security, Validation, jjwt, SpringDoc OpenAPI |
| Base de datos | MariaDB (`viajes_chile`) |
| Pruebas | Vitest (frontend); JUnit 5 y Mockito (backend) |
| Control de versiones | Git y GitHub |

## 3. Roles

| Rol de la pauta | Valor en el sistema | Permisos |
|---|---|---|
| Administrador | `admin` | Acceso total: rutas, usuarios, mensajes, flota, reportes, cancelaciones y órdenes. |
| Vendedor | `seller` | Solo lectura de productos (lista y detalle) y de órdenes (lista y detalle). Su vista no muestra otros módulos. |
| Cliente | `customer` | Tienda, carrito, compra, sus boletos, historial y datos de su cuenta. |

## 4. Requisitos funcionales

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| RF-01 | Explorar y buscar rutas. | El visitante consulta el catálogo, filtra por tipo de servicio y abre el detalle. |
| RF-02 | Calcular tarifa de referencia. | Muestra distancia y precio para dos ciudades distintas. |
| RF-03 | Consultar descuentos. | `/descuentos` lista rutas con precio normal y rebajado. |
| RF-04 | Administrar el catálogo. | El administrador crea, edita y elimina rutas (CRUD). |
| RF-05 | Reservar y comprar. | La API valida cupos y asientos, calcula descuentos en el servidor y emite venta y boletos en una transacción. |
| RF-06 | Consultar e imprimir boletos. | `/boletos/:código` muestra y permite imprimir cada boleto. |
| RF-07 | Registro e inicio de sesión. | Correo y contraseña, o Google; el usuario llega a la pantalla de su rol. |
| RF-08 | Recuperar contraseña. | Sin sesión: se pide solo el correo y se envía un enlace de 30 minutos. |
| RF-09 | Cambiar contraseña. | Con sesión: se pide la contraseña actual. |
| RF-10 | Editar datos de la cuenta. | "Mis datos" permite editar nombre, teléfono, región y comuna. |
| RF-11 | Historial de compras. | Cada usuario ve sus compras en "Mis datos". |
| RF-12 | Gestionar usuarios. | El administrador hace CRUD de usuarios y asigna roles. |
| RF-13 | Consultar órdenes. | Vendedor y administrador ven la lista y el detalle de órdenes. |
| RF-14 | Cancelar boletos o compras. | El administrador cancela con motivo; se libera el asiento. |
| RF-15 | Mensajes y reclamos. | Los clientes envían mensajes; el administrador los gestiona. |
| RF-16 | Flota y reportes. | El administrador registra eventos y consulta métricas por período. |
| RF-17 | Documentar la API. | Swagger UI con autorización Bearer. |

## 5. Requisitos no funcionales

| ID | Requisito | Verificación |
|---|---|---|
| RNF-01 | API REST versionada. | Todas las rutas cuelgan de `/api/v1`. |
| RNF-02 | Autenticación con JWT. | Token de acceso de 15 minutos y refresh token rotatorio en cookie `httpOnly`. |
| RNF-03 | Autorización por rol. | `SecurityConfig` restringe cada ruta; el frontend repite la restricción con `RoleRoute`. |
| RNF-04 | Contraseñas protegidas. | BCrypt; los tokens de refresh y de recuperación se guardan con hash. |
| RNF-05 | Protección contra fuerza bruta. | Límite de 10 intentos cada 5 minutos por IP en login, Google y recuperación (HTTP 429). |
| RNF-06 | CORS restringido. | Solo los orígenes de `CORS_ORIGINS` (por defecto `http://localhost:5173`). |
| RNF-07 | Validación y errores. | Bean Validation y manejador global con códigos 400, 401, 403, 404, 409, 422 y 500. |
| RNF-08 | Capas separadas. | Controller, Service, Repository y modelo. |
| RNF-09 | Interfaz adaptable. | Bootstrap y media queries. |
| RNF-10 | Pruebas automatizadas. | Vitest en el frontend y JUnit/Mockito en el backend. |

## 6. Modelo de datos

El detalle, con diagrama, está en `docs/diagrama-mer-arquitectura.md`.

| Entidad de la propuesta | Tabla en el sistema |
|---|---|
| USUARIO | `users` |
| PRODUCTO | `products` |
| BOLETA | `sales` (con `user_id` del comprador) |
| DETALLE_BOLETA | `tickets` (un registro por pasajero y asiento) |
| CATEGORIA | Hoy es el campo `products.type` (Clásico, Semi Cama, Salón Cama, Premium) |

Tablas de apoyo: `refresh_tokens`, `password_reset_tokens`, `contact_messages`, eventos de flota y registro de actividad.

## 7. Restricciones y exclusiones

1. Entorno local con Java 17, Maven, Node.js y MariaDB.
2. El pago es simulado.
3. Las compras anteriores a la migración `20261118_sales_user.sql` no están asociadas a un usuario.
4. Sin SMTP configurado, el enlace de recuperación se imprime en el log del backend.

## 8. Trazabilidad con la evaluación

| Indicador | Evidencia |
|---|---|
| Backend y base de datos | `backend/`, `backend/database/schema.sql`, migraciones |
| API REST y Swagger | Controladores con `/api/v1` y `/swagger-ui.html` |
| Integración frontend y backend | `frontend/src/lib/api.js`, proxy de Vite |
| JWT y roles | `SecurityConfig`, `JwtService`, `RefreshTokenService` |
| Sesiones en el frontend | `frontend/src/lib/api.js` (renovación automática) y `getStoredUser` |
| Restricciones en el frontend | `RoleRoute`, `AdminLayout`, `SellerPage`, `SiteLayout` |
| Documentación | `docs/` (ERS, APIs e integración, CSV de endpoints, manual de usuario) |
