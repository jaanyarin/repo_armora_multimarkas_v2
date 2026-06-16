# Handoff F2-004 — Configurar .env local con PostgreSQL Docker

## Cambio realizado

- Creado `.env` desde `.env.example` con password `armorar_bd_set`, puertos definitivos: DB=5434, API=8085, Frontend=5775
- PostgreSQL local 18 detenido (ocupaba puerto 5432), Docker PostgreSQL en puerto 5434
- Conexion verificada desde Quarkus con `-Dquarkus.datasource.jdbc.url=jdbc:postgresql://localhost:5434/armora`
- Puertos actualizados en: `.env`, `.env.example`, `application.properties`, `next.config.mjs`, `package.json`, `api-client.ts`, `environment.dart` (3 archivos), docs SDD

## Documentos consultados

- `docs/sdd/10_despliegue_conexion_servidor.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `agentes/docs/ai/02_handoff_protocol.md`

## Archivos modificados

| Archivo | Accion |
|---|---|
| `.env` | Creado con password, puertos |
| `frontend_web/package.json` | Script dev/start con `-p 5775` |
| `frontend_web/next.config.mjs` | Env `NEXT_PUBLIC_API_BASE_URL` default 8085 |
| `frontend_web/src/lib/api-client.ts` | Default URL 8085 |
| `frontend_web/.env.local.example` | Creado |
| `packages/mobile-core/lib/core/config/environment.dart` | Default 8085 |
| `mobile_cliente/lib/core/config/environment.dart` | Default 8085 |
| `mobile_proveedor/lib/core/config/environment.dart` | Default 8085 |
| `docs/sdd/10_despliegue_conexion_servidor.md` | Puertos actualizados |
| `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md` | URL API actualizada |

## Contratos API afectados

Ninguno.

## Modelo de datos afectado

Ninguno.

## Pruebas ejecutadas

- Verificacion de conexion PostgreSQL desde Quarkus mediante `mvn quarkus:dev`
- `npm run build` → PASS
- `flutter analyze` → PASS (los 3 proyectos)

## Riesgos abiertos

- `.env` no debe subirse a git (ya en `.gitignore`)
- Los 3 archivos `environment.dart` en mobile deben mantenerse sincronizados manualmente
- Apache httpd ocupa puerto 8080 por defecto, Quarkus debe usar 8085

## Siguiente agente recomendado

`armora-backend-quarkus` para continuar con F2-005 (fix login).
