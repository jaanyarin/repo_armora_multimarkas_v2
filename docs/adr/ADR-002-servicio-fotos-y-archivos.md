# ADR-002: Servicio de fotos y archivos - FilesResource

## Estado

Aceptado

## Contexto

Se necesita un mecanismo para que el admin web (Next.js) pueda subir, visualizar y eliminar fotos de perfil del personal (y potencialmente otros archivos como evidencias de pago, imagenes de catalogo, logos, etc.).

Requerimientos:

- Las fotos deben mostrarse en etiquetas `<img>` del frontend sin requerir autenticacion JWT (el navegador no puede enviar `Authorization` en `<img src="...">`).
- Las subidas requieren autenticacion (solo admin/operador pueden subir).
- La eliminacion de fotos anteriores al reemplazar debe ser posible.
- Los archivos deben guardarse en el servidor fisico, no en la BD.
- La URL almacenada en BD debe ser relativa (sin acoplar dominio/host).

## Decision

### Endpoints

| Metodo | Ruta | Auth | Proposito |
|---|---|---|---|
| POST | `/api/v1/files/upload` | JWT (ADMINISTRADOR, OPERADOR) | Subir foto multipart |
| GET | `/api/v1/files/photos/{fileName}` | `@PermitAll` | Servir foto estatica |
| DELETE | `/api/v1/files/photos/{fileName}` | JWT (ADMINISTRADOR, OPERADOR) | Eliminar foto del disco |

### `@PermitAll` en servePhoto

El endpoint `GET /files/photos/{fileName}` tiene `@PermitAll` anulando el `@RolesAllowed` de nivel de clase:

```java
@PermitAll
@GET
@Path("/photos/{fileName}")
public Response servePhoto(@PathParam String fileName) { ... }
```

Motivo: el navegador renderiza `<img src="...">` sin enviar headers de autorizacion. Si el endpoint requiere JWT, la imagen nunca se carga.

Riesgo: cualquier persona con la URL puede ver la foto. Mitigacion:
- Los nombres de archivo son UUIDs no adivinables.
- No se sirven directorios ni listados.
- En produccion Nginx/Caddy puede agregar reglas de acceso adicionales si fuera necesario.

### URL relativa en BD

La columna `personal.foto_url` almacena solo la ruta relativa:

```
/files/photos/uuid-foto.jpg
```

El frontend construye la URL completa con `API_BASE_URL`:

```typescript
const resolveFotoUrl = (fotoUrl: string | null | undefined): string => {
  if (!fotoUrl) return '/img/default-avatar.png';
  if (fotoUrl.startsWith('http')) return fotoUrl;
  return `${API_BASE_URL}${fotoUrl}`;  // → http://host:8885/api/v1/files/photos/uuid.jpg
};
```

### Directorio de uploads

Propiedad custom en `application.properties`:

```properties
app.upload.dir=uploads/photos
```

Se usa en vez de `quarkus.http.body.uploads-directory` porque esta ultima tiene comportamiento impredecible en dev mode y esta disenada para archivos temporales, no persistentes.

### Eliminacion al reemplazar

El flujo de reemplazo de foto es:

1. Frontend: DELETE `/api/v1/files/photos/{oldFile}` (con JWT)
2. Frontend: POST `/api/v1/files/upload` (sube la nueva)
3. Frontend: PUT `/api/v1/personal/{id}` con el nuevo `fotoUrl`

El DELETE se ejecuta dentro de un `try/catch` que no bloquea el flujo si el archivo ya no existe (ej. fue borrado manualmente).

### Validacion anti-path-traversal

Todos los endpoints de archivos validan que el `fileName` no contenga `..` ni `/` para evitar lectura/escritura fuera del directorio de uploads.

## Consecuencias

### Positivas

- Las fotos se muestran correctamente en el frontend sin auth.
- El DELETE permite limpiar archivos huerfanos al reemplazar fotos.
- La URL relativa en BD permite cambiar de dominio/host sin migrar datos.
- Validacion anti-path-traversal protege contra ataques de directory traversal.

### Negativas

- Las fotos son publicas (cualquiera con la URL puede verlas). Aceptable porque son fotos de perfil, no datos sensibles.
- Se requiere limpieza periodica de fotos huerfanas (cuando un personal se elimina pero su foto permanece en disco).

### Riesgos

- Si el disco de uploads se llena, las subidas fallaran. Monitorear espacio en disco.
- En produccion, Nginx/Caddy debe configurarse para servir archivos estaticos directamente sin pasar por Quarkus, mejorando performance.

## Referencias

- `docs/sdd/07_sdd_api_contratos.md` (seccion Files)
- `backend/api-quarkus/src/main/java/com/armora/files/FilesResource.java`
- `frontend_web/src/lib/api-client.ts` (metodo `api.del()`)
- `frontend_web/src/app/personal/editar-personal/page.tsx` (`resolveFotoUrl`, flujo de reemplazo)
