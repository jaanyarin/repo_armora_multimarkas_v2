# Especificación funcional y técnica: Gestión de Zonas y Rutas con Mapa y Polígonos

## 1. Objetivo

Implementar el endpoint **Gestión de Zonas y Rutas** en dos niveles de experiencia:

1. **Primera versión:** gestión administrativa de zonas y rutas mediante formulario, filtros, tabla y acciones CRUD.
2. **Segunda versión:** gestión geográfica avanzada, donde el usuario pueda definir visualmente el límite de una zona mediante un polígono en un mapa interactivo.

La finalidad es que el sistema permita crear, consultar, editar, activar/inactivar y eliminar zonas/rutas, además de representar sus límites geográficos para validar cobertura, clientes asignados y planificación comercial.

---

## 2. Contexto del endpoint

Endpoint base:

```txt
/app/zonas-rutas/gestion-zonas-rutas
```

Módulo:

```txt
Zonas y Rutas
```

Nombre funcional:

```txt
Gestión Zonas y Rutas
```

Debe respetar la línea visual actual del sistema Armora SAC:

- Barra superior clara.
- Menú lateral oscuro/invertido.
- Paleta predominante en blanco, negro, grises y acentos sobrios.
- Diseño responsive web y adaptable a mobile.
- Uso de componentes tipo Semantic UI / Material Design 3, según corresponda.

---

## 3. Flujo general requerido

### 3.1 Primera etapa: gestión estándar

Cuando el usuario entra al endpoint **Gestión Zonas y Rutas**, debe visualizar una primera pantalla administrativa con:

- Título de página.
- Filtros de búsqueda.
- Botón para crear nueva zona/ruta.
- Tabla de registros existentes.
- Acciones por registro: ver, editar, definir límite, activar/inactivar, eliminar.

Esta primera versión es la vista principal de gestión.

### 3.2 Segunda etapa: definición de límite geográfico

Cuando el usuario selecciona la acción **Definir límite** o **Editar polígono** sobre una zona/ruta, debe abrirse una segunda vista más completa con mapa interactivo.

En esta segunda versión el usuario podrá:

- Ver los datos principales de la zona/ruta.
- Dibujar un polígono sobre el mapa.
- Editar el polígono existente.
- Eliminar el polígono.
- Guardar las coordenadas.
- Visualizar clientes/puntos dentro o fuera de la zona.
- Confirmar cambios antes de guardar.

---

## 4. Primera versión: Gestión administrativa de zonas y rutas

### 4.1 Estructura visual

La pantalla debe dividirse en las siguientes secciones:

1. Encabezado del módulo.
2. Panel de filtros.
3. Tabla/listado de zonas y rutas.
4. Panel lateral o modal para crear/editar.
5. Acciones rápidas.

### 4.2 Campos del formulario

El formulario debe considerar como mínimo:

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| Código | Input readonly/autogenerado | Sí | Código interno de zona/ruta |
| Nombre de zona | Input texto | Sí | Nombre comercial o administrativo de la zona |
| Ruta | Input texto | Sí | Nombre o código de ruta |
| Vendedor / responsable | Select/autocomplete | Sí | Persona asignada a la ruta |
| Día de atención | Select múltiple o chips | Sí | Días en los que se atiende la ruta |
| Color de zona | Color picker | No | Color para identificar visualmente la zona en el mapa |
| Estado | Select / switch | Sí | Activo o Inactivo |
| Observación | Textarea | No | Comentarios administrativos |

### 4.3 Tabla de gestión

Columnas sugeridas:

| Columna | Descripción |
|---|---|
| Código | Identificador de zona/ruta |
| Zona | Nombre de la zona |
| Ruta | Nombre de la ruta |
| Responsable | Vendedor o personal asignado |
| Día atención | Día o días configurados |
| Clientes | Cantidad de clientes asignados |
| Polígono | Estado del límite: definido / pendiente |
| Estado | Activo / Inactivo |
| Acciones | Ver, Editar, Definir límite, Inactivar, Eliminar |

### 4.4 Acciones disponibles

Cada registro debe permitir:

- **Ver detalle:** abre vista de solo lectura.
- **Editar:** permite modificar datos administrativos.
- **Definir límite:** abre la segunda versión con mapa y polígono.
- **Activar/Inactivar:** cambia el estado operativo de la zona/ruta.
- **Eliminar:** permitido solo si no tiene dependencias críticas.

---

## 5. Segunda versión: Gestión geográfica con mapa y polígono

### 5.1 Objetivo de la segunda vista

Permitir que el usuario defina el límite geográfico de una zona/ruta mediante un polígono dibujado en el mapa.

Este polígono será usado como referencia para:

- Delimitar cobertura comercial.
- Validar clientes dentro/fuera de zona.
- Evitar cruces de rutas.
- Visualizar cobertura por responsable.
- Mejorar planificación de atención.

### 5.2 Estructura visual recomendada

Diseño en dos columnas:

#### Columna izquierda

- Datos principales de la zona/ruta.
- Formulario resumido.
- Botones de acción.
- Lista de coordenadas generadas.
- Lista de clientes dentro/fuera del polígono.

#### Columna derecha

- Mapa interactivo.
- Herramientas para dibujar, editar y eliminar polígono.
- Marcadores de clientes/puntos de venta.
- Leyenda de colores.

### 5.3 Herramientas del mapa

El mapa debe permitir:

- Dibujar polígono.
- Editar vértices del polígono.
- Mover puntos del polígono.
- Eliminar polígono.
- Centrar mapa.
- Ver coordenadas.
- Mostrar/ocultar clientes.
- Mostrar/ocultar otras zonas.

### 5.4 Librería recomendada

Para una primera implementación, se recomienda:

```txt
Leaflet + Leaflet Draw + OpenStreetMap
```

Motivo:

- No requiere costo inicial.
- Es suficiente para dibujar polígonos.
- Permite marcadores, capas y validaciones básicas.
- Es ideal para maqueta funcional y posterior evolución.

Alternativas futuras:

- Google Maps API, si se requiere navegación real, tráfico o cálculo avanzado de rutas.
- Mapbox, si se requiere una experiencia visual más moderna.

---

## 6. CRUD completo requerido

### 6.1 Crear zona/ruta

El usuario debe poder crear una zona/ruta desde la primera versión.

Flujo:

1. Clic en **Nueva zona/ruta**.
2. Completar datos administrativos.
3. Guardar.
4. El sistema crea la zona/ruta sin polígono.
5. El sistema muestra estado de polígono como **Pendiente**.
6. Luego el usuario puede ingresar a **Definir límite**.

### 6.2 Leer / consultar

Debe permitir:

- Buscar por zona.
- Buscar por ruta.
- Filtrar por vendedor.
- Filtrar por día de atención.
- Filtrar por estado.
- Filtrar por polígono definido o pendiente.

### 6.3 Editar zona/ruta

Debe permitir editar:

- Nombre de zona.
- Ruta.
- Responsable.
- Día de atención.
- Color.
- Estado.
- Observaciones.
- Polígono, desde la segunda vista.

### 6.4 Eliminar zona/ruta

Regla recomendada:

- Si la zona/ruta no tiene clientes, ventas, preventas u operaciones asociadas, se puede eliminar.
- Si tiene historial, no eliminar físicamente; solo inactivar.

### 6.5 Gestionar polígono

Acciones del polígono:

- Crear polígono.
- Editar polígono.
- Eliminar polígono.
- Guardar polígono.
- Restaurar última versión.
- Validar clientes dentro/fuera.

---

## 7. Modelo de datos sugerido

### 7.1 Tabla `zonas_rutas`

```sql
CREATE TABLE zonas_rutas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(30) NOT NULL UNIQUE,
    nombre_zona VARCHAR(150) NOT NULL,
    nombre_ruta VARCHAR(150) NOT NULL,
    responsable_id BIGINT NULL,
    dias_atencion JSON NULL,
    color VARCHAR(20) NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    observacion TEXT NULL,
    creado_por VARCHAR(100) NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100) NULL,
    actualizado_en DATETIME NULL
);
```

### 7.2 Tabla `zonas_rutas_poligonos`

```sql
CREATE TABLE zonas_rutas_poligonos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    zona_ruta_id BIGINT NOT NULL,
    coordenadas JSON NOT NULL,
    version INT NOT NULL DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_por VARCHAR(100) NULL,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100) NULL,
    actualizado_en DATETIME NULL,
    FOREIGN KEY (zona_ruta_id) REFERENCES zonas_rutas(id)
);
```

### 7.3 Ejemplo de coordenadas guardadas

```json
{
  "type": "Polygon",
  "coordinates": [
    [
      [-75.7286, -14.0671],
      [-75.7210, -14.0698],
      [-75.7225, -14.0755],
      [-75.7302, -14.0780],
      [-75.7351, -14.0720],
      [-75.7286, -14.0671]
    ]
  ]
}
```

> Nota técnica: se recomienda guardar el polígono en formato GeoJSON. En GeoJSON el orden correcto es longitud, latitud: `[lng, lat]`.

---

## 8. Endpoints API sugeridos

### 8.1 Zonas y rutas

```http
GET /api/zonas-rutas
GET /api/zonas-rutas/{id}
POST /api/zonas-rutas
PUT /api/zonas-rutas/{id}
PATCH /api/zonas-rutas/{id}/estado
DELETE /api/zonas-rutas/{id}
```

### 8.2 Polígonos

```http
GET /api/zonas-rutas/{id}/poligono
POST /api/zonas-rutas/{id}/poligono
PUT /api/zonas-rutas/{id}/poligono
DELETE /api/zonas-rutas/{id}/poligono
POST /api/zonas-rutas/{id}/validar-clientes
```

### 8.3 Clientes dentro/fuera de zona

```http
GET /api/zonas-rutas/{id}/clientes
GET /api/zonas-rutas/{id}/clientes/dentro
GET /api/zonas-rutas/{id}/clientes/fuera
```

---

## 9. Validaciones funcionales

### 9.1 Datos administrativos

- El nombre de zona es obligatorio.
- La ruta es obligatoria.
- El responsable debe existir.
- El estado solo puede ser `ACTIVO` o `INACTIVO`.
- El color debe tener formato hexadecimal válido si se informa.

### 9.2 Polígono

- El polígono debe tener mínimo 3 puntos.
- El polígono debe estar cerrado.
- No se debe guardar si tiene geometría inválida.
- Si se elimina el polígono, el estado visual debe volver a **Pendiente**.
- Debe mostrarse confirmación antes de reemplazar un polígono existente.

### 9.3 Clientes

- Un cliente con coordenadas puede validarse contra el polígono.
- Un cliente sin coordenadas debe mostrarse como pendiente de georreferenciación.
- Si un cliente está fuera del polígono, debe resaltarse visualmente.

---

## 10. Experiencia de usuario esperada

### 10.1 Primera pantalla

El usuario debe sentir que está gestionando registros.

Debe priorizarse:

- Búsqueda rápida.
- Tabla clara.
- Acciones visibles.
- Estado del polígono fácil de identificar.
- Botón claro para pasar a la vista de mapa.

Estados visuales sugeridos:

| Estado | Visual |
|---|---|
| Polígono definido | Badge verde |
| Polígono pendiente | Badge amarillo |
| Zona inactiva | Badge gris |
| Cliente fuera de zona | Badge rojo |

### 10.2 Segunda pantalla

El usuario debe sentir que está delimitando territorio.

Debe priorizarse:

- Mapa grande.
- Botones claros: dibujar, editar, eliminar, guardar.
- Coordenadas visibles.
- Confirmaciones antes de cambios destructivos.
- Colores por zona.
- Lista de clientes dentro/fuera.

---

## 11. Reglas de navegación

Desde la primera versión:

- Botón **Nueva zona/ruta** abre formulario.
- Botón **Editar** abre formulario con datos cargados.
- Botón **Definir límite** abre la segunda versión con mapa.
- Botón **Ver mapa** abre la segunda versión en modo consulta si ya tiene polígono.

Desde la segunda versión:

- Botón **Volver a gestión** regresa a la primera pantalla.
- Botón **Guardar polígono** persiste las coordenadas.
- Botón **Eliminar polígono** elimina o desactiva el polígono actual.
- Botón **Validar clientes** recalcula dentro/fuera.

---

## 12. Prompt recomendado para desarrollador o IA de código

```txt
Implementa el módulo Gestión de Zonas y Rutas para el endpoint /app/zonas-rutas/gestion-zonas-rutas.

Primero desarrolla la vista administrativa principal con formulario, filtros, tabla y CRUD completo de zonas/rutas, respetando la línea visual del sistema Armora SAC: menú lateral oscuro, barra superior clara, diseño sobrio, responsive y componentes tipo Semantic UI / Material Design.

La primera vista debe permitir crear, listar, buscar, editar, activar/inactivar y eliminar zonas/rutas. Cada registro debe mostrar si tiene o no polígono definido. Agrega una acción llamada “Definir límite” que lleve a una segunda vista.

La segunda vista debe permitir gestionar el límite geográfico de una zona/ruta mediante un mapa interactivo. Usa Leaflet, OpenStreetMap y Leaflet Draw. El usuario debe poder dibujar un polígono, editarlo, eliminarlo y guardar sus coordenadas en formato GeoJSON. También debe poder ver los clientes o puntos de venta dentro y fuera del polígono.

Implementa CRUD completo para la entidad zona/ruta y para su polígono asociado. Guarda el polígono como JSON/GeoJSON. Valida que el polígono tenga mínimo 3 puntos, que sea válido y que no se guarde vacío.

Diseña la UX en dos etapas:
1. Gestión administrativa.
2. Gestión geográfica del límite de zona.

Incluye botones claros: Nueva zona/ruta, Editar, Definir límite, Ver mapa, Guardar, Cancelar, Dibujar polígono, Editar polígono, Eliminar polígono y Validar clientes.

La solución debe quedar preparada para integrarse posteriormente con backend Quarkus y base de datos MySQL.
```

---

## 13. Criterios de aceptación

La implementación se considera correcta cuando:

- Existe una primera pantalla de gestión administrativa.
- Existe una segunda pantalla con mapa interactivo.
- Se puede crear una zona/ruta.
- Se puede editar una zona/ruta.
- Se puede activar/inactivar.
- Se puede eliminar si no tiene dependencias.
- Se puede dibujar un polígono.
- Se puede editar el polígono.
- Se puede eliminar el polígono.
- Se guardan coordenadas en formato GeoJSON.
- Se visualiza el estado del polígono en la tabla.
- Se diferencian clientes dentro/fuera de zona.
- La interfaz respeta la paleta y estilo visual del sistema actual.
- La pantalla funciona de forma responsive.

---

## 14. Recomendación final

No conviene mezclar todo en una sola pantalla desde el inicio.

La mejor experiencia es manejarlo en dos niveles:

1. **Gestión Zonas y Rutas:** administración rápida y CRUD.
2. **Definición de límite:** vista especializada con mapa y polígono.

Esto evita sobrecargar la pantalla principal y permite que el mapa tenga suficiente espacio para trabajar correctamente.
