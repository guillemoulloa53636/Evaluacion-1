# Viajes por Chile

SPA en React + Vite con API PHP y MariaDB de XAMPP. El catálogo, las cuentas y los mensajes de contacto se guardan en la base `viajes_chile`; el carrito permanece en el navegador.

## Abrir en desarrollo

1. Abre **XAMPP Control Panel** y pulsa **Start** en `Apache` y `MySQL`. Ambos servicios deben quedar activos.
2. Abre [http://localhost/phpmyadmin](http://localhost/phpmyadmin), selecciona la pestaña **Importar** y carga `database/schema.sql`. Esto crea las tablas y las 12 rutas iniciales.
3. Aplica la migración aditiva para habilitar descuentos, salidas, ventas y boletos:

	```powershell
	$projectPath = (Resolve-Path .).Path.Replace('\', '/')
	& C:\xampp\mysql\bin\mysql.exe --host=127.0.0.1 --port=3308 --user=root --execute="source $projectPath/database/migrations/20261008_discounts_and_tickets.sql"
	```

4. La configuración predeterminada de `api/bootstrap.php` conecta a `127.0.0.1:3308`, base `viajes_chile`, usuario `root` y contraseña vacía, habitual en una instalación local de XAMPP. Si definiste una contraseña, configúrala en la variable de entorno `DB_PASSWORD` para el proceso de Apache/PHP.
5. Publica la API PHP en el Apache local desde PowerShell, situado en la carpeta del proyecto:

	```powershell
	New-Item -ItemType Directory -Force C:\xampp\htdocs\api | Out-Null
	Copy-Item .\api\*.php C:\xampp\htdocs\api -Force
	```

	Comprueba la conexión abriendo [http://localhost/api/products.php](http://localhost/api/products.php). Debe aparecer un JSON con 12 productos.

6. Crea una cuenta administradora desde la raíz del proyecto. Si el correo ya existe, el comando actualiza su contraseña y le asigna el rol de administrador:

	```powershell
	C:\xampp\php\php.exe .\api\create_admin.php
	```

	El script pedirá correo y contraseña; esta última se guarda con `password_hash`. Puedes usarlo también para recuperar el acceso a una cuenta existente.

7. Instala dependencias y arranca Vite:

	```powershell
	npm ci
	npm run dev
	```

8. Abre la URL que muestre Vite, normalmente [http://localhost:5173/](http://localhost:5173/). Inicia sesión con la cuenta administradora para entrar al panel; las cuentas normales acceden al menú de rutas.

Vite reenvía `/api` a Apache. Por eso deben estar activos Apache y MySQL también mientras trabajas en desarrollo. La página de descuentos está en `/descuentos`; desde Administración, edita una ruta para configurar su porcentaje de descuento y sus salidas (fecha, hora, andén y cupos). El detalle permite seleccionar una salida y añadir asientos al carrito con el precio rebajado. Al confirmar la compra simulada se asignan asientos, se registran la venta y los boletos en MariaDB, y se abre `/boletos/<código>` para imprimir/guardar como PDF o descargar los boletos en HTML. El panel de reportes está en `/admin/reportes`.

## Pruebas

Ejecuta `npm test` para correr las pruebas con Vitest o `npm run coverage` para generar el informe de cobertura. Las pruebas específicas de descuentos y reportes están en `src/pages/DescuentosPage.test.jsx` y `src/pages/ReportesPage.test.jsx`. El panel de reportes usa cifras locales de demostración, señaladas en la interfaz; no son ventas ni eventos persistidos en la base de datos.

## Publicar dentro de htdocs

Desde la raíz del proyecto:

```powershell
npm run build
$projectName = Split-Path (Get-Location) -Leaf
$htdocsPath = "C:\xampp\htdocs\$projectName"
New-Item -ItemType Directory -Force $htdocsPath | Out-Null
Get-ChildItem .\dist -Force | Copy-Item -Destination $htdocsPath -Recurse -Force
New-Item -ItemType Directory -Force C:\xampp\htdocs\api | Out-Null
Copy-Item .\api\*.php C:\xampp\htdocs\api -Force
```

Después abre `http://localhost/$projectName/`. Vite configura automáticamente ese prefijo a partir del nombre de la carpeta del proyecto, y el `.htaccess` permite recargar rutas React sin fijar el nombre de la carpeta. Si al recargar una ruta Apache responde 404, comprueba que `mod_rewrite` esté habilitado y que Apache permita `.htaccess` (`AllowOverride All`).

## Base de datos y seguridad

- `database/schema.sql` crea las tablas de catálogo, usuarios, ventas, boletos y mensajes de contacto, y carga el catálogo inicial.
- `api/` contiene los endpoints PHP; el panel necesita una sesión con rol `admin` para consultar usuarios compradores o modificar rutas. La sección **Usuarios** muestra solo cuentas con rol `customer`.
- Las contraseñas se almacenan con hash. No uses la configuración local `root` sin contraseña en un servidor público.
- El carrito se conserva en `localStorage`; las compras simuladas y los boletos emitidos se registran en MariaDB.

### Datos para demostraciones locales

Importa `database/seeds/demo_trips.sql` en `viajes_chile` para habilitar ofertas con distintos porcentajes y salidas próximas en cinco rutas. El script actualiza los descuentos y solo agrega horarios cuando la ruta aún no tiene salidas configuradas; está pensado para la base local de demostración, no para producción. Los reportes actuales muestran métricas ilustrativas y no se derivan de ventas reales.