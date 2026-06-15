# Backend API Quarkus - ARMORA

## Objetivo

Base backend de Fase 1 para ARMORA Multimarkas v2.

Incluye:

- Quarkus REST.
- JSON con Jackson.
- Health endpoint propio en `/api/v1/health`.
- Version endpoint en `/api/v1/version`.
- OpenAPI en `/q/openapi`.
- Swagger UI en `/q/swagger-ui`.
- Configuracion PostgreSQL por variables de entorno.
- Redis por variables de entorno.
- Flyway configurado con migracion inicial `V1__init_foundation_schema.sql` validada contra PostgreSQL real. Migracion desactivada por defecto (`migrate-at-start=false`) para no alterar DB accidentalmente en tests normales. Forzar con `-Dquarkus.flyway.migrate-at-start=true` para validar localmente.
- JWT/OIDC preparado por configuracion, sin secretos hardcodeados.

## Requisito local actual

El entorno local detectado tiene Java 17. Por eso esta base queda compilable con `maven.compiler.release=17`.

La decision objetivo del proyecto sigue siendo Java 21+. Antes de produccion o estandarizacion final del equipo, instalar Java 21 y subir `maven.compiler.release` a `21`.

## Ejecutar pruebas

```powershell
mvn test
```

## Ejecutar en desarrollo

Crear `.env.local` desde `.env.example` y definir valores locales no productivos.

```powershell
docker compose --env-file ..\..\.env.local up -d postgres redis
mvn quarkus:dev
```

## Endpoints base

- `GET /api/v1/health`
- `GET /api/v1/version`
- `GET /q/openapi`
- `GET /q/swagger-ui`

## Convencion de nombres

Todo identificador fisico persistente (tablas, columnas, enums, funciones, migraciones) usa espanol y `snake_case` segun `docs/sdd/17_convencion_nombres_tecnicos.md`. Ejemplo: `usuarios`, `empresas`, `clave_hash`, `creado_en`, `tipo_usuario`.

## Seguridad

- No colocar credenciales reales en `application.properties`.
- No usar secretos en codigo fuente.
- Usar variables de entorno o rutas `*_SECRET_PATH`.
- No loguear tokens, passwords ni payloads sensibles.
## Validar migraciones Flyway con PostgreSQL local

Levantar PostgreSQL en puerto alternativo si `5432` no esta disponible:

```powershell
$env:POSTGRES_DB='armora'
$env:POSTGRES_USER='armora_user'
$env:POSTGRES_PASSWORD='armora_local_dev_password'
$env:POSTGRES_PORT='55432'
docker compose up -d --force-recreate postgres
```

Ejecutar tests forzando Flyway contra PostgreSQL local:

```powershell
mvn test `
  "-Dquarkus.flyway.migrate-at-start=true" `
  "-Dquarkus.flyway.clean-at-start=true" `
  "-Dquarkus.flyway.validate-on-migrate=true" `
  "-Dquarkus.datasource.jdbc.url=jdbc:postgresql://localhost:55432/armora" `
  "-Dquarkus.datasource.username=armora_user" `
  "-Dquarkus.datasource.password=armora_local_dev_password"
```

El password anterior es solo ejemplo local y no debe versionarse en archivos `.env` reales.
