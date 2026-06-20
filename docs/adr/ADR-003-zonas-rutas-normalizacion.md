# ADR-003: Normalizacion de Zonas y Rutas (V7 -> V9)

## Estado

Aceptado

## Contexto

En la Fase 2 del proyecto se implemento el modulo "Gestion Zonas y Rutas" para administrar zonas comerciales y sus rutas asociadas, con soporte de poligonos geograficos.

### Version inicial (V7)

La migracion V7 creo una tabla unica `zonas_rutas` que combinaba zona y ruta en un mismo registro:

| Columna | Tipo | Problema |
|---|---|---|
| `nombre_zona` | varchar(150) | Se repetia por cada ruta de la misma zona |
| `nombre_ruta` | varchar(150) | Combinado en la misma fila que la zona |
| `responsable_id` | uuid | FK a personal, pero no escalaba a multi-responsable |
| `color` | varchar(20) | Asociado a la fila, pero el color es propiedad de la zona |

**Problemas detectados:**
- Una zona con 6 rutas generaba 6 filas con el mismo `nombre_zona` y `color`.
- No habia integridad referencial entre zona y ruta (eran el mismo registro).
- El poligono geografico se asociaba a la fila `zonas_rutas`, no a la zona como entidad.
- Escalar a nuevas funcionalidades (ej. asignar rutas a personal, reportes por zona) requeria desnormalizar consultas.
- Violacion del principio de normalizacion (1FN/2FN): dependencias funcionales parciales.

### Migracion intermedia (V8)

V8 agrego `zonas_rutas_poligonos` con FK a `zonas_rutas(id)`. Esto agravo el problema porque los poligonos quedaban referenciando a filas individuales (zona+ruta) en vez de a la zona como entidad.

## Decision

Se decidio normalizar el modelo separando `zonas_rutas` en tres tablas:

1. **`zonas`**: entidad independiente con codigo, nombre, color, estado y observacion.
2. **`rutas`**: entidad dependiente de zona via FK, con codigo, nombre, dias de atencion, estado y observacion.
3. **`zonas_poligonos`**: entidad dependiente de zona via FK, con coordenadas GeoJSON, versionado y control de activo.

### Esquema final

```sql
-- Tabla independiente: zonas
CREATE TABLE zonas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(30) NOT NULL UNIQUE,
    nombre_zona varchar(150) NOT NULL,
    color varchar(20),
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    observacion text,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now()
);

-- Tabla dependiente de zona: rutas
CREATE TABLE rutas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(30) NOT NULL UNIQUE,
    zona_id uuid NOT NULL REFERENCES zonas(id) ON DELETE RESTRICT,
    nombre_ruta varchar(150) NOT NULL,
    dias_atencion jsonb,
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    observacion text,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now()
);

-- Tabla dependiente de zona: poligonos
CREATE TABLE zonas_poligonos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    zona_id uuid NOT NULL REFERENCES zonas(id) ON DELETE CASCADE,
    coordenadas jsonb NOT NULL,
    version integer NOT NULL DEFAULT 1,
    activo boolean NOT NULL DEFAULT true,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    UNIQUE (zona_id, version)
);
```

### Reglas de integridad

| Relacion | Tipo | Regla |
|---|---|---|
| `rutas.zona_id` -> `zonas.id` | FK | `ON DELETE RESTRICT` — no se puede eliminar una zona que tenga rutas activas |
| `zonas_poligonos.zona_id` -> `zonas.id` | FK | `ON DELETE CASCADE` — al eliminar una zona se eliminan sus poligonos |
| `rutas.codigo` | UNIQUE | Codigo unico a nivel global |
| `zonas.codigo` | UNIQUE | Codigo unico a nivel global |
| `zonas_poligonos (zona_id, version)` | UNIQUE | Versionado por zona |

### Migraciones involucradas

| Migracion | Accion | Descripcion |
|---|---|---|
| V7 | Crear | Crea `zonas_rutas` (tabla unica) |
| V8 | Crear | Crea `zonas_rutas_poligonos` (FK a `zonas_rutas`) |
| **V9** | **Normalizar** | **Crea `zonas`, `rutas`, `zonas_poligonos`. Las tablas V7/V8 permanecen sin uso** |
| V10 | Seed | Carga 40 zonas iniciales heredadas del sistema actual |
| V11 | Seed | Carga 227 rutas heredadas vinculadas a las 40 zonas |

> **Nota:** Las tablas `zonas_rutas` (V7) y `zonas_rutas_poligonos` (V8) no se eliminaron para preservar la trazabilidad de la migracion. Quedan como tablas huérfanas sin uso operativo. En una limpieza futura podrian eliminarse via una migracion V12+.

## API expuesta

El endpoint unico del modulo es:

```
Base: /api/v1/zonas-rutas
Auth: @RolesAllowed({"ADMINISTRADOR", "OPERADOR"})
```

| Metodo | Ruta | Accion | Roles |
|---|---|---|---|
| GET | `/zonas` | Listar zonas (con cantidad de rutas y flag de poligono) | ADMIN, OPERADOR |
| POST | `/zonas` | Crear zona | ADMIN |
| PUT | `/zonas/{id}` | Actualizar zona | ADMIN |
| GET | `/rutas` | Listar rutas (con datos de zona) | ADMIN, OPERADOR |
| POST | `/rutas` | Crear ruta | ADMIN |
| PUT | `/rutas/{id}` | Actualizar ruta | ADMIN |
| PATCH | `/{tipo}/{id}/estado` | Cambiar estado ACTIVO/INACTIVO | ADMIN |
| DELETE | `/{tipo}/{id}` | Eliminar zona o ruta | ADMIN |
| GET | `/zonas/{id}/poligono` | Obtener poligono activo | ADMIN, OPERADOR |
| PUT | `/zonas/{id}/poligono` | Guardar/actualizar poligono (versionado) | ADMIN |
| DELETE | `/zonas/{id}/poligono` | Desactivar poligono activo | ADMIN |

### DTOs implementados

| DTO | Campos |
|---|---|
| `ZonaResponse` | id, codigo, nombreZona, color, estado, observacion, cantidadRutas, tienePoligono, creadoEn, actualizadoEn |
| `RutaResponse` | id, codigo, zonaId, nombreZona, zonaColor, nombreRuta, diasAtencion, estado, observacion, creadoEn, actualizadoEn |
| `CrearZonaRequest` | codigo, nombreZona, color, estado, observacion |
| `CrearRutaRequest` | codigo, zonaId, nombreRuta, diasAtencion, estado, observacion |
| `CrearPoligonoRequest` | coordenadas (GeoJSON Polygon) |

### Validaciones implementadas

- Codigo: obligatorio, maximo 30 caracteres, unico por tabla
- Nombre: obligatorio, maximo 150 caracteres
- Color: opcional, formato hexadecimal (#RGB o #RRGGBB)
- Estado: solo ACTIVO o INACTIVO
- Poligono: validacion de GeoJSON Polygon cerrado (minimo 3 puntos, primer punto = ultimo punto)
- Path traversal: IDs validados como UUID
- Integridad referencial: FK checks con FOR UPDATE en transacciones

## Consecuencias

### Positivas

- Modelo normalizado: zonas, rutas y poligonos como entidades independientes con relaciones claras.
- Una zona puede tener N rutas sin duplicar datos de zona.
- Los poligonos pertenecen a la zona, no a una combinacion zona+ruta.
- Versionado de poligonos permite historial de cambios geograficos.
- Seed de 40 zonas y 227 rutas cargado desde datos heredados.
- El endpoint unico `/zonas-rutas` simplifica el enrutamiento y la documentacion OpenAPI.

### Negativas

- Las tablas V7/V8 (`zonas_rutas`, `zonas_rutas_poligonos`) quedan como tablas huerfanas. No se eliminaron para preservar trazabilidad.
- El cambio de V7 a V9 requirio ajustar el backend y frontend que ya estaban desarrollados contra el modelo V7.
- El concepto "habilitar ventas en rutas" quedo acoplado al estado ACTIVO/INACTIVO de la ruta, sin columna propia (`ventas_habilitadas`).

### Riesgos

- Si en el futuro se necesita `ventas_habilitadas` como estado independiente del estado de la ruta, se requerira una migracion V12+ y un endpoint especifico.
- Las tablas huerfanas V7/V8 podrian causar confusion si no se documenta su estado. Se recomienda eliminarlas en una migracion de limpieza futura o marcar su estado como deprecated.

## Referencias

- `backend/api-quarkus/src/main/resources/db/migration/V7__zonas_rutas.sql`
- `backend/api-quarkus/src/main/resources/db/migration/V8__zonas_rutas_poligonos.sql`
- `backend/api-quarkus/src/main/resources/db/migration/V9__zonas_rutas_normalizadas.sql`
- `backend/api-quarkus/src/main/resources/db/migration/V10__seed_zonas_iniciales.sql`
- `backend/api-quarkus/src/main/resources/db/migration/V11__seed_rutas_iniciales.sql`
- `backend/api-quarkus/src/main/java/com/armora/zonasrutas/ZonasRutasResource.java`
- `frontend_web/src/app/zonas-rutas/gestion-zonas-rutas/page.tsx`
- `frontend_web/src/app/zonas-rutas/gestion-zonas-rutas/poligono/page.tsx`
- `frontend_web/src/app/zonas-rutas/habilitar-ventas-rutas/page.tsx`
- `docs/design-system/revision-zonas-rutas.md`
- `docs/ai_workflow/F2-016_gestion_zonas_rutas.md`
- `docs/ai_workflow/F2-017_habilitar_ventas_rutas.md`
- `docs/sdd/06_sdd_modelo_datos_inicial.md`
- `docs/sdd/07_sdd_api_contratos.md`
