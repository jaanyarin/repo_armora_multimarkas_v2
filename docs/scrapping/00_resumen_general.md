# Resumen general scraping ARMORA

- URL base: `https://armorasac.com/app/`
- Endpoints detectados: `120`
- Endpoints procesados: `120`
- APIs detectadas: `235`

## Stack detectado

```json
{
  "url": "https://armorasac.com/app/",
  "title": "Página Principal",
  "detected": [
    "jQuery"
  ],
  "scripts": [
    "https://armorasac.com/app/static/jquery/jquery-3.4.1.min.js",
    "https://armorasac.com/app/static/jquery/jquery-serialize-object.min.js",
    "https://armorasac.com/app/static/semantic/semantic-dyvent.min.js",
    "https://armorasac.com/app/static/alert/ui-alert.js",
    "https://armorasac.com/app/static/datatable/datatables.dyvent.min.js",
    "https://armorasac.com/app/static/quicksearch/quicksearch.js",
    "https://armorasac.com/app/static/multiselect/multiselect.js",
    "https://armorasac.com/app/static/calendar/calendar.min.js",
    "https://armorasac.com/app/static/resources/js/page.js",
    "https://armorasac.com/app/static/resources/js/clases.js",
    "https://armorasac.com/app/static/resources/js/catalogo.js",
    "https://armorasac.com/app/static/moment/moment-with-locales.js",
    "https://armorasac.com/app/static/chartjs/chartjs.min.js",
    "https://armorasac.com/app/resources/general/home/index.js"
  ],
  "stylesheets": [
    "https://armorasac.com/app/static/semantic/semantic-dyvent.min.css",
    "https://armorasac.com/app/static/alert/ui-alert.css",
    "https://armorasac.com/app/static/datatable/datatables.dyvent.min.css",
    "https://armorasac.com/app/static/multiselect/multiselect.min.css",
    "https://armorasac.com/app/static/calendar/calendar.min.css",
    "https://armorasac.com/app/static/resources/css/page.css",
    "https://armorasac.com/app/static/tableflip/tableflip.css",
    "https://armorasac.com/app/static/chartjs/chartjs.min.css"
  ],
  "meta": {
    "viewport": "width=device-width, initial-scale=1",
    "msapplication-TileColor": "#000000",
    "theme-color": "#000000"
  }
}
```

## Mapa del sitio

| # | Título | URL | Fuente |
|---:|---|---|---|
| 1 | Home | `https://armorasac.com/app/` | base |
| 2 | https://armorasac.com/app/general/perfil-personal | `https://armorasac.com/app/general/perfil-personal` | initial dom |
| 3 | Home | `https://armorasac.com/app/home` | initial dom |
| 4 | Crear Compra | `https://armorasac.com/app/compras/crear-compra` | initial dom |
| 5 | Gestión de Compras | `https://armorasac.com/app/compras/gestion-compras` | initial dom |
| 6 | Crear Proveedor | `https://armorasac.com/app/proveedores/crear-proveedor` | initial dom |
| 7 | Gestión de Proveedores | `https://armorasac.com/app/proveedores/gestion-proveedores` | initial dom |
| 8 | Gestión Preventas | `https://armorasac.com/app/preventas/gestion-preventas` | initial dom |
| 9 | Reportes Preventas | `https://armorasac.com/app/preventas/reportes-preventas` | initial dom |
| 10 | Crear Venta Productos | `https://armorasac.com/app/ventas/crear-venta` | initial dom |
| 11 | Crear Venta Servicios | `https://armorasac.com/app/ventas/crear-venta-servicio` | initial dom |
| 12 | Gestión de Ventas | `https://armorasac.com/app/ventas/gestion-ventas` | initial dom |
| 13 | Puntos de Ventas | `https://armorasac.com/app/ventas/puntos-ventas` | initial dom |
| 14 | Gestión Notas Pedido | `https://armorasac.com/app/ventas/gestion-notas-pedido` | initial dom |
| 15 | Impresión de Ventas | `https://armorasac.com/app/ventas/impresion-ventas` | initial dom |
| 16 | Entregas Parciales | `https://armorasac.com/app/ventas/entregas-parciales` | initial dom |
| 17 | Fileteo Automatico | `https://armorasac.com/app/ventas/fileteo-automatico` | initial dom |
| 18 | Reportes de Ventas | `https://armorasac.com/app/ventas/reportes-ventas` | initial dom |
| 19 | Gestión Notas Credito | `https://armorasac.com/app/notas-credito/gestion-notas-credito` | initial dom |
| 20 | Devolucion Transportista | `https://armorasac.com/app/notas-credito/devoluciones-transportistas` | initial dom |
| 21 | Impresión Notas Credito | `https://armorasac.com/app/notas-credito/impresion-notas-credito` | initial dom |
| 22 | Reportes Notas Credito | `https://armorasac.com/app/notas-credito/reportes-notas-credito` | initial dom |
| 23 | Informes de Requerimientos | `https://armorasac.com/app/informes/requerimientos` | initial dom |
| 24 | Informes de Liquidaciones | `https://armorasac.com/app/informes/liquidaciones` | initial dom |
| 25 | Informes de Almacenes | `https://armorasac.com/app/informes/almacenes` | initial dom |
| 26 | Entregas Parciales | `https://armorasac.com/app/informes/entregas-parciales` | initial dom |
| 27 | Crear Cambio Productos | `https://armorasac.com/app/cambios-producto/crear-cambio-producto` | initial dom |
| 28 | Asignar Fecha de Entrega | `https://armorasac.com/app/cambios-producto/asignar-entrega-cambios-producto` | initial dom |
| 29 | Gestion Cambio Productos | `https://armorasac.com/app/cambios-producto/gestion-cambios-producto` | initial dom |
| 30 | Impresion Cambio Productos | `https://armorasac.com/app/cambios-producto/impresion-cambio-producto` | initial dom |
| 31 | Crear Req/Liq Cambios | `https://armorasac.com/app/cambios-producto/crear-reporte-cambios-producto` | initial dom |
| 32 | Gestion Req/Liq Cambios | `https://armorasac.com/app/cambios-producto/gestion-reportes-cambios-producto` | initial dom |
| 33 | Reporte Cambios Productos | `https://armorasac.com/app/cambios-producto/reportes-cambios-producto` | initial dom |
| 34 | Crear Canje | `https://armorasac.com/app/canjes/crear-canje` | initial dom |
| 35 | Asignar Fecha de Entrega | `https://armorasac.com/app/canjes/asignar-entrega-canjes` | initial dom |
| 36 | Gestion Canjes | `https://armorasac.com/app/canjes/gestion-canjes` | initial dom |
| 37 | Impresion Canjes | `https://armorasac.com/app/canjes/impresion-canjes` | initial dom |
| 38 | Crear Req/Liq Canjes | `https://armorasac.com/app/canjes/crear-reportes-canjes` | initial dom |
| 39 | Gestion Req/Liq Canjes | `https://armorasac.com/app/canjes/gestion-reportes-canjes` | initial dom |
| 40 | Reportes Canjes | `https://armorasac.com/app/canjes/reportes-canjes` | initial dom |
| 41 | Envios Pendientes Sunat | `https://armorasac.com/app/sunat/envios-sunat` | initial dom |
| 42 | Gestion Envios Sunat | `https://armorasac.com/app/sunat/gestion-envios-sunat` | initial dom |
| 43 | Reportes Envios Sunat | `https://armorasac.com/app/sunat/reportes-envios-sunat` | initial dom |
| 44 | Crear Resumen | `https://armorasac.com/app/resumen-diario/crear-resumen-diario` | initial dom |
| 45 | Gestion de Resumenes | `https://armorasac.com/app/resumen-diario/gestion-resumenes-diarios` | initial dom |
| 46 | Reportes de Resumenes | `https://armorasac.com/app/resumen-diario/reportes-resumenes-diarios` | initial dom |
| 47 | Crear Baja | `https://armorasac.com/app/comunicacion-baja/crear-comunicacion-baja` | initial dom |
| 48 | Gestion de Bajas | `https://armorasac.com/app/comunicacion-baja/gestion-comunicaciones-baja` | initial dom |
| 49 | Reportes de Baja | `https://armorasac.com/app/comunicacion-baja/reportes-comunicaciones-baja` | initial dom |
| 50 | Crear Requerimiento | `https://armorasac.com/app/requerimientos/crear-requerimiento` | initial dom |
| 51 | Gestion Requerimientos | `https://armorasac.com/app/requerimientos/gestion-requerimientos` | initial dom |
| 52 | Reportes Requerimientos | `https://armorasac.com/app/requerimientos/reportes-requerimientos` | initial dom |
| 53 | Crear Liquidacion | `https://armorasac.com/app/liquidaciones/crear-liquidacion` | initial dom |
| 54 | Gestion Liquidaciones | `https://armorasac.com/app/liquidaciones/gestion-liquidaciones` | initial dom |
| 55 | Reportes Liquidaciones | `https://armorasac.com/app/liquidaciones/reportes-liquidaciones` | initial dom |
| 56 | Crear Personal | `https://armorasac.com/app/personal/crear-personal` | initial dom |
| 57 | Gestion Personal | `https://armorasac.com/app/personal/gestion-personal` | initial dom |
| 58 | Reportes Personal | `https://armorasac.com/app/personal/reportes-personal` | initial dom |
| 59 | Crear Mapa de Rutas | `https://armorasac.com/app/mapas-rutas/crear-mapa-rutas` | initial dom |
| 60 | Gestion de Mapas de Rutas | `https://armorasac.com/app/mapas-rutas/gestion-mapas-rutas` | initial dom |
| 61 | Reportes de Mapas de Rutas | `https://armorasac.com/app/mapas-rutas/reportes-mapas-rutas` | initial dom |
| 62 | Crear Cliente | `https://armorasac.com/app/clientes/crear-cliente` | initial dom |
| 63 | Gestion Clientes | `https://armorasac.com/app/clientes/gestion-clientes` | initial dom |
| 64 | Habilitar Ventas Clientes | `https://armorasac.com/app/clientes/habilitar-ventas-clientes` | initial dom |
| 65 | Cambio dia Atencion | `https://armorasac.com/app/clientes/cambio-dia-atencion` | initial dom |
| 66 | Reportes Clientes | `https://armorasac.com/app/clientes/reportes-clientes` | initial dom |
| 67 | Gestion Zonas y Rutas | `https://armorasac.com/app/zonas-rutas/gestion-zonas-rutas` | initial dom |
| 68 | Habilitar Ventas en Rutas | `https://armorasac.com/app/zonas-rutas/habilitar-ventas-rutas` | initial dom |
| 69 | Reportes Zonas y Rutas | `https://armorasac.com/app/zonas-rutas/reportes-zonas-rutas` | initial dom |
| 70 | Gestion Almacenes | `https://armorasac.com/app/almacenes/gestion-almacenes` | initial dom |
| 71 | Reportes Almacenes | `https://armorasac.com/app/almacenes/reportes-almacenes` | initial dom |
| 72 | Inventario de Stocks | `https://armorasac.com/app/almacenes/inventario-stock` | initial dom |
| 73 | Gestion de Inventarios | `https://armorasac.com/app/almacenes/gestion-inventarios` | initial dom |
| 74 | Crear Unidad Trans. | `https://armorasac.com/app/unidades-transporte/crear-unidad-transporte` | initial dom |
| 75 | Gestion Unidades de Trans. | `https://armorasac.com/app/unidades-transporte/gestion-unidades-transporte` | initial dom |
| 76 | Reportes Unidades de Trans. | `https://armorasac.com/app/unidades-transporte/reportes-unidades-transporte` | initial dom |
| 77 | Requisitos de Canjes | `https://armorasac.com/app/premio-canje/gestion-requesitos-canje` | initial dom |
| 78 | Crear Premio Canje | `https://armorasac.com/app/premio-canje/crear-premio-canje` | initial dom |
| 79 | Gestion Premio Canje | `https://armorasac.com/app/premio-canje/gestion-premios-canjes` | initial dom |
| 80 | Reportes Premio Canje | `https://armorasac.com/app/premio-canje/reportes-premios-canjes` | initial dom |
| 81 | Clases y Subclases | `https://armorasac.com/app/productos/gestion-clases-subclases-productos` | initial dom |
| 82 | Crear Producto | `https://armorasac.com/app/productos/crear-producto` | initial dom |
| 83 | Gestion Productos | `https://armorasac.com/app/productos/gestion-productos` | initial dom |
| 84 | Reportes Productos | `https://armorasac.com/app/productos/reportes-productos` | initial dom |
| 85 | Crear Servicio | `https://armorasac.com/app/servicios/crear-servicio` | initial dom |
| 86 | Gestion Servicios | `https://armorasac.com/app/servicios/gestion-servicios` | initial dom |
| 87 | Crear Combo | `https://armorasac.com/app/combos/crear-combo` | initial dom |
| 88 | Gestion Combos | `https://armorasac.com/app/combos/gestion-combos` | initial dom |
| 89 | Reportes Combos | `https://armorasac.com/app/combos/reportes-combos` | initial dom |
| 90 | Crear Concurso | `https://armorasac.com/app/concursos/crear-concurso` | initial dom |
| 91 | Gestion Concursos | `https://armorasac.com/app/concursos/gestion-concursos` | initial dom |
| 92 | Reportes Concursos | `https://armorasac.com/app/concursos/reportes-concursos` | initial dom |
| 93 | Crear Reporte Comisiones | `https://armorasac.com/app/comisiones/crear-reporte-comisiones` | initial dom |
| 94 | Gestion Reporte Comisiones | `https://armorasac.com/app/comisiones/gestion-comisiones` | initial dom |
| 95 | Ajuste de Comisiones | `https://armorasac.com/app/comisiones/ajuste-comisiones` | initial dom |
| 96 | Crear Reporte Cobertura | `https://armorasac.com/app/cobertura/crear-reporte-cobertura` | initial dom |
| 97 | Gestion Reporte Cobertura | `https://armorasac.com/app/cobertura/gestion-coberturas` | initial dom |
| 98 | Crear Lista de Precios | `https://armorasac.com/app/lista-precios/crear-lista-precios` | initial dom |
| 99 | Gestion Listas de Precios | `https://armorasac.com/app/lista-precios/gestion-listas-precios` | initial dom |
| 100 | Copiar Listas de Precios | `https://armorasac.com/app/lista-precios/copiar-lista-precios` | initial dom |
| 101 | Reportes Listas de Precios | `https://armorasac.com/app/lista-precios/reportes-listas-precios` | initial dom |
| 102 | Crear Cliente | `https://armorasac.com/app/vendedor/crear-cliente` | initial dom |
| 103 | Clientes | `https://armorasac.com/app/vendedor/clientes` | initial dom |
| 104 | Crear Preventa | `https://armorasac.com/app/vendedor/crear-preventa` | initial dom |
| 105 | Preventas | `https://armorasac.com/app/vendedor/preventas` | initial dom |
| 106 | Ventas | `https://armorasac.com/app/vendedor/ventas` | initial dom |
| 107 | Crear Cambio Productos | `https://armorasac.com/app/vendedor/crear-cambio-producto` | initial dom |
| 108 | Cambios de Productos | `https://armorasac.com/app/vendedor/cambios-producto` | initial dom |
| 109 | Crear Canje | `https://armorasac.com/app/vendedor/crear-canje` | initial dom |
| 110 | Canjes | `https://armorasac.com/app/vendedor/canjes` | initial dom |
| 111 | Stock de Productos | `https://armorasac.com/app/vendedor/stock-productos` | initial dom |
| 112 | Comisiones | `https://armorasac.com/app/vendedor/comisiones` | initial dom |
| 113 | Concursos | `https://armorasac.com/app/vendedor/concursos` | initial dom |
| 114 | Configuracion Empresa | `https://armorasac.com/app/configuracion/configuracion-empresa` | initial dom |
| 115 | Configuracion Impresión | `https://armorasac.com/app/configuracion/configuracion-impresion` | initial dom |
| 116 | Configuracion Sunat | `https://armorasac.com/app/configuracion/configuracion-sunat` | initial dom |
| 117 | Configuracion Alertas | `https://armorasac.com/app/configuracion/configuracion-alertas` | initial dom |
| 118 | Mis Devoluciones | `https://armorasac.com/app/transportistas/mis-devoluciones` | initial dom |
| 119 | Mis Requerimientos | `https://armorasac.com/app/transportistas/mis-requerimientos` | initial dom |
| 120 | Mis Liquidaciones | `https://armorasac.com/app/transportistas/mis-liquidaciones` | initial dom |

## Endpoints procesados

| # | Título | URL | Estado | MD |
|---:|---|---|---|---|
| 1 | Página Principal | `https://armorasac.com/app/` | OK | `app__página_principal.md` |
| 2 | Perfil de Personal | `https://armorasac.com/app/general/perfil-personal` | OK | `app_general_perfil-personal__perfil_de_personal.md` |
| 3 | Página Principal | `https://armorasac.com/app/home` | OK | `app_home__página_principal.md` |
| 4 | Crear Compra | `https://armorasac.com/app/compras/crear-compra` | OK | `app_compras_crear-compra__crear_compra.md` |
| 5 | Gestión de Compras | `https://armorasac.com/app/compras/gestion-compras` | OK | `app_compras_gestion-compras__gestión_de_compras.md` |
| 6 | Crear Proveedor | `https://armorasac.com/app/proveedores/crear-proveedor` | OK | `app_proveedores_crear-proveedor__crear_proveedor.md` |
| 7 | Gestión de Proveedores | `https://armorasac.com/app/proveedores/gestion-proveedores` | OK | `app_proveedores_gestion-proveedores__gestión_de_proveedores.md` |
| 8 | Gestion Preventas | `https://armorasac.com/app/preventas/gestion-preventas` | OK | `app_preventas_gestion-preventas__gestion_preventas.md` |
| 9 | Reportes Comunicaciones de Baja | `https://armorasac.com/app/preventas/reportes-preventas` | OK | `app_preventas_reportes-preventas__reportes_comunicaciones_de_baja.md` |
| 10 | Crear Venta | `https://armorasac.com/app/ventas/crear-venta` | OK | `app_ventas_crear-venta__crear_venta.md` |
| 11 | Crear Venta Servicios | `https://armorasac.com/app/ventas/crear-venta-servicio` | OK | `app_ventas_crear-venta-servicio__crear_venta_servicios.md` |
| 12 | Gestión de Ventas | `https://armorasac.com/app/ventas/gestion-ventas` | OK | `app_ventas_gestion-ventas__gestión_de_ventas.md` |
| 13 | Puntos de Ventas | `https://armorasac.com/app/ventas/puntos-ventas` | OK | `app_ventas_puntos-ventas__puntos_de_ventas.md` |
| 14 | Gestión de Notas de Pedido | `https://armorasac.com/app/ventas/gestion-notas-pedido` | OK | `app_ventas_gestion-notas-pedido__gestión_de_notas_de_pedido.md` |
| 15 | Impresión de Ventas | `https://armorasac.com/app/ventas/impresion-ventas` | OK | `app_ventas_impresion-ventas__impresión_de_ventas.md` |
| 16 | Entregas Parciales | `https://armorasac.com/app/ventas/entregas-parciales` | OK | `app_ventas_entregas-parciales__entregas_parciales.md` |
| 17 | Fileteo Automatico | `https://armorasac.com/app/ventas/fileteo-automatico` | OK | `app_ventas_fileteo-automatico__fileteo_automatico.md` |
| 18 | Reportes de Ventas | `https://armorasac.com/app/ventas/reportes-ventas` | OK | `app_ventas_reportes-ventas__reportes_de_ventas.md` |
| 19 | Gestión Notas Crédito | `https://armorasac.com/app/notas-credito/gestion-notas-credito` | OK | `app_notas-credito_gestion-notas-credito__gestión_notas_crédito.md` |
| 20 | Devoluciones Transportistas | `https://armorasac.com/app/notas-credito/devoluciones-transportistas` | OK | `app_notas-credito_devoluciones-transportistas__devoluciones_transportistas.md` |
| 21 | Impresion Notas Credito | `https://armorasac.com/app/notas-credito/impresion-notas-credito` | OK | `app_notas-credito_impresion-notas-credito__impresion_notas_credito.md` |
| 22 | Reportes Notas Crédito | `https://armorasac.com/app/notas-credito/reportes-notas-credito` | OK | `app_notas-credito_reportes-notas-credito__reportes_notas_crédito.md` |
| 23 | Informes de Requerimientos | `https://armorasac.com/app/informes/requerimientos` | OK | `app_informes_requerimientos__informes_de_requerimientos.md` |
| 24 | Informes de Liquidaciones | `https://armorasac.com/app/informes/liquidaciones` | OK | `app_informes_liquidaciones__informes_de_liquidaciones.md` |
| 25 | Informes de Almacenes | `https://armorasac.com/app/informes/almacenes` | OK | `app_informes_almacenes__informes_de_almacenes.md` |
| 26 | Entregas Parciales | `https://armorasac.com/app/informes/entregas-parciales` | OK | `app_informes_entregas-parciales__entregas_parciales.md` |
| 27 | Crear Cambio de Productos | `https://armorasac.com/app/cambios-producto/crear-cambio-producto` | OK | `app_cambios-producto_crear-cambio-producto__crear_cambio_de_productos.md` |
| 28 | Asignar Entrega Cambios Productos | `https://armorasac.com/app/cambios-producto/asignar-entrega-cambios-producto` | OK | `app_cambios-producto_asignar-entrega-cambios-producto__asignar_entrega_cambios_productos.md` |
| 29 | Gestion de Cambios de Productos | `https://armorasac.com/app/cambios-producto/gestion-cambios-producto` | OK | `app_cambios-producto_gestion-cambios-producto__gestion_de_cambios_de_productos.md` |
| 30 | Impresión de Cambios de Productos | `https://armorasac.com/app/cambios-producto/impresion-cambio-producto` | OK | `app_cambios-producto_impresion-cambio-producto__impresión_de_cambios_de_productos.md` |
| 31 | Crear Reporte Cambios Producto | `https://armorasac.com/app/cambios-producto/crear-reporte-cambios-producto` | OK | `app_cambios-producto_crear-reporte-cambios-producto__crear_reporte_cambios_producto.md` |
| 32 | Gestion Reportes Cambios Producto | `https://armorasac.com/app/cambios-producto/gestion-reportes-cambios-producto` | OK | `app_cambios-producto_gestion-reportes-cambios-producto__gestion_reportes_cambios_producto.md` |
| 33 | Reportes Cambios de Productos | `https://armorasac.com/app/cambios-producto/reportes-cambios-producto` | OK | `app_cambios-producto_reportes-cambios-producto__reportes_cambios_de_productos.md` |
| 34 | Crear Canje | `https://armorasac.com/app/canjes/crear-canje` | OK | `app_canjes_crear-canje__crear_canje.md` |
| 35 | Asignar Entrega Canjes | `https://armorasac.com/app/canjes/asignar-entrega-canjes` | OK | `app_canjes_asignar-entrega-canjes__asignar_entrega_canjes.md` |
| 36 | Gestión de Canjes | `https://armorasac.com/app/canjes/gestion-canjes` | OK | `app_canjes_gestion-canjes__gestión_de_canjes.md` |
| 37 | Impresion de Canjes | `https://armorasac.com/app/canjes/impresion-canjes` | OK | `app_canjes_impresion-canjes__impresion_de_canjes.md` |
| 38 | Crear Reporte de Canjes | `https://armorasac.com/app/canjes/crear-reportes-canjes` | OK | `app_canjes_crear-reportes-canjes__crear_reporte_de_canjes.md` |
| 39 | Gestion de Reporte de Canjes | `https://armorasac.com/app/canjes/gestion-reportes-canjes` | OK | `app_canjes_gestion-reportes-canjes__gestion_de_reporte_de_canjes.md` |
| 40 | Reportes de Canjes | `https://armorasac.com/app/canjes/reportes-canjes` | OK | `app_canjes_reportes-canjes__reportes_de_canjes.md` |
| 41 | Envios Pendientes Sunat | `https://armorasac.com/app/sunat/envios-sunat` | OK | `app_sunat_envios-sunat__envios_pendientes_sunat.md` |
| 42 | Gestion Envíos Sunat | `https://armorasac.com/app/sunat/gestion-envios-sunat` | OK | `app_sunat_gestion-envios-sunat__gestion_envíos_sunat.md` |
| 43 | Reportes Envios Sunat | `https://armorasac.com/app/sunat/reportes-envios-sunat` | OK | `app_sunat_reportes-envios-sunat__reportes_envios_sunat.md` |
| 44 | Crear Resumen Diario | `https://armorasac.com/app/resumen-diario/crear-resumen-diario` | OK | `app_resumen-diario_crear-resumen-diario__crear_resumen_diario.md` |
| 45 | Gestión Resumenes Diarios | `https://armorasac.com/app/resumen-diario/gestion-resumenes-diarios` | OK | `app_resumen-diario_gestion-resumenes-diarios__gestión_resumenes_diarios.md` |
| 46 | Reportes Resumenes Diarios | `https://armorasac.com/app/resumen-diario/reportes-resumenes-diarios` | OK | `app_resumen-diario_reportes-resumenes-diarios__reportes_resumenes_diarios.md` |
| 47 | Crear Comunicación de Baja | `https://armorasac.com/app/comunicacion-baja/crear-comunicacion-baja` | OK | `app_comunicacion-baja_crear-comunicacion-baja__crear_comunicación_de_baja.md` |
| 48 | Gestión Comunicaciones de Baja | `https://armorasac.com/app/comunicacion-baja/gestion-comunicaciones-baja` | OK | `app_comunicacion-baja_gestion-comunicaciones-baja__gestión_comunicaciones_de_baja.md` |
| 49 | Reportes Comunicaciones de Baja | `https://armorasac.com/app/comunicacion-baja/reportes-comunicaciones-baja` | OK | `app_comunicacion-baja_reportes-comunicaciones-baja__reportes_comunicaciones_de_baja.md` |
| 50 | Crear Requerimiento | `https://armorasac.com/app/requerimientos/crear-requerimiento` | OK | `app_requerimientos_crear-requerimiento__crear_requerimiento.md` |
| 51 | Gestión Requerimientos | `https://armorasac.com/app/requerimientos/gestion-requerimientos` | OK | `app_requerimientos_gestion-requerimientos__gestión_requerimientos.md` |
| 52 | Reportes Requerimientos | `https://armorasac.com/app/requerimientos/reportes-requerimientos` | OK | `app_requerimientos_reportes-requerimientos__reportes_requerimientos.md` |
| 53 | Crear Liquidación | `https://armorasac.com/app/liquidaciones/crear-liquidacion` | OK | `app_liquidaciones_crear-liquidacion__crear_liquidación.md` |
| 54 | Gestión Liquidaciones | `https://armorasac.com/app/liquidaciones/gestion-liquidaciones` | OK | `app_liquidaciones_gestion-liquidaciones__gestión_liquidaciones.md` |
| 55 | Reportes Liquidación | `https://armorasac.com/app/liquidaciones/reportes-liquidaciones` | OK | `app_liquidaciones_reportes-liquidaciones__reportes_liquidación.md` |
| 56 | Crear Personal | `https://armorasac.com/app/personal/crear-personal` | ERROR | `` |
| 57 | Gestion Personal | `https://armorasac.com/app/personal/gestion-personal` | ERROR | `` |
| 58 | Reportes Personal | `https://armorasac.com/app/personal/reportes-personal` | OK | `app_personal_reportes-personal__reportes_personal.md` |
| 59 | Crear Mapa Rutas | `https://armorasac.com/app/mapas-rutas/crear-mapa-rutas` | OK | `app_mapas-rutas_crear-mapa-rutas__crear_mapa_rutas.md` |
| 60 | Gestion de Mapas de Rutas | `https://armorasac.com/app/mapas-rutas/gestion-mapas-rutas` | OK | `app_mapas-rutas_gestion-mapas-rutas__gestion_de_mapas_de_rutas.md` |
| 61 | Reporte de Mapas de Rutas | `https://armorasac.com/app/mapas-rutas/reportes-mapas-rutas` | OK | `app_mapas-rutas_reportes-mapas-rutas__reporte_de_mapas_de_rutas.md` |
| 62 | Crear Cliente | `https://armorasac.com/app/clientes/crear-cliente` | OK | `app_clientes_crear-cliente__crear_cliente.md` |
| 63 | Gestión de Clientes | `https://armorasac.com/app/clientes/gestion-clientes` | OK | `app_clientes_gestion-clientes__gestión_de_clientes.md` |
| 64 | Habilitar Ventas de Clientes | `https://armorasac.com/app/clientes/habilitar-ventas-clientes` | OK | `app_clientes_habilitar-ventas-clientes__habilitar_ventas_de_clientes.md` |
| 65 | Cambio día de Atención | `https://armorasac.com/app/clientes/cambio-dia-atencion` | OK | `app_clientes_cambio-dia-atencion__cambio_día_de_atención.md` |
| 66 | Reportes de Clientes | `https://armorasac.com/app/clientes/reportes-clientes` | OK | `app_clientes_reportes-clientes__reportes_de_clientes.md` |
| 67 | Gestión de Zonas y Rutas | `https://armorasac.com/app/zonas-rutas/gestion-zonas-rutas` | OK | `app_zonas-rutas_gestion-zonas-rutas__gestión_de_zonas_y_rutas.md` |
| 68 | Habilitar Ventas en Rutas | `https://armorasac.com/app/zonas-rutas/habilitar-ventas-rutas` | OK | `app_zonas-rutas_habilitar-ventas-rutas__habilitar_ventas_en_rutas.md` |
| 69 | Reportes de Zonas y Rutas | `https://armorasac.com/app/zonas-rutas/reportes-zonas-rutas` | OK | `app_zonas-rutas_reportes-zonas-rutas__reportes_de_zonas_y_rutas.md` |
| 70 | Gestión Almacenes | `https://armorasac.com/app/almacenes/gestion-almacenes` | OK | `app_almacenes_gestion-almacenes__gestión_almacenes.md` |
| 71 | Reportes Almacenes | `https://armorasac.com/app/almacenes/reportes-almacenes` | OK | `app_almacenes_reportes-almacenes__reportes_almacenes.md` |
| 72 | Inventario de Stocks | `https://armorasac.com/app/almacenes/inventario-stock` | OK | `app_almacenes_inventario-stock__inventario_de_stocks.md` |
| 73 | Gestion de Inventarios | `https://armorasac.com/app/almacenes/gestion-inventarios` | OK | `app_almacenes_gestion-inventarios__gestion_de_inventarios.md` |
| 74 | Crear Unidad Transporte | `https://armorasac.com/app/unidades-transporte/crear-unidad-transporte` | OK | `app_unidades-transporte_crear-unidad-transporte__crear_unidad_transporte.md` |
| 75 | Gestión de Unidades de Transporte | `https://armorasac.com/app/unidades-transporte/gestion-unidades-transporte` | OK | `app_unidades-transporte_gestion-unidades-transporte__gestión_de_unidades_de_transporte.md` |
| 76 | Reportes Unidades de Transporte | `https://armorasac.com/app/unidades-transporte/reportes-unidades-transporte` | OK | `app_unidades-transporte_reportes-unidades-transporte__reportes_unidades_de_transporte.md` |
| 77 | Gestion de Requisitos de Canjes | `https://armorasac.com/app/premio-canje/gestion-requesitos-canje` | OK | `app_premio-canje_gestion-requesitos-canje__gestion_de_requisitos_de_canjes.md` |
| 78 | Crear Premio de Canje | `https://armorasac.com/app/premio-canje/crear-premio-canje` | OK | `app_premio-canje_crear-premio-canje__crear_premio_de_canje.md` |
| 79 | Gestion de Premios de Canjes | `https://armorasac.com/app/premio-canje/gestion-premios-canjes` | OK | `app_premio-canje_gestion-premios-canjes__gestion_de_premios_de_canjes.md` |
| 80 | Reportes de Premios de Canjes | `https://armorasac.com/app/premio-canje/reportes-premios-canjes` | OK | `app_premio-canje_reportes-premios-canjes__reportes_de_premios_de_canjes.md` |
| 81 | Gestión de Clases y Subclases de Productos | `https://armorasac.com/app/productos/gestion-clases-subclases-productos` | OK | `app_productos_gestion-clases-subclases-productos__gestión_de_clases_y_subclases_de_productos.md` |
| 82 | Crear Producto | `https://armorasac.com/app/productos/crear-producto` | OK | `app_productos_crear-producto__crear_producto.md` |
| 83 | Gestión de Productos | `https://armorasac.com/app/productos/gestion-productos` | OK | `app_productos_gestion-productos__gestión_de_productos.md` |
| 84 | Reportes Productos | `https://armorasac.com/app/productos/reportes-productos` | OK | `app_productos_reportes-productos__reportes_productos.md` |
| 85 | Crear Servicio | `https://armorasac.com/app/servicios/crear-servicio` | OK | `app_servicios_crear-servicio__crear_servicio.md` |
| 86 | Gestión de Servicios | `https://armorasac.com/app/servicios/gestion-servicios` | OK | `app_servicios_gestion-servicios__gestión_de_servicios.md` |
| 87 | Crear Combo | `https://armorasac.com/app/combos/crear-combo` | OK | `app_combos_crear-combo__crear_combo.md` |
| 88 | Gestión de Combos | `https://armorasac.com/app/combos/gestion-combos` | OK | `app_combos_gestion-combos__gestión_de_combos.md` |
| 89 | Reportes de Combos | `https://armorasac.com/app/combos/reportes-combos` | OK | `app_combos_reportes-combos__reportes_de_combos.md` |
| 90 | Crear Concurso | `https://armorasac.com/app/concursos/crear-concurso` | OK | `app_concursos_crear-concurso__crear_concurso.md` |
| 91 | Gestión de Concursos | `https://armorasac.com/app/concursos/gestion-concursos` | OK | `app_concursos_gestion-concursos__gestión_de_concursos.md` |
| 92 | Reportes de Concursos | `https://armorasac.com/app/concursos/reportes-concursos` | OK | `app_concursos_reportes-concursos__reportes_de_concursos.md` |
| 93 | Crear Reporte de Comisiones | `https://armorasac.com/app/comisiones/crear-reporte-comisiones` | OK | `app_comisiones_crear-reporte-comisiones__crear_reporte_de_comisiones.md` |
| 94 | Gestión de Comisiones | `https://armorasac.com/app/comisiones/gestion-comisiones` | OK | `app_comisiones_gestion-comisiones__gestión_de_comisiones.md` |
| 95 | Ajuste de Comisiones | `https://armorasac.com/app/comisiones/ajuste-comisiones` | OK | `app_comisiones_ajuste-comisiones__ajuste_de_comisiones.md` |
| 96 | Crear Reporte de Cobertura | `https://armorasac.com/app/cobertura/crear-reporte-cobertura` | OK | `app_cobertura_crear-reporte-cobertura__crear_reporte_de_cobertura.md` |
| 97 | Gestión de Coberturas | `https://armorasac.com/app/cobertura/gestion-coberturas` | OK | `app_cobertura_gestion-coberturas__gestión_de_coberturas.md` |
| 98 | Crear Lista de Precios | `https://armorasac.com/app/lista-precios/crear-lista-precios` | OK | `app_lista-precios_crear-lista-precios__crear_lista_de_precios.md` |
| 99 | Gestión de Listas de Precios | `https://armorasac.com/app/lista-precios/gestion-listas-precios` | OK | `app_lista-precios_gestion-listas-precios__gestión_de_listas_de_precios.md` |
| 100 | Copiar Listas de Precios | `https://armorasac.com/app/lista-precios/copiar-lista-precios` | OK | `app_lista-precios_copiar-lista-precios__copiar_listas_de_precios.md` |
| 101 | Reportes de Listas de Precios | `https://armorasac.com/app/lista-precios/reportes-listas-precios` | OK | `app_lista-precios_reportes-listas-precios__reportes_de_listas_de_precios.md` |
| 102 | Crear Cliente | `https://armorasac.com/app/vendedor/crear-cliente` | OK | `app_vendedor_crear-cliente__crear_cliente.md` |
| 103 | Clientes | `https://armorasac.com/app/vendedor/clientes` | OK | `app_vendedor_clientes__clientes.md` |
| 104 | Crear Preventa | `https://armorasac.com/app/vendedor/crear-preventa` | OK | `app_vendedor_crear-preventa__crear_preventa.md` |
| 105 | Preventas | `https://armorasac.com/app/vendedor/preventas` | OK | `app_vendedor_preventas__preventas.md` |
| 106 | Ventas | `https://armorasac.com/app/vendedor/ventas` | OK | `app_vendedor_ventas__ventas.md` |
| 107 | Crear Cambio de Productos | `https://armorasac.com/app/vendedor/crear-cambio-producto` | OK | `app_vendedor_crear-cambio-producto__crear_cambio_de_productos.md` |
| 108 | Mis Cambios de Productos | `https://armorasac.com/app/vendedor/cambios-producto` | OK | `app_vendedor_cambios-producto__mis_cambios_de_productos.md` |
| 109 | Crear Canje | `https://armorasac.com/app/vendedor/crear-canje` | OK | `app_vendedor_crear-canje__crear_canje.md` |
| 110 | Mis Canjes | `https://armorasac.com/app/vendedor/canjes` | OK | `app_vendedor_canjes__mis_canjes.md` |
| 111 | Stock Productos | `https://armorasac.com/app/vendedor/stock-productos` | OK | `app_vendedor_stock-productos__stock_productos.md` |
| 112 | Mis Comisiones | `https://armorasac.com/app/vendedor/comisiones` | OK | `app_vendedor_comisiones__mis_comisiones.md` |
| 113 | Mis Concursos | `https://armorasac.com/app/vendedor/concursos` | OK | `app_vendedor_concursos__mis_concursos.md` |
| 114 | Configuración de Empresa | `https://armorasac.com/app/configuracion/configuracion-empresa` | OK | `app_configuracion_configuracion-empresa__configuración_de_empresa.md` |
| 115 | Configuración de Impresión | `https://armorasac.com/app/configuracion/configuracion-impresion` | OK | `app_configuracion_configuracion-impresion__configuración_de_impresión.md` |
| 116 | Configuracion Sunat | `https://armorasac.com/app/configuracion/configuracion-sunat` | ERROR | `` |
| 117 | Configuracion de Alertas | `https://armorasac.com/app/configuracion/configuracion-alertas` | OK | `app_configuracion_configuracion-alertas__configuracion_de_alertas.md` |
| 118 | Mis Devoluciones | `https://armorasac.com/app/transportistas/mis-devoluciones` | OK | `app_transportistas_mis-devoluciones__mis_devoluciones.md` |
| 119 | Mis Requerimientos | `https://armorasac.com/app/transportistas/mis-requerimientos` | OK | `app_transportistas_mis-requerimientos__mis_requerimientos.md` |
| 120 | Mis Liquidaciones | `https://armorasac.com/app/transportistas/mis-liquidaciones` | OK | `app_transportistas_mis-liquidaciones__mis_liquidaciones.md` |