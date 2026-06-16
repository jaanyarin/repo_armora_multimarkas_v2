# Perfiles de agentes - ARMORA SDD

Esta carpeta contiene los perfiles y documentos de coordinacion para que los agentes trabajen sobre ARMORA Multimarkas v2 con enfoque SDD.

## Decision tecnica vigente

- Admin web: Next.js + React + TypeScript.
- Mobile cliente: Flutter + Dart.
- Mobile proveedor: Flutter + Dart.
- Backend principal: Quarkus + Java 21+.
- Base de datos: PostgreSQL.
- Cache/colas: Redis.
- Contratos: API REST versionada `/api/v1` + OpenAPI.
- Despliegue: servidor fisico con Docker, Nginx/Caddy, HTTPS, backups y monitoreo.
- Arquitectura: monolito modular backend, API-first, mobile-ready y documentacion SDD viva.

## Agentes configurados

Los agentes activos estan definidos en `opencode.json`:

1. `armora-architect`: arquitectura, coordinacion tecnica y ruteo multidominio.
2. `armora-ui-ux`: UI/UX para admin web y apps Flutter.
3. `armora-product-owner`: alcance, reglas de negocio, historias y criterios de aceptacion.
4. `armora-backend-quarkus`: APIs REST, Quarkus, OpenAPI, transacciones y reglas servidor.
5. `armora-database`: PostgreSQL, modelo de datos, migraciones, indices y backups.
6. `armora-qa`: pruebas unitarias, integracion, contratos, E2E, regresion y release.
7. `armora-devops`: Docker, servidor fisico, HTTPS, backups, monitoreo y despliegue.
8. `armora-frontend-web`: admin web Next.js, React, TypeScript, Tailwind y consumo API.
9. `armora-mobile-flutter`: apps Flutter cliente/proveedor.
10. `armora-security`: secretos, RBAC, permisos, hardening, OWASP y revision de seguridad.
11. `armora-integrations`: SUNAT, pagos, webhooks y ERP futuro.
12. `armora-sdd-manager`: documentacion SDD, ADRs, glosario y trazabilidad.
13. `armora-delivery`: cronograma, dependencias, riesgos, releases y coordinacion.

## Documentos de coordinacion

- `AGENTS.md`: reglas raiz del repositorio.
- `opencode.json`: configuracion de agentes e instrucciones cargadas.
- `agentes/docs/ai/00_agent_orchestration.md`: matriz de coordinacion entre agentes.
- `agentes/docs/ai/01_context_map.md`: documentos que debe leer cada agente.
- `agentes/docs/ai/02_handoff_protocol.md`: protocolo de handoff entre agentes.
- `agentes/docs/ai/03_workflow_automatico_sincrono.md`: workflow maestro para trabajo automatico y sincrono.
- `docs/ai_workflow/00_tablero_agentes.md`: tablero operativo de tareas, estados y dependencias.
- `.opencode/skills/armora-sdd/SKILL.md`: skill para coherencia SDD.
- `.opencode/skills/armora-agent-routing/SKILL.md`: skill para elegir agente/rol segun tarea.
- `.opencode/skills/armora-*/SKILL.md`: 13 skills de agente que se cargan automaticamente segun la tarea.

## Uso recomendado

Cada tarea debe iniciar con:

1. Lectura de `AGENTS.md`.
2. Revision del documento SDD aplicable en `docs/sdd/`.
3. Seleccion del agente lider segun `agentes/docs/ai/00_agent_orchestration.md` (los skills ARMORA se cargan automaticamente segun la tarea desde `.opencode/skills/armora-*/`).
4. Registro o actualizacion en `docs/ai_workflow/00_tablero_agentes.md`.
5. Ejecucion segun `agentes/docs/ai/03_workflow_automatico_sincrono.md`.
6. Cierre con handoff segun `agentes/docs/ai/02_handoff_protocol.md`.

## Documentos SDD base

- `docs/sdd/00_indice.md`
- `docs/sdd/01_diagnostico_stack_actual.md`
- `docs/sdd/02_stack_recomendado.md`
- `docs/sdd/03_sdd_contexto_glosario.md`
- `docs/sdd/04_sdd_requerimientos.md`
- `docs/sdd/05_sdd_arquitectura.md`
- `docs/sdd/06_sdd_modelo_datos_inicial.md`
- `docs/sdd/07_sdd_api_contratos.md`
- `docs/sdd/08_sdd_roadmap_mvp.md`
- `docs/sdd/09_preguntas_validacion.md`
- `docs/sdd/10_despliegue_conexion_servidor.md`
- `docs/sdd/11_stack_alternativo_backend_quarkus.md`
- `docs/sdd/12_revision_respuestas_validacion.md`
- `docs/sdd/13_cronograma_quarkus_gantt.md`
- `docs/sdd/15_stack_mobile_flutter_dart.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`

## Politica transversal obligatoria

Aplica para todos los perfiles existentes y futuros:

- Nunca hardcodear credenciales, tokens, passwords, API keys, certificados, claves privadas, URLs secretas o datos sensibles dentro del codigo.
- Nunca subir secretos al repositorio.
- Nunca usar datos hardcodeados como si fueran datos reales de negocio.
- Nunca dejar mocks, stubs o datos de prueba conectados a flujos productivos.
- Toda configuracion debe venir de variables de entorno, archivos seguros de configuracion, vault o mecanismo equivalente.
- Todo dato semilla debe estar claramente separado como seed/dev/test y nunca mezclarse con produccion.
- Toda integracion externa debe usar secretos inyectados por entorno.
- Si se detecta un secreto en codigo, se debe tratar como incidente: removerlo, rotarlo y documentar la correccion.
