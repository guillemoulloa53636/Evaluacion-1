# Diagrama Entidad-Relación (MER) y arquitectura

## Modelo Entidad-Relación

```mermaid
erDiagram
    USERS ||--o{ REFRESH_TOKENS : "emite"
    SALES ||--|{ TICKETS : "contiene"
    PRODUCTS ||--o{ TICKETS : "se vende como"
    USERS ||--o{ ACTIVITY_LOG : "genera (por nombre)"

    USERS {
        BIGINT id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR password_hash "BCrypt"
        VARCHAR telephone
        VARCHAR region
        VARCHAR commune
        ENUM role "customer|seller|admin"
        TIMESTAMP created_at
    }
    REFRESH_TOKENS {
        BIGINT id PK
        BIGINT user_id FK
        CHAR token_hash UK
        DATETIME expires_at
        TIMESTAMP created_at
    }
    PRODUCTS {
        VARCHAR id PK
        VARCHAR slug
        VARCHAR title
        INT price
        INT discount_percent
        JSON schedules
    }
    SALES {
        BIGINT id PK
        CHAR sale_code UK
        INT total_amount
        ENUM status "pagada|parcial|anulada"
        TIMESTAMP created_at
    }
    TICKETS {
        BIGINT id PK
        BIGINT sale_id FK
        CHAR ticket_code UK
        VARCHAR product_id
        DATE schedule_date
        TIME departure_time
        SMALLINT seat_number
        VARCHAR passenger_name
        VARCHAR passenger_rut
        INT price_paid
        ENUM status "activo|cancelado"
    }
    CONTACT_MESSAGES {
        BIGINT id PK
        VARCHAR name
        VARCHAR email
        TEXT message
        ENUM type "mensaje|reclamo"
        ENUM status
    }
    FLEET_EVENTS {
        BIGINT id PK
        VARCHAR vehicle
        VARCHAR description
    }
    ACTIVITY_LOG {
        BIGINT id PK
        VARCHAR type
        VARCHAR description
        VARCHAR actor
    }
```

## Arquitectura

```mermaid
flowchart LR
    U[Navegador / SPA React + Vite] -- "JSON + JWT Bearer" --> API[Spring Boot /api/v1]
    U -- "cookie httpOnly refresh" --> API
    G[Google Identity Services] -- credential --> U
    API -- verifica credential --> G
    API --> SEC[Spring Security + JwtAuthenticationFilter]
    SEC --> SVC[Servicios: Auth, User, Purchase, Sale, Report]
    SVC --> REPO[Spring Data JPA]
    REPO --> DB[(MariaDB viajes_chile)]
```

Endpoints de cuenta: `POST /auth/login`, `/auth/register`, `/auth/google`, `/auth/refresh`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/change-password` (autenticado), `GET|PUT /auth/me`, `POST /auth/logout`. Tabla asociada: `password_reset_tokens` (user_id, token_hash, expires_at).
