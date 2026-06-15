# Perfiles de agentes - ARMORA SDD

Esta carpeta contiene perfiles de agentes para el proyecto ARMORA SDD.

## Decision tecnica vigente

La decision tecnica vigente del proyecto es:

- Admin web: Next.js + React + TypeScript.
- Mobile cliente: Flutter + Dart.
- Mobile proveedor: Flutter + Dart.
- Backend principal: Quarkus + Java 21+.
- Base de datos: PostgreSQL.
- Cache/colas: Redis.
- Contratos: API REST versionada `/api/v1` + OpenAPI.
- Despliegue: servidor fisico con Docker, Nginx/Caddy, HTTPS, backups y monitoreo.
- Arquitectura: monolito modular backend, API-first, mobile-ready y documentacion SDD viva.

## Agentes creados

1. `01_desarrollador_arquitecto.md`: perfil senior/staff/principal para arquitectura full stack con backend Quarkus, admin Next.js y mobile Flutter.
2. `02_disenador_ui_ux.md`: perfil senior para UI/UX web y mobile, Material Design 3, Flutter Material, Tailwind CSS y sistema de componentes.
3. `03_analista_funcional_product_owner.md`: perfil para alcance, historias, reglas de negocio y criterios de aceptacion.
4. `04_backend_quarkus_specialist.md`: perfil especialista en backend Quarkus, APIs, transacciones y seguridad backend.
5. `05_database_data_architect.md`: perfil especialista en PostgreSQL, modelo de datos, integridad, migraciones y backups.
6. `06_qa_test_engineer.md`: perfil QA para pruebas unitarias, integracion, E2E, contratos y regresion.
7. `07_devops_infra_engineer.md`: perfil DevOps para servidor fisico, Docker, HTTPS, backups, monitoreo y despliegue.
8. `08_frontend_web_specialist.md`: perfil frontend Next.js para admin web.
9. `09_mobile_specialist.md`: perfil mobile Flutter/Dart para apps cliente y proveedor.
10. `10_security_engineer.md`: perfil de seguridad aplicativa, secretos, permisos y hardening.
11. `11_integration_engineer.md`: perfil de integraciones SUNAT, pagos, webhooks y ERP futuro.
12. `12_documentation_sdd_manager.md`: perfil para mantener documentacion SDD, ADRs y trazabilidad.
13. `13_project_delivery_manager.md`: perfil para coordinacion, cronograma, dependencias, riesgos y entregas.

## Archivos de automatizacion para agentes

Ademas de los perfiles, esta entrega incluye:

- `AGENTS.md`: reglas raiz para agentes de codigo en VS Code, Codex, opencode u otros.
- `opencode.json`: configuracion de proyecto para opencode, con instrucciones y agentes por rol.
- `.github/copilot-instructions.md`: instrucciones compatibles con asistentes de VS Code/GitHub Copilot.
- `.vscode/settings.json`: recomendaciones basicas de workspace.
- `.opencode/skills/armora-sdd/SKILL.md`: skill para trabajar con SDD.
- `.opencode/skills/armora-agent-routing/SKILL.md`: skill para elegir agente/rol segun tarea.
- `docs/ai/00_agent_orchestration.md`: matriz de coordinacion entre agentes.
- `docs/ai/01_context_map.md`: mapa de documentos que debe leer cada agente.
- `docs/ai/02_handoff_protocol.md`: protocolo de handoff entre agentes.

## Uso recomendado

Cada agente debe usarse como guia de comportamiento, responsabilidades, criterios tecnicos y limites de decision para las tareas del proyecto.

Los agentes deben operar alineados con la documentacion SDD actualizada:

- `00_indice.md`
- `01_diagnostico_stack_actual.md`
- `02_stack_recomendado.md`
- `03_sdd_contexto_glosario.md`
- `04_sdd_requerimientos.md`
- `05_sdd_arquitectura.md`
- `06_sdd_modelo_datos_inicial.md`
- `07_sdd_api_contratos.md`
- `08_sdd_roadmap_mvp.md`
- `09_preguntas_validacion.md`
- `10_despliegue_conexion_servidor.md`
- `11_stack_alternativo_backend_quarkus.md`
- `12_revision_respuestas_validacion.md`
- `13_cronograma_quarkus_gantt.md`

- `15_stack_mobile_flutter_dart.md`

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
