# Diagnostico del sistema actual

## Resumen observado

El scraping detecto una aplicacion web administrativa bajo `https://armorasac.com/app/` con:

- 120 rutas funcionales detectadas.
- 120 endpoints procesados por el scraper.
- 235 llamadas API/XHR detectadas.
- Interfaz basada en HTML server-rendered, jQuery y librerias UI antiguas.
- Rutas de negocio con patron `/app/{modulo}/{pantalla}`.
- APIs internas con patron `/app/{modulo}/{pantalla}/rest/{accion}` y metodo predominante `POST`.

## Stack detectado

Observado directamente:

- Frontend: jQuery `3.4.1`.
- UI/CSS: Semantic UI customizado (`semantic-dyvent`).
- Tablas: DataTables customizado (`datatables.dyvent`).
- Componentes auxiliares: quicksearch, multiselect, calendar, Moment.js, Chart.js.
- Estilos globales: `page.css`, `tableflip.css`.
- Tipografia: Google Font Lato.
- Seguridad HTTP visible: HSTS, `x-frame-options: DENY`, `x-content-type-options: nosniff`.

Inferido con baja/mediana confianza:

- Backend server-rendered, probablemente Java/JVM o framework MVC tradicional. El scraping no expone codigo backend ni cabeceras suficientes para confirmarlo.
- Sesion basada en cookies; varias rutas protegidas redirigen a `/app/login` cuando la sesion no esta activa.
- API interna acoplada a pantallas, no una API publica versionada.

No detectado:

- React, Vue, Angular o SPA moderna.
- API REST versionada tipo `/api/v1`.
- GraphQL.
- OpenAPI/Swagger.
- App mobile nativa.

## Modulos observados

Los modulos principales detectados por rutas son:

- Compras: crear y gestionar compras.
- Proveedores: crear y gestionar proveedores.
- Preventas.
- Ventas: crear venta, servicios, notas de pedido, entregas parciales, impresion, reportes.
- Notas de credito.
- Clientes: crear, gestionar, habilitar ventas, dia de atencion, reportes.
- Zonas y rutas.
- Almacenes: gestion, reportes, inventario de stock, inventarios.
- Productos: clases, subclases, crear, gestionar, reportes.
- Listas de precios.
- Personal/usuarios.
- Configuracion: empresa, impresion, SUNAT, alertas.
- SUNAT: envios pendientes, gestion, reportes.
- Requerimientos, liquidaciones, resumen diario.
- Vendedor: clientes, preventas, ventas, stock, comisiones, concursos, canjes, cambios.
- Transportistas: devoluciones, requerimientos, liquidaciones.
- Combos, concursos, canjes, premios de canje, cambios de producto.
- Informes y mapas de rutas.

## APIs detectadas representativas

Catalogos globales:

- `/app/general/catalogo/rest/read-configuracion`
- `/app/general/catalogo/rest/read-status`
- `/app/general/catalogo/rest/list-almacen`
- `/app/general/catalogo/rest/list-proveedor-with-codigo`
- `/app/general/catalogo/rest/list-producto-with-unidad-medida`
- `/app/general/catalogo/rest/list-lista-precios`
- `/app/general/catalogo/rest/list-ruta-with-zona`
- `/app/general/catalogo/rest/list-rol-with-rol-categoria`

Perfil y permisos:

- `/app/general/perfil-personal/rest/read-perfil`

Gestion operativa:

- `/app/proveedores/gestion-proveedores/rest/list-proveedores`
- `/app/personal/gestion-personal/rest/list-personal`
- `/app/almacenes/gestion-almacenes/rest/list-almacenes`
- `/app/productos/gestion-productos/rest/list-productos`
- `/app/productos/gestion-clases-subclases-productos/rest/list-producto-clases`
- `/app/productos/gestion-clases-subclases-productos/rest/list-producto-subclases`
- `/app/lista-precios/gestion-listas-precios/rest/list-lista-precios`
- `/app/vendedor/stock-productos/rest/list-productos`
- `/app/vendedor/comisiones/rest/read-comisiones`

Configuracion:

- `/app/configuracion/configuracion-empresa/rest/read-empresa-principal`
- `/app/configuracion/configuracion-impresion/rest/read-configuracion-impresion`
- `/app/configuracion/configuracion-sunat/rest/read-configuracion-sunat`
- `/app/configuracion/configuracion-alertas/rest/read-configuracion-alertas`

## Hallazgos funcionales importantes

El sistema actual no es solo una tienda: es un ERP de distribucion con ventas, rutas, almacenes, personal, listas de precios, SUNAT, liquidaciones, comisiones y transportistas. El nuevo proyecto debe evitar reducir el alcance a "ecommerce"; el ecommerce debe montarse sobre un nucleo transaccional de inventario, pedidos y facturacion.

El perfil de usuario contiene permisos por categoria, almacenes asignados, lista de precios y rutas. Esto sugiere que el nuevo sistema debe tener RBAC granular y reglas de visibilidad por almacen, proveedor, cliente, zona/ruta y lista de precios.

## Limites del scraping

- Varias paginas individuales redirigieron a login, por lo que algunos MD muestran solo formulario de login.
- Las respuestas API vistas son previews y pueden contener datos reales parciales.
- No se detecto esquema de base de datos.
- No se detecto codigo backend.
- No se puede afirmar el framework backend actual sin acceso al servidor o repositorio.

## Decision para el nuevo proyecto

No conviene replicar el stack actual. jQuery + pantallas acopladas a endpoints internos limita:

- Mobile real para clientes y proveedores.
- Contratos API estables.
- Escalabilidad de permisos por rol y perfil.
- Offline/low-connectivity en almacen o ventas.
- Pagos futuros.
- Testing automatizado y SDD.

El nuevo proyecto debe usar una arquitectura API-first, mobile-ready y modular.
