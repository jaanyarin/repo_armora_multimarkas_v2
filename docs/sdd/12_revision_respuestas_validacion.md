# Revision de respuestas de validacion

Fuente: `09_preguntas_validacion.md` actualizado por el usuario.

## Decisiones ya claras

1. El sistema sera multi-sucursal.
2. Los clientes usaran celular para catalogo, carrito y nota de pedido.
3. El precio depende directamente del proveedor.
4. Los proveedores gestionan stock.
5. Los proveedores solo editan productos, no los crean libremente.
6. SUNAT, transportistas, comisiones, canjes y rutas deben considerarse desde MVP salvo decision contraria del admin.
7. Mobile cliente y mobile proveedor seran apps separadas.
8. El despliegue objetivo es servidor fisico.
9. No se requiere offline por ahora.
10. Se usaran codigos de barras en almacen.
11. Se requiere impresion de tickets o documentos desde web.
12. Volumen inicial estimado: 20 usuarios internos, 500 clientes, 50 proveedores, 100 productos, 150 movimientos diarios.

## Comentarios y recomendaciones

### 1. Multi-sucursal

Decision correcta. El modelo debe incluir:

- Empresa.
- Sucursal.
- Almacen.
- Usuario con scopes por sucursal/almacen.

No basta con un campo `almacenId` en usuario. Se necesita una tabla de scopes porque un usuario podria tener acceso a varias sucursales.

### 2. Flujo cliente: carrito -> nota de pedido -> pago -> compra

Recomendacion:

```text
Carrito
  -> Nota de pedido pendiente
  -> Validacion de stock/precio
  -> Pago
  -> Pedido pagado/confirmado
  -> Venta/compra procesada
  -> Comprobante SUNAT
```

La nota de pedido debe congelar precios y cantidades. Si el precio cambia despues, no debe afectar una nota ya confirmada.

### 3. Reserva de stock

Opciones:

Opcion A: reservar al agregar al carrito.

- Ventaja: el cliente ve stock casi garantizado.
- Desventaja: bloquea stock con carritos abandonados.
- No recomendada para este caso.

Opcion B: reservar al crear nota de pedido.

- Ventaja: protege stock mientras el cliente paga.
- Desventaja: requiere expiracion automatica.
- Recomendada.

Opcion C: reservar solo al confirmar pago.

- Ventaja: no bloquea stock antes de pagar.
- Desventaja: el cliente puede pagar y luego no haber stock.
- Riesgosa si el stock cambia rapido.

Decision recomendada:

- Reservar stock al crear la nota de pedido.
- La reserva debe expirar, por ejemplo en 15 a 30 minutos si el pago es online.
- Para transferencia manual, usar estado `PENDING_PAYMENT_VALIDATION` y una expiracion configurable mayor.
- Liberar stock automaticamente si no se paga, se rechaza o se cancela.

### 4. Precio por proveedor

Esto cambia el modelo. Si el precio depende del proveedor, entonces:

- Un producto puede tener uno o varios proveedores.
- El precio debe ser `supplier_product_price`, no solo `product_price`.
- El carrito puede contener productos de distintos proveedores.

Decision necesaria:

- Permitir carrito multi-proveedor y dividirlo en subpedidos por proveedor.
- O limitar cada carrito/pedido a un solo proveedor.

Recomendacion inicial:

- Permitir catalogo multi-proveedor.
- Al checkout, dividir internamente la nota en ordenes por proveedor si hay multiples proveedores.
- Mostrar al cliente claramente si su pedido se separa por proveedor.

### 5. Proveedores gestionan stock

Correcto, pero debe tener control:

- Todo movimiento de proveedor debe auditarse.
- El admin debe poder aprobar ajustes sensibles.
- El proveedor solo ve almacenes asignados.
- El proveedor no debe modificar stock de otros proveedores.

### 6. Proveedores editan productos

Recomendacion:

- El proveedor puede proponer cambios de nombre comercial, imagen, descripcion, disponibilidad o precio.
- El admin aprueba cambios criticos: SKU, impuestos, categoria, unidad, afectacion IGV, datos SUNAT.

Esto evita inconsistencias tributarias y de catalogo.

### 7. Modulos actuales dentro del MVP

Riesgo: incluir SUNAT, transportistas, comisiones, canjes y rutas desde el MVP aumenta bastante el alcance.

Recomendacion pragmatica:

- MVP 1: nucleo obligatorio con SUNAT minimo, pedidos, stock, productos, clientes, proveedores.
- MVP 2: transportistas/rutas.
- MVP 3: comisiones, canjes, concursos.

Si el admin exige todo desde el primer release, se debe ampliar plazo y presupuesto. No conviene prometer "MVP corto" con todos esos modulos.

### 8. Apps mobile separadas

Decision profesional y razonable:

- `mobile-cliente`: catalogo, carrito, pedidos, pagos.
- `mobile-proveedor`: stock, ventas, productos asignados, movimientos.

Para no duplicar demasiado:

- Compartir componentes, tema, cliente API y validaciones en `packages`.
- Mantener builds, permisos y navegacion separados.

### 9. Pagos: Yape, Plin, transferencias, tarjetas

Hay dos categorias:

Pagos integrados:

- Tarjeta con Culqi, Niubiz o Mercado Pago.
- El sistema recibe confirmacion automatica por webhook.
- Mejor trazabilidad.

Pagos semi-manuales:

- Yape, Plin o transferencia por QR/cuenta.
- El cliente sube constancia o codigo de operacion.
- Admin valida y marca como pagado.
- Puede automatizarse despues si el proveedor ofrece API.

Recomendacion:

- MVP: transferencia/Yape/Plin con validacion admin + tarjetas con una pasarela si el presupuesto lo permite.
- Fase siguiente: automatizar webhooks de proveedor de pago.

### 10. Pago despues de confirmacion

Correcto. Flujo recomendado:

1. Cliente crea nota.
2. Sistema valida precio y stock.
3. Sistema reserva stock.
4. Cliente paga.
5. Sistema/admin confirma pago.
6. Pedido se procesa.

### 11. Reembolsos solo admin

Correcto. Agregar permisos:

- `payments.refund.request`
- `payments.refund.approve`
- `payments.refund.execute`

Separar solicitud, aprobacion y ejecucion si hay montos altos.

### 12. SUNAT desde MVP

Si debe emitir comprobantes, entonces SUNAT no puede quedar en fase 7. Debe pasar al MVP, aunque sea con alcance minimo:

- Configurar empresa, series y correlativos.
- Emitir boleta/factura.
- Guardar XML/PDF/CDR.
- Registrar estado SUNAT.
- Reintentar envios fallidos.

Notas de credito pueden quedar para fase posterior si el negocio lo permite.

### 13. Boleta/factura automatico o manual

Recomendacion:

- Configuracion por empresa/sucursal:
  - `AUTO_ON_PAYMENT`
  - `AUTO_ON_DISPATCH`
  - `MANUAL`

Por defecto para MVP:

- `MANUAL` en staging.
- `AUTO_ON_PAYMENT` solo cuando el flujo este bien probado.

### 14. SUNAT directo o proveedor facturador

Mantener ambas opciones es correcto. Disenar interfaz:

```text
BillingProvider
  - SunatDirectProvider
  - ExternalBillingProvider
```

Opciones a evaluar:

- Integracion directa SUNAT.
- Nubefact.
- Facturador PRO/OSE/PSE local.
- Proveedor contable existente si aparece despues.

### 15. Datos en Peru

"Que los datos permanezcan en Peru" significa que la base de datos, backups y archivos se alojan fisicamente en servidores ubicados en Peru. Si usas servidor fisico local, probablemente se cumple. Si usas cloud, depende de la region.

Como no hay exigencia clara, recomendacion:

- No hacerlo requisito duro por ahora.
- Si se manejan datos sensibles, documentar ubicacion de datos y backups.
- Cumplir buenas practicas de proteccion de datos personales.

### 16. Hosting y presupuesto

Opciones:

Servidor fisico:

- Menor pago mensual si ya existe infraestructura.
- Mayor responsabilidad operativa.
- Requiere UPS, backup externo, IP fija, seguridad y monitoreo.

VPS:

- Costo mensual moderado.
- Mejor disponibilidad que una oficina comun.
- Escala simple para el volumen indicado.

Cloud administrado:

- Mayor costo.
- Mejor backup, seguridad y disponibilidad.
- Recomendado si pagos/mobile se vuelven criticos.

Recomendacion:

- Si el negocio exige servidor fisico, usarlo con Docker, backups externos y monitoreo.
- Mantener opcion de migrar a VPS/cloud sin cambiar arquitectura.

### 17. Integraciones ERP/contabilidad futuras

Opciones frecuentes a evaluar:

- Odoo.
- SAP Business One.
- Microsoft Dynamics 365 Business Central.
- Oracle NetSuite.
- Defontana.
- StarSoft.
- CONCAR.
- Siscont.
- Nubefact/facturadores electronicos.

Recomendacion:

- No integrar en MVP.
- Dejar tabla de eventos y exportaciones CSV/XLSX.
- Disenar APIs para ventas, comprobantes, productos, clientes y stock.

## Ajustes recomendados a la documentacion base

Actualizar decisiones base:

- Cambiar mobile unico por rol a dos apps: cliente y proveedor.
- Mover SUNAT a MVP minimo.
- Cambiar pricing para que dependa de proveedor.
- Agregar multi-sucursal y scopes desde el modelo inicial.
- Cambiar pagos de "fase 6" a "preparado desde MVP" y activar primero pagos manuales/semiautomaticos.
- Agregar codigo de barras e impresion como requerimientos MVP.

## Decision final aprobada

> Seccion actualizada para reflejar la decision vigente. Ver `00_indice.md` para la fuente de verdad.

Stack aprobado:

- Admin web: Next.js + React + TypeScript.
- Mobile cliente: Flutter + Dart.
- Mobile proveedor: Flutter + Dart.
- Backend: Quarkus + Java 21+.
- Base: PostgreSQL.
- Cache/colas: Redis.
- Contratos: OpenAPI generado desde Quarkus.
- Despliegue: servidor fisico con Docker Compose, Nginx/Caddy, HTTPS y backups externos.
