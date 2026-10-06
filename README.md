# Viajes por Chile

SPA en React + Vite con API PHP y MariaDB de XAMPP. El catálogo, las cuentas y los mensajes de contacto se guardan en la base `viajes_chile`; el carrito permanece en el navegador.

## Abrir en desarrollo

1. Abre **XAMPP Control Panel** y pulsa **Start** en `Apache` y `MySQL`. Ambos servicios deben quedar activos.
2. Abre [http://localhost/phpmyadmin](http://localhost/phpmyadmin), selecciona la pestaña **Importar** y carga `database/schema.sql`. Esto crea las tablas y las 12 rutas iniciales.
3. Revisa `api/bootstrap.php`. La configuración por defecto usa `root` sin contraseña, habitual en una instalación local de XAMPP. Si tu usuario de MariaDB tiene contraseña, actualiza `DB_USER` y `DB_PASSWORD`.
4. Publica la API PHP en el Apache local desde PowerShell, situado en la carpeta del proyecto:

	```powershell
	New-Item -ItemType Directory -Force C:\xampp\htdocs\api | Out-Null
	Copy-Item .\api\*.php C:\xampp\htdocs\api -Force
	```

	Comprueba la conexión abriendo [http://localhost/api/products.php](http://localhost/api/products.php). Debe aparecer un JSON con 12 productos.

5. Crea la primera cuenta administradora desde la raíz del proyecto:

	```powershell
	C:\xampp\php\php.exe .\api\create_admin.php
	```

	El script pedirá correo y contraseña; esta última se guarda con `password_hash`.

6. Instala dependencias y arranca Vite:

	```powershell
	npm ci
	npm run dev
	```

7. Abre la URL que muestre Vite, normalmente [http://localhost:5173/](http://localhost:5173/). Inicia sesión con la cuenta administradora para entrar al panel; las cuentas normales acceden al menú de rutas.

Vite reenvía `/api` a Apache. Por eso deben estar activos Apache y MySQL también mientras trabajas en desarrollo.

## Publicar dentro de htdocs

Desde la raíz del proyecto:

```powershell
npm run build
New-Item -ItemType Directory -Force C:\xampp\htdocs\Evaluacion-1 | Out-Null
Get-ChildItem .\dist -Force | Copy-Item -Destination C:\xampp\htdocs\Evaluacion-1 -Recurse -Force
New-Item -ItemType Directory -Force C:\xampp\htdocs\api | Out-Null
Copy-Item .\api\*.php C:\xampp\htdocs\api -Force
```

Después abre [http://localhost/Evaluacion-1/](http://localhost/Evaluacion-1/). El `.htaccess` incluido permite que React Router atienda rutas como `/Evaluacion-1/menu` y `/Evaluacion-1/admin`. Si al recargar una ruta Apache responde 404, comprueba que `mod_rewrite` esté habilitado y que Apache permita `.htaccess` (`AllowOverride All`).

## Base de datos y seguridad

- `database/schema.sql` crea `products`, `users` y `contact_messages`, y carga el catálogo inicial.
- `api/` contiene los endpoints PHP; el panel necesita una sesión con rol `admin` para consultar clientes o modificar rutas.
- Las contraseñas se almacenan con hash. No uses la configuración local `root` sin contraseña en un servidor público.
- El carrito sigue en `localStorage`; todavía no hay proceso de compra ni tabla de órdenes.