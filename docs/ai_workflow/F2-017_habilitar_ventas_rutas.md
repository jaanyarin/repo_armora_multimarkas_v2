# F2-017 - Habilitar Ventas en Rutas

Cambio realizado:
- Se implemento la pantalla web administrativa `Habilitar Ventas en Rutas` en Next.js + MUI.
- Se conecto la opcion del sidebar `Distribucion, Zonas y Rutas > Habilitar Ventas en Rutas` con la nueva ruta.
- La pantalla permite buscar, filtrar, seleccionar rutas y aplicar habilitacion/bloqueo masivo con confirmacion previa.

Documentos consultados:
- `docs/scrapping/endpoints/zonas_rutas/zonas_rutas_habilitar_ventas_en_rutas_zonas-rutas_habilitar-ventas-rutas.md`
- `docs/scrapping/html/app_zonas-rutas_habilitar-ventas-rutas__habilitar_ventas_en_rutas.html`
- `docs/scrapping/network/zonas_rutas_habilitar_ventas_en_rutas_zonas-rutas_habilitar-ventas-rutas.json`
- `docs/ai_workflow/00_tablero_agentes.md`
- `docs/ai_workflow/F2-016_gestion_zonas_rutas.md`
- `OPENCODE_UI_DESIGN_SYSTEM.md`

Archivos modificados:
- `frontend_web/src/app/zonas-rutas/habilitar-ventas-rutas/page.tsx`
- `frontend_web/src/design-system/web/layout/Sidebar.tsx`
- `docs/ai_workflow/F2-017_habilitar_ventas_rutas.md`

Contratos API afectados:
- Consumidos:
  - `GET /api/v1/zonas-rutas/rutas`
  - `PATCH /api/v1/zonas-rutas/rutas/{id}/estado`
- No se agregaron contratos backend nuevos en esta tarea.

Modelo de datos afectado:
- Ninguno en esta tarea.
- La pantalla usa el estado actual de ruta como equivalente operativo de venta habilitada/bloqueada.

Permisos/scopes afectados:
- La pantalla queda dentro del admin web.
- Las mutaciones dependen del backend existente, actualmente restringido a `ADMINISTRADOR` para cambios de estado.

Pruebas ejecutadas:
- No ejecutadas desde este entorno, porque no se levanto el proyecto localmente.

Pruebas pendientes:
- Ejecutar `npm run build` en `frontend_web`.
- Smoke manual autenticado:
  1. Abrir `/zonas-rutas/habilitar-ventas-rutas`.
  2. Validar carga de rutas.
  3. Filtrar por busqueda, zona, estado y dia.
  4. Seleccionar varias rutas.
  5. Habilitar ventas.
  6. Bloquear ventas.
  7. Verificar persistencia al actualizar.

Riesgos abiertos:
- El concepto `habilitar ventas` todavia no tiene columna/API propia como `ventas_habilitadas`; se uso `estado = ACTIVO/INACTIVO` de la ruta para no romper el contrato actual.
- Existe inconsistencia previa detectada en F2-016: las migraciones documentadas crean `zonas_rutas` y `zonas_rutas_poligonos`, pero el recurso Java consultado trabaja con `zonas`, `rutas` y `zonas_poligonos`. Debe resolverse antes de ampliar contratos backend.

Validaciones pendientes:
- Confirmar si `habilitar ventas` debe ser independiente del estado de la ruta. Si es independiente, crear migracion y endpoint especifico:
  - `ventas_habilitadas boolean NOT NULL DEFAULT false`
  - `PATCH /api/v1/zonas-rutas/rutas/{id}/ventas-habilitadas`
  - `PATCH /api/v1/zonas-rutas/rutas/ventas-habilitadas/bulk`

Siguiente agente recomendado:
- `armora-qa` para build y smoke manual.
- `armora-architect` + `armora-database` si se decide separar `estado` de `ventas_habilitadas`.
