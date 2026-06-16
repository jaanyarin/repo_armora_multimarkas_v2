# F1-006 - Base admin web Next.js

## Estado

`lista`

## Objetivo

Crear la base del admin web Next.js con App Router, estructura de carpetas, layout, pagina de login, dashboard con health check y API client configurable por entorno.

## Agente lider

`armora-frontend-web`

## Agentes de apoyo

- `armora-ui-ux`
- `armora-backend-quarkus`
- `armora-qa`

## Documentos consultados

- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `docs/sdd/17_convencion_nombres_tecnicos.md`
- `docs/ai_workflow/00_tablero_agentes.md`

## Cambios realizados

- Se creo `frontend_web/package.json` con Next.js 14, React 18, TypeScript.
- Se creo `frontend_web/tsconfig.json` con `@/*` path alias.
- Se creo `frontend_web/next.config.mjs` con configuracion basica.
- Se creo `frontend_web/.env.local.example` con variables de entorno para API.
- Se creo `frontend_web/src/lib/api-client.ts`: cliente HTTP tipado con metodos `get`, `post`, `health`, `version`.
- Se creo `frontend_web/src/lib/auth.tsx`: contexto de autenticacion con `AuthProvider`.
- Se creo `frontend_web/src/app/layout.tsx`: layout raiz con HTML `lang="es-PE"`.
- Se creo `frontend_web/src/app/page.tsx`: raiz redirige a `/login`.
- Se creo `frontend_web/src/app/(auth)/login/page.tsx`: formulario de login conectado a API.
- Se creo `frontend_web/src/app/dashboard/page.tsx`: pagina protegida que consume `/health`.
- Se creo `frontend_web/src/app/globals.css`: reset basico.

## Contratos API afectados

Ninguno nuevo. Consume `GET /api/v1/health` y `POST /api/v1/auth/login` ya definidos en plan de Fase 1.

## Modelo de datos afectado

Ninguno.

## Permisos/scopes afectados

Ninguno. Auth skeleton preparado pero no vinculado a RBAC aun.

## Pruebas ejecutadas

```powershell
npm run build
```

Resultado:

```text
✓ Compiled successfully
Route (app)                              Size     First Load JS
┌ ○ /                                    138 B          87.4 kB
├ ○ /_not-found                          873 B          88.2 kB
├ ○ /dashboard                           1.45 kB        88.7 kB
└ ○ /login                               1.68 kB          89 kB
```

## Pruebas pendientes

- Integracion real contra backend Quarkus cuando este disponible.
- Pruebas de autenticacion contra endpoint `/auth/login`.

## Riesgos abiertos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| API base URL hardcodeada si falta variable de entorno | Cae a localhost | Tiene fallback a localhost:8085 |
| Sin testing automatizado aun | No se detectan regresiones | F1-009 debe agregar tests de build y smoke |

## Handoff

```text
Cambio realizado:
Base admin web Next.js creada y validada con build exitoso. Estructura: layout, login, dashboard, API client, auth skeleton.

Documentos consultados:
docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md, docs/sdd/17_convencion_nombres_tecnicos.md, docs/ai_workflow/00_tablero_agentes.md.

Archivos modificados:
frontend_web/package.json
frontend_web/tsconfig.json
frontend_web/next.config.mjs
frontend_web/.env.local.example
frontend_web/src/app/layout.tsx
frontend_web/src/app/page.tsx
frontend_web/src/app/globals.css
frontend_web/src/app/(auth)/login/page.tsx
frontend_web/src/app/dashboard/page.tsx
frontend_web/src/lib/api-client.ts
frontend_web/src/lib/auth.tsx
docs/ai_workflow/00_tablero_agentes.md

Contratos API afectados:
Ninguno.

Modelo de datos afectado:
Ninguno.

Permisos/scopes afectados:
Ninguno.

Pruebas ejecutadas:
npm run build -> exitoso (4 rutas compiladas).

Pruebas pendientes:
Integracion real contra backend. Tests automatizados (F1-009).

Riesgos abiertos:
Dependencia de backend para probar login y health real.

Validaciones pendientes:
F1-007 (Flutter cliente) y F1-008 (Flutter proveedor) pueden iniciar en paralelo.

Siguiente agente recomendado:
armora-mobile-flutter para F1-007 / F1-008, o armora-qa para F1-009.
```
