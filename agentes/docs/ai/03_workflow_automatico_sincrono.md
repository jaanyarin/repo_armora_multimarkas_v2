# Workflow automatico y sincrono de agentes - ARMORA

## Objetivo

Definir como deben trabajar los agentes ARMORA cuando una tarea requiere coordinacion entre perfiles, evitando cambios aislados, contradicciones con SDD, perdida de trazabilidad o implementaciones por prueba y error.

Este protocolo aplica a todos los agentes definidos en `opencode.json` y a todos los perfiles ubicados en `agentes/perfiles/`.

## Principios obligatorios

1. SDD primero: ninguna funcionalidad nueva se implementa sin revisar especificacion, modelo, contrato y criterio de aceptacion aplicable.
2. Un agente lider por tarea: siempre existe un responsable principal y agentes de apoyo segun dominio.
3. Trabajo sincronizado por handoff: ningun agente entrega trabajo sin reportar impacto, archivos, contratos, datos, pruebas y riesgos.
4. Contratos antes de consumo: frontend web y mobile no inventan APIs ni payloads; consumen OpenAPI definido por backend.
5. Seguridad transversal: no hardcodear credenciales, tokens, passwords, API keys, certificados, claves privadas, URLs secretas ni datos sensibles.
6. Sin mocks productivos: mocks, stubs, seeds o datos fake solo pueden existir en contexto `dev`, `test` o documentacion, nunca conectados a produccion.
7. Cambios criticos requieren revision cruzada: stock, pedidos, pagos, SUNAT, permisos, precios, auditoria y datos financieros siempre pasan por Security y QA.
8. No operar por prueba y error: antes de editar, cada agente debe leer el contexto minimo y justificar el cambio con base en SDD, contrato o arquitectura.

## Entrada estandar de una tarea

Toda tarea automatizada debe representarse con esta ficha antes de iniciar:

```text
ID:
Titulo:
Objetivo:
Fase:
Dominio SDD:
Agente lider:
Agentes de apoyo:
Documentos obligatorios:
Archivos permitidos:
Contratos API afectados:
Modelo de datos afectado:
Riesgos de seguridad:
Criterios de aceptacion:
Estado:
Dependencias:
```

Si faltan `Objetivo`, `Agente lider`, `Documentos obligatorios` o `Criterios de aceptacion`, el agente debe bloquear la tarea y solicitar definicion.

## Estados de trabajo

| Estado | Significado | Responsable de mover estado |
|---|---|---|
| `pendiente` | Tarea registrada, aun no analizada | Delivery / Arquitecto |
| `en_analisis` | Agente lider revisa SDD, contratos y dependencias | Agente lider |
| `lista_para_implementar` | La tarea tiene alcance, criterios y archivos permitidos | Agente lider |
| `en_implementacion` | Se estan editando archivos o generando artefactos | Agente lider |
| `en_revision_cruzada` | Agentes de apoyo revisan impacto | QA / Security / agente de apoyo |
| `bloqueada` | Falta decision, secreto, contrato, dato o aprobacion | Agente que detecta bloqueo |
| `lista` | Cumple criterios de aceptacion y handoff | Agente lider + QA si aplica |
| `documentada` | SDD/ADR/changelog actualizado | SDD Manager |

## Seleccion del agente lider

| Tipo de tarea | Agente lider | Apoyo obligatorio |
|---|---|---|
| Arquitectura, estructura repo, decisiones tecnicas | `armora-architect` | SDD Manager, Delivery si afecta cronograma |
| Alcance, reglas de negocio, criterios | `armora-product-owner` | Arquitecto, SDD Manager |
| API, backend, reglas servidor | `armora-backend-quarkus` | QA, Security si hay auth/datos sensibles |
| Modelo, migraciones, indices | `armora-database` | Backend, QA |
| Admin web Next.js | `armora-frontend-web` | UI/UX, Backend, QA |
| App Flutter cliente/proveedor | `armora-mobile-flutter` | UI/UX, Backend, Security, QA |
| UI, UX, sistema visual | `armora-ui-ux` | Frontend/Mobile segun plataforma |
| Auth, permisos, secretos, hardening | `armora-security` | Backend, QA |
| Docker, servidor, CI/CD, backups | `armora-devops` | Security, Backend |
| SUNAT, pagos, webhooks, ERP | `armora-integrations` | Backend, Security, QA |
| Pruebas, regresion, contrato | `armora-qa` | Agente dueno del cambio |
| Documentacion SDD, ADR, changelog | `armora-sdd-manager` | Agente dueno del cambio |
| Cronograma, riesgos, dependencias | `armora-delivery` | Arquitecto, Product Owner |

## Flujo sincronico obligatorio

### 1. Intake

El arquitecto o delivery registra la tarea en `docs/ai_workflow/00_tablero_agentes.md` con estado `pendiente`.

Debe indicar como minimo:

- ID.
- Objetivo.
- Fase.
- Agente lider.
- Agentes de apoyo.
- Criterios de aceptacion.

### 2. Analisis del agente lider

El agente lider cambia el estado a `en_analisis` y revisa:

- `AGENTS.md`.
- `docs/sdd/00_indice.md`.
- Documento SDD del dominio.
- `agentes/docs/ai/00_agent_orchestration.md`.
- `agentes/docs/ai/02_handoff_protocol.md`.
- Este documento.

Si la tarea toca Fase 1, tambien debe revisar:

- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`.

### 3. Preparacion de contrato o diseno

Antes de implementar:

- Backend define o actualiza contrato API.
- Database define o revisa migracion/modelo.
- UI/UX define comportamiento visual si hay pantalla.
- Security revisa permisos si hay datos sensibles o sesion.
- QA define pruebas minimas.

### 4. Implementacion

El agente lider implementa solo dentro de los archivos permitidos para la tarea.

Reglas:

- No modificar dominios no relacionados.
- No crear datos hardcodeados para simular negocio real.
- No introducir secretos ni credenciales.
- No cambiar contrato publico sin actualizar OpenAPI y avisar a consumidores.
- No cambiar modelo sin migracion y revision de Database.

### 5. Revision cruzada

La tarea pasa a `en_revision_cruzada` cuando termina la implementacion inicial.

Revisiones minimas:

- QA: pruebas, criterios de aceptacion, regresion.
- Security: auth, permisos, secretos, exposicion de datos.
- Backend/Frontend/Mobile: compatibilidad de contrato cuando aplique.
- SDD Manager: documentacion viva si cambia comportamiento.

### 6. Handoff

El agente lider debe dejar el handoff con este formato:

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

### 7. Cierre

Una tarea solo puede quedar `lista` cuando:

- Cumple criterios de aceptacion.
- No tiene secretos hardcodeados.
- No deja mocks productivos activos.
- No rompe contratos API.
- Tiene pruebas o al menos plan de pruebas documentado.
- Tiene handoff completo.
- Tiene documentacion actualizada si cambio SDD, contrato, arquitectura o alcance.

## Reglas de bloqueo obligatorio

Un agente debe bloquear la tarea si detecta:

- Falta decision de negocio.
- Contradiccion con SDD vigente.
- Se requiere un secreto real no disponible.
- Hay intento de hardcodear credenciales, tokens, API keys o datos sensibles.
- Se pide conectar una integracion externa sin contrato ni ambiente definido.
- Se modifica stock, pagos, SUNAT, permisos o datos financieros sin QA y Security.
- Se intenta consumir una API no definida en OpenAPI.
- Se requiere cambiar alcance o fecha sin Delivery Manager.

## Flujo especifico para Fase 1

Durante Fase 1, el orden recomendado es:

1. `armora-architect`: validar estructura base y limites del monorepo.
2. `armora-devops`: preparar Docker Compose, variables, red local y convenciones de entorno.
3. `armora-backend-quarkus`: crear base Quarkus, health, version, OpenAPI y configuracion.
4. `armora-database`: crear migracion inicial y convenciones Flyway.
5. `armora-frontend-web`: crear base Next.js y consumo inicial de API.
6. `armora-mobile-flutter`: crear bases Flutter cliente/proveedor y configuracion por ambiente.
7. `armora-security`: revisar secretos, CORS, auth skeleton y permisos base.
8. `armora-qa`: definir pruebas minimas de build, health, contrato y smoke.
9. `armora-sdd-manager`: actualizar SDD, ADR y handoffs.
10. `armora-delivery`: actualizar tablero, dependencias y avance.

## Politica de sincronizacion entre frentes

Backend, frontend web y mobile pueden avanzar en paralelo solo si existe contrato API acordado.

Si no existe contrato:

1. Backend propone contrato.
2. Frontend/Mobile revisan consumo.
3. QA define prueba de contrato.
4. Security valida permisos.
5. Luego se implementa en paralelo.

## Archivos de control

- `AGENTS.md`: reglas raiz del repositorio.
- `opencode.json`: agentes configurados y documentos cargados.
- `agentes/docs/ai/00_agent_orchestration.md`: matriz de coordinacion.
- `agentes/docs/ai/01_context_map.md`: mapa de contexto.
- `agentes/docs/ai/02_handoff_protocol.md`: formato de handoff.
- `agentes/docs/ai/03_workflow_automatico_sincrono.md`: este protocolo.
- `docs/ai_workflow/00_tablero_agentes.md`: tablero operativo de tareas.

## Regla final

Si hay duda entre avanzar rapido o mantener coherencia de contrato, datos, seguridad y SDD, se debe priorizar coherencia. El objetivo de los agentes no es producir cambios aislados, sino construir el sistema ARMORA de forma trazable, segura y coordinada.
