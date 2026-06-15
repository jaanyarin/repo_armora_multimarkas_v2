# SDD - Contexto y glosario

## Vision

Construir una plataforma comercial y operativa para ARMORA donde administradores, clientes y proveedores trabajen sobre el mismo nucleo de datos: productos, precios, stock, pedidos, ventas, pagos, almacenes y reportes.

## Actores

Admin:

- Gestiona usuarios, roles, permisos, clientes, proveedores, productos, almacenes, listas de precios, pedidos, ventas, reportes y configuracion.

Cliente:

- Accede desde celular.
- Ve catalogo de productos segun su perfil/lista de precios.
- Gestiona su perfil.
- Agrega productos al carrito.
- Crea pedidos.
- Consulta historial y estado de pedidos.
- En fase futura, paga desde el celular.

Proveedor:

- Accede desde web y celular.
- Gestiona sus productos o productos asignados.
- Controla almacen/stock segun permisos.
- Consulta ventas, pedidos y reportes asociados.

Operador interno:

- Puede gestionar inventario, validar pedidos, procesar ventas y atender incidencias.

Transportista/vendedor futuro:

- Puede operar rutas, entregas, preventas, devoluciones y cobranza si se decide ampliar el alcance.

## Dominios principales

Identidad y acceso:

- Usuarios, roles, permisos, perfiles, sesiones, auditoria.

Catalogo:

- Productos, categorias, subcategorias, marcas, unidades de medida, imagenes, combos, listas de precios.

Clientes:

- Datos fiscales/comerciales, direcciones, contactos, perfil de compra, lista de precios, estado comercial.

Proveedores:

- Datos fiscales/comerciales, usuarios vinculados, productos/almacenes asignados, ventas y reportes.

Inventario:

- Almacenes, stock, movimientos, reservas, ajustes, transferencias, alertas.

Pedidos y carrito:

- Carrito, pedido, detalle de pedido, estados, aprobacion, anulacion.

Ventas y facturacion:

- Venta, comprobantes, notas de credito, impuestos, SUNAT.

Pagos:

- Intencion de pago, transaccion, webhooks, conciliacion, reembolso.

Reportes:

- Ventas, stock, pedidos, clientes, proveedores, productos.

## Glosario

Producto:

- Item vendible. Puede tener SKU, codigo interno, unidad de medida, categoria, precio, impuestos, imagenes y stock.

Combo:

- Agrupacion comercial de productos con precio/reglas propias.

Lista de precios:

- Conjunto de precios aplicable a clientes, proveedores, rutas o segmentos.

Almacen:

- Ubicacion logica/fisica de stock.

Stock disponible:

- Stock fisico menos reservas activas.

Reserva:

- Cantidad bloqueada por carrito/pedido pendiente.

Carrito:

- Seleccion temporal de productos previa a crear un pedido.

Pedido:

- Solicitud formal de compra creada por cliente o actor autorizado.

Venta:

- Transaccion comercial confirmada, normalmente posterior a aprobacion/preparacion del pedido.

Proveedor:

- Actor externo que puede controlar stock, consultar ventas o gestionar productos segun permisos.

Permiso:

- Accion atomica sobre recurso. Ejemplo: `products.create`, `orders.approve`.

Rol:

- Agrupacion de permisos.

Scope:

- Restriccion de alcance: por empresa, almacen, proveedor, cliente, ruta o zona.

SUNAT:

- Integracion tributaria para comprobantes electronicos en Peru.
