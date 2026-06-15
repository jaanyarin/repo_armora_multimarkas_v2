# Stack backend Quarkus con mobile Flutter

> **SUPERSEDED**: Este documento fue consolidado en `02_stack_recomendado.md`. Su contenido unico (paquetes Java, dependencias Maven/Flutter) ya esta incorporado alli. Mantener solo como referencia historica.

## Objetivo

Definir como queda el proyecto ARMORA usando Quarkus como backend oficial y Flutter/Dart como stack mobile para cliente y proveedor.

## Stack aprobado

- Admin web: Next.js + React + TypeScript.
- Mobile cliente: Flutter + Dart.
- Mobile proveedor: Flutter + Dart.
- Backend: Quarkus + Java 21+.
- API REST: Quarkus REST.
- Persistencia: Hibernate ORM with Panache o Hibernate ORM/JPA tradicional.
- Migraciones: Flyway o Liquibase.
- Base de datos: PostgreSQL.
- Seguridad: Quarkus OIDC/JWT RBAC o SmallRye JWT.
- OpenAPI: SmallRye OpenAPI.
- Cache/colas: Redis + scheduler/jobs; para colas avanzadas, RabbitMQ/Kafka o Redis Streams.
- Build/deploy: JVM jar en Docker al inicio; native executable despues si conviene.

## Arquitectura

```text
Admin Web (Next.js)    Mobile Cliente (Flutter)    Mobile Proveedor (Flutter)
        |                        |                           |
        | HTTPS / JSON           | HTTPS / JSON              | HTTPS / JSON
        v                        v                           v
                              API Quarkus
                                  |
          ------------------------------------------------
          | Auth | Catalog | Orders | Stock | Payments | Billing |
          ------------------------------------------------
                                  |
                            PostgreSQL
                                  |
                    Redis / Workers / SUNAT / Pagos
```

## Estructura de repositorio sugerida

```text
apps/
  admin-web/          # Next.js
  mobile-cliente/     # Flutter
  mobile-proveedor/   # Flutter
  api-quarkus/        # Quarkus
packages/
  contracts/          # OpenAPI generado + clientes TS/Dart
  mobile-core/        # tema, auth, cliente API y widgets comunes Flutter
  ui-web/             # componentes web compartidos si aplica
docs/
  sdd/
  adr/
  api/
```

## Modulos Quarkus sugeridos

En Quarkus conviene ordenar por paquetes de dominio:

```text
com.armora.auth
com.armora.access
com.armora.users
com.armora.customers
com.armora.suppliers
com.armora.catalog
com.armora.pricing
com.armora.inventory
com.armora.cart
com.armora.orders
com.armora.sales
com.armora.payments
com.armora.billing
com.armora.reports
com.armora.audit
```

Cada modulo deberia tener:

- `Resource`: endpoints REST.
- `Service`: casos de uso.
- `Repository`: consultas.
- `Entity`: modelo JPA.
- `DTO`: request/response.
- `Mapper`: conversion Entity/DTO.

## Compatibilidad Quarkus + Flutter

Quarkus y Flutter no comparten lenguaje, por eso el contrato oficial debe ser OpenAPI.

Flujo recomendado:

1. Quarkus expone OpenAPI versionado.
2. Se genera cliente Dart para Flutter o se implementa una capa `ApiClient` estrictamente basada en el contrato.
3. Se genera cliente TypeScript para Next.js o servicios tipados.
4. Los cambios de API se validan con pruebas de contrato.
5. Las reglas criticas quedan siempre en backend: permisos, precio, stock, pago, SUNAT y auditoria.

## Ventajas de Quarkus

- Muy buen rendimiento y bajo consumo comparado con stacks Java tradicionales.
- Fuerte tipado Java para dominio transaccional.
- Buen encaje con PostgreSQL, JPA, transacciones y sistemas empresariales.
- Native build posible para arranque rapido y menor memoria cuando el sistema este estable.
- Buen soporte para OpenAPI, OIDC/JWT, Health, Metrics y OpenTelemetry.
- Puede ser mas familiar si el equipo viene de Java/Spring.
- Encaja bien con facturacion, SUNAT, auditoria, jobs y procesos empresariales.

## Ventajas de Flutter para ARMORA

- Experiencia mobile consistente para cliente y proveedor.
- Dos apps separadas sin mezclar flujos ni permisos.
- Buen control visual y rendimiento para pantallas operativas.
- Buen soporte para lector de codigo de barras, camara, push notifications y almacenamiento seguro.
- Permite crear APKs independientes: cliente y proveedor.

## Costos y tradeoffs

- No se comparten tipos directamente entre Java, TypeScript y Dart.
- Los contratos deben mantenerse con OpenAPI y disciplina de versionado.
- El equipo debe dominar dos ecosistemas frontend: React/Next.js para web y Flutter/Dart para mobile.
- Si el equipo no domina Flutter, la fundacion mobile debe incluir tiempo de aprendizaje y arquitectura base.
- Prisma no aplica; se usarian JPA/Hibernate y Flyway/Liquibase.

## Decision tecnica

Para ARMORA, la decision aprobada es:

- Usar Quarkus como backend principal.
- Usar Flutter/Dart para mobile cliente y mobile proveedor.
- Usar Next.js para admin web.
- Usar OpenAPI como contrato central.

No se recomienda mezclar NestJS y Quarkus al inicio. NestJS queda como alternativa historica si en el futuro se decide volver a full-stack TypeScript.

## Dependencias Quarkus sugeridas

- `quarkus-rest`
- `quarkus-rest-jackson`
- `quarkus-hibernate-orm-panache`
- `quarkus-jdbc-postgresql`
- `quarkus-flyway`
- `quarkus-smallrye-openapi`
- `quarkus-smallrye-jwt` o `quarkus-oidc`
- `quarkus-redis-client`
- `quarkus-scheduler`
- `quarkus-smallrye-health`
- `quarkus-micrometer`
- `quarkus-opentelemetry`

## Dependencias Flutter sugeridas

- `go_router` para navegacion.
- `flutter_riverpod` para estado.
- `dio` para HTTP si no se usa cliente generado.
- `flutter_secure_storage` para tokens.
- `json_serializable` / `freezed` si se modelan DTOs manuales.
- `mobile_scanner` para codigo de barras/QR.
- `firebase_messaging` para push notifications.
- `image_picker` o `file_picker` para evidencias/imagenes.

## Conexion en servidor fisico

```text
Nginx/Caddy
  |-- admin.armorasac.com -> Next.js
  |-- api.armorasac.com   -> Quarkus API
       |
       |-- PostgreSQL
       |-- Redis
       |-- workers/scheduler

Apps Flutter instaladas en celulares
  |-- mobile-cliente -> api.armorasac.com/api/v1
  |-- mobile-proveedor -> api.armorasac.com/api/v1
```

Quarkus puede desplegarse como:

- JVM jar en contenedor Docker para empezar.
- Native executable en contenedor minimo cuando el sistema este estable y se justifique optimizar arranque/memoria.

## Fuentes oficiales sugeridas

- Quarkus guides: https://quarkus.io/guides/
- Quarkus REST: https://quarkus.io/guides/rest
- Hibernate ORM with Panache: https://quarkus.io/guides/hibernate-orm-panache
- JWT RBAC: https://quarkus.io/guides/security-jwt
- Flutter docs: https://docs.flutter.dev/
- Dart docs: https://dart.dev/guides
