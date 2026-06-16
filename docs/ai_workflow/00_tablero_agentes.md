# Tablero operativo de agentes - ARMORA

## Objetivo

Controlar el trabajo automatico y sincrono de agentes por tarea, estado, responsable, dependencias, criterios de aceptacion y handoff.

Este tablero debe actualizarse cada vez que una tarea cambie de estado o requiera intervencion de otro agente.

## Estados permitidos

- `pendiente`
- `en_analisis`
- `lista_para_implementar`
- `en_implementacion`
- `en_revision_cruzada`
- `bloqueada`
- `lista`
- `documentada`

## Reglas de uso

1. Toda tarea debe tener un agente lider.
2. Toda tarea que toque contrato API debe incluir Backend, consumidores y QA.
3. Toda tarea que toque modelo de datos debe incluir Database y Backend.
4. Toda tarea que toque auth, permisos, secretos o datos sensibles debe incluir Security.
5. Toda tarea que toque pagos, SUNAT, stock o datos financieros debe incluir Security y QA.
6. Toda tarea finalizada debe tener handoff.
7. No se permiten secretos, credenciales, tokens, API keys, certificados, claves privadas, URLs secretas ni datos sensibles hardcodeados.
8. No se permiten mocks, stubs o datos fake activos en produccion.

## Fase 1 - Fundacion tecnica

| ID | Tarea | Estado | Agente lider | Agentes de apoyo | Depende de | Criterio de aceptacion | Handoff |
|---|---|---|---|---|---|---|---|
| F1-001 | Validar estructura base del repositorio | lista | `armora-architect` | `armora-delivery`, `armora-sdd-manager` | Ninguna | Estructura objetivo confirmada contra `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md` | `docs/ai_workflow/F1-001_validacion_estructura_base.md` |
| F1-002 | Definir convenciones de configuracion y secretos | lista | `armora-security` | `armora-devops`, `armora-backend-quarkus` | F1-001 | `.env.example` sin secretos reales y politica de configuracion definida | `docs/ai_workflow/F1-002_convenciones_configuracion_secretos.md` |
| F1-003 | Preparar Docker Compose local | lista | `armora-devops` | `armora-security`, `armora-backend-quarkus` | F1-001, F1-002 | PostgreSQL y Redis definidos para entorno local sin exponer secretos reales | `docs/ai_workflow/F1-003_docker_compose_local.md` |
| F1-004 | Crear base backend Quarkus | lista | `armora-backend-quarkus` | `armora-database`, `armora-security`, `armora-qa` | F1-002, F1-003 | Health, version, OpenAPI y configuracion por entorno disponibles | `docs/ai_workflow/F1-004_base_backend_quarkus.md` |
| F1-005 | Crear migracion inicial PostgreSQL | lista | `armora-database` | `armora-backend-quarkus`, `armora-qa` | F1-004 | Flyway operativo con migracion inicial trazable | `docs/ai_workflow/F1-005_migracion_inicial_flyway.md` |
| F1-006 | Crear base admin web Next.js | lista | `armora-frontend-web` | `armora-ui-ux`, `armora-backend-quarkus`, `armora-qa` | F1-004 | App web base consume configuracion de API sin URLs secretas hardcodeadas | `docs/ai_workflow/F1-006_base_admin_web_nextjs.md` |
| F1-007 | Crear base mobile cliente Flutter | lista | `armora-mobile-flutter` | `armora-ui-ux`, `armora-backend-quarkus`, `armora-security`, `armora-qa` | F1-004 | App cliente base con configuracion por ambiente y sin datos fake productivos | `docs/ai_workflow/F1-007_base_mobile_cliente_flutter.md` |
| F1-008 | Crear base mobile proveedor Flutter | lista | `armora-mobile-flutter` | `armora-ui-ux`, `armora-backend-quarkus`, `armora-security`, `armora-qa` | F1-004 | App proveedor base con configuracion por ambiente y sin datos fake productivos | `docs/ai_workflow/F1-008_base_mobile_proveedor_flutter.md` |
| F1-009 | Definir pruebas minimas de Fase 1 | lista | `armora-qa` | `armora-backend-quarkus`, `armora-frontend-web`, `armora-mobile-flutter`, `armora-devops` | F1-004, F1-006, F1-007, F1-008 | Checklist de build, health, contrato y smoke documentado | `docs/ai_workflow/F1-009_pruebas_minimas_fase_1.md` |
| F1-010 | Documentar ADR inicial de arquitectura | lista | `armora-sdd-manager` | `armora-architect` | F1-001 | ADR registra decisiones de monorepo, Quarkus, Next.js, Flutter, PostgreSQL, Redis y OpenAPI | `docs/ai_workflow/F1-010_adr_inicial_arquitectura.md` |

## Fase 2 - Autenticacion y seguridad

| ID | Tarea | Estado | Agente lider | Agentes de apoyo | Depende de | Criterio de aceptacion | Handoff |
|---|---|---|---|---|---|---|---|
| F2-001 | Implementar auth backend con JWT | lista | `armora-backend-quarkus` | `armora-security`, `armora-qa`, `armora-database` | F1-005, F1-009 | POST /auth/login retorna JWT; GET /auth/me retorna usuario autenticado; seed admin funcional; tests pasan | `docs/ai_workflow/F2-001_auth_backend_jwt.md` |
| F2-002 | CRUD usuarios, roles y permisos | pendiente | `armora-backend-quarkus` | `armora-database`, `armora-security`, `armora-qa`, `armora-frontend-web` | F2-001 | Endpoints CRUD para usuarios, roles y permisos con validacion RBAC | Pendiente |
| F2-003 | UI Design System - tokens, componentes y theme | lista | `armora-ui-ux` | `armora-frontend-web`, `armora-mobile-flutter`, `armora-sdd-manager` | F1-006, F1-007, F1-008 | Paleta Vanguard, tipografia Calibri, tokens, StatusBadge, StatusSemaforo, AppLayout implementados en web y mobile | `docs/ai_workflow/F2-003_ui_design_system.md` |
| F2-004 | Configurar .env local con PostgreSQL Docker | lista | `armora-devops` | `armora-backend-quarkus`, `armora-security` | F1-003 | `.env` con POSTGRES_PASSWORD, puerto 5434, conexion verificada | Pendiente |

## Plantilla de nueva tarea

```text
ID:
Tarea:
Estado: pendiente
Agente lider:
Agentes de apoyo:
Depende de:
Documentos obligatorios:
Archivos permitidos:
Criterios de aceptacion:
Handoff: Pendiente
```

## Plantilla de bloqueo

```text
ID:
Motivo de bloqueo:
Decision requerida:
Agente que bloquea:
Agente que debe resolver:
Impacto si se continua sin resolver:
Fecha:
```

## Plantilla de handoff

```text
Cambio realizado:
Documentos consultados:
Archivos modificados:
Contratos API afectados:
Modelo de datos afectado:
Permisos/scopes afectados:
Pruebas ejecutadas:
Pruebas pendientes:
Riesgos abiertos:
Validaciones pendientes:
Siguiente agente recomendado:
```





