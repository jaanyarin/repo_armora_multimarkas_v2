# F1-003 - Docker Compose local

## Estado

`lista`

## Objetivo

Preparar Docker Compose local para PostgreSQL y Redis, sin exponer servicios a internet y sin versionar secretos reales.

## Agente lider

`armora-devops`

## Agentes de apoyo

- `armora-security`
- `armora-backend-quarkus`

## Documentos consultados

- `AGENTS.md`
- `.env.example`
- `seguridad/convenciones_configuracion_secretos.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `agentes/docs/ai/03_workflow_automatico_sincrono.md`
- `docs/ai_workflow/00_tablero_agentes.md`

## Cambios realizados

- Se creo `docker-compose.yml` en la raiz del repositorio.
- Se creo `infra/docker/README.md` con instrucciones de uso local.
- Se definieron servicios locales para PostgreSQL 16 y Redis 7.
- Se configuraron puertos ligados a `127.0.0.1` para evitar exposicion externa directa.
- Se usaron variables de entorno para DB, usuario, password, puertos y timezone.
- Se agregaron healthchecks para PostgreSQL y Redis.
- Se agregaron volumenes persistentes locales.
- Se agrego red Docker local `armora_local`.

## Servicios definidos

| Servicio | Imagen | Puerto local | Exposicion | Persistencia | Healthcheck |
|---|---|---:|---|---|---|
| PostgreSQL | `postgres:16-alpine` | `${POSTGRES_PORT:-5432}` | `127.0.0.1` | `armora_postgres_data` | `pg_isready` |
| Redis | `redis:7-alpine` | `${REDIS_PORT:-6379}` | `127.0.0.1` | `armora_redis_data` | `redis-cli ping` |

## Validaciones ejecutadas

```powershell
docker compose -f "C:\repos\repo_armora_multimarkas_v2\docker-compose.yml" --env-file "C:\repos\repo_armora_multimarkas_v2\.env.example" config
```

Resultado: Compose valido.

Tambien se valido por busqueda textual que:

- PostgreSQL y Redis usan `127.0.0.1`.
- `POSTGRES_PASSWORD` viene desde variable de entorno.
- No hay passwords reales en `docker-compose.yml`.
- La guia indica usar `.env.local` no versionado.

## Decision tecnica

F1-003 queda completada. A partir de este punto, F1-004 puede crear la base Quarkus usando PostgreSQL y Redis como dependencias locales.

No se levantaron contenedores porque esta tarea define y valida la configuracion; el arranque real debe hacerse cuando se inicie backend o pruebas locales.

## Riesgos abiertos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Usar `.env.example` directamente para levantar servicios | Password placeholder invalido para trabajo real | Copiar a `.env.local` y definir password local no productivo. |
| Exponer PostgreSQL/Redis fuera de localhost | Riesgo de acceso externo | Mantener puertos ligados a `127.0.0.1`. |
| Agregar servicios app antes de tener manifiestos | Compose incompleto o fragil | Agregar Quarkus/Next.js/Flutter cuando existan `pom.xml`, `package.json` y `pubspec.yaml`. |

## Handoff

```text
Cambio realizado:
Definido Docker Compose local para PostgreSQL y Redis con healthchecks, volumenes y red local.

Documentos consultados:
AGENTS.md, .env.example, seguridad/convenciones_configuracion_secretos.md, docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md, agentes/docs/ai/03_workflow_automatico_sincrono.md, docs/ai_workflow/00_tablero_agentes.md.

Archivos modificados:
docker-compose.yml
infra/docker/README.md
docs/ai_workflow/F1-003_docker_compose_local.md
docs/ai_workflow/00_tablero_agentes.md

Contratos API afectados:
Ninguno.

Modelo de datos afectado:
Ninguno.

Permisos/scopes afectados:
Ninguno.

Pruebas ejecutadas:
docker compose config con .env.example.
Revision textual de puertos localhost, variables y ausencia de secretos reales.

Pruebas pendientes:
Levantar `docker compose --env-file .env.local up -d postgres redis` cuando se cree `.env.local` local.
Validar conexion desde Quarkus cuando F1-004 exista.

Riesgos abiertos:
No usar .env.example como archivo real de entorno; crear .env.local no versionado.

Validaciones pendientes:
F1-004 debe consumir PostgreSQL/Redis respetando variables y sin secretos hardcodeados.

Siguiente agente recomendado:
armora-backend-quarkus para F1-004, con apoyo de armora-database, armora-security y armora-qa.
```
