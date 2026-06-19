# SDD - API y contratos

## Convenciones

Base path:

```text
/api/v1
```

Formato:

```json
{
  "data": {},
  "meta": {},
  "errors": []
}
```

Errores:

```json
{
  "data": null,
  "meta": {
    "requestId": "req_..."
  },
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "message": "Campo invalido",
      "field": "email"
    }
  ]
}
```

Headers recomendados:

- `Authorization: Bearer <token>`
- `Idempotency-Key: <uuid>` para pagos, pedidos y operaciones criticas.
- `X-Request-Id` generado o propagado.

## Auth

POST `/auth/login`

```json
{
  "username": "admin",
  "password": "secret"
}
```

POST `/auth/refresh`

POST `/auth/logout`

GET `/me`

Respuesta `GET /me`:

```json
{
  "data": {
    "id": "usr_1",
    "username": "admin",
    "type": "ADMIN",
    "permissions": ["products.read", "orders.approve"],
    "scopes": [
      { "type": "WAREHOUSE", "id": "wh_1" }
    ]
  }
}
```

## Usuarios y permisos

GET `/users`

POST `/users`

PATCH `/users/{id}`

GET `/roles`

POST `/roles`

PUT `/roles/{id}/permissions`

## Personal (staff)

GET `/personal`

Query params:

- `page` (default 1)
- `limit` (default 20)
- `search` (nombre, documento)
- `esVendedor`
- `esTransportista`

Respuesta:

```json
{
  "data": {
    "items": [
      {
        "id": "uuid",
        "nombresCompletos": "Juan Perez",
        "tipoDocumento": "DNI",
        "numeroDocumento": "12345678",
        "cargo": "Vendedor",
        "area": "Ventas",
        "sede": "Lima Centro",
        "estado": "ACTIVO"
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 20
  }
}
```

POST `/personal`

Crea un nuevo registro de personal. Request:

```json
{
  "nombresCompletos": "Juan Perez",
  "tipoDocumento": "DNI",
  "numeroDocumento": "12345678",
  "sexo": "MASCULINO",
  "estadoCivil": "SOLTERO",
  "fechaNacimiento": "1990-01-15",
  "cargo": "Vendedor",
  "area": "Ventas",
  "sede": "Lima Centro",
  "emailContacto": "juan@armora.com",
  "emailPersonal": "juan@gmail.com",
  "telefonoFijo": "01-1234567",
  "telefonoCelular": "987654321",
  "direccion": "Av. Siempre Viva 123",
  "referencia": "Cerca del parque",
  "contactoEmergencia": "Maria Perez / 987654322",
  "ubigeoCodigo": "150101",
  "departamentoNombre": "Lima",
  "provinciaNombre": "Lima",
  "distritoNombre": "Lima",
  "fotoUrl": "/files/photos/uuid-foto.jpg",
  "esVendedor": true,
  "esTransportista": false,
  "observaciones": "Vendedor zona norte"
}
```

GET `/personal/{id}`

Retorna detalle completo con los 29 campos del personal + usuario asociado.

PUT `/personal/{id}`

Actualiza datos del personal. Mismos campos que POST.

PATCH `/personal/{id}/cambiar-clave`

Solo ADMINISTRADOR. Request:

```json
{
  "claveTemporal": "Temp2026!",
  "exigirCambio": true
}
```

### Permisos de personal

GET `/personal/{id}/permisos`

Retorna lista de permisos de modulo asignados:

```json
{
  "data": [
    { "codigoPermiso": "Almacenes > Crear Inventario", "grupo": "Almacenes" },
    { "codigoPermiso": "Ventas > Ver Ventas", "grupo": "Ventas" }
  ]
}
```

PUT `/personal/{id}/permisos`

Reemplaza todos los permisos del personal (envio batch). Solo ADMINISTRADOR.

```json
{
  "permisos": [
    { "codigoPermiso": "Almacenes > Crear Inventario", "grupo": "Almacenes" }
  ]
}
```

### Recursos asignados

GET `/personal/{id}/recursos`

Retorna rutas, almacenes y listas de precios asignadas:

```json
{
  "data": {
    "rutasIds": ["uuid1", "uuid2"],
    "rutasNombres": ["Ruta Norte", "Ruta Sur"],
    "almacenesIds": ["uuid3"],
    "listasPreciosIds": ["uuid4"]
  }
}
```

PUT `/personal/{id}/recursos`

Reemplaza todos los recursos asignados. Solo ADMINISTRADOR.

```json
{
  "rutasIds": ["uuid1", "uuid2"],
  "almacenesIds": ["uuid3"],
  "listasPreciosIds": ["uuid4"]
}
```

## Files (fotos / archivos)

POST `/files/upload`

Sube un archivo de foto (multipart). Extensiones permitidas: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`. Tamaño maximo: 5MB.

Request: `Content-Type: multipart/form-data`

| Campo | Tipo | Descripcion |
|---|---|---|
| file | FileUpload | Archivo de imagen |

Response:

```json
{
  "data": {
    "url": "/files/photos/uuid-foto.jpg",
    "fileName": "uuid-foto.jpg",
    "originalName": "foto_perfil.jpg",
    "size": 123456
  }
}
```

GET `/files/photos/{fileName}`

Sirve el archivo de foto estatico (dev mode; en produccion lo sirve Nginx/Caddy directamente).

## Clientes

GET `/customers`

POST `/customers`

GET `/customers/{id}`

PATCH `/customers/{id}`

POST `/customers/{id}/addresses`

PATCH `/customers/{id}/addresses/{addressId}`

## Proveedores

GET `/suppliers`

POST `/suppliers`

GET `/suppliers/{id}`

PATCH `/suppliers/{id}`

PUT `/suppliers/{id}/products`

PUT `/suppliers/{id}/warehouses`

PUT `/suppliers/{id}/product-prices`

GET `/supplier-portal/stock`

GET `/supplier-portal/sales`

## Catalogo

GET `/products`

POST `/products`

GET `/products/{id}`

PATCH `/products/{id}`

POST `/products/{id}/images`

GET `/categories`

POST `/categories`

GET `/price-lists`

POST `/price-lists`

PUT `/price-lists/{id}/items`

Mobile catalog:

GET `/catalog/products`

Query params:

- `q`
- `categoryId`
- `page`
- `limit`
- `sort`

GET `/catalog/products/{id}`

## Inventario

GET `/warehouses`

POST `/warehouses`

GET `/warehouses/{id}/stock`

POST `/inventory/movements`

POST `/inventory/adjustments`

POST `/inventory/transfers`

POST `/inventory/reservations`

DELETE `/inventory/reservations/{id}`

## Carrito

GET `/cart`

POST `/cart/items`

PATCH `/cart/items/{itemId}`

DELETE `/cart/items/{itemId}`

POST `/cart/checkout`

Checkout request:

```json
{
  "addressId": "addr_1",
  "notes": "Entregar en la tarde"
}
```

Checkout response:

```json
{
  "data": {
    "orderId": "ord_1",
    "code": "PED-2026-000001",
    "status": "PENDING",
    "total": 120.5
  }
}
```

## Pedidos

GET `/orders`

POST `/orders`

GET `/orders/{id}`

PATCH `/orders/{id}/status`

POST `/orders/{id}/cancel`

POST `/orders/{id}/approve`

GET `/my/orders`

GET `/my/orders/{id}`

## Pagos

POST `/orders/{id}/payment-intents`

POST `/payments/{provider}/webhook`

GET `/payment-intents/{id}`

POST `/orders/{id}/manual-payment-evidence`

PATCH `/orders/{id}/manual-payment-evidence/{evidenceId}/review`

## Ventas

GET `/sales`

POST `/sales/from-order/{orderId}`

GET `/sales/{id}`

POST `/sales/{id}/invoice`

POST `/invoices/{id}/send-sunat`

GET `/invoices/{id}/sunat-status`

## Reportes

GET `/reports/sales`

GET `/reports/orders`

GET `/reports/stock`

GET `/reports/products`

GET `/reports/customers`

GET `/reports/suppliers`

## Eventos internos

Eventos para colas y notificaciones:

- `order.created`
- `order.approved`
- `order.cancelled`
- `stock.low`
- `payment.succeeded`
- `payment.failed`
- `invoice.created`
- `invoice.sunat.accepted`
- `invoice.sunat.rejected`

## Mapeo desde sistema actual

El sistema actual usa rutas como `/app/productos/gestion-productos/rest/list-productos`. En el nuevo proyecto debe mapearse a:

- UI admin: `/productos`
- API: `GET /api/v1/products`

Ejemplos:

- `/app/proveedores/gestion-proveedores/rest/list-proveedores` -> `GET /api/v1/suppliers`
- `/app/almacenes/gestion-almacenes/rest/list-almacenes` -> `GET /api/v1/warehouses`
- `/app/vendedor/stock-productos/rest/list-productos` -> `GET /api/v1/catalog/products` o `GET /api/v1/supplier-portal/stock` segun actor.
- `/app/configuracion/configuracion-empresa/rest/read-empresa-principal` -> `GET /api/v1/settings/company`
