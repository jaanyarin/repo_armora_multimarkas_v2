# F1-005 - Migracion inicial PostgreSQL/Flyway

## Estado

`lista`

## Objetivo

Crear y validar la migracion inicial PostgreSQL con Flyway para la fundacion tecnica de ARMORA Multimarkas v2, usando nombres fisicos en espanol segun `docs/sdd/17_convencion_nombres_tecnicos.md`.

## Agente lider

`armora-database`

## Agentes de apoyo

- `armora-backend-quarkus`
- `armora-qa`

## Documentos consultados

- `docs/sdd/06_sdd_modelo_datos_inicial.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `docs/sdd/17_convencion_nombres_tecnicos.md`
- `docs/ai_workflow/00_tablero_agentes.md`
- `backend/api-quarkus/README.md`

## Cambios realizados

- Se creo `backend/api-quarkus/src/main/resources/db/migration/V1__init_foundation_schema.sql`.
- Se normalizo la migracion a nombres fisicos en espanol: tablas, columnas, enums, funcion, triggers, indices y constraints.
- Se agrego migracion inicial para fundacion de identidad, RBAC, empresas, sucursales, auditoria y metadata.
- Se mantuvo `quarkus.flyway.migrate-at-start=false` por defecto para no modificar DB accidentalmente en tests normales.
- Se documento en `backend/api-quarkus/README.md` el comando explicito para validar Flyway contra PostgreSQL local.

## Tablas y objetos creados

| Objeto | Tipo | Proposito |
|---|---|---|
| `pgcrypto` | Extension | UUID con `gen_random_uuid()`. |
| `asignar_actualizado_en()` | Funcion | Actualizacion automatica de `actualizado_en`. |
| `tipo_usuario` | Enum | Tipos de usuario: administrador, operador, cliente, proveedor. |
| `estado_registro` | Enum | Estados base de registros. |
| `tipo_alcance_acceso` | Enum | Tipos de alcance de acceso. |
| `empresas` | Tabla | Empresa/razon social. |
| `sucursales` | Tabla | Sucursales por empresa. |
| `usuarios` | Tabla | Identidad base. |
| `roles` | Tabla | Roles RBAC. |
| `permisos` | Tabla | Permisos RBAC. |
| `usuarios_roles` | Tabla | Relacion usuarios-roles. |
| `roles_permisos` | Tabla | Relacion roles-permisos. |
| `alcances_acceso` | Tabla | Alcances de acceso por usuario. |
| `registros_auditoria` | Tabla | Auditoria de mutaciones criticas. |
| `metadatos_plataforma` | Tabla | Metadata tecnica de plataforma. |

## Validaciones ejecutadas

### Tests normales

```powershell
mvn test
```

Resultado:

```text
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### Validacion Flyway contra PostgreSQL local

PostgreSQL se levanto en `127.0.0.1:55432` porque `5432` no estaba disponible localmente.

```powershell
mvn test `
  "-Dquarkus.flyway.migrate-at-start=true" `
  "-Dquarkus.flyway.clean-at-start=true" `
  "-Dquarkus.flyway.validate-on-migrate=true" `
  "-Dquarkus.datasource.jdbc.url=jdbc:postgresql://localhost:55432/armora" `
  "-Dquarkus.datasource.username=armora_user" `
  "-Dquarkus.datasource.password=armora_local_dev_password"
```

Resultado esperado y validado:

```text
Successfully validated 1 migration
Successfully applied 1 migration to schema "public", now at version v1
Tests run: 2, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### Verificacion de tablas

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'flyway_schema_history',
    'usuarios',
    'roles',
    'permisos',
    'empresas',
    'registros_auditoria',
    'metadatos_plataforma'
  )
order by table_name;
```

Resultado esperado:

```text
empresas
flyway_schema_history
metadatos_plataforma
permisos
registros_auditoria
roles
usuarios
```

## Seguridad

- No se agregaron datos reales.
- No se agregaron usuarios seed ni passwords.
- No se versionaron secretos.
- La validacion usa password local temporal solo en variables de proceso/comando.

## Decision tecnica

F1-005 queda completada. La base de datos ya tiene una migracion inicial validada con PostgreSQL real y normalizada a nombres fisicos en espanol.

No se crean tablas de catalogo, stock, pedidos ni pagos en esta migracion para evitar adelantar dominios de negocio sin specs completas. Esas tablas deben entrar por migraciones posteriores, asociadas a sus historias y contratos.

## Riesgos abiertos

| Riesgo | Impacto | Mitigacion |
|---|---|---|
| Modelo inicial puede requerir ajuste cuando se implemente auth real | Cambios de migracion posteriores | Agregar nuevas migraciones, no editar `V1` luego de compartida. |
| Java local sigue en 17 | Brecha contra stack objetivo Java 21+ | Instalar Java 21 antes de CI/productivo. |
| `clean-at-start=true` borra DB local | Perdida de datos locales | Usarlo solo para validacion local controlada, nunca staging/produccion. |
| Agentes creen nombres fisicos en ingles | Inconsistencia tecnica | Revisar `docs/sdd/17_convencion_nombres_tecnicos.md` antes de cada migracion. |

## Handoff

```text
Cambio realizado:
Creada y validada migracion inicial Flyway sobre PostgreSQL real, normalizada a nombres fisicos en espanol.

Documentos consultados:
docs/sdd/06_sdd_modelo_datos_inicial.md, docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md, docs/sdd/17_convencion_nombres_tecnicos.md, docs/ai_workflow/00_tablero_agentes.md, backend/api-quarkus/README.md.

Archivos modificados:
backend/api-quarkus/src/main/resources/db/migration/V1__init_foundation_schema.sql
backend/api-quarkus/src/main/resources/application.properties
backend/api-quarkus/README.md
docs/sdd/17_convencion_nombres_tecnicos.md
docs/ai_workflow/F1-005_migracion_inicial_flyway.md
docs/ai_workflow/00_tablero_agentes.md

Contratos API afectados:
Ninguno.

Modelo de datos afectado:
Identidad, RBAC, empresa/sucursal, auditoria y metadata tecnica.

Permisos/scopes afectados:
Se crean tablas base `permisos`, `roles`, `usuarios_roles`, `roles_permisos` y `alcances_acceso`; no se asignan permisos aun.

Pruebas ejecutadas:
mvn test normal.
mvn test con Flyway forzado contra PostgreSQL local.
Consulta SQL de verificacion de tablas.

Pruebas pendientes:
Agregar migraciones de catalogo, inventario, pedidos y pagos cuando sus specs entren a implementacion.

Riesgos abiertos:
No editar V1 luego de compartirla; crear nuevas migraciones incrementales.

Validaciones pendientes:
F1-006 puede iniciar admin web base. F1-010 debe registrar ADR inicial de arquitectura.

Siguiente agente recomendado:
armora-frontend-web para F1-006 o armora-sdd-manager para F1-010 si se prioriza ADR.
```