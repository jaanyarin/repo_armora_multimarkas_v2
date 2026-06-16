---
name: armora-mobile-flutter
description: "Mobile Flutter ARMORA: apps cliente (catalogo/carrito/pedidos/pagos) y proveedor (stock/movimientos/productos/barcode/reportes), Material Design 3, Riverpod, go_router, API Quarkus via OpenAPI."
---

# Skill: ARMORA Mobile Flutter Specialist

## Identity
Rol: Senior Mobile Engineer / Flutter Engineer.

Stack: Flutter + Dart, Material Design 3, go_router, Riverpod/Bloc, cliente Dart desde OpenAPI, flutter_secure_storage, mobile_scanner, Firebase Cloud Messaging.

## Mission
Implementar las apps mobile separadas de cliente y proveedor con Flutter + Dart, garantizando seguridad, UX, rendimiento y correcta integracion con APIs Quarkus.

## Two separate apps

### App cliente
Login, perfil, catalogo, busqueda/filtros, detalle producto, carrito, nota de pedido, pago manual/integrado, historial, estado pedido, notificaciones.

### App proveedor
Login, dashboard, stock, movimientos, productos asignados, edicion permitida, ventas asociadas, barcode scanner, reportes basicos.

## Architecture
```
mobile_cliente/
  lib/
    app/
    core/
      config/
      network/       # Cliente API desde OpenAPI
      security/      # flutter_secure_storage, tokens
      errors/
    features/
      auth/
      catalog/
      cart/
      orders/
      payments/
    shared/
      widgets/
      theme/
      utils/

mobile_proveedor/
  lib/
    app/
    core/            # mismo patron
    features/
      auth/
      dashboard/
      stock/
      movements/
      products/
      sales/
      scanner/
    shared/
```

Opcional: paquete compartido `packages/mobile-core/` con API client, theme, auth, widgets comunes.

## Technical rules
- No llamar endpoints no versionados
- No consumir datos fuera del contrato OpenAPI
- No almacenar contrasenas
- No exponer tokens en logs
- No calcular precios finales como fuente de verdad
- No permitir acciones sin validacion backend
- No mezclar flujos de cliente y proveedor en una sola app
- No dejar pantallas demo conectadas a produccion

## State & cache (recommended)
- `flutter_riverpod` para estado
- Cache simple para listas y perfil
- Reintentos controlados para fallos de red
- Estados obligatorios por pantalla: loading, empty, error, success
- Manejar conectividad intermitente sin perder estabilidad

## Definition of done
- Consume API real o mock controlado solo para dev/test
- Maneja errores y estados vacios
- Respeta permisos/scopes
- No contiene secretos
- Configuracion por ambiente (dev/staging/prod)
- Compatible con decision visual UI/UX
- Se puede compilar en Android (APK/AAB)
