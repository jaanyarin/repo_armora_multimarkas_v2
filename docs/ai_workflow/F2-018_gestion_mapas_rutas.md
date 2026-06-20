# Handoff F2-018 — Gestion de Mapas de Rutas

## Objetivo

Implementar el endpoint `/app/mapas-rutas/gestion-mapas-rutas` en la nueva plataforma ARMORA, usando la grilla heredada real indicada por negocio.

## Alcance confirmado

- No se implementa componente visual de mapa.
- La pantalla es administrativa.
- Las columnas reales del catalogo son `codigo`, `nombre` y `cant_rutas`.
- La data anterior de `mapas_rutas` se reemplaza por la data heredada validada.

## Base de datos

Migracion creada:

`backend/api-quarkus/src/main/resources/db/migration/V12__seed_mapas_rutas_reales.sql`

Cambios:

- Agrega `codigo varchar(30)`.
- Agrega `cant_rutas integer NOT NULL DEFAULT 0`.
- Limpia la data previa de `personal_mapas_rutas` y `mapas_rutas`.
- Crea `uq_mapas_rutas_codigo`.
- Crea indices por `codigo` y `nombre`.
- Inserta 26 mapas heredados.

## Backend

Archivo creado:

`backend/api-quarkus/src/main/java/com/armora/mapasrutas/MapasRutasResource.java`

Endpoint:

| Metodo | Ruta | Auth | Descripcion |
|---|---|---|---|
| GET | `/api/v1/mapas-rutas` | ADMINISTRADOR, OPERADOR | Lista mapas de rutas con busqueda opcional `q` |

Contrato principal:

```json
{
  "data": [
    {
      "id": "uuid",
      "codigo": "MAP210100005",
      "nombre": "MAPA ICA A",
      "cantRutas": 6,
      "estado": "ACTIVO",
      "actualizadoEn": "2026-06-20 00:00:00"
    }
  ]
}
```

## Datos cargados

- Total mapas: 26.
- Total rutas acumuladas: 232.
- `MAPA TOTAL`: 79 rutas.
- `VENTA DIRECTA`: 1 ruta.
- `MAPA MERCADOS E`: 3 rutas.
- `MAPA MERCADOS F`: 3 rutas.
- El resto de mapas principales ICA/Mercados/Palpa/Mayoristas quedan con 6 rutas.

## Frontend

Archivo:

`frontend_web/src/app/mapas-rutas/gestion-mapas-rutas/page.tsx`

Ruta:

`/mapas-rutas/gestion-mapas-rutas`

El backend entrega campos principales reales y campos derivados temporales para compatibilidad con la primera version UI.

## Validacion SQL recomendada

```sql
SELECT codigo, nombre, cant_rutas
FROM mapas_rutas
ORDER BY nombre;
```

Criterios:

- La consulta debe devolver 26 registros.
- No deben aparecer mapas fuera de la lista heredada.
- `MAPA TOTAL` debe devolver `79`.
- `VENTA DIRECTA` debe devolver `1`.

## Pruebas sugeridas

```bash
cd backend/api-quarkus
./mvnw compile
```

```bash
cd frontend_web
npm run typecheck
npm run build
```

Smoke manual:

1. Ejecutar migraciones Flyway.
2. Iniciar backend.
3. Iniciar frontend.
4. Entrar a `/mapas-rutas/gestion-mapas-rutas`.
5. Buscar `MAPA TOTAL` y validar 79 rutas.
6. Buscar `VENTA DIRECTA` y validar 1 ruta.
