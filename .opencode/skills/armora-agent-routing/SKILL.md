---
name: armora-agent-routing
description: "Rutea tareas al agente ARMORA adecuado segun el tipo de trabajo: backend, frontend, mobile, datos, seguridad, etc. Cargar al inicio de cada tarea."
---

# Skill: ARMORA Agent Routing

## Objetivo

Detectar automaticamente el tipo de tarea y seleccionar el agente optimo, o sugerir el cambio si el agente actual no es el indicado.

## Matriz de deteccion automatica

| Si la tarea menciona... | Usar agente |
|---|---|
| arquitectura, diseno general, coordinacion, orquestar, stack, decision tecnica | `armora-architect` |
| ui, ux, diseno, pantalla, componente visual, tema, colores, tipografia, material design, tailwind | `armora-ui-ux` |
| producto, alcance, historia de usuario, criterio de aceptacion, regla de negocio, backlog, priorizar | `armora-product-owner` |
| endpoint, api, rest, quarkus, servicio, dto, repositorio, panache, jpa, transaccion, negocio backend | `armora-backend-quarkus` |
| tabla, migracion, modelo de datos, schema, sql, postgresql, indice, constraint, vista, secuencia, flyway | `armora-database` |
| prueba, test, qa, unit test, integration test, e2e, contrato, regresion, cobertura, escenario de prueba | `armora-qa` |
| devops, docker, despliegue, servidor, nginx, caddy, https, certificado, backup, monitoreo, ci/cd | `armora-devops` |
| frontend, web, nextjs, react, typescript, admin, panel, tabla, formulario web, tanstack, tailwind web | `armora-frontend-web` |
| flutter, mobile, dart, app, android, ios, cliente, proveedor, barcode, scanner, material flutter | `armora-mobile-flutter` |
| seguridad, permiso, scope, rbac, token, jwt, secreto, hardening, owasp, csp, cors, autenticacion, sesion | `armora-security` |
| integracion, sunat, pago, yape, plin, culqi, niubiz, mercadopago, webhook, facturador, erp | `armora-integrations` |
| documentacion, sdd, spec, adr, glossary, changelog, contrato api, modelo de datos documentado | `armora-sdd-manager` |
| cronograma, plan, release, entrega, riesgo, dependencia, raci, hito, deadline, coordinacion de equipo | `armora-delivery` |


## Cadena automatica por tipo de trabajo

El ruteo no debe seleccionar solo un agente aislado. Para tareas de implementacion debe activar una cadena de agentes coordinada por `armora-architect`.

| Tipo de solicitud | Cadena minima |
|---|---|
| Crear pantalla admin web | `armora-architect` -> `armora-product-owner` -> `armora-ui-ux` -> `armora-backend-quarkus` si hay API -> `armora-frontend-web` -> `armora-security` -> `armora-qa` -> `armora-sdd-manager` si cambia contrato/alcance |
| Crear endpoint/API | `armora-architect` -> `armora-product-owner` -> `armora-database` si persiste -> `armora-backend-quarkus` -> consumidor web/mobile si aplica -> `armora-security` -> `armora-qa` -> `armora-sdd-manager` |
| Crear migracion/modelo | `armora-architect` -> `armora-database` -> `armora-backend-quarkus` -> `armora-security` si hay datos sensibles -> `armora-qa` -> `armora-sdd-manager` |
| Crear pantalla Flutter | `armora-architect` -> `armora-product-owner` -> `armora-ui-ux` -> `armora-backend-quarkus` si hay API -> `armora-mobile-flutter` -> `armora-security` -> `armora-qa` |
| Corregir login/auth/permisos | `armora-architect` -> `armora-backend-quarkus` -> `armora-frontend-web`/`armora-mobile-flutter` consumidor -> `armora-security` -> `armora-qa` |
| Integracion pagos/SUNAT | `armora-architect` -> `armora-product-owner` -> `armora-integrations` -> `armora-backend-quarkus` -> `armora-database` si persiste -> `armora-security` -> `armora-qa` -> `armora-sdd-manager` |
| Documentacion o cronograma | `armora-architect` -> `armora-sdd-manager` o `armora-delivery` -> agente dueno del dominio si requiere validacion tecnica |

Regla de ejecucion:
- Si el usuario pide “implementa”, “corrige”, “migra”, “crea” o “continua”, usar la cadena minima aplicable.
- Si el usuario solo pregunta, responder con analisis y no modificar archivos salvo que lo solicite.
- Si existe conflicto entre rapidez y revision cruzada, priorizar revision cruzada.

## Reglas de ruteo

1. Si la tarea es **multidominio** (ej: "crear modulo de ventas" afecta backend + frontend + mobile) -> usar `armora-architect` como orquestador y derivar sub-tareas.
2. Si la tarea es **ambigua** -> usar `armora-architect` para analisis inicial.
3. Si la tarea **contradice SDD** -> no continuar, cargar `armora-sdd` skill para evaluar.
4. Si el cambio es **critico** (pagos, stock, SUNAT, permisos) -> involucrar siempre a `armora-security` y `armora-qa`.
5. Todo handoff entre agentes debe seguir `02_handoff_protocol.md`.

## Handoff minimo

Al transferir a otro agente, incluir:
- Tarea original
- Que se avanzo / decidio
- Documentos SDD consultados
- Contratos o tablas afectadas
- Pruebas necesarias
- Riesgos abiertos

