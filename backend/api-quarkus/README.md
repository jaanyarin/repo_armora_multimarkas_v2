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
- Flyway preparado, sin migrar al arranque todavia.
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

## Seguridad

- No colocar credenciales reales en `application.properties`.
- No usar secretos en codigo fuente.
- Usar variables de entorno o rutas `*_SECRET_PATH`.
- No loguear tokens, passwords ni payloads sensibles.
