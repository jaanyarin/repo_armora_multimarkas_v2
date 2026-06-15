# Plan de ejecucion - Fase 1 Fundacion tecnica

## Objetivo

Preparar la base tecnica del proyecto ARMORA para iniciar construccion real con:

- Backend Quarkus.
- Admin web Next.js.
- Mobile cliente Flutter.
- Mobile proveedor Flutter.
- PostgreSQL.
- Redis.
- OpenAPI.
- Docker local.
- CI base.

Esta fase no debe construir aun todos los modulos de negocio. Debe dejar un esqueleto funcional, seguro y extensible para que las siguientes fases implementen usuarios, roles, clientes, proveedores, catalogo, inventario, pedidos y pagos.

## Estado del repositorio actual

El repositorio actual contiene principalmente documentacion:

- `_docs_scrapping_gpt`: artefactos del scraping del sistema actual.
- `_docs_nuevo_proyecto_sdd`: documentacion SDD, arquitectura, stack, cronograma y agentes.

No existe todavia una estructura de codigo del nuevo sistema. Por tanto, la primera accion de construccion debe ser crear el monorepo base.

## Decisiones vigentes

Stack vigente:

- Admin web: Next.js + React + TypeScript.
- Mobile cliente: Flutter + Dart.
- Mobile proveedor: Flutter + Dart.
- Backend: Quarkus + Java 21+.
- DB: PostgreSQL.
- Cache/colas: Redis.
- Contratos: REST `/api/v1` + OpenAPI.
- Infra: Docker Compose local y luego servidor fisico.

Regla transversal:

- No hardcodear secretos, credenciales, tokens, API keys, certificados, URLs secretas ni datos sensibles.
- No dejar mocks, stubs o datos fake en flujos productivos.
- Toda configuracion sensible debe ir por variables de entorno o mecanismo seguro.

## Alcance de Fase 1

Segun `08_sdd_roadmap_mvp.md`, Fase 1 debe entregar:

- Monorepo con apps `api-quarkus`, `admin-web`, `mobile-cliente`, `mobile-proveedor`.
- Docker local con PostgreSQL y Redis.
- Quarkus base: REST, OpenAPI, health checks, migraciones.
- Next.js base: layout, login, rutas protegidas.
- Flutter cliente base: estructura, navegacion, tema, login y cliente API.
- Flutter proveedor base: estructura, navegacion, tema, login y cliente API.
- Auth basica.
- Migraciones iniciales.
- CI con lint, tests/builds base.
- OpenAPI inicial.

## Agentes responsables

| Frente | Agente principal | Agentes de soporte |
|---|---|---|
| Direccion tecnica | `01_desarrollador_arquitecto.md` | `13_project_delivery_manager.md` |
| Backend Quarkus | `04_backend_quarkus_specialist.md` | `05_database_data_architect.md`, `10_security_engineer.md` |
| Admin web | `08_frontend_web_specialist.md` | `02_disenador_ui_ux.md`, `10_security_engineer.md` |
| Mobile Flutter | `09_mobile_specialist.md` | `02_disenador_ui_ux.md`, `10_security_engineer.md` |
| DevOps | `07_devops_infra_engineer.md` | `10_security_engineer.md` |
| QA | `06_qa_test_engineer.md` | `12_documentation_sdd_manager.md` |
| Documentacion | `12_documentation_sdd_manager.md` | todos |

## Estructura inicial propuesta

```text
armora/
  apps/
    api-quarkus/
    admin-web/
    mobile-cliente/
    mobile-proveedor/
  packages/
    contracts/
    mobile-core/
    ui-web/
  infra/
    docker/
    nginx/
    scripts/
  docs/
    adr/
    api/
    runbooks/
  .github/
    workflows/
  .env.example
  docker-compose.yml
  README.md
```

Nota: el repositorio actual puede convertirse en raiz del nuevo monorepo o puede mantenerse como repo documental y crear un repositorio nuevo de codigo. Recomendacion: crear un nuevo monorepo `armora-platform` y copiar la documentacion SDD como `docs/sdd`.

## Tareas tecnicas Fase 1

### T04 - Crear monorepo y estructura apps/api/packages

Responsable: DevOps + Arquitecto.

Actividades:

- Crear estructura de carpetas.
- Definir convenciones de nombres.
- Crear `README.md` principal.
- Crear `.gitignore`.
- Crear `.editorconfig`.
- Crear `.env.example` sin secretos reales.
- Crear carpeta `docs/adr`.
- Registrar ADR inicial de stack.

Entregables:

- Monorepo inicial.
- Documentacion base de desarrollo local.
- ADR de stack.

Criterios de aceptacion:

- Existe estructura `apps/`, `packages/`, `infra/`, `docs/`.
- No hay credenciales reales.
- Existe guia de setup local.

### T05 - Docker local: PostgreSQL, Redis, Quarkus, Next.js y Flutter

Responsable: DevOps.

Actividades:

- Crear `docker-compose.yml`.
- Crear servicio PostgreSQL.
- Crear servicio Redis.
- Crear red interna.
- Configurar volumnes locales.
- Definir variables en `.env.example`.
- Preparar perfiles local/staging/prod conceptuales.

Entregables:

- Docker Compose local.
- PostgreSQL accesible solo local/red interna.
- Redis accesible solo local/red interna.

Criterios de aceptacion:

- `docker compose up -d` levanta PostgreSQL y Redis.
- No hay passwords productivos en repo.
- `.env.example` contiene placeholders seguros.

### T06 - Quarkus base

Responsable: Backend Quarkus Specialist.

Actividades:

- Crear app Quarkus.
- Configurar Java 21+.
- Agregar dependencias:
  - `quarkus-rest`
  - `quarkus-rest-jackson`
  - `quarkus-hibernate-orm-panache`
  - `quarkus-jdbc-postgresql`
  - `quarkus-flyway`
  - `quarkus-smallrye-openapi`
  - `quarkus-smallrye-health`
  - `quarkus-smallrye-jwt` u OIDC segun decision.
  - `quarkus-redis-client`
- Crear endpoint `/api/v1/health`.
- Crear endpoint `/api/v1/version`.
- Configurar OpenAPI.
- Configurar Flyway.
- Crear primera migracion.

Entregables:

- `apps/api-quarkus`.
- Health check.
- OpenAPI visible.
- Migracion inicial.

Criterios de aceptacion:

- API arranca localmente.
- Health check responde.
- OpenAPI se genera.
- No hay secrets hardcodeados.

### T07 - CI base, lint, formato, testing y convenciones

Responsable: DevOps + QA.

Actividades:

- Crear workflow CI.
- Validar backend con tests.
- Validar admin web con lint/build.
- Validar Flutter con analyze/test.
- Definir convenciones de ramas.
- Definir convenciones de commits.
- Agregar chequeo basico contra secretos.

Entregables:

- Pipeline CI base.
- Comandos documentados.
- Checklist de PR.

Criterios de aceptacion:

- CI ejecuta al menos validaciones base.
- Fallan cambios con tests rotos.
- Existe checklist de seguridad.

## Tareas complementarias recomendadas

Aunque el cronograma liste T04-T07 como Fase 1, para iniciar construccion sin deuda se recomienda incluir:

### F1-A - ADR inicial de arquitectura

Contenido:

- Quarkus como backend.
- Flutter para mobile.
- Next.js para admin.
- PostgreSQL como DB.
- OpenAPI como contrato.
- Docker Compose local.

### F1-B - Politica de configuracion

Contenido:

- `.env.example`.
- Variables obligatorias.
- Variables por ambiente.
- Reglas de secretos.
- Prohibicion de hardcoding.

### F1-C - Esqueleto de autenticacion

Minimo:

- Tabla/entidad inicial `users`.
- Seed admin solo para dev, con password por variable o generada.
- Endpoint login inicialmente preparado, aunque RBAC completo sea Fase 2.

### F1-D - Contrato OpenAPI inicial

Minimo:

- `/api/v1/health`
- `/api/v1/version`
- `/api/v1/auth/login`
- `/api/v1/auth/refresh`
- `/api/v1/me`

## Primer backlog ejecutable

| Prioridad | Tarea | Responsable | Bloquea |
|---:|---|---|---|
| 1 | Crear monorepo base | DevOps/Arquitecto | Todo |
| 2 | Crear Docker Compose PostgreSQL/Redis | DevOps | Backend |
| 3 | Crear Quarkus base | Backend | OpenAPI/Auth |
| 4 | Configurar Flyway y primera migracion | Backend/DB | Auth/Datos |
| 5 | Crear OpenAPI inicial | Backend | Web/Mobile |
| 6 | Crear Next.js base | Frontend | Admin |
| 7 | Crear Flutter cliente base | Mobile | App cliente |
| 8 | Crear Flutter proveedor base | Mobile | App proveedor |
| 9 | Crear `.env.example` y politica config | DevOps/Security | Todos |
| 10 | Crear CI base | DevOps/QA | Calidad |

## Contratos minimos de Fase 1

```http
GET /api/v1/health
GET /api/v1/version
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET /api/v1/me
```

Respuestas iniciales deben seguir la forma:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_..."
  },
  "errors": []
}
```

## Variables de entorno minimas

Ejemplo sin valores reales:

```env
APP_ENV=local
API_PORT=8080
DATABASE_URL=jdbc:postgresql://postgres:5432/armora
DATABASE_USERNAME=armora_user
DATABASE_PASSWORD=change_me_local_only
REDIS_HOST=redis
REDIS_PORT=6379
JWT_ISSUER=armora-local
JWT_SECRET_PATH=/run/secrets/jwt_secret
ADMIN_WEB_PUBLIC_API_URL=http://localhost:8080/api/v1
```

Regla: `.env.example` puede contener placeholders, no secretos reales.

## Riesgos de Fase 1

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Elegir mal estructura de monorepo | Deuda temprana | Validar con arquitecto antes de codificar modulos |
| OpenAPI no queda como contrato central | Web/mobile divergen | Generar contrato desde Quarkus desde el inicio |
| Secretos en repo | Riesgo critico | `.env.example`, vault/variables y chequeo CI |
| Docker local incompleto | Dificulta onboarding | Documentar setup y validar en maquina limpia |
| Auth improvisada | Riesgo de seguridad | Diseñar minima pero alineada a Fase 2 |
| Flutter duplicado entre apps | Mayor mantenimiento | Crear `packages/mobile-core` temprano |

## Criterio de salida Fase 1

Fase 1 se considera terminada cuando:

- Monorepo existe.
- Docker local levanta PostgreSQL y Redis.
- API Quarkus arranca.
- Health check responde.
- OpenAPI inicial existe.
- Migracion inicial corre.
- Admin web arranca y consume health/version.
- Flutter cliente arranca y consume health/version.
- Flutter proveedor arranca y consume health/version.
- Existe `.env.example` sin secretos reales.
- Existe CI base.
- Existe ADR inicial de stack.

## Recomendacion final

Antes de crear modulos de negocio, construir Fase 1 con disciplina. El valor de esta fase no esta en pantallas completas, sino en dejar lista una base limpia, segura, versionada y automatizable para que los agentes puedan trabajar en paralelo sin romper contratos.

