# SDD - Requerimientos

## Alcance MVP recomendado

El MVP debe cubrir:

- Admin web con gestion base.
- Mobile cliente con catalogo, carrito y pedidos.
- Portal proveedor web/mobile con stock y ventas basicas.
- Backend API comun.
- Modelo de roles/permisos.
- Inventario simple con reservas por pedido.
- Pagos preparados desde MVP, empezando por pagos semi-manuales si no se aprueba pasarela automatica.
- Emision SUNAT minima desde MVP.
- Codigo de barras e impresion web como alcance operativo inicial.

## Requerimientos funcionales

### Identidad y permisos

RF-001: El sistema debe permitir iniciar sesion con email/usuario y contrasena.

RF-002: El sistema debe soportar roles: admin, operador, cliente, proveedor.

RF-003: El admin debe poder crear, editar, activar y desactivar usuarios.

RF-004: El admin debe poder asignar roles y permisos.

RF-005: El sistema debe limitar datos por scope: almacen, proveedor, cliente o empresa.

### Clientes

RF-010: El admin debe poder crear, editar, activar/desactivar y consultar clientes.

RF-011: Un cliente debe poder ver y editar datos permitidos de su perfil.

RF-012: Un cliente debe tener una o mas direcciones de entrega.

RF-013: Un cliente debe tener reglas comerciales asignadas. El precio final depende del proveedor del producto y puede combinarse con listas o condiciones del cliente.

RF-014: El cliente solo debe ver productos disponibles para su perfil/lista de precios.

### Proveedores

RF-020: El admin debe poder crear, editar, activar/desactivar y consultar proveedores.

RF-021: Un proveedor debe poder acceder a web y mobile.

RF-022: Un proveedor debe poder ver productos y stock asociados a su cuenta.

RF-023: Un proveedor debe poder consultar ventas/pedidos asociados.

RF-024: Un proveedor debe poder registrar movimientos de almacen si tiene permiso.

### Productos y catalogo

RF-030: El admin debe poder crear, editar, activar/desactivar productos.

RF-031: Un producto debe tener SKU/codigo, nombre, descripcion, unidad, categoria, precio, impuestos, imagenes y estado.

RF-032: El sistema debe soportar categorias y subcategorias.

RF-033: El sistema debe soportar listas de precios.

RF-034: El catalogo mobile debe permitir busqueda, filtros y detalle de producto.

RF-035: El sistema debe soportar precio por proveedor/producto.

### Inventario

RF-040: El sistema debe registrar stock por producto y almacen.

RF-041: El sistema debe registrar movimientos de entrada, salida, ajuste y reserva.

RF-042: Al crear una nota de pedido, el sistema debe reservar stock con expiracion configurable.

RF-043: Si el pedido se cancela, la reserva debe liberarse.

RF-044: El sistema debe emitir alertas de bajo stock.

RF-045: El sistema debe soportar lectura de codigo de barras para operaciones de almacen.

### Carrito y pedidos

RF-050: El cliente debe poder agregar, editar cantidad y quitar productos del carrito.

RF-051: El carrito debe recalcular subtotal, impuestos, descuentos y total.

RF-052: El cliente debe poder crear un pedido desde el carrito.

RF-053: El pedido debe tener estados: borrador, pendiente, confirmado, en preparacion, enviado, entregado, cancelado.

RF-054: El admin debe poder aprobar, rechazar o cancelar pedidos.

RF-055: El cliente debe poder ver historial y estado de pedidos.

### Pagos futuros

RF-060: El sistema debe permitir crear una intencion o registro de pago asociado a una nota de pedido.

RF-061: El sistema debe recibir webhooks del proveedor de pagos cuando el pago sea integrado.

RF-062: El estado de pago debe actualizarse de forma idempotente.

RF-063: El pedido no debe depender de un unico proveedor de pagos.

RF-064: El sistema debe permitir pagos manuales o semi-manuales mediante Yape, Plin o transferencia con validacion de admin.

### Ventas y facturacion

RF-070: El admin debe poder convertir un pedido aprobado en venta.

RF-071: La venta debe generar movimientos de stock.

RF-072: El sistema debe emitir comprobantes electronicos con integracion SUNAT minima desde MVP.

RF-073: El sistema debe soportar notas de credito en fase posterior.

RF-074: El sistema debe permitir emision automatica o manual de comprobantes segun configuracion.

RF-075: El sistema debe soportar impresion web de tickets o documentos.

### Reportes

RF-080: El admin debe consultar reportes de ventas, pedidos, clientes, proveedores, productos y stock.

RF-081: El proveedor debe consultar reportes acotados a su scope.

RF-082: Los reportes deben exportarse a CSV/XLSX en fase posterior.

## Requerimientos no funcionales

RNF-001: API versionada desde el inicio: `/api/v1`.

RNF-002: Toda operacion critica debe tener auditoria.

RNF-003: El backend debe validar permisos en servidor, no solo en UI.

RNF-004: Las operaciones de pedidos, pagos y stock deben ser transaccionales.

RNF-005: Los endpoints mutables deben soportar idempotencia cuando aplique.

RNF-006: La app mobile debe manejar conectividad intermitente con reintentos y estados claros.

RNF-007: Passwords hasheados con algoritmo robusto, por ejemplo Argon2id o bcrypt.

RNF-008: Tokens de acceso cortos y refresh tokens rotativos.

RNF-009: Logs estructurados sin datos sensibles.

RNF-010: Backups automaticos de base de datos.

RNF-011: Migraciones versionadas y reversibles cuando sea posible.

RNF-012: Cobertura minima de pruebas para reglas de negocio criticas.

RNF-013: Tiempos objetivo iniciales: p95 menor a 500 ms para lecturas comunes y menor a 1500 ms para operaciones transaccionales comunes.

RNF-014: Accesibilidad web minima WCAG AA para admin.

RNF-015: Observabilidad con health checks, logs y metricas basicas.
