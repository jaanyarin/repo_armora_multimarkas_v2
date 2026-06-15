# Reportes Unidades de Transporte

## Endpoint

- URL: `https://armorasac.com/app/unidades-transporte/reportes-unidades-transporte`
- Path: `/app/unidades-transporte/reportes-unidades-transporte`
- Origen detección: `initial dom`

## Texto visible

```text
Personal: ALEJANDRO ANYARIN Lista Precios: LISTA DE PRECIO M1P Almacen: BROCKER MESA 1 Home Logout Compras Proveedores Preventas Ventas Notas de Credito Informes Cambios de Productos Canjes de Productos Sunat Resumenes Diarios Comunicacion de Baja Requerimientos Liquidaciones Personal Mapas de Rutas Clientes Zonas y Rutas Almacenes Unidades de Trans. Premios Canjes Productos Servicios Combos de Productos Concursos Comisiones Cobertura Listas de Precios Vendedor Configuracion Transportistas General Reportes Unidades de Transporte
```

## Tablas detectadas

```json
[]
```

## Paleta detectada

```json
{
  "top_colors": [
    {
      "color": "rgba(255, 255, 255, 0.9)",
      "count": 1287
    },
    {
      "color": "rgb(0, 0, 0)",
      "count": 718
    },
    {
      "color": "rgba(255, 255, 255, 0.7)",
      "count": 357
    },
    {
      "color": "rgb(255, 255, 255)",
      "count": 82
    },
    {
      "color": "rgba(0, 0, 0, 0.87)",
      "count": 66
    },
    {
      "color": "rgb(27, 28, 29)",
      "count": 12
    },
    {
      "color": "rgb(57, 75, 97)",
      "count": 2
    },
    {
      "color": "rgb(233, 238, 245)",
      "count": 2
    },
    {
      "color": "rgb(218, 218, 218)",
      "count": 1
    },
    {
      "color": "rgb(37, 41, 46)",
      "count": 1
    },
    {
      "color": "rgba(34, 36, 38, 0.15)",
      "count": 1
    },
    {
      "color": "rgb(243, 244, 245)",
      "count": 1
    },
    {
      "color": "rgb(212, 212, 213)",
      "count": 1
    },
    {
      "color": "rgba(0, 0, 0, 0.85)",
      "count": 1
    }
  ],
  "css_variables": {}
}
```

## APIs observadas hasta esta pantalla

```json
[
  {
    "url": "https://armorasac.com/app/general/catalogo/rest/read-configuracion",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/home/rest/read-transportista",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/home/rest/read-subtotales",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/general/perfil-personal/rest/read-perfil",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/home/rest/list-ventas",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": "listaPrecios=-1",
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/general/catalogo/rest/read-status",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/general/catalogo/rest/list-almacen",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/general/catalogo/rest/list-proveedor-with-codigo",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/general/catalogo/rest/list-producto-with-unidad-medida",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/general/perfil-personal/rest/read-perfil",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": null
  },
  {
    "url": "https://armorasac.com/app/general/catalogo/rest/read-configuracion",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"montoBoletaDni\":700.0,\"porcentajeIgv\":18.0,\"preview\":true,\"periodoFechaInicio\":\"2026-01-01\",\"periodoFechaFin\":\"2026-12-31\"}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/read-transportista",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"fechaRequerimientos\":\"2026-06-11\",\"requerimientos\":[],\"series\":[]}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/read-subtotales",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"totalVentas\":0.0,\"totalDevuelto\":0.0,\"total\":0.0}"
  },
  {
    "url": "https://armorasac.com/app/general/perfil-personal/rest/read-perfil",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"codigo\":\"PER260600001\",\"login\":\"alanyarin\",\"nombreCompleto\":\"ALEJANDRO ANYARIN \",\"sexo\":\"Masculino\",\"estadoCivil\":\"Casado\",\"documento\":\"DNI: 42920008\",\"fechaNacimiento\":\"1985-02-28\",\"telefonoFijo\":\"\",\"telefonoCel\":\"980029687\",\"email\":\"\",\"direccion\":\"san joaquin\",\"referencia\":\"\",\"ubigeo\":\"110101\",\"pais\":\"Perú\",\"almacen\":1,\"listaPrecios\":27,\"almacenes\":[{\"value\":1,\"name\":\"BROCKER MESA 1\"}],\"listasPrecios\":[{\"value\":27,\"name\":\"LISTA DE PRECIO M1P\"}],\"permisos\":[{\"categoria\":\"Almacenes\",\"permisos\":[\"Gestion Almacenes\",\"Reportes Almacenes\",\"Gestion de Inventarios\",\"Crear Inventario de Stocks\"]},{\"categoria\":\"Comunicación de Baja\",\"permisos\":[\"Crear Comunicación de Baja\",\"Gestion Comunicaciones de Baja\",\"Reportes Comunicaciones de Baja\"]},{\"categoria\":\"Configuracion\",\"permisos\":[\"Configuracion Empresa\",\"Configuracion Impresión\",\"Configuracion Sunat\",\"Configuracion Alertas\"]},{\"categoria\":\"Clientes\",\"permisos\":[\"Cambio dia Atencion Lotes\",\"Crear Cliente\",\"Gestion Clientes\",\"Habilitar Ventas Clientes\",\"Reportes Clientes\"]},{\"categoria\":\"Compras\",\"permisos\":[\"Crear Compra\",\"Gestion Compras\"]},{\"categoria\":\"Liquidaciones\",\"permisos\":[\"Crear Liquidacion\",\"Gestion de Liquidaciones\",\"Reportes de Liquidaciones\"]},{\"categoria\":\"Listas de Precios\",\"permisos\":[\"Copiar Listas de Precios\",\"Crear Lista de Precios\",\"Gestion de Listas de Precios\",\"Reportes Listas de Precios\"]},{\"categoria\":\"Notas de Credito\",\"permisos\":[\"Gestion de Notas de Credito\",\"Impresión de Notas de Credito\",\"Reportes de Notas de Credito\",\"Devoluciones Transportistas\"]},{\"categoria\":\"Personal\",\"permisos\":[\"Crear Personal\",\"Gestion del Personal\",\"Reportes del Personal\"]},{\"categoria\":\"Productos\",\"permisos\":[\"Crear Producto\",\"Gestion de Clases y Subclases\",\"Gestion de Productos\",\"Reportes de Productos\"]},{\"categoria\":\"Proveedores\",\"permisos\":[\"Crear Proveedor\",\"Gestion Proveedores\"]},{\"categoria\":\"Preventas\",\"permisos\":[\"Gestion Preventas\",\"Reportes Preventas\"]},{\"categoria\":\"Resumen Diario\",\"permisos\":[\"Crear Resumen Diario\",\"Gestion de Resumenes Diarios\",\"Reportes de Resumenes Diarios\"]},{\"categoria\":\"Requerimientos\",\"permisos\":[\"Crear Requerimiento\",\"Gestion de Requerimientos\",\"Reportes de Requerimientos\"]},{\"categoria\":\"Sunat\",\"permisos\":[\"Gestion Envios Sunat\",\"Reportes Envios Sunat\",\"Envios Pendientes Sunat\"]},{\"categoria\":\"Transferencias\",\"permisos\":[\"Crear Transferencia\",\"Gestion de Transferencias\",\"Reportes de Transferencias\"]},{\"categoria\":\"Unidades de Transporte\",\"permisos\":[\"Crear Unidad de Transporte\",\"Gestion de Unidades de Transporte\",\"Reportes de Unidades de Transporte\"]},{\"categoria\":\"Vendedor\",\"permisos\":[\"Crear Cliente\",\"Gestion de Clientes\",\"Crear Preventa\",\"Gestion de Preventas\",\"Stock Productos\",\"Gestion de Ventas\",\"Crear Cambio Producto\",\"Gestion de Cambios de Producto\",\"Crear Canje\",\"Gestion de Canjes\",\"Gestion de Comisiones\",\"Gestion de Concursos\"]},{\"categoria\":\"Ventas\",\"permisos\":[\"Crear Venta\",\"Gestion Ventas\",\"Impresión Ventas\",\"Reportes de Ventas\",\"Gestion de Notas de Pedido\",\"Entregas Parciales\",\"Crear Venta de Servicios\",\"Puntos de Ventas\",\"Fileteo Automatico\"]},{\"categoria\":\"Zonas y Rutas\",\"permisos\":[\"Gestion Zonas y Rutas\",\"Habilitar Ventas\",\"Reportes de Zonas y Rutas\"]},{\"categoria\":\"Comisiones\",\"permisos\":[\"Crear Reporte de Comision\",\"Gestion de Comisiones\",\"Ajuste de Comisiones\"]},{\"categoria\":\"Cobertura\",\"permisos\":[\"Crear Reporte de Cobertura\",\"Gestion de Coberturas\"]},{\"categoria\":\"Canjes\",\"permisos\":[\"Crear Canje\",\"Gestion de Canjes\",\"Reportes de Canjes\",\"Asignar Fecha Entrega Canjes\",\"Crear Reporte Canjes\",\"Gestion de Reportes Canjes\",\"Impresión de Canjes\"]},{\"categoria\":\"Concursos\",\"permisos\":[\"Crear Concurso\",\"Gestion de Concursos\",\"Reportes de Concursos\"]},{\"categoria\":\"Combos\",\"permisos\":[\"Crear Combo\",\"Gestion de Combos\",\"Reportes de Combos\"]},{\"categoria\":\"Cambios\",\"permisos\":[\"Crear Cambio Producto\",\"Gestion de Cambios de Producto\",\"Asignar Fecha Entrega Cambios\",\"Crear Reporte Cambios de Productos\",\"Gestion de Reportes Cambios de Productos\",\"Impresión de Cambios de Productos\",\"Reportes de Cambios\"]},{\"categoria\":\"Informes\",\"permisos\":[\"Informes de Requerimientos\",\"Informes de Liquidaciones\",\"Informes de Almacenes\",\"Informes de Entregas Parciales\"]},{\"categoria\":\"Mapas de Rutas\",\"permisos\":[\"Crear Mapa de Rutas\",\"Gestion de Mapas de Rutas\",\"Reportes de Mapas de Rutas\"]},{\"categoria\":\"Premios de Canjes\",\"permisos\":[\"Gestion de Requisitos de Canje\",\"Crear Premio de Canje\",\"Gestion de Premio de Canje\",\"Reporte de Premios de Canjes\"]},{\"categoria\":\"Transportista\",\"permisos\":[\"Mis Devoluciones\",\"Mis Requerimientos\",\"Mis Liquidaciones\"]},{\"categoria\":\"Servicios\",\"permisos\":[\"Crear Servicio\",\"Gestion de Servicios\"]}],\"rutas\":[{\"zona\":\"ICA G\",\"rutas\":[\"10\",\"60\",\"40\",\"50\",\"30\",\"20\"]},{\"zona\":\"DISTRIBUIDORES\",\"rutas\":[\"10\"]},{\"zona\":\"ICA E\",\"rutas\":[\"40\",\"20\",\"50\",\"30\",\"60\",\"10\"]},{\"zona\":\"ICA C\",\"rutas\":[\"60\",\"40\",\"30\",\"10\",\"20\",\"50\"]},{\"zona\":\"ICA J\",\"rutas\":[\"40\",\"10\",\"60\",\"20\",\"30\",\"50\"]},{\"zona\":\"ICA D\",\"rutas\":[\"40\",\"50\",\"30\",\"60\",\"10\",\"20\"]},{\"zona\":\"ICA F\",\"rutas\":[\"50\",\"30\",\"20\",\"60\",\"10\",\"40\"]},{\"zona\":\"ICA A\",\"rutas\":[\"20\",\"60\",\"40\",\"50\",\"30\",\"10\"]},{\"zona\":\"ICA I\",\"rutas\":[\"10\",\"50\",\"20\",\"30\",\"40\",\"60\"]},{\"zona\":\"ICA B\",\"rutas\":[\"10\",\"50\",\"30\",\"20\",\"40\",\"60\"]},{\"zona\":\"ICA H\",\"rutas\":[\"30\",\"20\",\"10\",\"50\",\"60\",\"40\"]},{\"zona\":\"MERCADOS F\",\"rutas\":[\"10\",\"20\",\"30\",\"40\",\"50\",\"60\"]},{\"zona\":\"MERCADOS E\",\"rutas\":[\"10\",\"20\",\"30\",\"40\",\"50\",\"60\"]},{\"zona\":\"ICA K\",\"rutas\":[\"30\",\"20\",\"50\",\"10\",\"60\",\"40\"]}]}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/list-ventas",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": "listaPrecios=-1",
    "response_preview": "{\"data\":true,\"fechaInicio\":\"2026-06-01\",\"fechaFin\":\"2026-06-30\",\"totalVentas\":\"0.00\",\"totalDevolucion\":\"0.00\",\"total\":\"0.00\",\"ventas\":[],\"devoluciones\":[]}"
  },
  {
    "url": "https://armorasac.com/app/general/catalogo/rest/read-configuracion",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"montoBoletaDni\":700.0,\"porcentajeIgv\":18.0,\"preview\":true,\"periodoFechaInicio\":\"2026-01-01\",\"periodoFechaFin\":\"2026-12-31\"}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/read-transportista",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"fechaRequerimientos\":\"2026-06-11\",\"requerimientos\":[],\"series\":[]}"
  },
  {
    "url": "https://armorasac.com/app/general/perfil-personal/rest/read-perfil",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"codigo\":\"PER260600001\",\"login\":\"alanyarin\",\"nombreCompleto\":\"ALEJANDRO ANYARIN \",\"sexo\":\"Masculino\",\"estadoCivil\":\"Casado\",\"documento\":\"DNI: 42920008\",\"fechaNacimiento\":\"1985-02-28\",\"telefonoFijo\":\"\",\"telefonoCel\":\"980029687\",\"email\":\"\",\"direccion\":\"san joaquin\",\"referencia\":\"\",\"ubigeo\":\"110101\",\"pais\":\"Perú\",\"almacen\":1,\"listaPrecios\":27,\"almacenes\":[{\"value\":1,\"name\":\"BROCKER MESA 1\"}],\"listasPrecios\":[{\"value\":27,\"name\":\"LISTA DE PRECIO M1P\"}],\"permisos\":[{\"categoria\":\"Almacenes\",\"permisos\":[\"Gestion Almacenes\",\"Reportes Almacenes\",\"Gestion de Inventarios\",\"Crear Inventario de Stocks\"]},{\"categoria\":\"Comunicación de Baja\",\"permisos\":[\"Crear Comunicación de Baja\",\"Gestion Comunicaciones de Baja\",\"Reportes Comunicaciones de Baja\"]},{\"categoria\":\"Configuracion\",\"permisos\":[\"Configuracion Empresa\",\"Configuracion Impresión\",\"Configuracion Sunat\",\"Configuracion Alertas\"]},{\"categoria\":\"Clientes\",\"permisos\":[\"Cambio dia Atencion Lotes\",\"Crear Cliente\",\"Gestion Clientes\",\"Habilitar Ventas Clientes\",\"Reportes Clientes\"]},{\"categoria\":\"Compras\",\"permisos\":[\"Crear Compra\",\"Gestion Compras\"]},{\"categoria\":\"Liquidaciones\",\"permisos\":[\"Crear Liquidacion\",\"Gestion de Liquidaciones\",\"Reportes de Liquidaciones\"]},{\"categoria\":\"Listas de Precios\",\"permisos\":[\"Copiar Listas de Precios\",\"Crear Lista de Precios\",\"Gestion de Listas de Precios\",\"Reportes Listas de Precios\"]},{\"categoria\":\"Notas de Credito\",\"permisos\":[\"Gestion de Notas de Credito\",\"Impresión de Notas de Credito\",\"Reportes de Notas de Credito\",\"Devoluciones Transportistas\"]},{\"categoria\":\"Personal\",\"permisos\":[\"Crear Personal\",\"Gestion del Personal\",\"Reportes del Personal\"]},{\"categoria\":\"Productos\",\"permisos\":[\"Crear Producto\",\"Gestion de Clases y Subclases\",\"Gestion de Productos\",\"Reportes de Productos\"]},{\"categoria\":\"Proveedores\",\"permisos\":[\"Crear Proveedor\",\"Gestion Proveedores\"]},{\"categoria\":\"Preventas\",\"permisos\":[\"Gestion Preventas\",\"Reportes Preventas\"]},{\"categoria\":\"Resumen Diario\",\"permisos\":[\"Crear Resumen Diario\",\"Gestion de Resumenes Diarios\",\"Reportes de Resumenes Diarios\"]},{\"categoria\":\"Requerimientos\",\"permisos\":[\"Crear Requerimiento\",\"Gestion de Requerimientos\",\"Reportes de Requerimientos\"]},{\"categoria\":\"Sunat\",\"permisos\":[\"Gestion Envios Sunat\",\"Reportes Envios Sunat\",\"Envios Pendientes Sunat\"]},{\"categoria\":\"Transferencias\",\"permisos\":[\"Crear Transferencia\",\"Gestion de Transferencias\",\"Reportes de Transferencias\"]},{\"categoria\":\"Unidades de Transporte\",\"permisos\":[\"Crear Unidad de Transporte\",\"Gestion de Unidades de Transporte\",\"Reportes de Unidades de Transporte\"]},{\"categoria\":\"Vendedor\",\"permisos\":[\"Crear Cliente\",\"Gestion de Clientes\",\"Crear Preventa\",\"Gestion de Preventas\",\"Stock Productos\",\"Gestion de Ventas\",\"Crear Cambio Producto\",\"Gestion de Cambios de Producto\",\"Crear Canje\",\"Gestion de Canjes\",\"Gestion de Comisiones\",\"Gestion de Concursos\"]},{\"categoria\":\"Ventas\",\"permisos\":[\"Crear Venta\",\"Gestion Ventas\",\"Impresión Ventas\",\"Reportes de Ventas\",\"Gestion de Notas de Pedido\",\"Entregas Parciales\",\"Crear Venta de Servicios\",\"Puntos de Ventas\",\"Fileteo Automatico\"]},{\"categoria\":\"Zonas y Rutas\",\"permisos\":[\"Gestion Zonas y Rutas\",\"Habilitar Ventas\",\"Reportes de Zonas y Rutas\"]},{\"categoria\":\"Comisiones\",\"permisos\":[\"Crear Reporte de Comision\",\"Gestion de Comisiones\",\"Ajuste de Comisiones\"]},{\"categoria\":\"Cobertura\",\"permisos\":[\"Crear Reporte de Cobertura\",\"Gestion de Coberturas\"]},{\"categoria\":\"Canjes\",\"permisos\":[\"Crear Canje\",\"Gestion de Canjes\",\"Reportes de Canjes\",\"Asignar Fecha Entrega Canjes\",\"Crear Reporte Canjes\",\"Gestion de Reportes Canjes\",\"Impresión de Canjes\"]},{\"categoria\":\"Concursos\",\"permisos\":[\"Crear Concurso\",\"Gestion de Concursos\",\"Reportes de Concursos\"]},{\"categoria\":\"Combos\",\"permisos\":[\"Crear Combo\",\"Gestion de Combos\",\"Reportes de Combos\"]},{\"categoria\":\"Cambios\",\"permisos\":[\"Crear Cambio Producto\",\"Gestion de Cambios de Producto\",\"Asignar Fecha Entrega Cambios\",\"Crear Reporte Cambios de Productos\",\"Gestion de Reportes Cambios de Productos\",\"Impresión de Cambios de Productos\",\"Reportes de Cambios\"]},{\"categoria\":\"Informes\",\"permisos\":[\"Informes de Requerimientos\",\"Informes de Liquidaciones\",\"Informes de Almacenes\",\"Informes de Entregas Parciales\"]},{\"categoria\":\"Mapas de Rutas\",\"permisos\":[\"Crear Mapa de Rutas\",\"Gestion de Mapas de Rutas\",\"Reportes de Mapas de Rutas\"]},{\"categoria\":\"Premios de Canjes\",\"permisos\":[\"Gestion de Requisitos de Canje\",\"Crear Premio de Canje\",\"Gestion de Premio de Canje\",\"Reporte de Premios de Canjes\"]},{\"categoria\":\"Transportista\",\"permisos\":[\"Mis Devoluciones\",\"Mis Requerimientos\",\"Mis Liquidaciones\"]},{\"categoria\":\"Servicios\",\"permisos\":[\"Crear Servicio\",\"Gestion de Servicios\"]}],\"rutas\":[{\"zona\":\"ICA G\",\"rutas\":[\"10\",\"60\",\"40\",\"50\",\"30\",\"20\"]},{\"zona\":\"DISTRIBUIDORES\",\"rutas\":[\"10\"]},{\"zona\":\"ICA E\",\"rutas\":[\"40\",\"20\",\"50\",\"30\",\"60\",\"10\"]},{\"zona\":\"ICA C\",\"rutas\":[\"60\",\"40\",\"30\",\"10\",\"20\",\"50\"]},{\"zona\":\"ICA J\",\"rutas\":[\"40\",\"10\",\"60\",\"20\",\"30\",\"50\"]},{\"zona\":\"ICA D\",\"rutas\":[\"40\",\"50\",\"30\",\"60\",\"10\",\"20\"]},{\"zona\":\"ICA F\",\"rutas\":[\"50\",\"30\",\"20\",\"60\",\"10\",\"40\"]},{\"zona\":\"ICA A\",\"rutas\":[\"20\",\"60\",\"40\",\"50\",\"30\",\"10\"]},{\"zona\":\"ICA I\",\"rutas\":[\"10\",\"50\",\"20\",\"30\",\"40\",\"60\"]},{\"zona\":\"ICA B\",\"rutas\":[\"10\",\"50\",\"30\",\"20\",\"40\",\"60\"]},{\"zona\":\"ICA H\",\"rutas\":[\"30\",\"20\",\"10\",\"50\",\"60\",\"40\"]},{\"zona\":\"MERCADOS F\",\"rutas\":[\"10\",\"20\",\"30\",\"40\",\"50\",\"60\"]},{\"zona\":\"MERCADOS E\",\"rutas\":[\"10\",\"20\",\"30\",\"40\",\"50\",\"60\"]},{\"zona\":\"ICA K\",\"rutas\":[\"30\",\"20\",\"50\",\"10\",\"60\",\"40\"]}]}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/read-subtotales",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"totalVentas\":0.0,\"totalDevuelto\":0.0,\"total\":0.0}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/list-ventas",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": "listaPrecios=-1",
    "response_preview": "{\"data\":true,\"fechaInicio\":\"2026-06-01\",\"fechaFin\":\"2026-06-30\",\"totalVentas\":\"0.00\",\"totalDevolucion\":\"0.00\",\"total\":\"0.00\",\"ventas\":[],\"devoluciones\":[]}"
  },
  {
    "url": "https://armorasac.com/app/general/catalogo/rest/read-configuracion",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"montoBoletaDni\":700.0,\"porcentajeIgv\":18.0,\"preview\":true,\"periodoFechaInicio\":\"2026-01-01\",\"periodoFechaFin\":\"2026-12-31\"}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/read-transportista",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"fechaRequerimientos\":\"2026-06-11\",\"requerimientos\":[],\"series\":[]}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/read-subtotales",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"totalVentas\":0.0,\"totalDevuelto\":0.0,\"total\":0.0}"
  },
  {
    "url": "https://armorasac.com/app/general/perfil-personal/rest/read-perfil",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"codigo\":\"PER260600001\",\"login\":\"alanyarin\",\"nombreCompleto\":\"ALEJANDRO ANYARIN \",\"sexo\":\"Masculino\",\"estadoCivil\":\"Casado\",\"documento\":\"DNI: 42920008\",\"fechaNacimiento\":\"1985-02-28\",\"telefonoFijo\":\"\",\"telefonoCel\":\"980029687\",\"email\":\"\",\"direccion\":\"san joaquin\",\"referencia\":\"\",\"ubigeo\":\"110101\",\"pais\":\"Perú\",\"almacen\":1,\"listaPrecios\":27,\"almacenes\":[{\"value\":1,\"name\":\"BROCKER MESA 1\"}],\"listasPrecios\":[{\"value\":27,\"name\":\"LISTA DE PRECIO M1P\"}],\"permisos\":[{\"categoria\":\"Almacenes\",\"permisos\":[\"Gestion Almacenes\",\"Reportes Almacenes\",\"Gestion de Inventarios\",\"Crear Inventario de Stocks\"]},{\"categoria\":\"Comunicación de Baja\",\"permisos\":[\"Crear Comunicación de Baja\",\"Gestion Comunicaciones de Baja\",\"Reportes Comunicaciones de Baja\"]},{\"categoria\":\"Configuracion\",\"permisos\":[\"Configuracion Empresa\",\"Configuracion Impresión\",\"Configuracion Sunat\",\"Configuracion Alertas\"]},{\"categoria\":\"Clientes\",\"permisos\":[\"Cambio dia Atencion Lotes\",\"Crear Cliente\",\"Gestion Clientes\",\"Habilitar Ventas Clientes\",\"Reportes Clientes\"]},{\"categoria\":\"Compras\",\"permisos\":[\"Crear Compra\",\"Gestion Compras\"]},{\"categoria\":\"Liquidaciones\",\"permisos\":[\"Crear Liquidacion\",\"Gestion de Liquidaciones\",\"Reportes de Liquidaciones\"]},{\"categoria\":\"Listas de Precios\",\"permisos\":[\"Copiar Listas de Precios\",\"Crear Lista de Precios\",\"Gestion de Listas de Precios\",\"Reportes Listas de Precios\"]},{\"categoria\":\"Notas de Credito\",\"permisos\":[\"Gestion de Notas de Credito\",\"Impresión de Notas de Credito\",\"Reportes de Notas de Credito\",\"Devoluciones Transportistas\"]},{\"categoria\":\"Personal\",\"permisos\":[\"Crear Personal\",\"Gestion del Personal\",\"Reportes del Personal\"]},{\"categoria\":\"Productos\",\"permisos\":[\"Crear Producto\",\"Gestion de Clases y Subclases\",\"Gestion de Productos\",\"Reportes de Productos\"]},{\"categoria\":\"Proveedores\",\"permisos\":[\"Crear Proveedor\",\"Gestion Proveedores\"]},{\"categoria\":\"Preventas\",\"permisos\":[\"Gestion Preventas\",\"Reportes Preventas\"]},{\"categoria\":\"Resumen Diario\",\"permisos\":[\"Crear Resumen Diario\",\"Gestion de Resumenes Diarios\",\"Reportes de Resumenes Diarios\"]},{\"categoria\":\"Requerimientos\",\"permisos\":[\"Crear Requerimiento\",\"Gestion de Requerimientos\",\"Reportes de Requerimientos\"]},{\"categoria\":\"Sunat\",\"permisos\":[\"Gestion Envios Sunat\",\"Reportes Envios Sunat\",\"Envios Pendientes Sunat\"]},{\"categoria\":\"Transferencias\",\"permisos\":[\"Crear Transferencia\",\"Gestion de Transferencias\",\"Reportes de Transferencias\"]},{\"categoria\":\"Unidades de Transporte\",\"permisos\":[\"Crear Unidad de Transporte\",\"Gestion de Unidades de Transporte\",\"Reportes de Unidades de Transporte\"]},{\"categoria\":\"Vendedor\",\"permisos\":[\"Crear Cliente\",\"Gestion de Clientes\",\"Crear Preventa\",\"Gestion de Preventas\",\"Stock Productos\",\"Gestion de Ventas\",\"Crear Cambio Producto\",\"Gestion de Cambios de Producto\",\"Crear Canje\",\"Gestion de Canjes\",\"Gestion de Comisiones\",\"Gestion de Concursos\"]},{\"categoria\":\"Ventas\",\"permisos\":[\"Crear Venta\",\"Gestion Ventas\",\"Impresión Ventas\",\"Reportes de Ventas\",\"Gestion de Notas de Pedido\",\"Entregas Parciales\",\"Crear Venta de Servicios\",\"Puntos de Ventas\",\"Fileteo Automatico\"]},{\"categoria\":\"Zonas y Rutas\",\"permisos\":[\"Gestion Zonas y Rutas\",\"Habilitar Ventas\",\"Reportes de Zonas y Rutas\"]},{\"categoria\":\"Comisiones\",\"permisos\":[\"Crear Reporte de Comision\",\"Gestion de Comisiones\",\"Ajuste de Comisiones\"]},{\"categoria\":\"Cobertura\",\"permisos\":[\"Crear Reporte de Cobertura\",\"Gestion de Coberturas\"]},{\"categoria\":\"Canjes\",\"permisos\":[\"Crear Canje\",\"Gestion de Canjes\",\"Reportes de Canjes\",\"Asignar Fecha Entrega Canjes\",\"Crear Reporte Canjes\",\"Gestion de Reportes Canjes\",\"Impresión de Canjes\"]},{\"categoria\":\"Concursos\",\"permisos\":[\"Crear Concurso\",\"Gestion de Concursos\",\"Reportes de Concursos\"]},{\"categoria\":\"Combos\",\"permisos\":[\"Crear Combo\",\"Gestion de Combos\",\"Reportes de Combos\"]},{\"categoria\":\"Cambios\",\"permisos\":[\"Crear Cambio Producto\",\"Gestion de Cambios de Producto\",\"Asignar Fecha Entrega Cambios\",\"Crear Reporte Cambios de Productos\",\"Gestion de Reportes Cambios de Productos\",\"Impresión de Cambios de Productos\",\"Reportes de Cambios\"]},{\"categoria\":\"Informes\",\"permisos\":[\"Informes de Requerimientos\",\"Informes de Liquidaciones\",\"Informes de Almacenes\",\"Informes de Entregas Parciales\"]},{\"categoria\":\"Mapas de Rutas\",\"permisos\":[\"Crear Mapa de Rutas\",\"Gestion de Mapas de Rutas\",\"Reportes de Mapas de Rutas\"]},{\"categoria\":\"Premios de Canjes\",\"permisos\":[\"Gestion de Requisitos de Canje\",\"Crear Premio de Canje\",\"Gestion de Premio de Canje\",\"Reporte de Premios de Canjes\"]},{\"categoria\":\"Transportista\",\"permisos\":[\"Mis Devoluciones\",\"Mis Requerimientos\",\"Mis Liquidaciones\"]},{\"categoria\":\"Servicios\",\"permisos\":[\"Crear Servicio\",\"Gestion de Servicios\"]}],\"rutas\":[{\"zona\":\"ICA G\",\"rutas\":[\"10\",\"60\",\"40\",\"50\",\"30\",\"20\"]},{\"zona\":\"DISTRIBUIDORES\",\"rutas\":[\"10\"]},{\"zona\":\"ICA E\",\"rutas\":[\"40\",\"20\",\"50\",\"30\",\"60\",\"10\"]},{\"zona\":\"ICA C\",\"rutas\":[\"60\",\"40\",\"30\",\"10\",\"20\",\"50\"]},{\"zona\":\"ICA J\",\"rutas\":[\"40\",\"10\",\"60\",\"20\",\"30\",\"50\"]},{\"zona\":\"ICA D\",\"rutas\":[\"40\",\"50\",\"30\",\"60\",\"10\",\"20\"]},{\"zona\":\"ICA F\",\"rutas\":[\"50\",\"30\",\"20\",\"60\",\"10\",\"40\"]},{\"zona\":\"ICA A\",\"rutas\":[\"20\",\"60\",\"40\",\"50\",\"30\",\"10\"]},{\"zona\":\"ICA I\",\"rutas\":[\"10\",\"50\",\"20\",\"30\",\"40\",\"60\"]},{\"zona\":\"ICA B\",\"rutas\":[\"10\",\"50\",\"30\",\"20\",\"40\",\"60\"]},{\"zona\":\"ICA H\",\"rutas\":[\"30\",\"20\",\"10\",\"50\",\"60\",\"40\"]},{\"zona\":\"MERCADOS F\",\"rutas\":[\"10\",\"20\",\"30\",\"40\",\"50\",\"60\"]},{\"zona\":\"MERCADOS E\",\"rutas\":[\"10\",\"20\",\"30\",\"40\",\"50\",\"60\"]},{\"zona\":\"ICA K\",\"rutas\":[\"30\",\"20\",\"50\",\"10\",\"60\",\"40\"]}]}"
  },
  {
    "url": "https://armorasac.com/app/home/rest/list-ventas",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": "listaPrecios=-1",
    "response_preview": "{\"data\":true,\"fechaInicio\":\"2026-06-01\",\"fechaFin\":\"2026-06-30\",\"totalVentas\":\"0.00\",\"totalDevolucion\":\"0.00\",\"total\":\"0.00\",\"ventas\":[],\"devoluciones\":[]}"
  },
  {
    "url": "https://armorasac.com/app/general/perfil-personal/rest/read-perfil",
    "method": "POST",
    "status": 200,
    "resource_type": "xhr",
    "content_type": "application/json;charset=UTF-8",
    "post_data": null,
    "response_preview": "{\"codigo\":\"PER260600001\",\"login\":\"alanyarin\",\"nombreCompleto\":\"ALEJANDRO ANYARIN \",\"sexo\":\"Masculino\",\"estadoCivil\":\"Casado\",\"documento\":\"DNI: 42920008\",\"fechaNacimiento\":\"1985-02-28\",\"telefonoFijo\":\"\",\"telefonoCel\":\"980029687\",\"email\":\"\",\"direccion\":\"san joaquin\",\"referencia\":\"\",\"ubigeo\":\"110101\",\"pais\":\"Perú\",\"almacen\":1,\"listaPrecios\":27,\"almacenes\":[{\"value\":1,\"name\":\"BROCKER MESA 1\"}],\"listasPrecios\":[{\"value\":27,\"name\":\"LISTA DE PRECIO M1P\"}],\"permisos\":[{\"categoria\":\"Almacenes\",\"permisos\":[\"Gestion Almacenes\",\"Reportes Almacenes\",\"Gestion de Inventarios\",\"Crear Inventario de Stocks\"]},{\"categoria\":\"Comunicación de Baja\",\"permisos\":[\"Crear Comunicación de Baja\",\"Gestion Comunicaciones de Baja\",\"Reportes Comunicaciones de Baja\"]},{\"categoria\":\"Configuracion\",\"permisos\":[\"Configuracion Empresa\",\"Configuracion Impresión\",\"Configuracion Sunat\",\"Configuracion Alertas\"]},{\"categoria\":\"Clientes\",\"permisos\":[\"Cambio dia Atencion Lotes\",\"Crear Cliente\",\"Gestion Clientes\",\"Habilitar Ventas Clientes\",\"Reportes Clientes\"]},{\"categoria\":\"Compras\",\"permisos\":[\"Crear Compra\",\"Gestion Compras\"]},{\"categoria\":\"Liquidaciones\",\"permisos\":[\"Crear Liquidacion\",\"Gestion de Liquidaciones\",\"Reportes de Liquidaciones\"]},{\"categoria\":\"Listas de Precios\",\"permisos\":[\"Copiar Listas de Precios\",\"Crear Lista de Precios\",\"Gestion de Listas de Precios\",\"Reportes Listas de Precios\"]},{\"categoria\":\"Notas de Credito\",\"permisos\":[\"Gestion de Notas de Credito\",\"Impresión de Notas de Credito\",\"Reportes de Notas de Credito\",\"Devoluciones Transportistas\"]},{\"categoria\":\"Personal\",\"permisos\":[\"Crear Personal\",\"Gestion del Personal\",\"Reportes del Personal\"]},{\"categoria\":\"Productos\",\"permisos\":[\"Crear Producto\",\"Gestion de Clases y Subclases\",\"Gestion de Productos\",\"Reportes de Productos\"]},{\"categoria\":\"Proveedores\",\"permisos\":[\"Crear Proveedor\",\"Gestion Proveedores\"]},{\"categoria\":\"Preventas\",\"permisos\":[\"Gestion Preventas\",\"Reportes Preventas\"]},{\"categoria\":\"Resumen Diario\",\"permisos\":[\"Crear Resumen Diario\",\"Gestion de Resumenes Diarios\",\"Reportes de Resumenes Diarios\"]},{\"categoria\":\"Requerimientos\",\"permisos\":[\"Crear Requerimiento\",\"Gestion de Requerimientos\",\"Reportes de Requerimientos\"]},{\"categoria\":\"Sunat\",\"permisos\":[\"Gestion Envios Sunat\",\"Reportes Envios Sunat\",\"Envios Pendientes Sunat\"]},{\"categoria\":\"Transferencias\",\"permisos\":[\"Crear Transferencia\",\"Gestion de Transferencias\",\"Reportes de Transferencias\"]},{\"categoria\":\"Unidades de Transporte\",\"permisos\":[\"Crear Unidad de Transporte\",\"Gestion de Unidades de Transporte\",\"Reportes de Unidades de Transporte\"]},{\"categoria\":\"Vendedor\",\"permisos\":[\"Crear Cliente\",\"Gestion de Clientes\",\"Crear Preventa\",\"Gestion de Preventas\",\"Stock Productos\",\"Gestion de Ventas\",\"Crear Cambio Producto\",\"Gestion de Cambios de Producto\",\"Crear Canje\",\"Gestion de Canjes\",\"Gestion de Comisiones
```

## HTML guardado

Archivo HTML: `app_unidades-transporte_reportes-unidades-transporte__reportes_unidades_de_transporte.html`

## Screenshot

Archivo PNG: `app_unidades-transporte_reportes-unidades-transporte__reportes_unidades_de_transporte.png`
