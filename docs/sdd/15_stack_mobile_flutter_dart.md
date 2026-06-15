# Stack mobile Flutter + Dart

## Objetivo

Definir la decision tecnica para construir las dos aplicaciones moviles de ARMORA usando Flutter + Dart:

- App cliente.
- App proveedor.

Estas apps consumiran la API Quarkus mediante contratos OpenAPI y no contendran reglas criticas de negocio que deban validarse en servidor.

## Decision tecnica

Se aprueba Flutter + Dart como stack mobile oficial para ARMORA.

La decision reemplaza la propuesta anterior basada en Expo/React Native. Expo queda como alternativa valida, pero no como stack seleccionado.

Stack mobile final:

```text
Mobile cliente: Flutter + Dart
Mobile proveedor: Flutter + Dart
Backend API: Quarkus + OpenAPI
Auth: JWT + refresh token rotativo
Storage seguro: flutter_secure_storage
Push notifications: Firebase Cloud Messaging
Barcode scanner: mobile_scanner u opcion equivalente
```

## Por que Flutter para ARMORA

ARMORA requiere apps moviles operativas, no solo pantallas simples:

- Catalogo.
- Busqueda/filtros.
- Carrito.
- Nota de pedido.
- Pago manual o integrado.
- Historial de pedidos.
- Stock proveedor.
- Productos asignados.
- Movimientos de almacen.
- Lector de codigo de barras.
- Notificaciones.

Flutter ofrece buen control visual, experiencia consistente, rendimiento adecuado para formularios y pantallas operativas, y una base unica para Android/iOS.

## Apps separadas

Se mantienen dos aplicaciones diferentes:

### App cliente

Responsabilidades:

- Login.
- Perfil.
- Catalogo.
- Detalle de producto.
- Carrito.
- Nota de pedido.
- Pago manual: Yape, Plin, transferencia.
- Seguimiento de pedido.
- Historial.
- Notificaciones.

### App proveedor

Responsabilidades:

- Login proveedor.
- Dashboard proveedor.
- Stock asignado.
- Movimientos permitidos.
- Productos asignados.
- Edicion permitida/propuesta de cambios.
- Ventas y pedidos asociados.
- Reportes por scope.
- Lectura de codigo de barras.

## Por que no una sola app por rol

Aunque una app unica podria ocultar pantallas segun permisos, no se recomienda para ARMORA por estos motivos:

- Cliente y proveedor tienen flujos distintos.
- Reduce riesgo de exponer pantallas equivocadas.
- Permite publicar y versionar cada app de forma independiente.
- Simplifica navegacion, permisos visuales y pruebas.
- Facilita mantener nombres, iconos, permisos nativos y experiencia de usuario distintos.

## Arquitectura mobile sugerida

```text
mobile-cliente/
  lib/
    app/
    core/
      api/
      auth/
      config/
      errors/
      storage/
      theme/
      widgets/
    features/
      auth/
      profile/
      catalog/
      cart/
      orders/
      payments/
      notifications/

mobile-proveedor/
  lib/
    app/
    core/
      api/
      auth/
      config/
      errors/
      storage/
      theme/
      widgets/
    features/
      auth/
      dashboard/
      stock/
      movements/
      products/
      sales/
      orders/
      reports/
      scanner/
```

Si se desea reducir duplicacion, crear un paquete compartido:

```text
packages/
  mobile-core/
    lib/
      api/
      auth/
      theme/
      storage/
      errors/
      widgets/
```

## Comunicacion con Quarkus

El backend Quarkus expone API REST versionada:

```text
/api/v1
```

La integracion se hara mediante OpenAPI:

1. Quarkus genera el contrato OpenAPI.
2. Flutter consume cliente Dart generado o servicios Dart manuales alineados al contrato.
3. Toda mutacion critica usa `Authorization` y, cuando corresponda, `Idempotency-Key`.
4. Las apps no recalculan reglas criticas; solo muestran datos y envian acciones.

## Seguridad mobile

- Access token corto.
- Refresh token rotativo.
- Refresh token almacenado en `flutter_secure_storage`.
- Logout debe limpiar tokens y cache sensible.
- Bloqueo por sesion expirada.
- No guardar contrasenas.
- No registrar tokens en logs.
- Validar permisos siempre en backend, no solo en la app.

## Estado y cache

Recomendacion inicial:

- `flutter_riverpod` para estado.
- Cache simple para listas y perfil.
- Reintentos controlados para fallos de red.
- Estados obligatorios por pantalla: loading, empty, error, success.

No se requiere modo offline en MVP, pero la app debe manejar conectividad intermitente sin perder estabilidad.

## Lector de codigo de barras

Para proveedor/almacen:

- Escanear producto.
- Buscar SKU/codigo de barras.
- Registrar movimiento si tiene permiso.
- Validar en backend que el proveedor/usuario tenga scope sobre el producto/almacen.

Libreria sugerida:

- `mobile_scanner` u otra equivalente validada en pruebas de dispositivo.

## Notificaciones

Usar Firebase Cloud Messaging para:

- Pedido creado.
- Pedido aprobado/rechazado.
- Pago pendiente/aprobado/rechazado.
- Stock bajo.
- Pedido asignado a proveedor.
- Cambios relevantes de estado.

El backend debe manejar tokens de dispositivo por usuario/app.

## Build y distribucion

Entregables por app:

- APK debug para pruebas internas.
- APK/AAB release para distribucion.
- Versionado independiente para cliente y proveedor.
- Variables por ambiente: local, staging, produccion.

## Riesgos y mitigaciones

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Equipo sin experiencia Dart | Retraso inicial | Fase de arquitectura base y convenciones. |
| Duplicacion entre apps | Mayor mantenimiento | Crear `mobile-core` compartido. |
| Contrato API desactualizado | Errores de integracion | OpenAPI versionado y tests de contrato. |
| Permisos mal aplicados en UI | Exposicion funcional | Validar siempre en backend. |
| Libreria scanner inestable | Fallos operativos | Pruebas tempranas en dispositivos reales. |

## Comparacion con Expo/React Native

| Criterio | Flutter/Dart | Expo/React Native |
|---|---|---|
| Control visual | Muy alto | Alto |
| Consistencia UI | Muy alta | Alta |
| Reutilizacion con Next.js | Baja | Alta |
| Curva si vienes de React | Mayor | Menor |
| Enfoque mobile operativo | Muy bueno | Bueno |
| Apps separadas cliente/proveedor | Muy adecuado | Adecuado |
| Integracion con Quarkus | Via OpenAPI | Via OpenAPI |

## Decision final

Para ARMORA se adopta Flutter + Dart para las dos apps moviles.

Se mantiene:

- Next.js para admin web.
- Quarkus para backend.
- PostgreSQL para datos.
- Redis para cache/colas.
- OpenAPI como contrato.
- Servidor fisico con Docker, HTTPS, backups y monitoreo.
