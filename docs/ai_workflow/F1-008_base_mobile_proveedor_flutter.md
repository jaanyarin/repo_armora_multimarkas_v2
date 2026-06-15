# F1-008 - Base mobile proveedor Flutter

## Estado

`lista`

## Objetivo

Crear la base de la app mobile proveedor en Flutter con estructura de proyecto, configuracion por ambiente, API client, pantalla de login, pagina de inicio con health check y analisis de codigo limpio.

## Agente lider

`armora-mobile-flutter`

## Agentes de apoyo

- `armora-ui-ux`
- `armora-backend-quarkus`
- `armora-security`
- `armora-qa`

## Documentos consultados

- `docs/sdd/15_stack_mobile_flutter_dart.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `docs/sdd/17_convencion_nombres_tecnicos.md`
- `docs/ai_workflow/00_tablero_agentes.md`

## Cambios realizados

- `mobile_proveedor/pubspec.yaml` con Flutter 3.29, http, flutter_secure_storage.
- `mobile_proveedor/analysis_options.yaml` con lints basicos.
- `lib/main.dart`: entry point.
- `lib/app/app.dart`: MaterialApp con tema Material 3.
- `lib/core/config/environment.dart`: configuracion por compilacion (API_BASE_URL, APP_ENV).
- `lib/core/network/api_client.dart`: cliente HTTP generico con GET, POST, manejo de token.
- `lib/core/theme/app_theme.dart`: tema claro/oscuro con Material 3.
- `lib/features/auth/presentation/login_page.dart`: formulario de login conectado a `/auth/login`.
- `lib/features/home/presentation/home_page.dart`: pagina de inicio con health check.

## Contratos API afectados

Ninguno nuevo. Consume `GET /api/v1/health` y `POST /api/v1/auth/login`.

## Modelo de datos afectado

Ninguno.

## Permisos/scopes afectados

Ninguno.

## Pruebas ejecutadas

```powershell
flutter pub get
flutter analyze
```

Resultado: `No issues found!`

## Pruebas pendientes

- Pruebas unitarias de login y API client (F1-009).
- Pruebas de integracion contra backend real.

## Riesgos abiertos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Sin auth real implementado (solo skeleton) | Login falla hasta que backend implemente endpoint | Pendiente de backend |
| `flutter_secure_storage` no usado aun | Token en memoria volatil | Implementar en Fase 2 con auth real |

## Handoff

```text
Cambio realizado:
Base app mobile proveedor Flutter creada: pubspec, theme, API client, login, home con health check.

Documentos consultados:
docs/sdd/15_stack_mobile_flutter_dart.md, docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md, docs/sdd/17_convencion_nombres_tecnicos.md, docs/ai_workflow/00_tablero_agentes.md.

Archivos modificados:
mobile_proveedor/pubspec.yaml
mobile_proveedor/analysis_options.yaml
mobile_proveedor/lib/main.dart
mobile_proveedor/lib/app/app.dart
mobile_proveedor/lib/core/config/environment.dart
mobile_proveedor/lib/core/network/api_client.dart
mobile_proveedor/lib/core/theme/app_theme.dart
mobile_proveedor/lib/features/auth/presentation/login_page.dart
mobile_proveedor/lib/features/home/presentation/home_page.dart
docs/ai_workflow/00_tablero_agentes.md

Contratos API afectados:
Ninguno.

Modelo de datos afectado:
Ninguno.

Permisos/scopes afectados:
Ninguno.

Pruebas ejecutadas:
flutter analyze -> No issues found.

Pruebas pendientes:
Unitarias e integracion (F1-009).

Siguiente agente recomendado:
armora-qa para F1-009 (pruebas minimas Fase 1).
```
