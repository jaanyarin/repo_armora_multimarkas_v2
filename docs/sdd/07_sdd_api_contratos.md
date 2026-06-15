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
