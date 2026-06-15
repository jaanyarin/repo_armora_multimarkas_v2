# Stack recomendado

## Recomendacion principal actualizada

Usar una arquitectura API-first con backend Quarkus, admin web Next.js y dos aplicaciones moviles Flutter separadas:

- Admin web: Next.js App Router + React + TypeScript.
- Mobile cliente: Flutter + Dart.
- Mobile proveedor: Flutter + Dart.
- Backend API: Quarkus + Java 21+.
- API REST: Quarkus REST.
- Base de datos: PostgreSQL.
- Persistencia: Hibernate ORM con Panache o JPA tradicional.
- Migraciones: Flyway o Liquibase.
- Cache/colas: Redis; para colas avanzadas evaluar Redis Streams, RabbitMQ o Kafka segun crecimiento.
- Archivos: S3 compatible, por ejemplo MinIO en servidor fisico, AWS S3 o Cloudflare R2.
- UI web: Tailwind CSS + shadcn/ui o componentes propios sobre Radix.
- Estado remoto web: TanStack Query.
- Estado mobile: Riverpod, Bloc o Provider; recomendacion inicial: Riverpod.
- Validacion backend: Bean Validation/Jakarta Validation en DTOs Quarkus.
- Contratos: OpenAPI generado desde Quarkus y clientes generados/consumidos por Next.js y Flutter.
- Auth: JWT access token + refresh token rotativo, RBAC por permisos y scopes por entidad.
- Testing: JUnit/RestAssured para backend, Playwright para web, tests Flutter widget/integration para mobile, tests de contrato OpenAPI.

## Por que este stack

Next.js es adecuado para el admin web porque permite construir un panel moderno, mantenible y preparado para formularios, tablas, rutas protegidas, dashboards y operaciones administrativas.

Flutter es adecuado para las apps cliente y proveedor porque ARMORA necesita mobile real, no solo una web responsiva: catalogo, carrito, pedidos, pagos, stock, movimientos de almacen, lector de codigo de barras, notificaciones y experiencia visual consistente. Flutter permite mantener dos apps separadas con una base tecnica compartible en Dart.

Quarkus es adecuado para el backend porque el dominio es transaccional y empresarial: stock, pedidos, pagos, ventas, SUNAT, auditoria, integraciones y consistencia de datos. Encaja bien con PostgreSQL, JPA, transacciones, OpenAPI, seguridad JWT/OIDC, health checks, metricas y despliegue en contenedores.

PostgreSQL es la base recomendada porque el sistema requiere integridad transaccional para stock, reservas, pedidos, pagos, comprobantes, movimientos de almacen y auditoria.

Redis se usa como soporte para cache, rate limiting, sesiones auxiliares, colas ligeras, expiracion de reservas, reintentos de pagos/SUNAT y jobs asincronos.

## Arquitectura recomendada

Monolito modular al inicio, no microservicios.

Motivo: el dominio es grande, pero el equipo necesitara consistencia transaccional y menor complejidad operativa. Separar microservicios desde el dia 1 agregaria riesgos en inventario, pagos, ventas, SUNAT y auditoria. La arquitectura debe separar modulos en codigo para permitir dividir servicios en el futuro si el volumen lo exige.

Estructura sugerida:

```text
apps/
  admin-web/            # Next.js
  mobile-cliente/       # Flutter, catalogo, carrito, pedidos y pagos
  mobile-proveedor/     # Flutter, stock, ventas, productos asignados
  api-quarkus/          # Quarkus
packages/
  contracts/            # OpenAPI generado, clientes TS/Dart, schemas compartidos
  ui-web/               # componentes web si aplica
  mobile-core/          # tema, cliente API, auth, widgets comunes Flutter
  config/               # convenciones, scripts, plantillas
docs/
  sdd/
  adr/
  api/
```

## Backend

Stack:

- Quarkus REST.
- Hibernate ORM with Panache o JPA tradicional.
- PostgreSQL con migraciones versionadas mediante Flyway o Liquibase.
- Redis para cache, expiracion de reservas, rate limiting y jobs ligeros.
- SmallRye OpenAPI para contratos.
- Quarkus OIDC/JWT o SmallRye JWT para seguridad.
- Quarkus Scheduler para tareas programadas.
- Micrometer/OpenTelemetry para metricas/trazabilidad cuando el sistema pase de MVP.
- Health checks para API, base de datos, Redis, jobs, SUNAT y pagos.

Modulos backend por dominio (paquetes `com.armora.*`):

| Paquete | Responsabilidad |
|---|---|
| `auth` | Autenticacion, JWT, refresh tokens |
| `access` | Control de acceso, scopes, sesiones |
| `users` | Usuarios, roles, permisos |
| `customers` | Clientes, zonas, rutas |
| `suppliers` | Proveedores, contratos |
| `catalog` | Productos, categorias, unidades, codigos de barras, combos, servicios |
| `pricing` | Listas de precios, precios por proveedor |
| `inventory` | Stock, movimientos, reservas, almacenes, inventarios |
| `cart` | Carrito, notas de pedido (mobile) |
| `orders` | Pedidos, entregas parciales |
| `sales` | Ventas, puntos de venta, fileteo |
| `payments` | Pagos, conciliacion, idempotencia |
| `billing` | Facturacion, SUNAT, resumen diario, comunicacion de baja, notas de credito |
| `reports` | Reportes, dashboard, cobertura, liquidaciones |
| `audit` | Auditoria de mutaciones criticas |

Cada modulo incluye: `Resource` (endpoint REST), `Service` (caso de uso), `Repository` (consulta), `Entity` (modelo JPA), `DTO` (request/response) y `Mapper` (conversion).

Dependencias Maven principales:

- `quarkus-rest` + `quarkus-rest-jackson`
- `quarkus-hibernate-orm-panache`
- `quarkus-jdbc-postgresql` + `quarkus-flyway`
- `quarkus-smallrye-openapi`
- `quarkus-smallrye-jwt` o `quarkus-oidc`
- `quarkus-redis-client`
- `quarkus-scheduler`
- `quarkus-smallrye-health`
- `quarkus-micrometer` + `quarkus-opentelemetry`

## Admin web

Stack:

- Next.js App Router.
- React Server Components donde haya lectura pesada.
- Client Components para tablas, formularios y acciones.
- TanStack Query para mutaciones y cache cliente.
- TanStack Table o AG Grid Community para grillas complejas.
- React Hook Form + Zod para formularios en cliente.
- shadcn/ui + Tailwind CSS como base visual recomendada.

Pantallas MVP:

- Login.
- Dashboard.
- Usuarios/roles/permisos/scopes.
- Clientes.
- Proveedores.
- Productos/categorias/unidades/codigos de barras.
- Almacenes/stock.
- Pedidos.
- Pagos manuales.
- Ventas.
- SUNAT minimo.
- Reportes basicos.
- Configuracion empresa/sucursal.

## Mobile Flutter

Stack recomendado:

- Flutter + Dart.
- Navegacion: go_router.
- Estado: Riverpod como opcion inicial recomendada.
- Cliente HTTP: Dio o cliente generado desde OpenAPI.
- Almacenamiento seguro: flutter_secure_storage para tokens.
- Cache local: Hive, Isar o SQLite segun necesidad. Para MVP, cache simple + reintentos.
- Formularios: flutter_form_builder o formularios controlados propios.
- Barcode/QR scanner: mobile_scanner u otra libreria compatible.
- Push notifications: Firebase Cloud Messaging.
- Camara/archivos: image_picker/file_picker segun flujo.

Dependencias Flutter sugeridas:

- `go_router` para navegacion.
- `flutter_riverpod` para estado.
- `dio` para HTTP si no se usa cliente generado desde OpenAPI.
- `flutter_secure_storage` para tokens.
- `json_serializable` / `freezed` para DTOs.
- `mobile_scanner` para codigo de barras/QR.
- `firebase_messaging` para push notifications.
- `image_picker` / `file_picker` para evidencias e imagenes.

Dos apps mobile separadas:

- App cliente: catalogo, filtros, detalle, carrito, nota de pedido, pago manual, seguimiento e historial.
- App proveedor: stock, productos asignados, movimientos, ventas/pedidos asociados, lectura de codigo de barras y reportes por scope.

Razon: cliente y proveedor comparten API, autenticacion, tema visual y algunos componentes, pero sus permisos y flujos son diferentes. Separar apps reduce riesgo de exponer funcionalidades incorrectas.

## Contratos API

El contrato oficial sera OpenAPI generado por Quarkus.

Uso recomendado:

- Backend Quarkus publica `/q/openapi` o artefacto OpenAPI versionado.
- Next.js consume cliente TypeScript generado o servicios manuales tipados.
- Flutter consume cliente Dart generado o capa propia basada en el contrato.
- Todo cambio de endpoint debe actualizar contrato, tests y documentacion.

## Pagos

Para Peru, dejar abstraccion de proveedor de pago desde el MVP:

- `PaymentProvider` con adaptadores: pagos manuales, Culqi, Niubiz, Mercado Pago u otro.
- Estados internos independientes del proveedor: `PENDING`, `AUTHORIZED`, `PAID`, `FAILED`, `CANCELLED`, `REFUNDED`.
- Webhooks firmados cuando exista pasarela integrada.
- Idempotencia por `paymentIntentId` o `Idempotency-Key`.

MVP recomendado:

- Yape, Plin y transferencia con evidencia/codigo de operacion.
- Validacion manual por admin.
- Pasarela integrada en fase posterior o sandbox controlado.

## Alternativas consideradas

Expo/React Native:

- Valido si el equipo domina React/TypeScript y se prioriza reutilizacion mental con Next.js.
- No elegido como opcion principal porque ARMORA requiere apps moviles operativas con alto control visual, separacion clara por rol y posible uso intensivo de funcionalidades nativas.

NestJS:

- Valido si se prioriza full-stack TypeScript y velocidad de producto.
- No elegido como opcion principal en esta version porque se aprobo Quarkus como backend empresarial.

Microservicios desde inicio:

- No recomendado para MVP.
- Requiere DevOps, observabilidad y consistencia distribuida desde el primer sprint.

## Decision final aprobada

Adoptar:

- Next.js para admin web.
- Flutter + Dart para mobile cliente.
- Flutter + Dart para mobile proveedor.
- Quarkus + Java para backend API.
- PostgreSQL para base transaccional.
- Redis para cache/colas/expiraciones.
- OpenAPI como contrato entre backend, web y mobile.
- Servidor fisico con Docker, reverse proxy, HTTPS, backups y monitoreo.
