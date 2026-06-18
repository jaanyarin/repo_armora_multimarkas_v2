# Handoff F2-009 — Botón Cambiar contraseña con Dialog modal

## Cambio realizado
Se implementó el diálogo modal de cambio de contraseña desde la tabla de Gestión del Personal.

### Frontend
1. **Diálogo modal** (MUI Dialog) con:
   - Título: "Cambiar contraseña"
   - Input "Nueva contraseña" (type password)
   - Input "Repetir contraseña" (type password)
   - Validación en vivo: mínimo 6 caracteres, ambas coinciden
   - Botón "Cancelar" (variant outlined)
   - Botón "Aceptar" (variant contained, deshabilitado si validación falla)
   - Loading spinner durante llamada API
   - Snackbar de éxito al cerrar
   - Cleanup completo al cerrar (inputs, errores, target)

2. **api-client.ts**: nuevo método `patch()` para PATCH requests

### Backend
1. **Nuevo endpoint**: `PATCH /api/v1/personal/{id}/cambiar-clave`
2. **Nuevo record**: `CambiarClaveRequest(nuevaClave, confirmarClave)`
3. **Validaciones**:
   - `nuevaClave.length() >= 6` → 400 si no
   - `nuevaClave.equals(confirmarClave)` → 400 si no
   - Personal existe → 404 si no
4. **Hash**: BCrypt.hashpw con gensalt
5. **Transacción**: FOR UPDATE + commit/rollback
6. **Permisos**: `@RolesAllowed({"ADMINISTRADOR"})`

## Documentos consultados
- `frontend_web/src/app/personal/gestion-personal/page.tsx`
- `backend/api-quarkus/src/main/java/com/armora/personal/PersonalResource.java`

## Archivos modificados
- `frontend_web/src/app/personal/gestion-personal/page.tsx` — Dialog, estados, handlers, snackbar
- `frontend_web/src/lib/api-client.ts` — nuevo método `patch()`
- `backend/api-quarkus/src/main/java/com/armora/personal/PersonalResource.java` — nuevo endpoint PATCH

## Contratos API afectados
- Nuevo: `PATCH /api/v1/personal/{id}/cambiar-clave`

## Modelo de datos afectado
Ninguno (solo UPDATE a `usuarios.clave_hash`)

## Permisos/scopes afectados
Solo ADMINISTRADOR puede cambiar contraseñas

## Pruebas ejecutadas
- `mvn compile` → 0 errores
- `tsc --noEmit` → 0 errores
- `next build` → 0 errores

## Pruebas pendientes
- Verificación manual: abrir dialog, validar errores en vivo, cambiar contraseña, verificar login con nueva clave
- Probar con contraseña < 6 caracteres → debe rechazar
- Probar con contraseñas que no coinciden → debe rechazar

## Riesgos abiertos
- Security hallazgo M1: política de contraseña débil (solo 6+ chars, sin mayúscula/número/especial)
- Security hallazgo C1: JWT TTL de 24h (pre-existente, no parte de este cambio)

## Validaciones pendientes
Ninguna

## Siguiente agente recomendado
`armora-qa` para test E2E del flujo de cambio de contraseña
