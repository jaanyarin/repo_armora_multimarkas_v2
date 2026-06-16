# Handoff F2-005 — Fix login: CORS, seed admin y Flyway

## Cambio realizado

- **CORS backend**: Agregado `quarkus.http.cors=true` con origins `http://localhost:5775` en `application.properties` para permitir peticiones del frontend Next.js
- **Seed admin email**: Cambiado de `admin@armora.dev` a `admin@armora.local` en `DevSeed.java`
- **Seed admin password**: Cambiado default de `admin123` a `admin` en `DevSeed.java` y `application.properties`
- **Flyway**: Cambiado `quarkus.flyway.migrate-at-start=false` a `true` para que las migraciones se ejecuten automaticamente al iniciar (el seed requiere las tablas existentes)
- **Fallo detectado**: `relation usuarios does not exist` — el seed se ejecutaba antes que Flyway creara las tablas. Solucionado con migrate-at-start=true

## Documentos consultados

- `docs/sdd/07_sdd_api_contratos.md`
- `.opencode/skills/armora-security/SKILL.md`
- `agentes/docs/ai/02_handoff_protocol.md`

## Archivos modificados

| Archivo | Accion |
|---|---|
| `backend/api-quarkus/src/main/resources/application.properties` | CORS enabled, seed.admin.password default=admin, flyway.migrate-at-start=true |
| `backend/api-quarkus/src/main/java/com/armora/platform/seed/DevSeed.java` | Email cambiado a `admin@armora.local`, password default=admin |

## Contratos API afectados

- `POST /api/v1/auth/login` — ahora acepta `admin@armora.local` / `admin`
- No hay cambios de schema, solo de seed

## Modelo de datos afectado

Ninguno. Solo seed data.

## Pruebas ejecutadas

- Verificacion de que `mvn quarkus:dev` arranca sin error de seed
- `npm run build` → PASS (validacion de que frontend compila)

## Riesgos abiertos

- Si la BD tiene datos previos (ej. admin@armora.dev ya existe), el seed no se ejecuta de nuevo. Usar `docker compose down -v` para reset completo
- CORS configurado solo para `localhost:5775`. En produccion agregar el dominio real

## Validaciones pendientes

- Probar login en `http://localhost:5775` con `admin@armora.local` / `admin`
- Verificar CORS no bloquee ninguna peticion

## Siguiente agente recomendado

`armora-frontend-web` para F2-006 (dashboard components) o `armora-qa` para pruebas de login.
