# SDD - Modelo de datos inicial

Este modelo es conceptual y puede conservar nombres heredados o equivalentes en ingles cuando provienen del analisis inicial.

Decision vigente: toda implementacion fisica debe usar nombres en espanol y `snake_case`, segun `17_convencion_nombres_tecnicos.md`. Esto aplica a tablas, columnas, enums, indices, constraints, funciones, procedimientos, triggers y migraciones.

## Mapeo conceptual a fisico (V1 migration)

| Concepto (ingles) | Tabla fisica | Estado |
|---|---|---|
| User | `usuarios` | Creada en V1 |
| Company | `empresas` | Creada en V1 |
| Branch | `sucursales` | Creada en V1 |
| Role | `roles` | Creada en V1 |
| Permission | `permisos` | Creada en V1 |
| UserRole | `usuarios_roles` | Creada en V1 |
| RolePermission | `roles_permisos` | Creada en V1 |
| AccessScope | `alcances_acceso` | Creada en V1 |
| AuditLog | `registros_auditoria` | Creada en V1 |
| PlatformMetadata | `metadatos_plataforma` | Creada en V1 |

Enums creados: `tipo_usuario` (ADMINISTRADOR, OPERADOR, CLIENTE, PROVEEDOR), `estado_registro` (ACTIVO, INACTIVO, BLOQUEADO), `tipo_alcance_acceso`.

Funcion creada: `asignar_actualizado_en()` para actualizacion automatica de `actualizado_en`.

Columnas normalizadas: `creado_en`, `actualizado_en`, `clave_hash`.

> Nota: No editar V1 luego de compartida. Nuevas tablas deben entrar por migraciones incrementales (V2, V3, ...).

## Identidad y permisos

User:

- id
- username
- email
- passwordHash
- type: ADMIN, OPERATOR, CUSTOMER, SUPPLIER
- status: ACTIVE, INACTIVE, BLOCKED
- lastLoginAt
- createdAt, updatedAt

Company:

- id
- legalName
- commercialName
- ruc
- status

Branch:

- id
- companyId
- name
- address
- status

Role:

- id
- name
- description
- isSystem

Permission:

- id
- code
- description
- module

UserRole:

- userId
- roleId

RolePermission:

- roleId
- permissionId

AccessScope:

- id
- userId
- scopeType: COMPANY, WAREHOUSE, SUPPLIER, CUSTOMER, ROUTE, ZONE
- scopeId

## Clientes

Customer:

- id
- code
- documentType
- documentNumber
- businessName
- commercialName
- email
- phone
- status
- priceListId
- creditEnabled
- createdAt, updatedAt

CustomerAddress:

- id
- customerId
- label
- country
- department
- province
- district
- ubigeo
- addressLine
- reference
- isDefault

CustomerContact:

- id
- customerId
- name
- phone
- email
- role

## Proveedores

Supplier:

- id
- code
- documentType
- documentNumber
- businessName
- commercialName
- email
- phone
- status

SupplierUser:

- supplierId
- userId

SupplierProduct:

- supplierId
- productId
- editableBySupplier
- status

SupplierProductPrice:

- id
- supplierId
- productId
- currency
- price
- validFrom
- validTo
- status

SupplierWarehouse:

- supplierId
- warehouseId

## Catalogo

Product:

- id
- code
- sku
- name
- description
- unitId
- categoryId
- subcategoryId
- taxProfileId
- status
- isSellable
- isBonus
- createdAt, updatedAt

ProductImage:

- id
- productId
- url
- sortOrder
- isPrimary

Category:

- id
- name
- sortOrder

Subcategory:

- id
- categoryId
- name
- sortOrder

Unit:

- id
- name
- symbol

PriceList:

- id
- code
- name
- currency
- status

PriceListItem:

- id
- priceListId
- productId
- price
- validFrom
- validTo

## Inventario

Warehouse:

- id
- branchId
- code
- name
- status
- alertLowStock

Stock:

- id
- warehouseId
- productId
- physicalQty
- reservedQty
- availableQty
- minQty
- updatedAt

InventoryMovement:

- id
- warehouseId
- productId
- type: IN, OUT, ADJUSTMENT, RESERVATION, RELEASE, TRANSFER
- quantity
- referenceType
- referenceId
- reason
- createdBy
- createdAt

StockReservation:

- id
- orderId
- productId
- warehouseId
- quantity
- status: ACTIVE, RELEASED, CONSUMED
- expiresAt

Barcode:

- id
- productId
- code
- type
- isPrimary

## Carrito y pedidos

Cart:

- id
- customerId
- status: ACTIVE, CONVERTED, ABANDONED
- createdAt, updatedAt

CartItem:

- id
- cartId
- productId
- quantity
- unitPriceSnapshot

Order:

- id
- code
- customerId
- addressId
- status: PENDING, CONFIRMED, PREPARING, SHIPPED, DELIVERED, CANCELLED
- paymentStatus: UNPAID, PENDING, PAID, FAILED, REFUNDED
- subtotal
- taxTotal
- discountTotal
- total
- notes
- createdAt, updatedAt

OrderItem:

- id
- orderId
- productId
- quantity
- unitPrice
- taxAmount
- total

OrderStatusHistory:

- id
- orderId
- fromStatus
- toStatus
- reason
- changedBy
- createdAt

## Pagos

PaymentIntent:

- id
- orderId
- provider
- providerIntentId
- amount
- currency
- status
- idempotencyKey
- createdAt, updatedAt

PaymentTransaction:

- id
- paymentIntentId
- providerTransactionId
- eventType
- status
- rawPayloadRef
- createdAt

ManualPaymentEvidence:

- id
- orderId
- method: YAPE, PLIN, TRANSFER
- operationCode
- imageUrl
- status: PENDING_REVIEW, APPROVED, REJECTED
- reviewedBy
- reviewedAt

## Ventas y facturacion

Sale:

- id
- code
- orderId
- customerId
- status
- subtotal
- taxTotal
- total
- createdAt

Invoice:

- id
- saleId
- documentType
- series
- number
- status
- sunatStatus
- xmlUrl
- pdfUrl
- cdrUrl

## Auditoria

AuditLog:

- id
- actorUserId
- action
- entityType
- entityId
- beforeJson
- afterJson
- ipAddress
- userAgent
- createdAt

## Reglas de integridad iniciales

- `Stock.availableQty = physicalQty - reservedQty`.
- Un pedido confirmado no debe cambiar precios aunque cambie la lista de precios.
- Si el precio depende de proveedor, el pedido debe guardar `supplierId` y `unitPrice` congelado por item.
- Un producto desactivado no aparece en catalogo, pero permanece en historicos.
- Toda mutacion de stock debe generar `InventoryMovement`.
- Toda transicion de pedido debe generar `OrderStatusHistory`.
- Todo pago por webhook debe ser idempotente.
- Toda reserva debe expirar o consumirse para evitar stock bloqueado.
