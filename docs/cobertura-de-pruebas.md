# Informe de cobertura de pruebas

## Resumen de ejecución

Se ejecutaron las pruebas sobre el estado del proyecto después de incorporar el filtro por tipo de servicio y ampliar los casos de componentes y lógica de dominio.

| Comando | Resultado |
|---|---|
| `npm test -- --run` | PASS — 15 archivos de prueba, 38 casos aprobados, 0 fallidos. |
| `npm test -- --run src/pages/DescuentosPage.test.jsx` | PASS — 1 archivo, 3 casos. |
| `npm test -- --run src/pages/ReportesPage.test.jsx` | PASS — 1 archivo, 3 casos. |
| `npm run coverage` | PASS — 15 archivos, 38 casos aprobados y reporte V8 generado. |
| `npm run build` | PASS — Vite generó el build de producción. |

La ejecución de cobertura informa:

| Métrica | Resultado | Cubiertos / total |
|---|---:|---:|
| Sentencias | 76,76% | 370 / 482 |
| Ramas | 62,68% | 215 / 343 |
| Funciones | 70,05% | 138 / 197 |
| Líneas | 80,41% | 312 / 388 |

Los porcentajes se refieren a los módulos que informa el recolector de cobertura V8 en esta configuración. No implican que todas las funciones del repositorio estén probadas ni que cada rama de negocio se haya ejecutado.

## Alcance cubierto

- **Descuentos:** cálculo redondeado, representación de precios y estados de carga/error/lista.
- **Reportes:** período inicial, cambio del período, métricas/eventos y control de acceso.
- **Catálogo:** cálculo de tarifas normales/especiales, trayectos inválidos, formato de precio e imágenes.
- **API frontend:** configuración de `fetch`, credenciales, cabeceras, respuestas HTTP inválidas y desconexión.
- **Contextos:** carga/creación/edición/eliminación del catálogo y carrito con precio rebajado y salida seleccionada.
- **Cuenta y ayuda:** acceso, restricción del modo administrador, errores de autenticación, validación de registro y envío de contacto.
- **Administración y catálogo:** representación de rutas, edición de descuento/salidas y nuevo filtro de tipos de servicio.
- **Checkout y boletos:** datos de pasajeros enviados a la API, emisión/visualización, error de búsqueda y escape del HTML de descarga.

La configuración de Vitest/RTL usa `jsdom`. Los tests de interfaz no requieren XAMPP ni usan una base de datos real: las dependencias API se simulan en esos casos para aislar el comportamiento del frontend.

## Cobertura observada en módulos clave

| Módulo | Líneas | Funciones | Nota |
|---|---:|---:|---|
| `src/data/catalog.js` | 100% | 100% | Reglas de tarifa y formateo cubiertas. |
| `src/lib/api.js` | 100% | 100% | Solicitudes correctas y condiciones de error cubiertas. |
| `src/context/ProductContext.jsx` | 100% | 100% | Carga, CRUD, error y uso del hook cubiertos. |
| `src/pages/DescuentosPage.jsx` | 100% | 100% | Presentación/ofertas y cálculo cubiertos. |
| `src/pages/ReportesPage.jsx` | 87,5% | 90% | Vista/período principal cubiertos; aún hay ramas de estado por probar. |
| `src/pages/AccountPages.jsx` | 97,82% | 100% | Acceso, registro y contacto; queda al menos una línea sin ejecutar. |
| `src/pages/AdminPage.jsx` | 62,16% | 44,44% | Persisten formularios y caminos de CRUD por cubrir. |
| `src/components/SiteLayout.jsx` | 56,52% | 37,5% | El drawer y parte de la navegación/checkout necesitan más casos. |
| `src/context/CartContext.jsx` | 80,95% | 57,14% | Faltan algunas combinaciones de almacenamiento y mutaciones. |
| `src/pages/TicketsPage.jsx` | 70,37% | 84,61% | Vista/HTML/error cubiertos; aún falta ejercitar toda la acción de descarga/impresión. |

La tabla refleja porcentajes de líneas y funciones por archivo presentados por Vitest/V8. Para todas las métricas y ramas, vuelve a ejecutar `npm run coverage`.

## Relación con la pauta y exclusiones

- Se dispone de más de 10 casos automatizados: se ejecutan **38** con el comando único `npm test -- --run`.
- Las pruebas de las dos páginas solicitadas (`DescuentosPage` y `ReportesPage`) fueron además ejecutadas cada una en un comando separado.
- Se usa **Vitest + React Testing Library + user-event + jsdom**. Jasmine/Karma se omiten deliberadamente según el alcance solicitado; no se declaran instalados ni utilizados.
- La cobertura de líneas es 80,41%, pero no se fijó un mínimo obligatorio en la configuración ni se afirma cobertura total.

## Límites de la evidencia y brechas pendientes

1. No se ejecutó una suite Playwright de navegador; jsdom no sustituye una prueba visual en Chrome/Firefox.
2. No se ejecutaron pruebas de integración sobre endpoints PHP con la MariaDB local durante esta medición. La suite frontend simula respuestas API.
3. La cobertura más baja está en `AdminPage.jsx` y `SiteLayout.jsx`; deben priorizarse el CRUD completo, autorización, estados vacíos/errores del carrito, eliminación, compra y descarga de boletos.
4. Los tests del panel Reportes validan los datos ilustrativos del componente; no prueban métricas reales ni almacenamiento para ventas, cancelaciones, reclamos o eventos de flota.
5. No hay pago real; el checkout registra una compra simulada y emite boletos.

Por lo tanto, el resultado acredita pruebas unitarias/de componentes y build, no una certificación completa de integración o aceptación del sistema.

## Repetir la validación

```powershell
npm ci
npm test -- --run
npm test -- --run src/pages/DescuentosPage.test.jsx
npm test -- --run src/pages/ReportesPage.test.jsx
npm run coverage
npm run build
```

Vitest genera la salida navegable dentro de `coverage/`; ese directorio se excluye de Git para no versionar artefactos generados.
