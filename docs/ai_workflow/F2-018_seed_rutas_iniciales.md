# F2-018 - Seed inicial de rutas por zona

Cambio previsto:
- Cargar 227 rutas heredadas en tabla `rutas`.
- Vincular cada ruta a su zona existente en `zonas` por `nombre_zona`.
- Mantener `nombre_ruta` con el codigo heredado visible: `01`, `10`, `20`, `30`, `40`, `50`, `60`.
- Generar codigo tecnico unico como `<codigo_zona>-R<codigo_ruta>`.

Modelo de datos afectado:
- `rutas.codigo`
- `rutas.zona_id`
- `rutas.nombre_ruta`
- `rutas.estado`
- `metadatos_plataforma.esquema.version = 11`

Validacion de datos:
- Total recibido: 227 rutas.
- Zonas distintas: 40.
- Duplicados detectados: 0.
- Correccion aplicada: `PALPA 30;` normalizado a `PALPA | 30`.

Pruebas esperadas:
- Flyway debe ejecutar V11 despues de V10.
- `GET /api/v1/zonas-rutas/rutas` debe devolver 227 rutas nuevas.
- Cada zona debe mostrar su `cantidad_rutas` segun la relacion `rutas.zona_id`.
