# Diagrama de APIs y lógica de negocio

## Arquitectura

```mermaid
flowchart LR
  UI[React + Vite] -->|JSON + Bearer JWT /api/v1| API[API REST Spring Boot]
  UI -->|ID token| G[Google Identity]
  API -->|verifica ID token| G
  API -->|JPA| DB[(MariaDB viajes_chile)]
```

En desarrollo, Vite reenvía `/api` a `http://localhost:8080`. El frontend no llama a la API PHP.

## Endpoints

| Endpoint | Métodos | Acceso | Función |
|---|---|---|---|
| `/api/v1/auth/register` | POST | Público | Crea una cuenta cliente y guarda su contraseña con BCrypt. |
| `/api/v1/auth/login` | POST | Público | Verifica correo y contraseña; responde con JWT y datos públicos del usuario. |
| `/api/v1/auth/google` | POST | Público | Verifica la credencial con Google, registra al usuario cliente si hace falta y responde con JWT. |
| `/api/v1/auth/me` | GET | Bearer JWT | Devuelve la cuenta asociada al token. |
| `/api/v1/auth/logout` | POST | Bearer JWT | Confirma el cierre; el cliente elimina el token de sesión. |
| `/api/v1/products` | GET, POST | GET público; POST admin | Lista o crea rutas. |
| `/api/v1/products/{slug}` | GET, PUT, DELETE | GET público; cambios admin | Consulta, actualiza o elimina una ruta. |
| `/api/v1/purchases` | POST | Público | Valida disponibilidad y pasajeros; reserva asientos y crea venta y boletos en una transacción. |
| `/api/v1/purchases/{saleCode}` | GET | Código de compra | Devuelve el detalle de una compra y sus boletos. |
| `/api/v1/sales/cancellations` | POST | Admin | Cancela un boleto o todos los boletos de una compra y recalcula su estado. |
| `/api/v1/contact-messages` | POST, GET | POST público; GET admin | Recibe mensajes/reclamos; lista y filtra la bandeja de administración. |
| `/api/v1/contact-messages/{id}` | PUT, DELETE | Admin | Actualiza estado/notas; elimina lógicamente o, con `?permanent=true`, definitivamente. |
| `/api/v1/fleet-events` | GET, POST | Admin | Lista o registra eventos de flota. |
| `/api/v1/fleet-events/{id}` | PUT, DELETE | Admin | Actualiza o elimina un evento de flota. |
| `/api/v1/reports?period=day\|week\|month\|year` | GET | Admin | Calcula métricas, compras, cancelaciones, flota y actividad desde MariaDB. |
| `/api/v1/users` | GET, POST | Admin | Lista o crea usuarios. |
| `/api/v1/users/{id}` | GET, PUT, DELETE | Admin | Consulta, actualiza o elimina un usuario. |

Las rutas de administración requieren `Authorization: Bearer <token>` con rol `admin`. La API comprueba que la cuenta siga existiendo y consulta su rol actual antes de autorizar la solicitud.

## Flujo de compra

```mermaid
sequenceDiagram
  participant C as Cliente
  participant UI as React
  participant API as Spring Boot
  participant DB as MariaDB
  C->>UI: Elige ruta, salida y pasajeros
  UI->>API: POST /api/v1/purchases
  API->>DB: BEGIN; bloquea la ruta
  API->>DB: Comprueba cupos y asientos activos
  API->>API: Valida pasajeros y calcula descuentos
  API->>DB: Inserta sales y tickets; COMMIT
  API-->>UI: sale_code y boletos
  UI->>API: GET /api/v1/purchases/{saleCode}
  API-->>UI: Detalle de compra y boletos
```

## Autenticación

1. `POST /api/v1/auth/login` recibe `email` y `password`; el verificador BCrypt también admite los hashes creados por la API PHP existente.
2. La API firma un JWT con `JWT_SECRET` y devuelve el usuario sin datos de contraseña.
3. React conserva el token en `sessionStorage` y lo envía como Bearer en las solicitudes protegidas.
4. El login Google valida el ID token con Google y usa el mismo formato de respuesta JWT.
