# F1-004 - Base backend Quarkus

## Estado

`lista`

## Objetivo

Crear la base backend Quarkus para ARMORA Multimarkas v2 con endpoints minimos, OpenAPI, health, version y configuracion por entorno.

## Agente lider

`armora-backend-quarkus`

## Agentes de apoyo

- `armora-database`
- `armora-security`
- `armora-qa`

## Documentos consultados

- `AGENTS.md`
- `.env.example`
- `seguridad/convenciones_configuracion_secretos.md`
- `docs/sdd/11_stack_alternativo_backend_quarkus.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `agentes/docs/ai/03_workflow_automatico_sincrono.md`
- `docs/ai_workflow/00_tablero_agentes.md`

## Cambios realizados

- Se creo `backend/api-quarkus/pom.xml`.
- Se agrego aplicacion JAX-RS con base `/api/v1`.
- Se agrego `GET /api/v1/health`.
- Se agrego `GET /api/v1/version`.
- Se configuro OpenAPI en `/q/openapi`.
- Se configuro Swagger UI en `/q/swagger-ui`.
- Se preparo configuracion para PostgreSQL, Redis, Flyway y JWT por variables de entorno.
- Se agregaron pruebas Quarkus para health y version.
- Se agrego `backend/api-quarkus/README.md`.

## Endpoints base

| Metodo | Ruta | Objetivo |
|---|---|---|
| GET | `/api/v1/health` | Health propio de plataforma. |
| GET | `/api/v1/version` | Version de servicio y API. |
| GET | `/q/openapi` | Contrato OpenAPI generado por Quarkus. |
| GET | `/q/swagger-ui` | UI de exploracion OpenAPI. |

## Dependencias Quarkus iniciales

- `quarkus-rest`
- `quarkus-rest-jackson`
- `quarkus-smallrye-health`
- `quarkus-smallrye-openapi`
- `quarkus-hibernate-validator`
- `quarkus-jdbc-postgresql`
- `quarkus-flyway`
- `quarkus-redis-client`
- `quarkus-smallrye-jwt`
- `quarkus-junit5`
- `rest-assured`

## Validaciones ejecutadas

```powershell
mvn test
```

Resultado:

```text
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

Tambien se corrigio el puerto de test a aleatorio con:

```properties
%test.quarkus.http.test-port=0
```

Esto evita fallos cuando `8081` ya esta ocupado en el entorno local.

## Seguridad

- No se agregaron secretos reales.
- `application.properties` usa variables de entorno y placeholders.
- No hay passwords, tokens ni API keys embebidas.
- DB, Redis y JWT quedan preparados para configuracion por entorno.

## Brecha tecnica detectada

El entorno local actual tiene Java 17:

```text
openjdk version "17.0.19"
```

Por eso `pom.xml` queda con:

```xml
<maven.compiler.release>17</maven.compiler.release>
```

La decision objetivo del stack sigue siendo Java 21+. Antes de estandarizar produccion o CI final, se debe instalar Java 21 y subir el release a `21`.

## Decision tecnica

F1-004 queda completada como base backend ejecutable y testeada.

F1-005 puede iniciar migracion inicial Flyway sobre PostgreSQL.

## Riesgos abiertos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Java local 17 distinto a objetivo Java 21 | Diferencias de runtime/CI | Instalar Java 21 antes de CI productivo y actualizar `maven.compiler.release`. |
| Flyway preparado sin migracion inicial | DB aun no versionada | Ejecutar F1-005. |
| Auth/JWT preparado pero no implementado | No hay login real todavia | Implementar auth skeleton en fase correspondiente. |

## Handoff

```text
Cambio realizado:
Creada base backend Quarkus con endpoints health/version, OpenAPI, Swagger UI, configuracion por entorno y pruebas.

Documentos consultados:
AGENTS.md, .env.example, seguridad/convenciones_configuracion_secretos.md, docs/sdd/11_stack_alternativo_backend_quarkus.md, docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md, agentes/docs/ai/03_workflow_automatico_sincrono.md, docs/ai_workflow/00_tablero_agentes.md.

Archivos modificados:
backend/api-quarkus/pom.xml
backend/api-quarkus/README.md
backend/api-quarkus/src/main/java/com/armora/platform/ArmoraApiApplication.java
backend/api-quarkus/src/main/java/com/armora/platform/api/HealthResource.java
backend/api-quarkus/src/main/java/com/armora/platform/api/HealthResponse.java
backend/api-quarkus/src/main/java/com/armora/platform/api/VersionResource.java
backend/api-quarkus/src/main/java/com/armora/platform/api/VersionResponse.java
backend/api-quarkus/src/main/resources/application.properties
backend/api-quarkus/src/test/java/com/armora/platform/api/HealthResourceTest.java
backend/api-quarkus/src/test/java/com/armora/platform/api/VersionResourceTest.java
docs/ai_workflow/F1-004_base_backend_quarkus.md
docs/ai_workflow/00_tablero_agentes.md

Contratos API afectados:
GET /api/v1/health
GET /api/v1/version
GET /q/openapi
GET /q/swagger-ui

Modelo de datos afectado:
Ninguno. Flyway queda preparado para F1-005.

Permisos/scopes afectados:
Ninguno. JWT queda como dependencia/configuracion base, sin reglas de permisos aun.

Pruebas ejecutadas:
mvn test: 2 pruebas, 0 fallos, BUILD SUCCESS.

Pruebas pendientes:
Validar conexion PostgreSQL/Flyway cuando F1-005 cree migracion inicial.
Validar OpenAPI consumido por frontend/mobile cuando existan clientes.

Riesgos abiertos:
Java local 17, objetivo futuro Java 21+.

Validaciones pendientes:
Instalar Java 21 antes de CI productivo o actualizar decision tecnica si se acepta Java 17.

Siguiente agente recomendado:
armora-database para F1-005, con apoyo de armora-backend-quarkus y armora-qa.
```
