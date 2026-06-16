# Handoff F2-006 — Dashboard components: Sidebar, Topbar y dashboard

## Cambio realizado

Implementación del dashboard principal replicando la estructura visual de `https://armorasac.com/app/home`:

### Sidebar (`Sidebar.tsx`)
- Menú colapsable tipo acordeón con **32 categorías** que replican el menú original de ARMORA
- Buscador de categorías/items
- Categorías: Dashboard, Compras, Proveedores, Preventas, Ventas (9 sub-items), Notas de Credito, Informes, Cambios de Productos (7), Canjes de Productos (7), Sunat, Resumenes Diarios, Comunicacion de Baja, Requerimientos, Liquidaciones, Personal, Mapas de Rutas, Clientes (5), Zonas y Rutas, Almacenes (4), Unidades de Trans., Premios Canjes (4), Productos (4), Servicios, Combos, Concursos, Comisiones, Cobertura, Listas de Precios (4), Vendedor (12), Configuracion (4), Transportistas, General
- Iconos MUI por categoria, responsive (drawer temporal en mobile, permanente en desktop)

### Topbar (`Topbar.tsx`)
- Info del usuario a la izquierda: "Personal: nombre", "Lista Precios", "Almacen"
- Iconos Home y Logout a la derecha
- Versión responsive: info colapsa debajo en mobile

### Dashboard (`dashboard/page.tsx`)
- **Grafico de Ventas**: selector de lista de precios, 3 tarjetas de estadísticas (Total Ventas, Total Devoluciones, Total), gráfico de barras con recharts
- **Gestión Transportista**: stats, búsqueda por serie/correlativo
- **Estado de la API**: badge operativo/error con health check

### Dependencias agregadas
- `recharts` para gráficos

## Documentos consultados

- `docs/scrapping/html/app_home__página_principal.html` — HTML original del dashboard ARMORA
- `docs/scrapping/02_mapa_sitio.json` — estructura de menú
- `docs/scrapping/00_resumen_general.md` — resumen del scraping
- `docs/design-system/00_referencia.md` — paleta Vanguard y tokens existentes

## Archivos modificados/creados

| Archivo | Accion |
|---|---|
| `frontend_web/src/design-system/web/layout/Sidebar.tsx` | Reescribir completo con 32 categorías colapsables |
| `frontend_web/src/design-system/web/layout/Topbar.tsx` | Actualizar con info de usuario + home/logout |
| `frontend_web/src/app/dashboard/page.tsx` | Reescribir con gráfico de ventas + transportista + health |
| `frontend_web/package.json` | Dependencia `recharts` agregada |
| `frontend_web/package-lock.json` | Actualizado |

## Contratos API afectados

- `GET /api/v1/health` — consumido para el badge de estado

## Modelo de datos afectado

Ninguno.

## Pruebas ejecutadas

- `npm run build` → PASS (6 rutas, dashboard 266 kB first load JS)
- Corrección de errores de compilación:
  - Icono `ClipboardList` no existe en MUI v5 → reemplazado por `Assignment`
  - `size` prop de Grid v2 no existe en MUI v5 → cambiado a `item xs={12} sm={X}`
  - `slotProps` no existe en MUI v5 TextField → cambiado a `InputProps`

## Riesgos abiertos

- Todos los paths del menú apuntan a `#` (placeholder). Deben vincularse a rutas reales cuando los módulos existan
- Los datos del gráfico son mock (estáticos). Deben conectarse a la API de reportes
- La sección Transportista usa datos mock

## Siguiente agente recomendado

`armora-ui-ux` para revisión de diseño y consistencia visual.
`armora-qa` para pruebas E2E del dashboard.
