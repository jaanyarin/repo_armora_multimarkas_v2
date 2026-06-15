# SDD - Arquitectura

## Vista general

```text
Admin Web (Next.js)    Mobile Cliente (Flutter)    Mobile Proveedor (Flutter)
        |                        |                           |
        | HTTPS / JSON           | HTTPS / JSON              | HTTPS / JSON
        v                        v                           v
                         API Quarkus / REST / OpenAPI
                                      |
        ---------------------------------------------------------------
        |        |         |        |          |        |             |
      Auth    Catalog   Orders   Inventory   Payments   Sales      Billing
        |        |         |        |          |        |             |
        ---------------------------------------------------------------
                                      |
                              PostgreSQL + JPA/Flyway
                                      |
                         Redis / Workers / Object Storage
                                      |
                         SUNAT / Payment Providers / Email / Push
```

## Principios

- API-first: web y mobile consumen los mismos contratos versionados.
- Backend Quarkus como nucleo transaccional.
- Modular monolith: modulos separados en codigo, una sola base transaccional inicial.
- Server-side authorization: todos los permisos se validan en API.
- Auditabilidad: toda accion critica queda registrada.
- Idempotencia: pagos, webhooks y operaciones sensibles no deben duplicar efectos.
- Evolucion gradual: dejar limites claros para separar servicios en el futuro.
- Mobile separado por rol: cliente y proveedor tienen apps distintas para evitar exposicion de funciones por error.

## Contratos entre capas

El backend Quarkus publica OpenAPI como contrato oficial.

- Next.js consume la API mediante cliente TypeScript o servicios tipados.
- Flutter cliente consume la API mediante cliente Dart generado o capa de servicios Dart.
- Flutter proveedor consume la misma API, pero con permisos/scopes distintos.
- Ninguna app debe asumir reglas criticas en cliente; precio, stock, permisos, pago y facturacion se recalculan/validan en servidor.

## Modulos backend Quarkus

AuthModule:

- Login, refresh token, logout, recuperacion de contrasena.
- Sesiones/dispositivos.

AccessControlModule:

- Roles, permisos, scopes.
- Filtros/guards/interceptors de Quarkus para autorizacion.

UsersModule:

- Usuarios internos, clientes y proveedores con cuenta.

CustomersModule:

- Clientes, direcciones, contactos, condiciones comerciales.

SuppliersModule:

- Proveedores, usuarios vinculados, productos/almacenes asociados.

CatalogModule:

- Productos, categorias, unidades, imagenes, combos y codigos de barras.

PricingModule:

- Precios por proveedor/producto, listas, vigencias y descuentos.

InventoryModule:

- Almacenes, stock, movimientos, reservas, ajustes y transferencias.

CartModule:

- Carritos persistentes por cliente.

OrdersModule:

- Pedidos, estados, aprobaciones, cancelaciones y subpedidos por proveedor si aplica.

SalesModule:

- Ventas, comprobantes, notas de credito futuras.

PaymentsModule:

- Intenciones, pagos manuales, transacciones, webhooks, conciliacion y reembolsos.

BillingModule:

- SUNAT, proveedor facturador externo, series, correlativos, XML/PDF/CDR y reintentos.

ReportsModule:

- Consultas optimizadas, reportes y exportaciones.

NotificationsModule:

- Emails, push notifications, alertas de stock y avisos de pago/pedido.

AuditModule:

- Bitacora de cambios y acciones criticas.

## Seguridad

Autenticacion:

- Access JWT corto.
- Refresh token rotativo almacenado de forma segura.
- Mobile Flutter: refresh token en almacenamiento seguro del dispositivo.
- Web: cookie httpOnly o BFF session, segun implementacion final.

Autorizacion:

- RBAC por permisos atomicos.
- Scopes por entidad: empresa, sucursal, almacen, proveedor, cliente, zona/ruta.
- Ejemplo: un proveedor puede tener `inventory.read` pero solo para `supplierId=123` y almacenes asignados.

Datos sensibles:

- No registrar tokens, contrasenas, numeros completos de tarjeta ni secretos.
- Cifrar secretos de integraciones.
- Rotacion de claves.
- Separar archivos publicos e internos: imagenes de catalogo, evidencias de pago, XML/PDF/CDR y documentos privados.

## Transacciones criticas

Crear pedido:

1. Validar cliente activo.
2. Validar carrito no vacio.
3. Recalcular precios en servidor.
4. Validar proveedor/producto/precio vigente.
5. Validar stock disponible.
6. Crear pedido.
7. Crear subgrupos por proveedor si el carrito es multi-proveedor.
8. Crear reservas de stock.
9. Registrar auditoria.

Cancelar pedido:

1. Validar estado cancelable.
2. Liberar reservas.
3. Cambiar estado.
4. Registrar auditoria.

Confirmar pago manual:

1. Validar evidencia/codigo de operacion.
2. Validar permiso admin.
3. Aprobar o rechazar pago.
4. Actualizar estado de pedido.
5. Registrar auditoria.
6. Encolar notificacion.

Confirmar pago por webhook:

1. Recibir webhook.
2. Verificar firma.
3. Verificar idempotencia.
4. Actualizar transaccion.
5. Actualizar pedido si corresponde.
6. Encolar notificacion.

Emitir comprobante:

1. Validar venta confirmada.
2. Validar cliente y datos tributarios.
3. Crear comprobante.
4. Generar XML/PDF.
5. Enviar a SUNAT o proveedor facturador.
6. Guardar respuesta y estado.
7. Registrar auditoria.

## Integraciones

SUNAT:

- Mantener aislada en `BillingModule`.
- Usar colas para envios y reintentos.
- Guardar payloads, respuestas, XML, PDF, CDR y estados.
- Permitir proveedor externo mediante interfaz `BillingProvider`.

Pagos:

- Adaptadores por proveedor.
- Pago manual como primer adaptador.
- Webhook controller por proveedor cuando aplique.
- Tabla interna de transacciones independiente.

Email/push:

- Plantillas versionadas.
- Envio asincrono.
- Push notification a Flutter mediante FCM.

## Ambientes

Local:

- Docker Compose con PostgreSQL, Redis, API Quarkus y admin web.
- Apps Flutter ejecutadas en emulador/dispositivo, conectadas a la API local o staging.

Staging:

- Datos anonimizados o seeds.
- Pagos en sandbox o flujo manual de prueba.
- SUNAT en ambiente de prueba si aplica.
- APKs de prueba para cliente/proveedor.

Produccion:

- Backups automaticos.
- Monitoreo.
- Alertas.
- Migraciones controladas.
- HTTPS obligatorio.
- Base de datos y Redis no expuestos a internet.
