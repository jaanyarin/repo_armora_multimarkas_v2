# Handoff F2-008 — Botón Editar Personal → wizard precargado

## Cambio realizado
Se implementó la funcionalidad de edición de personal desde la tabla de Gestión del Personal.

### Frontend
1. **Nueva página**: `frontend_web/src/app/personal/editar-personal/page.tsx`
   - Reutiliza el wizard de 6 pasos de Crear Personal
   - Título cambia a "Editar Personal"
   - Campo "Usuario" deshabilitado (solo lectura)
   - Campo "Email Corporativo" deshabilitado (solo lectura)
   - Sección "Password" eliminada del formulario
   - Botón submit: "Guardar cambios"
   - Precarga datos desde `GET /api/v1/personal/{id}`
   - Submit vía `PUT /api/v1/personal/{id}`
   - Snackbar de éxito + redirección a gestion-personal
   - Wrapped con Suspense para useSearchParams

2. **Página gestion-personal**: botón Editar navega a editar-personal

### Backend
1. **`ActualizarPersonalRequest`** expandido: ahora acepta `tipoDocumento`, `sexo`, `estadoCivil`, `fechaNacimiento`, `fotoUrl`
2. **PUT query** actualizada: UPDATE con 14 columnas incluyendo casts a tipos enum
3. **Validación unicidad**: `SELECT COUNT(id) FROM personal WHERE numero_documento = ? AND id != ?` → 409 Conflict si duplicado
4. **Transacción**: `FOR UPDATE` + commit/rollback

### Fix adicional
Se corrigió field name mismatch entre frontend y backend en ambas páginas (crear-personal y editar-personal):
- `emailCorporativo` → `emailContacto`
- `celular` → `telefonoCelular`
- `telefono` → `telefonoFijo`

## Documentos consultados
- `frontend_web/src/app/personal/gestion-personal/page.tsx`
- `frontend_web/src/app/personal/crear-personal/page.tsx`
- `backend/api-quarkus/src/main/java/com/armora/personal/PersonalResource.java`

## Archivos creados
- `frontend_web/src/app/personal/editar-personal/page.tsx`

## Archivos modificados
- `frontend_web/src/app/personal/gestion-personal/page.tsx` — onClick EditIcon → router.push
- `frontend_web/src/app/personal/crear-personal/page.tsx` — field names corregidos
- `backend/api-quarkus/src/main/java/com/armora/personal/PersonalResource.java` — PUT expandido

## Contratos API afectados
- `PUT /api/v1/personal/{id}` — ahora acepta campos adicionales

## Modelo de datos afectado
Ninguno (BD no cambia)

## Permisos/scopes afectados
`@RolesAllowed({"ADMINISTRADOR", "OPERADOR"})` para PUT

## Pruebas ejecutadas
- `mvn compile` → 0 errores
- `tsc --noEmit` → 0 errores
- `next build` → 0 errores

## Pruebas pendientes
- Verificación manual: editar un personal, guardar, verificar datos actualizados en BD
- Verificar que email/telefono no se sobrescriban con NULL

## Riesgos abiertos
- El frontend envía campos extra (cargo, area, sede, etc.) que el backend ignora. No causa daño pero no se persisten.
- Security hallazgo M2: permisos no se persisten aún (feature pendiente)

## Validaciones pendientes
Ninguna

## Siguiente agente recomendado
`armora-qa` para test E2E del flujo completo de edición
