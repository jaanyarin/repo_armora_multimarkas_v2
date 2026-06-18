# AGENTS.md - ARMORA Multimarkas v2

## Estado del repositorio

Este repositorio contiene documentacion SDD, perfiles de agentes y estructura base para iniciar construccion del proyecto ARMORA Multimarkas v2.

Estructura principal esperada:

- `docs/sdd/`: especificaciones SDD, arquitectura, contratos, cronograma y plan de Fase 1.
- `docs/scrapping/`: evidencia y documentacion extraida del sistema heredado.
- `docs/ai_workflow/`: tablero operativo para coordinacion automatica de agentes.
- `agentes/perfiles/`: perfiles especializados de agentes (DEPRECATED â€” migrados a `.opencode/skills/armora-*/`).
- `agentes/docs/ai/`: reglas de orquestacion, contexto, handoff y workflow sincronico.
- `backend/`: backend Quarkus con migracion Flyway V1.
- `frontend_web/`: admin web Next.js con login y dashboard.
- `mobile_cliente/`: app Flutter de clientes con login y health check.
- `mobile_proveedor/`: app Flutter de proveedores con login y health check.
- `packages/`: paquetes compartidos o contratos generados.
- `seguridad/`: documentacion o artefactos de seguridad.

No ejecutes comandos de build/test/lint si no existe manifiesto del stack correspondiente (`pom.xml`, `package.json`, `pubspec.yaml`, etc.). Antes de compilar o instalar dependencias, verifica que el subproyecto ya este inicializado.

## Flujo de desarrollo SDD

1. Leer SDD relevante en `docs/sdd/` antes de proponer cambios.
2. Verificar `docs/scrapping/` si se necesita entender el sistema heredado.
3. Confirmar que la tarea no contradice la decision tecnica vigente.
4. Usar el agente correspondiente segun la matriz de ruteo.
5. Si la tarea implica crear codigo nuevo, iniciar con spec, modelo y contrato, no con implementacion improvisada.
6. Registrar decisiones tecnicas como ADR cuando cambie stack, modelo, contrato o alcance.
7. Actualizar el tablero `docs/ai_workflow/00_tablero_agentes.md` cuando una tarea cambie de estado.
8. Cerrar cada tarea con handoff segun `agentes/docs/ai/02_handoff_protocol.md`.

## Stack - decision tecnica vigente

- Web admin: Next.js + React + TypeScript.
- Mobile: Flutter + Dart, dos apps separadas: `mobile_cliente` y `mobile_proveedor`.
- Backend API: Quarkus + Java 21+.
- BD: PostgreSQL.
- Cache/colas: Redis.
- Contratos: OpenAPI REST versionado `/api/v1`, generado desde Quarkus.
- Despliegue: servidor fisico, Docker Compose, Nginx/Caddy, HTTPS.

## Agentes y ruteo

| Tarea | Agente principal en `opencode.json` | Apoyo |
|---|---|---|
| Arquitectura / coordinacion | `armora-architect` | SDD Manager, Delivery si aplica |
| UI/UX diseno | `armora-ui-ux` | Frontend/Mobile segun plataforma |
| Alcance / reglas de negocio | `armora-product-owner` | Arquitecto, SDD Manager |
| Endpoints / APIs / logica backend | `armora-backend-quarkus` | QA, Security |
| Tablas / migraciones / modelo | `armora-database` | Backend, QA |
| Pruebas unitarias / integracion / E2E | `armora-qa` | Segun dominio |
| Infraestructura / Docker / despliegue | `armora-devops` | Security, Backend |
| Pantallas admin web | `armora-frontend-web` | UI/UX, Backend, QA |
| Pantallas Flutter cliente/proveedor | `armora-mobile-flutter` | UI/UX, Backend, Security, QA |
| Permisos / RBAC / seguridad | `armora-security` | Backend, Product Owner, QA |
| SUNAT / pagos / webhooks | `armora-integrations` | Backend, Security, QA |
| Documentacion SDD / ADRs | `armora-sdd-manager` | Agente dueno del cambio |
| Cronograma / releases / riesgos | `armora-delivery` | Arquitecto, Product Owner |

Usar `armora-architect` para tareas ambiguas, multidominio o cuando no sea evidente el agente lider.

## Reglas de arquitectura

- Backend es fuente de verdad de reglas de negocio. Web y mobile no calculan precios, stock, permisos ni estados tributarios como verdad.
- API versionada: siempre `/api/v1/...`.
- Mutaciones criticas auditan: stock, pedidos, pagos, ventas, SUNAT, permisos y datos financieros.
- Contrato unico: Next.js y Flutter consumen la misma API, no APIs paralelas.
- BD y Redis no se exponen a internet.
- OpenAPI es el contrato de coordinacion entre backend, frontend, mobile y QA.

## Seguridad obligatoria

- No hardcodear credenciales, tokens, API keys, certificados, claves privadas, URLs secretas ni datos reales.
- No subir secretos al repo. Usar variables de entorno, vault o mecanismo seguro equivalente.
- No dejar mocks, stubs o datos fake activos en produccion.
- No usar datos hardcodeados como si fueran datos reales de negocio.
- Si se detecta un secreto en codigo: remover, rotar y documentar como incidente.


## Orquestador automatico por cadena de agentes

Cuando el usuario solicite implementar, corregir, migrar, crear o continuar una funcionalidad, el flujo por defecto es automatico y dirigido por `armora-architect`.

La secuencia base es:

1. `armora-architect`: entiende la solicitud, revisa SDD, define alcance, riesgos, archivos permitidos y criterios de aceptacion.
2. `armora-product-owner`: valida reglas de negocio cuando hay comportamiento funcional, usuarios, permisos o flujo operativo.
3. `armora-ui-ux`: define o revisa experiencia de usuario para toda pantalla web/mobile.
4. `armora-database`: valida persistencia, migraciones, constraints, indices y nomenclatura en espanol `snake_case`.
5. `armora-backend-quarkus`: implementa o valida API, reglas servidor, transacciones y errores.
6. `armora-frontend-web` / `armora-mobile-flutter`: implementa consumo real, formularios, estados y navegacion.
7. `armora-security`: audita secretos, hardcoding, RBAC, JWT, CORS y datos sensibles.
8. `armora-qa`: valida build, tests, criterios de aceptacion, contrato y regresion.
9. `armora-sdd-manager`: actualiza SDD, ADR, tablero o handoff cuando cambia contrato, modelo, alcance o comportamiento.
10. `armora-architect`: integra hallazgos y cierra como listo o bloqueado.

Si OpenCode permite `task()`/subagentes, el arquitecto debe delegar cada paso al `subagent_type` correspondiente. Si no esta disponible, debe aplicar la misma cadena manualmente y reportar el resultado de cada rol.

Para pantallas como `crear personal`, UI/UX, Backend, Frontend, Security y QA son obligatorios; Database tambien si se toca tabla, enum, constraint o migracion.

## Coordinacion automatica entre agentes

Todo agente debe seguir:

- `agentes/docs/ai/00_agent_orchestration.md` para ruteo por dominio.
- `agentes/docs/ai/02_handoff_protocol.md` para cierre de tarea.
- `agentes/docs/ai/03_workflow_automatico_sincrono.md` para flujo automatico, estados, bloqueos y sincronizacion.
- `docs/ai_workflow/00_tablero_agentes.md` como tablero operativo.

## Comandos personalizados

Al recibir **"sincroniza gh"** o **"sincroniza github"**, ejecutar:

1. `git add -A` (todos los archivos, incluyendo untracked)
2. `git commit -m "feat: <descripcion de cambios>"` (mensaje descriptivo del conjunto de cambios)
3. `git push -u origin master`

No preguntar confirmacion ni detalle del mensaje. Inferir el mensaje del contexto de las cambios.

Reglas de coordinacion:

- Cambio funcional: Product Owner.
- Cambio de contrato API: Backend + Frontend/Mobile consumidor + QA.
- Cambio de modelo de datos: Database + Backend + QA.
- Cambio mobile que toque sesion o datos sensibles: UI/UX + Mobile + Security + QA.
- Cambio de pagos/SUNAT: Integration + Backend + Security + QA.
- Cambio de despliegue: DevOps + Security.
- Cambio de alcance/fecha: Delivery Manager.
- Cambio documental final: SDD Manager.

## Fase 1

Para iniciar construccion, usar como base:

- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`.
- `docs/ai_workflow/00_tablero_agentes.md`.

La Fase 1 no debe enfocarse en modulos completos de negocio. Debe dejar lista la base tecnica: estructura, configuracion, Docker local, Quarkus base, PostgreSQL/Flyway, Redis, OpenAPI, apps base Next.js/Flutter, seguridad inicial y pruebas minimas.

## Criterios de bloqueo

Bloquear o pedir validacion si:

- Falta decision de negocio.
- Hay contradiccion entre SDD y solicitud.
- Se requiere secreto real.
- Se expone dato sensible.
- Se rompe contrato API.
- Se cambia flujo critico de pago, stock, SUNAT, permisos, precios o datos financieros.
- Se intenta implementar sin criterio de aceptacion.
- Se intenta consumir una API que no esta definida o acordada.

## Donde profundizar

- `agentes/perfiles/`: perfiles de agentes con roles, responsabilidades y reglas tecnicas (DEPRECATED â€” migrados a `.opencode/skills/armora-*/`).
- `agentes/docs/ai/00_agent_orchestration.md`: matriz de coordinacion.
- `agentes/docs/ai/01_context_map.md`: mapa de documentos por agente.
- `agentes/docs/ai/02_handoff_protocol.md`: protocolo de handoff.
- `agentes/docs/ai/03_workflow_automatico_sincrono.md`: protocolo maestro de trabajo automatico y sincrono.
- `docs/ai_workflow/00_tablero_agentes.md`: tablero operativo de tareas.
- `.opencode/skills/armora-agent-routing/SKILL.md`: ruteo por palabras clave.
- `.opencode/skills/armora-sdd/SKILL.md`: coherencia SDD.

