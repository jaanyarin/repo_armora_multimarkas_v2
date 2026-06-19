# Handoff F2-014 — Security Review + workflow rule ARMORA #11

## Cambio realizado
Se realizó la revisión de seguridad de los nuevos endpoints de personal y files. Se agregó la regla ARMORA #11 al workflow de agentes.

### Security Review Hallazgos

| ID | Hallazgo | Severidad | Estado |
|---|---|---|---|
| S1 | POST /files/upload valida extensión (jpg/jpeg/png/gif/webp) | ✅ Mitigado | Ok |
| S2 | POST /files/upload valida tamaño máximo 5MB | ✅ Mitigado | Ok |
| S3 | PUT /personal/{id}/permisos solo ADMINISTRADOR | ✅ Configurado | Ok |
| S4 | PUT /personal/{id}/recursos solo ADMINISTRADOR | ✅ Configurado | Ok |
| S5 | JWT TTL 24h (pre-existente, no parte de este cambio) | ⚠️ Bajo | Pre-existente |
| S6 | Permisos de personal se borran y reinsertan en transacción | ✅ Mitigado | Ok |
| S7 | Foto se guarda en disco local, URL almacenada en BD | ⚠️ Medio | Requiere Nginx para servir en prod |

### Nueva regla de workflow
Se agregó **Regla ARMORA #11** al documento `agentes/docs/ai/03_workflow_automatico_sincrono.md`:
> Matching DTO ↔ BD obligatorio: antes de dar por terminado un endpoint CRUD, armora-database y armora-backend-quarkus deben verificar que cada campo del DTO de request tenga columna en BD y viceversa. Sin esta verificación, el handoff no puede cerrarse.

## Documentos consultados
- `agentes/docs/ai/03_workflow_automatico_sincrono.md`
- `backend/api-quarkus/src/main/java/com/armora/personal/PersonalResource.java`
- `backend/api-quarkus/src/main/java/com/armora/files/FilesResource.java`
- `frontend_web/src/app/personal/crear-personal/page.tsx`
- `frontend_web/src/app/personal/editar-personal/page.tsx`

## Archivos modificados
- `agentes/docs/ai/03_workflow_automatico_sincrono.md` — nueva regla #11

## Contratos API afectados
- `POST /files/upload` — nuevo
- `GET /personal/{id}/permisos` — nuevo
- `PUT /personal/{id}/permisos` — nuevo
- `GET /personal/{id}/recursos` — nuevo
- `PUT /personal/{id}/recursos` — nuevo

## Modelo de datos afectado
- `personal_permisos` — nueva tabla (V5)
- `personal` — nuevas columnas (V5)

## Permisos/scopes afectados
- POST/PUT personal requiere ADMINISTRADOR u OPERADOR
- PUT permisos y PUT recursos requieren ADMINISTRADOR
- PUT cambiar-clave requiere ADMINISTRADOR
- POST /files/upload requiere ADMINISTRADOR u OPERADOR

## Pruebas ejecutadas
- `mvn compile` → 0 errores
- `tsc --noEmit` → 0 errores
- `next build` → 0 errores

## Pruebas pendientes
- Verificación manual: crear personal con foto, permisos y recursos; editar; verificar en BD
- Verificar que foto se muestra al editar personal

## Riesgos abiertos
- Las fotos se guardan en disco local (`uploads/photos/`). En producción, Nginx/Caddy debe servir `GET /files/photos/*` como contenido estático. Sin eso, las URLs de foto no serán accesibles.

## Validaciones pendientes
- Ninguna

## Siguiente agente recomendado
`armora-qa` para test E2E del flujo completo de creación y edición de personal
