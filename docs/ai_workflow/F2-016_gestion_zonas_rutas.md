# F2-016 - Gestion Zonas y Rutas

Cambio realizado:
- Se continuo la sesion `session-ses_132b.md` desde el punto donde quedaron V7/V8 y el backend parcial.
- Se implemento el modulo de Gestion Zonas y Rutas con persistencia, API Quarkus y pantallas Next.js.
- Se agrego vista de poligono con editor GeoJSON y previsualizacion SVG, sin instalar dependencias ni levantar servicios.

Documentos consultados:
- `session-ses_132b.md`
- `AGENTS.md`
- `agentes/docs/ai/00_agent_orchestration.md`
- `agentes/docs/ai/02_handoff_protocol.md`
- `agentes/docs/ai/03_workflow_automatico_sincrono.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `docs/sdd/17_convencion_nombres_tecnicos.md`
- `_para_chat_gpt/_hecho_por chat_gpt/ESPECIFICACION_GESTION_ZONAS_RUTAS_MAPA.md`

Archivos modificados:
- `backend/api-quarkus/src/main/resources/db/migration/V7__zonas_rutas.sql`
- `backend/api-quarkus/src/main/resources/db/migration/V8__zonas_rutas_poligonos.sql`
- `backend/api-quarkus/src/main/java/com/armora/zonasrutas/ZonasRutasResource.java`
- `frontend_web/src/design-system/web/layout/Sidebar.tsx`
- `frontend_web/src/app/zonas-rutas/gestion-zonas-rutas/page.tsx`
- `frontend_web/src/app/zonas-rutas/gestion-zonas-rutas/poligono/page.tsx`
- `docs/ai_workflow/00_tablero_agentes.md`
- `docs/ai_workflow/F2-016_gestion_zonas_rutas.md`

Contratos API afectados:
- `GET /api/v1/zonas-rutas?q=&estado=`
- `GET /api/v1/zonas-rutas/{id}`
- `POST /api/v1/zonas-rutas`
- `PUT /api/v1/zonas-rutas/{id}`
- `PATCH /api/v1/zonas-rutas/{id}/estado`
- `DELETE /api/v1/zonas-rutas/{id}`
- `GET /api/v1/zonas-rutas/{id}/poligono`
- `POST /api/v1/zonas-rutas/{id}/poligono`
- `PUT /api/v1/zonas-rutas/{id}/poligono`
- `DELETE /api/v1/zonas-rutas/{id}/poligono`

Modelo de datos afectado:
- Nueva tabla `zonas_rutas`.
- Nueva tabla `zonas_rutas_poligonos`.
- FK opcional `zonas_rutas.responsable_id -> personal.id`.
- FK cascade `zonas_rutas_poligonos.zona_ruta_id -> zonas_rutas.id`.

Permisos/scopes afectados:
- Lectura permitida para `ADMINISTRADOR` y `OPERADOR`.
- Mutaciones restringidas a `ADMINISTRADOR`.

Pruebas ejecutadas:
- `mvn compile -q` en `backend/api-quarkus`.
- `npm run build` en `frontend_web`.

Pruebas pendientes:
- Smoke manual con servicios levantados.
- Flujo E2E autenticado: crear, editar, cambiar estado, eliminar, guardar y eliminar poligono.
- Validacion visual con Leaflet Draw cuando se agregue la dependencia real de mapa.

Riesgos abiertos:
- La vista de poligono no usa aun Leaflet/Leaflet Draw porque no hay dependencia instalada y el usuario pidio no levantar servicios.
- `DELETE /zonas-rutas/{id}` sigue siendo borrado fisico segun alcance implementado; si existen dependencias futuras, debe cambiar a inactivacion o validacion de relaciones.
- La seleccion de responsable usa UUID manual hasta que exista endpoint/autocomplete de personal vendedor.

Validaciones pendientes:
- Confirmar regla de negocio final para eliminacion cuando existan clientes, ventas o preventas asociadas.
- Integrar clientes georreferenciados dentro/fuera cuando exista contrato.

Siguiente agente recomendado:
- `armora-qa` para smoke E2E con servicios levantados cuando el usuario lo autorice.
