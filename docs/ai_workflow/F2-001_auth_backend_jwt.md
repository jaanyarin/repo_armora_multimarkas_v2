# Handoff F2-001 - Auth backend con JWT

## Cambio realizado

- POST `/api/v1/auth/login` acepta `{email, password}`, valida contra `usuarios` via BCrypt, retorna JWT firmado con RSA.
- GET `/api/v1/auth/me` requiere header `Authorization: Bearer <token>`, retorna `{id, email, nombre, roles}`.
- JWT generado con SmallRye JWT (`io.smallrye.jwt.build.Jwt`), firmado con clave RSA privada (`privatekey.pem`), verificado con clave publica (`publickey.pem`).
- Claves PEM generadas en `src/main/resources/` (PKCS#8 privada, SPKI publica).
- Seed en desarrollo/test: `DevSeed.java` crea `admin@armora.dev` / `admin123` con rol `admin` si no existe.
- Dependencia: `org.mindrot:jbcrypt:0.4` para hash de contrasenas.

## Documentos consultados

- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `agentes/docs/ai/02_handoff_protocol.md`
- `docs/ai_workflow/00_tablero_agentes.md`
- `agentes/perfiles/04_especialista_backend_quarkus.md`
- `docs/sdd/06_sdd_modelo_datos_inicial.md`

## Archivos modificados

| Archivo | Accion |
|---|---|
| `backend/api-quarkus/pom.xml` | Agregada dependencia jbcrypt 0.4 |
| `backend/api-quarkus/src/main/resources/application.properties` | Configuracion JWT, perfil test con PostgreSQL en contenedor |
| `backend/api-quarkus/src/main/resources/privatekey.pem` | Nueva clave RSA privada |
| `backend/api-quarkus/src/main/resources/publickey.pem` | Nueva clave RSA publica |
| `backend/api-quarkus/src/main/java/com/armora/platform/auth/AuthResource.java` | Nuevo endpoint login + me |
| `backend/api-quarkus/src/main/java/com/armora/platform/auth/TokenService.java` | Nuevo servicio de JWT |
| `backend/api-quarkus/src/main/java/com/armora/platform/auth/LoginRequest.java` | Nuevo DTO request |
| `backend/api-quarkus/src/main/java/com/armora/platform/auth/LoginResponse.java` | Nuevo DTO response |
| `backend/api-quarkus/src/main/java/com/armora/platform/auth/MeResponse.java` | Nuevo DTO response |
| `backend/api-quarkus/src/main/java/com/armora/platform/seed/DevSeed.java` | Nuevo seed de admin |
| `backend/api-quarkus/src/test/java/com/armora/platform/auth/AuthResourceTest.java` | Nuevos tests de auth |

## Contratos API afectados

- `POST /api/v1/auth/login`:
  - Request: `{email: string, password: string}`
  - Response 200: `{token: string, expiresIn: number}`
  - Response 401: `{error: "Credenciales invalidas"}`
- `GET /api/v1/auth/me`:
  - Header: `Authorization: Bearer <token>`
  - Response 200: `{id: number, email: string, nombre: string, roles: string[]}`
  - Response 401: `{error: "Token invalido o expirado"}`

## Modelo de datos afectado

- Tabla `usuarios` (existente V1): se usa `email`, `nombre`, `contrasena_hash` para auth.
- Seed inserta en `usuarios` y `usuarios_roles`.

## Permisos/scopes afectados

- `/auth/me` requiere rol autenticado (`@RolesAllowed`).
- `/auth/login` es publico (`@PermitAll`).

## Pruebas ejecutadas

- `mvn test`: 4 tests (Health, Version, AuthLogin, AuthMe) → 4 exitosos, 0 fallos.
- Prueba login con credenciales correctas retorna token.
- Prueba login con credenciales incorrectas retorna 401.
- Prueba Health retorna 200 con status OK.
- Prueba Version retorna version del API.

## Pruebas pendientes

- Prueba de token expirado (requiere configurar tiempo de expiracion corto).
- Prueba de token malformado.
- Prueba de permisos granulares.

## Riesgos abiertos

- Claves RSA generadas localmente en `src/main/resources/`. En produccion deben ser inyectadas via volumen/config externo, no empaquetadas en el JAR.
- `DevSeed.java` activo en perfiles dev/test. NO debe ejecutarse en produccion.
- PostgreSQL contenedor de pruebas manual (`docker run ... -p 5433:5432`). Considerar migrar a Testcontainers cuando el entorno lo soporte.

## Validaciones pendientes

- Verificar que `flyway.clean-at-start` respeta los seeds existentes (el seed se ejecuta despues de Flyway en cada inicio).

## Siguiente agente recomendado

- `armora-qa` para revision cruzada de tests de auth.
- `armora-security` para auditoria de manejo de claves JWT y seed.
- `armora-database` para F2-002 si se requieren nuevas migraciones.
