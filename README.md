# Viajes por Chile

SPA en React + Vite, API REST Spring Boot y MariaDB. El frontend está en `frontend/` y el backend, sus endpoints PHP heredados y los scripts de base de datos están en `backend/`. El catálogo, las cuentas, los mensajes, las ventas y los boletos se guardan en la base `viajes_chile`; el carrito permanece en el navegador.

## Abrir en desarrollo

1. Abre **XAMPP Control Panel** y pulsa **Start** en `MySQL`. Apache no es necesario para la aplicación.
2. Abre [http://localhost/phpmyadmin](http://localhost/phpmyadmin), selecciona la pestaña **Importar** y carga `backend/database/schema.sql`. Esto crea las tablas y las 12 rutas iniciales.
3. Si actualizas una base creada con una versión anterior del esquema, aplica las migraciones pendientes de `backend/database/migrations/` en orden. Una base nueva cargada desde `schema.sql` ya incluye esas tablas y columnas.

4. Configura las variables del backend en la misma terminal desde la que lo iniciarás. Ajusta la conexión si tu MariaDB usa otros datos:

	```powershell
	$env:DB_URL = "jdbc:mariadb://localhost:3308/viajes_chile"
	$env:DB_USER = "root"
	$env:DB_PASSWORD = ""
	$env:JWT_SECRET = "<clave aleatoria de al menos 32 bytes>"
	$env:CORS_ORIGINS = "http://localhost:5173"
	```

5. Inicia Spring Boot desde `backend`:

	```powershell
	Set-Location backend
	mvn spring-boot:run
	```

	La API queda en `http://localhost:8080`; verifica el catálogo en `http://localhost:8080/api/v1/products`.

6. Instala las dependencias del frontend y arranca Vite desde otra terminal en la raíz:

	```powershell
	npm ci --prefix frontend
	npm run dev
	```

7. Abre la URL que muestre Vite, normalmente [http://localhost:5173/](http://localhost:5173/). Para crear el primer administrador, registra una cuenta y asígnale el rol en MariaDB:

	```sql
	UPDATE users SET role = 'admin' WHERE email = 'tu-correo@example.com';
	```

	Luego inicia sesión con esa cuenta para acceder al panel.

Vite reenvía `/api` a Spring Boot. Apache no participa en las solicitudes de la aplicación. La página de descuentos está en `/descuentos`; desde Administración, edita una ruta para configurar su porcentaje y sus salidas. Las compras y los boletos se registran en MariaDB y el panel `/admin/reportes` consulta esos registros.

## Pruebas

Ejecuta `npm test` para correr las pruebas con Vitest o `npm run coverage` para generar el informe de cobertura. Las pruebas específicas de descuentos y reportes están en `frontend/src/pages/DescuentosPage.test.jsx` y `frontend/src/pages/ReportesPage.test.jsx`. En Administración > Reportes, el filtro de período también se aplica al archivo Excel; puedes exportar todo el reporte o filtrar por ventas/compras, boletos, cancelaciones, flota o sucesos. Cada categoría se descarga en hojas separadas. Los datos de demostración cargados mediante seeds no representan actividad real.

### Documentos de evaluación

- [Diagrama de APIs y lógica de negocio](docs/diagrama-apis.md)
- [Especificación de Requisitos de Software (ERS)](docs/ERS-viajes-por-chile.md)
- [Informe de cobertura de pruebas](docs/cobertura-de-pruebas.md)
- [Guía de estudio y exposición individual](docs/guia-exposicion-individual.md)

## Inicio de sesión con Google

1. El formulario de inicio de sesión muestra el botón de Google usando el ID público predeterminado del proyecto; no necesitas crear `.env` para probarlo.
2. Para usar tu propio *ID de cliente OAuth* de tipo Aplicación web, autoriza el origen `http://localhost:5173`, agrega tu correo como usuario de prueba y configura el mismo ID en `VITE_GOOGLE_CLIENT_ID` (frontend) y `GOOGLE_CLIENT_ID` (Spring Boot).
3. Reinicia Vite y Spring Boot después de cambiar la configuración.

El secreto del cliente no se usa ni se guarda en el proyecto.

## API Spring Boot

`backend/` contiene la API REST usada por el frontend (puerto 8080). La interfaz de Swagger está disponible en `http://localhost:8080/swagger-ui/index.html` y la especificación OpenAPI en `http://localhost:8080/v3/api-docs`.

La autenticación entrega un JWT en `POST /api/v1/auth/login` y `POST /api/v1/auth/google`. Las rutas protegidas reciben `Authorization: Bearer <token>`. El API centraliza productos, usuarios, contactos, compras, cancelaciones, eventos de flota y reportes. Las modificaciones administrativas requieren rol `admin`; el rol `seller` solo puede consultar productos y el listado `GET /api/v1/ordenes`. El catálogo, el envío de contacto y las compras simuladas son públicos para usuarios no vendedores.

El frontend conserva el access JWT solo en memoria; el refresh token se entrega en una cookie `HttpOnly`, `Secure` y `SameSite=Strict`, y el perfil no secreto para navegación se guarda en `localStorage`. El cliente renueva el access token al recibir `401`, y el refresh token rota y solo se almacena como hash en MariaDB. El catálogo está disponible en `GET /api/v1/products` y también en `GET /api/v1/productos`; el listado de órdenes devuelve resúmenes sin datos personales. Aplica `backend/database/migrations/20261116_seller_role.sql` y `backend/database/migrations/20261116_jwt_refresh_tokens.sql` a las bases existentes; `backend/database/schema.sql` incluye ambos cambios para bases nuevas.

Antes de iniciar Spring Boot, configura `JWT_SECRET` con una clave aleatoria de al menos 32 bytes; no existe una clave de fallback y la aplicación no inicia sin ella. No la guardes en el repositorio. `JWT_EXPIRATION_MS` es opcional y dura 15 minutos por defecto; `JWT_REFRESH_EXPIRATION_MS` dura 7 días. `CORS_ORIGINS` debe limitarse a los orígenes reales del frontend. La API verifica el usuario y su rol actual en la base de datos en cada solicitud autenticada.

## Publicar dentro de htdocs

Desde la raíz del proyecto:

```powershell
npm run build
$projectName = Split-Path (Get-Location) -Leaf
$htdocsPath = "C:\xampp\htdocs\$projectName"
New-Item -ItemType Directory -Force $htdocsPath | Out-Null
Get-ChildItem .\frontend\dist -Force | Copy-Item -Destination $htdocsPath -Recurse -Force
```

El servidor web debe reenviar `/api` a Spring Boot, y `VITE_API_BASE_URL` debe apuntar a esa API al generar el build. El proxy de `frontend/vite.config.js` solo aplica en desarrollo.

## Base de datos y seguridad

- `backend/database/schema.sql` crea las tablas del catálogo, usuarios, ventas, boletos, mensajes, flota y actividad.
- Spring Boot guarda las contraseñas con BCrypt y requiere JWT para las operaciones protegidas. No uses la configuración local `root` sin contraseña en un servidor público.
- El carrito se conserva en `localStorage`; las compras simuladas y los boletos emitidos se registran en MariaDB.

### Datos para demostraciones locales

Importa `backend/database/seeds/demo_trips.sql` en `viajes_chile` para habilitar ofertas con distintos porcentajes y salidas próximas en cinco rutas. El script actualiza los descuentos y solo agrega horarios cuando la ruta aún no tiene salidas configuradas; está pensado para la base local de demostración, no para producción. Las filas de ventas, flota y actividad que crea el seed son datos de demostración; el panel consulta los datos almacenados en MariaDB.