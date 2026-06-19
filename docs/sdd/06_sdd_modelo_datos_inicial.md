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

## Mapeo conceptual a fisico (V2-V6 migrations)

| Concepto (ingles) | Tabla fisica | Migracion | Estado |
|---|---|---|---|
| Staff/Employee | `personal` | V2 | Creada |
| Route | `mapas_rutas` | V2 | Creada |
| PersonalRoutes | `personal_mapas_rutas` | V2 | Creada |
| PersonalWarehouses | `personal_almacenes` | V2 | Creada |
| PersonalPriceLists | `personal_listas_precios` | V2 | Creada |
| Ubigeo | `ubigeo` | V3 | Creada |
| SeedUbigeo | `ubigeo` (datos) | V4 | Poblada |
| PersonalPermissions | `personal_permisos` | V5 | Creada |
| Cargo | `personal.cargo` | V5 | Columna agregada |
| Area | `personal.area` | V5 | Columna agregada |
| Sede | `personal.sede` | V5 | Columna agregada |
| Personal.estado | `personal.estado` | V6 | Columna agregada |

## Personal (staff / employees)

### personal

| Columna | Tipo | Descripcion |
|---|---|---|
| id | uuid PK | Identificador unico |
| usuario_id | uuid FK -> usuarios | Cuenta de usuario asociada |
| nombres_completos | varchar(255) | Nombres y apellidos |
| tipo_documento | enum(tipo_documento_personal) | DNI, CEXT, CDIP, RUC, PASS, etc. |
| numero_documento | varchar(20) | Numero de documento |
| sexo | enum(sexo_personal) | MASCULINO, FEMENINO, etc. |
| estado_civil | enum(estado_civil_personal) | SOLTERO, CASADO, etc. |
| fecha_nacimiento | date | Fecha de nacimiento |
| cargo | varchar(180) | Cargo laboral |
| area | varchar(180) | Area/departamento |
| sede | varchar(180) | Sede de trabajo |
| email_contacto | varchar(180) | Correo de contacto |
| email_personal | varchar(180) | Correo personal |
| telefono_fijo | varchar(20) | Telefono fijo |
| telefono_celular | varchar(20) | Telefono celular |
| direccion | text | Direccion domicilio |
| referencia | text | Referencia de direccion |
| contacto_emergencia | text | Nombre y telefono de emergencia |
| ubigeo_codigo | varchar(10) | Codigo ubigeo |
| departamento_nombre | varchar(100) | Departamento (texto legible) |
| provincia_nombre | varchar(100) | Provincia (texto legible) |
| distrito_nombre | varchar(100) | Distrito (texto legible) |
| foto_url | text | URL de foto de perfil |
| es_vendedor | boolean | Indica si es vendedor |
| es_transportista | boolean | Indica si es transportista |
| estado | estado_registro | ACTIVO, INACTIVO, BLOQUEADO. Default ACTIVO |
| observaciones | text | Notas adicionales |
| creado_en | timestamptz | Fecha de creacion |
| actualizado_en | timestamptz | Fecha de actualizacion |

Constraints:
- `uq_personal_usuario`: unico por usuario_id
- `uq_personal_documento`: unico por (tipo_documento, numero_documento)
- `fk_personal_usuario`: FK a usuarios ON DELETE CASCADE

### personal_permisos

| Columna | Tipo | Descripcion |
|---|---|---|
| personal_id | uuid PK, FK -> personal | Personal asociado |
| codigo_permiso | varchar(255) PK | Codigo del permiso (ej. "Almacenes > Crear Inventario") |
| grupo | varchar(100) | Grupo de modulo del permiso |
| creado_en | timestamptz | Fecha de creacion |

### mapas_rutas

| Columna | Tipo | Descripcion |
|---|---|---|
| id | uuid PK | Identificador unico |
| nombre | varchar(140) UNIQUE | Nombre de la ruta |
| descripcion | text | Descripcion |
| estado | enum(estado_registro) | ACTIVO, INACTIVO, BLOQUEADO |
| creado_en | timestamptz | Fecha de creacion |
| actualizado_en | timestamptz | Fecha de actualizacion |

### personal_mapas_rutas (junction)

| Columna | Tipo | Descripcion |
|---|---|---|
| personal_id | uuid PK, FK -> personal | Personal |
| mapa_ruta_id | uuid PK, FK -> mapas_rutas | Ruta asignada |
| creado_en | timestamptz | Fecha de asignacion |

### personal_almacenes (junction)

| Columna | Tipo | Descripcion |
|---|---|---|
| personal_id | uuid PK, FK -> personal | Personal |
| almacen_id | uuid PK | Almacen asignado (FK futura a almacenes) |
| creado_en | timestamptz | Fecha de asignacion |

### personal_listas_precios (junction)

| Columna | Tipo | Descripcion |
|---|---|---|
| personal_id | uuid PK, FK -> personal | Personal |
| lista_precio_id | uuid PK | Lista de precio asignada (FK futura a listas_precios) |
| creado_en | timestamptz | Fecha de asignacion |

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
