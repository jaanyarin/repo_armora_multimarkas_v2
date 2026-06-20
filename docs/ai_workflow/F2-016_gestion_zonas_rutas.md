# Handoff F2-016 — Gestion Zonas y Rutas

## Cambio realizado

Se implemento el modulo completo de Gestion de Zonas y Rutas, incluyendo modelo de datos, API backend, tres paginas frontend (admin web) y seeds de datos heredados.

### Componentes implementados

#### Base de datos (migraciones Flyway)

| Migracion | Descripcion |
|---|---|
| V7 | Crea `zonas_rutas` (tabla unica zona+ruta) |
| V8 | Crea `zonas_rutas_poligonos` (poligonos asociados a zona_ruta) |
| **V9** | **Normaliza en `zonas`, `rutas`, `zonas_poligonos` (ver ADR-003)** |
| V10 | Seed de 40 zonas comerciales heredadas |
| V11 | Seed de 227 rutas heredadas vinculadas a las 40 zonas |

Las tablas V7/V8 quedaron huerfanas (no eliminadas para preservar trazabilidad). El modelo operativo es V9.

#### Backend (ZonasRutasResource.java — 632 lineas)

Endpoint unico bajo `/api/v1/zonas-rutas` con JDBC directo (sin Panache):

| Metodo | Ruta | Accion |
|---|---|---|
| GET | `/zonas` | Listar zonas (q, estado) con cantidadRutas y tienePoligono |
| POST | `/zonas` | Crear zona (ADMIN) |
| PUT | `/zonas/{id}` | Actualizar zona (ADMIN) |
| GET | `/rutas` | Listar rutas (q, zonaId) con datos de zona |
| POST | `/rutas` | Crear ruta (ADMIN) |
| PUT | `/rutas/{id}` | Actualizar ruta (ADMIN) |
| PATCH | `/{tipo}/{id}/estado` | Cambiar estado ACTIVO/INACTIVO (ADMIN) |
| DELETE | `/{tipo}/{id}` | Eliminar zona o ruta (ADMIN) |
| GET | `/zonas/{id}/poligono` | Obtener poligono activo |
| PUT | `/zonas/{id}/poligono` | Guardar/actualizar poligono (versionado, ADMIN) |
| DELETE | `/zonas/{id}/poligono` | Desactivar poligono activo (ADMIN) |

Validaciones:
- Codigo maximo 30 chars, unico por tabla
- Nombre maximo 150 chars
- Color formato hexadecimal (#RGB o #RRGGBB)
- Estado solo ACTIVO/INACTIVO
- Poligono: GeoJSON Polygon cerrado (min 3 vertices)
- IDs validados como UUID
- Transacciones con FOR UPDATE y rollback

#### Frontend (3 paginas admin web)

1. **Gestion Zonas y Rutas** (`/zonas-rutas/gestion-zonas-rutas/`)
   - Tabs para alternar entre zonas y rutas
   - Tabla con KPI, busqueda y filtros
   - CRUD completo: crear, editar, activar/inactivar, eliminar
   - Dialog de creacion/edicion con validacion en vivo

2. **Mapa Poligono** (`/zonas-rutas/gestion-zonas-rutas/poligono/`)
   - Canvas para dibujo de poligono geografico
   - Modo mover vertices (drag) y modo editar (agregar/quitar vertices)
   - Versionado de poligonos
   - Validacion GeoJSON (poligono cerrado)

3. **Habilitar Ventas en Rutas** (`/zonas-rutas/habilitar-ventas-rutas/`)
   - Busqueda y filtros por zona, estado y dia de atencion
   - Seleccion masiva de rutas
   - Accion de habilitar/bloquear ventas (cambia estado de ruta)
   - Confirmacion previa a la accion masiva

#### UI/UX Design System Vanguard

Se realizo revision UI/UX (`docs/design-system/revision-zonas-rutas.md`) con 22 hallazgos:
- 1 critico (H15: `colors.semantic.error` no existe, usar `danger`)
- 5 altos, 8 medios, 8 bajos
- Se aplicaron 14 correcciones de alineacion al Design System Vanguard MD3

## Documentos consultados

- `docs/sdd/06_sdd_modelo_datos_inicial.md`
- `docs/sdd/07_sdd_api_contratos.md`
- `docs/ai_workflow/00_tablero_agentes.md`
- `docs/adr/ADR-001-inicial-arquitectura.md`
- `docs/adr/ADR-002-servicio-fotos-y-archivos.md`
- `docs/adr/ADR-003-zonas-rutas-normalizacion.md`
- `docs/design-system/revision-zonas-rutas.md`
- `docs/scrapping/endpoints/zonas_rutas/` (varios archivos de scraping)
- `docs/17_convencion_nombres_tecnicos.md`

## Archivos modificados

### Base de datos (migraciones)
- `backend/api-quarkus/src/main/resources/db/migration/V7__zonas_rutas.sql` (creado)
- `backend/api-quarkus/src/main/resources/db/migration/V8__zonas_rutas_poligonos.sql` (creado)
- `backend/api-quarkus/src/main/resources/db/migration/V9__zonas_rutas_normalizadas.sql` (creado)
- `backend/api-quarkus/src/main/resources/db/migration/V10__seed_zonas_iniciales.sql` (creado)
- `backend/api-quarkus/src/main/resources/db/migration/V11__seed_rutas_iniciales.sql` (creado)

### Backend
- `backend/api-quarkus/src/main/java/com/armora/zonasrutas/ZonasRutasResource.java` (creado, 632 lineas)

### Frontend (Next.js)
- `frontend_web/src/app/zonas-rutas/gestion-zonas-rutas/page.tsx` (creado)
- `frontend_web/src/app/zonas-rutas/gestion-zonas-rutas/poligono/page.tsx` (creado)
- `frontend_web/src/app/zonas-rutas/habilitar-ventas-rutas/page.tsx` (creado)
- `frontend_web/src/design-system/web/layout/Sidebar.tsx` (modificado, enlaces a zonas-rutas)

### Documentacion
- `docs/design-system/revision-zonas-rutas.md` (creado, revision UI/UX)
- `docs/adr/ADR-003-zonas-rutas-normalizacion.md` (creado)
- `docs/ai_workflow/F2-016_gestion_zonas_rutas.md` (creado, este documento)
- `docs/ai_workflow/F2-017_habilitar_ventas_rutas.md` (creado, handoff de habilitar ventas)
- `docs/ai_workflow/00_tablero_agentes.md` (modificado, criterios F2-016 actualizados)
- `docs/sdd/06_sdd_modelo_datos_inicial.md` (modificado, seccion zonas/rutas agregada)
- `docs/sdd/07_sdd_api_contratos.md` (modificado, endpoints zonas-rutas agregados)

## Contratos API afectados

**Nuevos endpoints** (bajo `/api/v1/zonas-rutas/`):

| Metodo | Ruta | Auth |
|---|---|---|
| GET | `/zonas-rutas/zonas` | ADMIN, OPERADOR |
| POST | `/zonas-rutas/zonas` | ADMIN |
| PUT | `/zonas-rutas/zonas/{id}` | ADMIN |
| GET | `/zonas-rutas/rutas` | ADMIN, OPERADOR |
| POST | `/zonas-rutas/rutas` | ADMIN |
| PUT | `/zonas-rutas/rutas/{id}` | ADMIN |
| PATCH | `/zonas-rutas/{tipo}/{id}/estado` | ADMIN |
| DELETE | `/zonas-rutas/{tipo}/{id}` | ADMIN |
| GET | `/zonas-rutas/zonas/{id}/poligono` | ADMIN, OPERADOR |
| PUT | `/zonas-rutas/zonas/{id}/poligono` | ADMIN |
| DELETE | `/zonas-rutas/zonas/{id}/poligono` | ADMIN |

## Modelo de datos afectado

**Nuevas tablas** (V9 — normalizadas):

| Tabla | Columnas clave | FK |
|---|---|---|
| `zonas` | id (uuid PK), codigo (UNIQUE), nombre_zona, color, estado | — |
| `rutas` | id (uuid PK), codigo (UNIQUE), zona_id, nombre_ruta, dias_atencion (jsonb), estado | `zona_id` -> `zonas(id) ON DELETE RESTRICT` |
| `zonas_poligonos` | id (uuid PK), zona_id, coordenadas (jsonb), version, activo | `zona_id` -> `zonas(id) ON DELETE CASCADE`, UNIQUE(zona_id, version) |

**Tablas huerfanas** (V7/V8 — sin uso operativo):
| Tabla | Estado |
|---|---|
| `zonas_rutas` | Sin uso desde V9 |
| `zonas_rutas_poligonos` | Sin uso desde V9 |

**Seeds cargados:**
- 40 zonas comerciales (codigos ZON-0001 a ZON-0040)
- 227 rutas distribuidas en las 40 zonas (codigos tipo `ZON-0001-R10`)

## Permisos/scopes afectados

- `GET` endpoints: accesibles para ADMINISTRADOR y OPERADOR
- `POST/PUT/PATCH/DELETE`: solo ADMINISTRADOR
- No se crearon scopes especificos por zona/ruta en esta fase
- Los permisos usan `@RolesAllowed` a nivel de metodo

## Pruebas ejecutadas

- `mvn compile` (backend) — sin errores
- `tsc --noEmit` (frontend) — sin errores
- `next build` (frontend) — sin errores
- Validacion manual de migraciones SQL (sintaxis PostgreSQL)
- Revision UI/UX con 22 hallazgos documentados

## Pruebas pendientes

- Pruebas de integracion para los endpoints de zonas-rutas (unitarias con base de datos de prueba)
- Smoke manual completo:
  1. Login como ADMINISTRADOR
  2. Crear zona con codigo, nombre, color y verificar en lista
  3. Editar zona, cambiar estado, eliminar (sin rutas asociadas)
  4. Crear ruta vinculada a zona existente
  5. Verificar que no se puede eliminar zona con rutas activas (ON DELETE RESTRICT)
  6. Dibujar poligono en canvas y guardar
  7. Verificar versionado del poligono
  8. Habilitar/deshabilitar ventas en rutas
- Probar que el build de produccion funciona (`docker compose`)

## Riesgos abiertos

1. **Tablas huerfanas V7/V8**: `zonas_rutas` y `zonas_rutas_poligonos` quedaron sin uso. No se eliminaron para preservar trazabilidad. Podrian causar confusion. Se recomienda eliminarlas en migracion futura V12+.
2. **`ventas_habilitadas` acoplado a `estado`**: El concepto "habilitar ventas en rutas" se implemento cambiando el estado ACTIVO/INACTIVO de la ruta. Si en el futuro se necesita como campo independiente, se requiere migracion V12+ con columna `ventas_habilitadas boolean` y endpoint especifico.
3. **Sin cobertura de tests unitarios**: El recurso Java usa JDBC directo (632 lineas) sin tests automatizados. Se recomienda agregar tests de integracion con base de datos de prueba.
4. **Colores hardcodeados en frontend**: Aunque se aplicaron 14 correcciones de alineacion al DS Vanguard, persisten algunas desviaciones menores documentadas en `revision-zonas-rutas.md`.

## Validaciones pendientes

- Confirmar si el modelo de zonas/rutas requiere `responsable_id` (vendedor asignado) desde el MVP o si queda para fase posterior
- Confirmar si `habilitar ventas` debe ser independiente del estado de la ruta (ver F2-017 handoff)
- Confirmar si las tablas V7/V8 deben eliminarse o mantenerse como deprecated

## Siguiente agente recomendado

`armora-qa` para pruebas de integracion y smoke manual del modulo completo.
`armora-backend-quarkus` si se decide agregar tests unitarios con base de datos de prueba.
