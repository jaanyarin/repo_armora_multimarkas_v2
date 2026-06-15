# F1-002 - Convenciones de configuracion y secretos

## Estado

`lista`

## Objetivo

Definir convenciones minimas de configuracion y secretos antes de crear Docker, backend Quarkus, frontend Next.js o apps Flutter ejecutables.

## Agente lider

`armora-security`

## Agentes de apoyo

- `armora-devops`
- `armora-backend-quarkus`

## Documentos consultados

- `AGENTS.md`
- `seguridad/politica_transversal.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `agentes/docs/ai/03_workflow_automatico_sincrono.md`
- `docs/ai_workflow/00_tablero_agentes.md`

## Cambios realizados

- Se creo `.env.example` con variables esperadas y placeholders sin secretos reales.
- Se creo `seguridad/convenciones_configuracion_secretos.md`.
- Se actualizo `.gitignore` para ignorar `.env.*` y carpetas `secrets/`, manteniendo versionable `.env.example`.
- Se definieron reglas por entorno para Quarkus, Next.js, Flutter, Docker e integraciones futuras.

## Validaciones

| Criterio | Estado | Comentario |
|---|---|---|
| `.env.example` existe | Cumple | Incluye placeholders y variables base. |
| `.env.example` no contiene secretos reales | Cumple | Usa valores locales publicos o placeholders. |
| `.env*` reales ignorados | Cumple | `.gitignore` contiene `.env.*` y excepcion `!.env.example`. |
| Carpeta de secretos ignorada | Cumple | `.gitignore` contiene `secrets/` y `**/secrets/`. |
| Politica documentada | Cumple | Existe `seguridad/convenciones_configuracion_secretos.md`. |
| Reglas para Next.js publico/privado | Cumple | Se prohiben secretos en `NEXT_PUBLIC_*`. |
| Reglas para Flutter | Cumple | Se prohiben secretos compilados en APK/AAB/IPA. |
| Reglas para Quarkus | Cumple | Se indica uso de env vars y `*_SECRET_PATH`. |

## Decision tecnica

F1-002 queda completada. A partir de este punto, F1-003 puede crear Docker Compose usando nombres de variables y placeholders, sin secretos reales.

## Riesgos abiertos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Usar passwords reales en `.env.local` y compartirlos | Exposicion de secretos | No versionar `.env.local`; rotar si se comparte por error. |
| Poner secretos en `NEXT_PUBLIC_*` | Exposicion en navegador | Revision Security antes de cerrar tareas frontend. |
| Compilar secretos en Flutter | Exposicion en APK/AAB/IPA | Usar configuracion por entorno y almacenamiento seguro. |

## Handoff

```text
Cambio realizado:
Definidas convenciones de configuracion y secretos para Fase 1.

Documentos consultados:
AGENTS.md, seguridad/politica_transversal.md, docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md, agentes/docs/ai/03_workflow_automatico_sincrono.md, docs/ai_workflow/00_tablero_agentes.md.

Archivos modificados:
.env.example
.gitignore
seguridad/convenciones_configuracion_secretos.md
docs/ai_workflow/F1-002_convenciones_configuracion_secretos.md
docs/ai_workflow/00_tablero_agentes.md

Contratos API afectados:
Ninguno.

Modelo de datos afectado:
Ninguno.

Permisos/scopes afectados:
Ninguno. Se definio politica previa para secretos y configuracion.

Pruebas ejecutadas:
Revision de existencia de .env.example, reglas .gitignore y busqueda textual de placeholders principales.

Pruebas pendientes:
Validar consumo real cuando existan Quarkus, Next.js, Flutter y Docker Compose.

Riesgos abiertos:
Evitar secretos en NEXT_PUBLIC_*, APK/AAB/IPA, application.properties y logs.

Validaciones pendientes:
F1-003 debe usar estas convenciones para crear Docker Compose local.

Siguiente agente recomendado:
armora-devops para F1-003, con apoyo de armora-security y armora-backend-quarkus.
```
