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
| F2-004 | Configurar .env local con PostgreSQL Docker | lista | `armora-devops` | `armora-backend-quarkus`, `armora-security` | F1-003 | `.env` con POSTGRES_PASSWORD, puerto 5434, conexion verificada | `docs/ai_workflow/F2-004_config_env_docker.md` |
| F2-005 | Fix login: CORS + seed admin + Flyway migrate-at-start | lista | `armora-backend-quarkus` | `armora-security`, `armora-qa` | F2-001, F2-004 | CORS habilitado, seed admin@armora.local/admin funcional, flyway corre antes del seed | `docs/ai_workflow/F2-005_fix_login_cors_seed_flyway.md` |
| F2-006 | Dashboard components: Sidebar, Topbar y dashboard | lista | `armora-frontend-web` | `armora-ui-ux`, `armora-backend-quarkus`, `armora-qa` | F2-003 | Sidebar con 32 categorias, Topbar con info usuario, dashboard con grafico, health check, build pasa | `docs/ai_workflow/F2-006_dashboard_components.md` |
| F2-007 | Fix búsqueda rápida (pérdida de foco) en Gestion Personal | lista | `armora-frontend-web` | `armora-architect`, `armora-qa` | F2-006 | Componentes helper extraídos fuera del componente principal; key estable en TextField; foco mantenido al escribir; build pasa | `docs/ai_workflow/F2-007_fix_busqueda_gestion_personal.md` |
| F2-008 | Botón Editar Personal → wizard precargado | lista | `armora-frontend-web` | `armora-backend-quarkus`, `armora-security`, `armora-qa` | F2-007, backend | Página editar-personal creada; wizard 6 pasos con datos precargados; PUT expandido con todos los campos; field names sincronizados (emailContacto, telefonoCelular, telefonoFijo) | `docs/ai_workflow/F2-008_editar_personal_wizard.md` |
| F2-009 | Botón Cambiar contraseña con Dialog modal | lista | `armora-frontend-web` | `armora-backend-quarkus`, `armora-security`, `armora-qa` | F2-007 | Dialog con validación en vivo; PATCH endpoint cambiar-clave implementado; BCrypt hash; auditoría registrada | `docs/ai_workflow/F2-009_cambiar_contrasena_dialog.md` |
| F2-010 | Migración V5: columnas faltantes personal + tabla permisos | lista | `armora-database` | `armora-backend-quarkus`, `armora-qa` | F2-009 | V5 agrega cargo, area, sede, email_personal, contacto_emergencia, departamento_nombre, provincia_nombre, distrito_nombre a personal; crea personal_permisos | `docs/ai_workflow/F2-010_migracion_v5_personal_campos.md` |
| F2-011 | Backend: expandir DTOs, INSERT/UPDATE, GET con todos los campos | lista | `armora-backend-quarkus` | `armora-database`, `armora-qa` | F2-010 | CrearPersonalRequest, ActualizarPersonalRequest, PersonalDetalleResponse incluyen cargo, area, sede, emailPersonal, contactoEmergencia, fotoUrl, observaciones, ubigeoCodigo, departamentoNombre, provinciaNombre, distritoNombre. INSERT y UPDATE persisten todas las columnas. GET devuelve todos los campos. | `docs/ai_workflow/F2-011_backend_dtos_expandidos.md` |
| F2-012 | Backend: endpoints permisos, recursos, upload foto | lista | `armora-backend-quarkus` | `armora-security`, `armora-qa` | F2-011 | GET/PUT /personal/{id}/permisos, GET/PUT /personal/{id}/recursos, POST /files/upload con validación de extensión y tamaño 5MB | `docs/ai_workflow/F2-012_endpoints_permisos_recursos_upload.md` |
| F2-013 | Frontend: conectar permisos, recursos, upload foto en crear y editar | lista | `armora-frontend-web` | `armora-backend-quarkus`, `armora-qa` | F2-012 | crear-personal envía foto via POST /files/upload, guarda permisos y recursos via PUT endpoints. editar-personal carga permisos y recursos desde GET, los envía en PUT. Foto se carga y muestra correctamente. | `docs/ai_workflow/F2-013_frontend_permisos_recursos_foto.md` |
| F2-014 | Security Review + workflow rule ARMORA #11 | lista | `armora-security` | `armora-architect`, `armora-sdd-manager` | F2-013 | Revisión de seguridad de endpoints de personal y files. Nueva regla ARMORA #11 agregada al workflow: matching DTO↔BD obligatorio. | `docs/ai_workflow/F2-014_security_review_workflow_rule.md` |
| F2-015 | Agregar campo estado (ACTIVO/INACTIVO/BLOQUEADO) a personal - BD, backend y frontend | lista | `armora-architect` | `armora-database`, `armora-backend-quarkus`, `armora-frontend-web`, `armora-qa` | F2-011 | Migracion V6 aplicada, DTOs incluyen estado, INSERT/UPDATE persisten estado, GET devuelve estado, QA E2E pasa | Este task (armora-sdd-manager) |
| F2-016 | Gestion Zonas y Rutas: migraciones, API, UI CRUD y poligono | lista | `armora-architect` | `armora-product-owner`, `armora-ui-ux`, `armora-database`, `armora-backend-quarkus`, `armora-frontend-web`, `armora-security`, `armora-qa`, `armora-sdd-manager` | F2-015 | V7/V8 crean zonas_rutas y zonas_rutas_poligonos; API /zonas-rutas valida UUID/estado/color/GeoJSON; admin web lista, crea, edita, activa/inactiva, elimina y gestiona poligono; builds backend/frontend pasan sin levantar servicios | `docs/ai_workflow/F2-016_gestion_zonas_rutas.md` |
| F2-017 | Habilitar Ventas en Rutas: UI operativa y accion masiva | documentada | `armora-frontend-web` | `armora-ui-ux`, `armora-architect`, `armora-qa` | F2-016 | Pantalla `/zonas-rutas/habilitar-ventas-rutas` creada; sidebar enlazado; filtros, seleccion masiva y confirmacion implementados; handoff documentado | `docs/ai_workflow/F2-017_habilitar_ventas_rutas.md` |

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


