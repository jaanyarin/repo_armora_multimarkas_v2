# Preguntas de validacion

Estas decisiones necesitan aprobacion antes de empezar implementacion.

## Negocio

1. El nuevo sistema manejara una sola empresa o varias empresas/sucursales?
     varias/sucursales
2. Los clientes compraran directamente o sus pedidos siempre requieren aprobacion del admin?
     la idea es que los clientes tengan a disposicion los productos activos en su celular, puedan empaquetarlo como carrito de compras y una vez ya lleno segun sus requerimiento pueda hacer su nota de pedido, aqui puede aumentar o bajar productos, ya confirmado con el pago dela nota, ya se procesa como compra
3. El stock se debe reservar al crear pedido, al aprobar pedido o solo al convertir a venta?
     que es lo mas recomendable, explica las opciones
4. Las listas de precios dependen del cliente, zona/ruta, proveedor o combinacion?
     el precio depende directamente del proveedor
5. Los proveedores gestionan su propio stock o solo ven stock/ventas reportadas por ARMORA?
     gestionan
6. Los proveedores pueden crear productos o solo editar informacion permitida?
     editar
7. Se requiere mantener modulos actuales como SUNAT, transportistas, comisiones, canjes y rutas desde el MVP?
     si, a menos que el admin usuario diga lo contrario
8. El nuevo mobile sera una sola app por rol o apps separadas para cliente y proveedor?
     creo que mas profesional es separado, ya que comparte algunos aspectos, pero no se desea mezclar funcionalidades y asi evito posibles errores

## Pagos

9. Que pasarela se prefiere para Peru: Culqi, Niubiz, Mercado Pago u otra?
     pago con billetera: yape, plin, transferencias, y las mencionadas explicame mas de esto
10. Se aceptaran pagos con tarjeta, Yape/Plin, transferencia, contraentrega o todos?
     mencionado en la pregunta 9
11. El pago ocurre antes de aprobacion del pedido o despues de confirmacion de stock?
     confirmacion
12. Se requeriran reembolsos desde el sistema?
     si, pero lo hara solo los admin de sistema

## Facturacion y SUNAT

13. El MVP debe emitir comprobantes electronicos o puede quedar para fase posterior?
     debe emitir
14. Se emitira boleta/factura automaticamente al pago, al despacho o manualmente?
     dejar abierto las 2 opciones
15. Ya existe proveedor/facturador electronico o se integra directo con SUNAT?
     dejar a las 2 opciones

## Operacion

16. Cuantos usuarios internos, clientes y proveedores se esperan en el primer ano?
     ui: 20, c:500, p:50
17. Cuantos productos y movimientos de stock diarios se esperan?
     un total de casi 100 productos y movimientos 150 diario
18. Se necesita modo offline para proveedores o vendedores?
     no, todo en linea
19. Se usaran lectores de codigo de barras en almacen?
     si
20. Se necesita impresion de tickets o documentos desde web?
     si

## Tecnologia

21. El equipo domina TypeScript/React/Node o hay preferencia por otro stack?
     que otro stack recomendado puede usarse
22. Se desplegara en AWS, Azure, GCP, VPS o infraestructura local?
     servidor fisico
23. Se requiere que los datos permanezcan en Peru?
     no entiendo, explicame
24. Hay restricciones de presupuesto mensual para hosting?
     se busca optimizar, aqui dame opciones
25. Se integrara con algun ERP/contabilidad existente?
     no por el momento, pero dame lista de opciones que existan y poder ver si se toma en cuenta la integracion

## Recomendacion de aprobacion inicial [SUPERSEDED]

> Esta recomendacion fue reemplazada por la decision final documentada en `02_stack_recomendado.md` y `12_revision_respuestas_validacion.md`. El stack aprobado es: Next.js + Quarkus + Flutter + PostgreSQL + Redis. Ver `00_indice.md` para la decision vigente.
