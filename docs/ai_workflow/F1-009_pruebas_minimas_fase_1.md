# F1-009 - Pruebas minimas Fase 1

## Estado

`lista`

## Objetivo

Definir e implementar el checklist de pruebas minimas para Fase 1: build, health, contrato y smoke tests basicos en cada componente del monorepo.

## Agente lider

`armora-qa`

## Agentes de apoyo

- `armora-backend-quarkus`
- `armora-frontend-web`
- `armora-mobile-flutter`
- `armora-devops`

## Documentos consultados

- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `docs/sdd/17_convencion_nombres_tecnicos.md`
- `docs/ai_workflow/00_tablero_agentes.md`
- Handoffs F1-005, F1-006, F1-007, F1-008

## Checklist de pruebas minimas Fase 1

### 1. Backend Quarkus (`backend/api-quarkus/`)

| Prueba | Estado | Comando |
|---|---|---|
| Compilacion | ✅ | `mvn compile` |
| Tests unitarios | ✅ (2 tests) | `mvn test` |
| Health endpoint | ✅ `GET /api/v1/health` → 200, status=UP | Test: `HealthResourceTest` |
| Version endpoint | ✅ `GET /api/v1/version` → 200, apiVersion=v1 | Test: `VersionResourceTest` |
| OpenAPI generado | ✅ `GET /q/openapi` | Build time |
| Flyway validate (opcional) | ✅ Validado contra PostgreSQL real | `mvn test -Dquarkus.flyway.migrate-at-start=true` |

### 2. Admin web Next.js (`frontend_web/`)

| Prueba | Estado | Comando |
|---|---|---|
| Instalacion de dependencias | ✅ | `npm install` |
| Build | ✅ | `npm run build` |
| Rutas estaticas | ✅ `/`, `/login`, `/dashboard`, `/_not-found` | Build output |
| Lint | ⚠️ `next lint` no configurado | Pendiente agregar ESLint |

### 3. Mobile cliente Flutter (`mobile_cliente/`)

| Prueba | Estado | Comando |
|---|---|---|
| Dependencias | ✅ | `flutter pub get` |
| Analisis de codigo | ✅ | `flutter analyze` |
| Widget test login | ✅ (1 test) | `flutter test` |
| Build APK (debug) | ⚠️ No ejecutado | `flutter build apk --debug` |

### 4. Mobile proveedor Flutter (`mobile_proveedor/`)

| Prueba | Estado | Comando |
|---|---|---|
| Dependencias | ✅ | `flutter pub get` |
| Analisis de codigo | ✅ | `flutter analyze` |
| Widget test login | ✅ (1 test) | `flutter test` |
| Build APK (debug) | ⚠️ No ejecutado | `flutter build apk --debug` |

### 5. Docker Compose

| Prueba | Estado | Comando |
|---|---|---|
| PostgreSQL local | ✅ | `docker compose up -d` (validado en F1-005) |
| Redis local | ✅ | `docker compose up -d` |
| Healthcheck PostgreSQL | ✅ | `pg_isready` |
| Healthcheck Redis | ✅ | `redis-cli ping` |

### 6. Smoke tests transversales

| Prueba | Estado |
|---|---|
| Backend arranca sin secretos hardcodeados | ✅ |
| Backend usa configuracion por entorno | ✅ |
| Frontend web usa variables de entorno (NEXT_PUBLIC_API_BASE_URL) | ✅ |
| Flutter apps usan configuracion por compilacion (--dart-define) | ✅ |
| Sin credenciales reales en repo | ✅ |
| `.env.example` sin secretos reales | ✅ |
| Convencion nombres espanol validada en migracion V1 | ✅ |

## Total de tests automatizados

| Componente | Tests | Status |
|---|---|---|
| Backend Quarkus | 2 | ✅ Pasaron |
| mobile_cliente | 1 | ✅ Paso |
| mobile_proveedor | 1 | ✅ Paso |
| Admin web | 0 (build verifica) | ✅ Build exitoso |
| **Total** | **4 tests + 3 builds** | **Todos OK** |

## Pruebas pendientes para Fase 2+

- Pruebas de integracion con autenticacion real (JWT/OIDC).
- Pruebas de contrato OpenAPI (contract testing).
- Pruebas E2E web (Cypress/Playwright).
- Pruebas E2E mobile (integration_test).
- Pruebas de regresion por PR.
- Cobertura minima definida.

## Seguridad

- No se incluyeron secretos en tests.
- Los tests usan `@QuarkusTest` con perfil `test`, sin conexion externa.

## Handoff

```text
Cambio realizado:
Checklist de pruebas minimas Fase 1 documentado e implementado. Backend 2 tests, Flutter cliente 1 test, Flutter proveedor 1 test, admin web build exitoso.

Documentos consultados:
docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md, docs/sdd/17_convencion_nombres_tecnicos.md, docs/ai_workflow/00_tablero_agentes.md, handoffs F1-005, F1-006, F1-007, F1-008.

Archivos modificados:
mobile_cliente/test/login_page_test.dart
mobile_proveedor/test/login_page_test.dart
docs/ai_workflow/F1-009_pruebas_minimas_fase_1.md
docs/ai_workflow/00_tablero_agentes.md

Pruebas ejecutadas:
mvn test -> 2 tests, BUILD SUCCESS
npm run build -> compiled successfully (4 routes)
flutter test (cliente) -> 1 test passed
flutter test (proveedor) -> 1 test passed
flutter analyze (cliente) -> No issues found
flutter analyze (proveedor) -> No issues found

Pruebas pendientes:
Build APK debug, contract testing, E2E, cobertura.

Siguiente agente recomendado:
armora-sdd-manager para cierre documental de Fase 1.
```
