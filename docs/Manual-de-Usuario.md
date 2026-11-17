# Manual de Usuario – Viajes por Chile

**Versión del documento:** 1.0
**Fecha de creación:** 17/11/2026

> **Evidencia de la documentación:** cada imagen debe llevar número, título, la imagen con borde de 1 px negro y una nota debajo. Ejemplo: *Figura 1. Pantalla de inicio de sesión. Nota: muestra los campos de correo y contraseña.*

## Introducción

**Propósito del documento:** explicar cómo usar Viajes por Chile. Está dirigido a clientes que compran boletos, vendedores que consultan productos y órdenes, y administradores que gestionan el sistema.

**Descripción del sistema:** aplicación web para vender boletos de bus a destinos de Chile. Los clientes buscan rutas, compran boletos y revisan su historial. Los vendedores consultan productos y órdenes. Los administradores gestionan rutas, usuarios, mensajes, flota y reportes de ventas.

**Cómo usar este manual:** cada sección corresponde a un perfil. Sigue los pasos en orden y compáralos con las capturas.

## Requisitos del sistema

**Hardware:** computador con 4 GB de RAM o más y conexión a internet.

**Software:**
- Navegador actualizado (Chrome, Edge o Firefox).
- Para instalar el proyecto: Node.js 18 o superior, Java 17 o superior, Maven y MariaDB (XAMPP incluye MariaDB).

## Instalación y configuración

1. **Base de datos:** crear la base `viajes_chile` y ejecutar `database/schema.sql` y las migraciones de `database/migrations`, en orden de fecha. *(Captura: consola de MariaDB con las tablas creadas.)*
2. **Backend:** en la carpeta `backend`, ejecutar `mvn spring-boot:run`. Queda en `http://localhost:8080`. *(Captura: consola con el mensaje de inicio.)*
3. **Frontend:** en la raíz, ejecutar `npm install` y luego `npm run dev`. Queda en `http://localhost:5173`. *(Captura: consola de Vite.)*
4. **Configuración inicial:** variables de entorno opcionales: `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `SPRING_MAIL_HOST` (correo real para recuperar contraseña) y `REFRESH_COOKIE_SECURE=true` en producción. *(Captura: Swagger abierto en `/swagger-ui.html`.)*

## Comenzando

**Crear una cuenta:** en la pantalla de inicio, pulsar "Regístrate" y completar nombre, correo, contraseña, teléfono, región y comuna. *(Captura: formulario de registro.)*

**Iniciar sesión:** ingresar correo y contraseña, o usar el botón de Google. Los administradores también pueden usar "Ingresar como administrador". Según su rol, cada usuario llega a su pantalla: clientes al menú, vendedores a su panel y administradores al dashboard. *(Captura: pantalla de inicio de sesión.)*

**Recuperar la contraseña (sin sesión):** pulsar "¿Olvidaste tu contraseña?", ingresar solo el correo y abrir el enlace que llega por correo para crear la nueva contraseña. El enlace vence en 30 minutos. *(Capturas: pantalla de correo, mensaje de confirmación y pantalla de nueva contraseña.)*

**Interfaz inicial:** barra superior con el menú de rutas, descuentos, nosotros, "Mis datos" y cerrar sesión. *(Captura con anotaciones de cada área.)*

## Uso del software

### Cliente

| Función | Cómo usarla |
|---|---|
| Ver rutas | Entrar a "Menú" y elegir una ruta para ver su detalle, salidas y precio. |
| Comprar boletos | Elegir salida y asientos, ingresar nombre y RUT de cada pasajero y confirmar. Se muestran los boletos con su código. |
| Ver boletos | Abrir el enlace de la compra (`/boletos/código`). |
| Mis datos | Menú "Mis datos": editar nombre, teléfono, región y comuna. |
| Cambiar contraseña | En "Mis datos", sección "Cambiar contraseña": ingresar la actual y la nueva. |
| Historial de compras | Al final de "Mis datos": código, fecha, boletos, total y estado de cada compra. |
| Descuentos y contacto | Menús "Descuentos" y "Servicio" para consultas y reclamos. |

### Vendedor

| Función | Cómo usarla |
|---|---|
| Ver productos | Panel de vendedor, sección "Productos"; pulsar "Ver detalle" en una ruta. |
| Ver órdenes | Sección "Órdenes"; pulsar "Ver detalle" para ver los boletos de la orden. |
| Mis datos | Botón "Mis datos". |

El vendedor no ve otras opciones: el resto del sistema está bloqueado para su rol.

### Administrador

| Función | Cómo usarla |
|---|---|
| Dashboard | Resumen general al entrar a `/admin`. |
| Usuarios | Crear, editar y eliminar usuarios y asignar roles. |
| Rutas | Crear, editar y eliminar rutas y sus salidas. |
| Mensajes | Revisar y responder mensajes y reclamos. |
| Flota | Registrar y gestionar eventos de buses. |
| Reportes | Ventas, boletos, cancelaciones y anulación de boletos. |
| Mis datos | Entrada "Mis datos" en el menú lateral. |

### Navegación por el software

Describir el menú superior (clientes), el panel de vendedor y el menú lateral del administrador. *(Capturas con anotaciones de cada menú.)*

## Mensajes frecuentes

| Mensaje | Qué significa |
|---|---|
| "El correo o la contraseña no son correctos" | Datos de acceso inválidos. |
| "Demasiados intentos" | Se superó el límite de intentos; esperar unos minutos. |
| "El enlace es inválido o ya expiró" | Solicitar un nuevo enlace de recuperación. |
| "La contraseña actual no es correcta" | Revisar la contraseña actual al cambiarla. |
