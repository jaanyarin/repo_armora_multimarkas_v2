# Workflow automatico y sincrono de agentes - ARMORA

## Objetivo

Definir como deben trabajar los agentes ARMORA cuando una tarea requiere coordinacion entre perfiles, evitando cambios aislados, contradicciones con SDD, perdida de trazabilidad o implementaciones por prueba y error.

Este protocolo aplica a todos los agentes definidos en `opencode.json` y a todos los skills ARMORA ubicados en `.opencode/skills/armora-*/`.

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


## Cadena automatica obligatoria por feature

Cuando el usuario solicite construir, corregir o migrar una funcionalidad, el flujo por defecto debe ser una cadena automatica dirigida por `armora-architect`. No se debe ejecutar como trabajo aislado de un solo agente salvo que la tarea sea puramente documental o una consulta.

### Secuencia base

| Orden | Rol | Agente | Responsabilidad | Salida obligatoria |
|---|---|---|---|---|
| 1 | Orquestador | `armora-architect` | Entender solicitud, leer SDD, definir alcance, detectar dominios afectados, crear subtareas y seleccionar agentes | Plan de ejecucion, archivos permitidos, criterios de aceptacion, riesgos |
| 2 | Funcional | `armora-product-owner` cuando aplique | Confirmar regla de negocio, datos requeridos, estados, validaciones y comportamiento esperado | Criterios funcionales y bloqueos de negocio |
| 3 | Diseno UI/UX | `armora-ui-ux` cuando hay pantalla o flujo visual | Definir estructura visual, UX, estados, errores, accesibilidad y componentes | Especificacion UI/UX para web/mobile |
| 4 | Datos | `armora-database` cuando hay persistencia | Revisar tablas, columnas, enums, indices, constraints y migraciones en espanol `snake_case` | Modelo/migracion validada |
| 5 | Backend | `armora-backend-quarkus` cuando hay API o regla servidor | Implementar contrato, validaciones, transacciones, errores y seguridad del lado servidor | Endpoint/servicio implementado y documentado |
| 6 | Frontend/Mobile | `armora-frontend-web` o `armora-mobile-flutter` | Implementar pantalla, consumo API, formularios, estados, errores y navegacion | UI integrada al contrato real |
| 7 | Seguridad | `armora-security` | Auditar secretos, RBAC, JWT, CORS, exposicion de datos, hardcoding y permisos | Revision de seguridad con hallazgos o aprobacion |
| 8 | Auditor QA | `armora-qa` | Validar criterios, pruebas unitarias/integracion/build/E2E segun alcance, regresion | Resultado de pruebas y riesgos residuales |
| 9 | Documentacion | `armora-sdd-manager` cuando cambia contrato, modelo o alcance | Actualizar SDD, ADR, tablero y handoff final | Documentacion sincronizada |
| 10 | Cierre | `armora-architect` | Integrar resultados, resolver conflictos, decidir si esta lista o bloqueada | Resumen final, estado y siguiente paso |

### Reglas de automatizacion

1. El orquestador debe delegar subtareas con `task()` cuando OpenCode lo permita, usando el `subagent_type` correspondiente.
2. Si la herramienta no permite ejecucion real de subagentes en ese contexto, el orquestador debe simular la cadena de revision usando los perfiles cargados y dejar evidencia en el handoff.
3. El desarrollador no debe implementar antes de que UI/UX, Datos o Backend definan contrato cuando la tarea los afecte.
4. QA y Security no deben ser omitidos en funcionalidades con login, permisos, datos personales, ventas, stock, pagos, pedidos o integraciones.
5. Una feature con pantalla debe pasar por UI/UX antes de cierre, aunque el cambio tecnico sea backend o API.
6. Ningun agente puede introducir credenciales, tokens, passwords, API keys, certificados, claves privadas, URLs secretas ni datos reales hardcodeados.
7. Ningun agente puede consumir datos hardcodeados como si fueran datos reales del sistema.
8. El cierre debe indicar que agentes participaron, que validaron y que quedo pendiente.

### Aplicacion al modulo Crear Personal

Para migrar `https://armorasac.com/app/personal/crear-personal` al panel ARMORA v2, la cadena minima es:

1. `armora-architect`: delimita alcance de la pantalla Crear Personal dentro del admin web.
2. `armora-product-owner`: define campos obligatorios, reglas de documento, roles, vendedor/transportista y estados.
3. `armora-ui-ux`: replica/mejora UX del sistema heredado usando el design system actual.
4. `armora-database`: valida tabla `personal`, `usuarios` y enums en espanol.
5. `armora-backend-quarkus`: valida/ajusta `/api/v1/personal`.
6. `armora-frontend-web`: implementa ruta, formulario, validaciones y consumo real de API.
7. `armora-security`: revisa datos personales, credenciales temporales y permisos.
8. `armora-qa`: ejecuta build, tests y casos de formulario.
9. `armora-sdd-manager`: actualiza tablero/handoff si cambia contrato o alcance.

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
- `docs/sdd/17_convencion_nombres_tecnicos.md` si toca base de datos, migraciones o artefactos persistentes.

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
- No crear identificadores fisicos persistentes en ingles; usar espanol `snake_case` segun `docs/sdd/17_convencion_nombres_tecnicos.md`.

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

