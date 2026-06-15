# SDD - Roadmap MVP

## Decision tecnica base

Stack aprobado para planificacion:

- Admin web: Next.js + React + TypeScript.
- Mobile cliente: Flutter + Dart.
- Mobile proveedor: Flutter + Dart.
- Backend: Quarkus + Java.
- Base de datos: PostgreSQL.
- Cache/colas: Redis.
- Contratos: OpenAPI.
- Despliegue: servidor fisico con Docker, Nginx/Caddy, HTTPS, backups y monitoreo.

## Fase 0 - Validacion y decisiones

Objetivo:

- Cerrar decisiones funcionales y tecnicas antes de codificar.

Entregables:

- Respuestas a `09_preguntas_validacion.md`.
- ADR de stack final: Next.js + Flutter + Quarkus + PostgreSQL.
- Mapa final de roles/permisos/scopes.
- Alcance cerrado de MVP 1.
- Decision de carrito multi-proveedor o pedido por proveedor.
- Decision de SUNAT directo o proveedor facturador para MVP.

Criterio de salida:

- Stack aprobado.
- Flujos principales aprobados.
- Modelo conceptual aprobado.
- Backend Quarkus aprobado.
- Flutter aprobado para mobile cliente y proveedor.

## Fase 1 - Fundacion tecnica

Objetivo:

- Crear monorepo, API Quarkus, admin web y bases Flutter.

Entregables:

- Monorepo con apps `api-quarkus`, `admin-web`, `mobile-cliente`, `mobile-proveedor`.
- Docker local con PostgreSQL y Redis.
- Quarkus base: REST, OpenAPI, health checks, migraciones.
- Next.js base: layout, login, rutas protegidas.
- Flutter cliente base: estructura, navegacion, tema, login y cliente API.
- Flutter proveedor base: estructura, navegacion, tema, login y cliente API.
- Auth basica.
- Migraciones iniciales.
- CI con lint, typecheck/tests backend, build web y pruebas Flutter base.
- OpenAPI inicial.

Criterio de salida:

- Login funcional en web, mobile cliente y mobile proveedor.
- Usuario admin seed.
- Health check de API.
- APK/debug build generado para ambas apps Flutter.

## Fase 2 - Admin base

Objetivo:

- Gestionar entidades maestras.

Entregables:

- Usuarios, roles, permisos y scopes.
- Empresas, sucursales y almacenes.
- Clientes.
- Proveedores.
- Productos, categorias, unidades y codigos de barras.
- Listas de precios.
- Precios por proveedor/producto.

Criterio de salida:

- CRUDs principales funcionales.
- Auditoria basica.
- Validaciones de permisos en backend.
- OpenAPI actualizado.

## Fase 3 - Catalogo y carrito Flutter cliente

Objetivo:

- Permitir que clientes naveguen catalogo y preparen compra desde la app Flutter cliente.

Entregables:

- Login cliente.
- Perfil cliente.
- Catalogo mobile Flutter.
- Busqueda, filtros y detalle de producto.
- Carrito.
- Checkout a nota de pedido pendiente.
- Reserva de stock con expiracion.
- Registro de pago manual/semi-manual.

Criterio de salida:

- Cliente crea nota de pedido desde celular.
- Pedido aparece en admin.
- Stock se reserva con expiracion.
- App Flutter cliente consume la API Quarkus mediante contrato OpenAPI.

## Fase 4 - Pedidos, inventario y ventas

Objetivo:

- Operar pedidos y stock de forma controlada.

Entregables:

- Bandeja de pedidos admin.
- Aprobar/rechazar/cancelar pedidos.
- Validacion admin de pagos manuales.
- Movimientos de inventario.
- Conversion de pedido a venta.
- Reportes basicos.
- Lectura de codigo de barras para operaciones de almacen.
- Impresion web de documentos basicos.

Criterio de salida:

- Flujo completo: cliente crea pedido, admin valida pago/aprueba, stock se descuenta, venta queda registrada.

## Fase 5 - Flutter proveedor

Objetivo:

- Dar acceso operativo a proveedores desde app Flutter separada.

Entregables:

- Login proveedor.
- Vista de stock.
- Vista de ventas/pedidos asociados.
- Registro de movimientos si aplica.
- Productos asignados.
- Lector de codigo de barras.
- Reportes basicos por scope.

Criterio de salida:

- Proveedor solo ve datos de su scope.
- Admin puede configurar permisos del proveedor.
- App Flutter proveedor opera contra API Quarkus con permisos reales en servidor.

## Fase 6 - Pagos integrados

Objetivo:

- Activar pagos desde celular mediante proveedor integrado.

Entregables:

- PaymentProvider elegido.
- Intenciones de pago.
- Webhooks.
- Conciliacion basica.
- Estados de pago en pedido.
- Reembolsos admin.

Criterio de salida:

- Pedido puede pasar a pagado mediante flujo real o sandbox.
- Webhook duplicado no duplica pagos ni movimientos.

## Fase 7 - SUNAT avanzado y facturacion completa

Objetivo:

- Completar comprobantes electronicos y escenarios tributarios avanzados.

Entregables:

- Series y correlativos avanzados.
- Emision de comprobantes.
- Envio/reintento SUNAT.
- Notas de credito.
- Estados, CDR, XML y PDF.

Criterio de salida:

- Venta genera comprobante y registra estado SUNAT. En MVP 1 ya debe existir emision minima; esta fase completa reintentos, notas de credito y escenarios avanzados.

## Criterios generales de calidad

- Cada feature nueva debe tener spec.
- Cada endpoint nuevo debe estar en OpenAPI.
- Cada regla de negocio critica debe tener prueba.
- Cada decision tecnica relevante debe tener ADR.
- Cada pantalla debe tener estados loading, empty y error.
- Toda mutacion critica debe auditarse.
- Cada release mobile debe generar APK de cliente y proveedor cuando corresponda.
