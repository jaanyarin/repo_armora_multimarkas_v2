# Convenciones de configuracion y secretos - ARMORA

## Objetivo

Definir como se manejan configuraciones, variables de entorno y secretos en ARMORA Multimarkas v2 para evitar credenciales hardcodeadas, datos sensibles embebidos y mocks productivos.

Este documento responde a la tarea `F1-002` del tablero de agentes.

## Regla principal

Ningun secreto real debe existir en el repositorio.

Esto incluye:

- Passwords.
- Tokens.
- API keys.
- Certificados.
- Claves privadas.
- Client secrets.
- URLs secretas o internas sensibles.
- Datos reales de clientes, proveedores, ventas, pagos o SUNAT.

## Archivos permitidos

| Archivo | Se versiona | Contenido permitido |
|---|---:|---|
| `.env.example` | Si | Variables esperadas y placeholders sin secretos reales. |
| `.env.local` | No | Valores locales del desarrollador. |
| `.env.development` | No | Valores de desarrollo. |
| `.env.staging` | No | Valores de staging. |
| `.env.production` | No | Valores de produccion. |
| `secrets/*` | No | Secretos locales o montados por entorno. |

## Convencion por entorno

| Entorno | Uso | Reglas |
|---|---|---|
| `local` | Desarrollo en maquina local | Puede usar passwords locales no productivos, nunca versionados. |
| `dev` | Ambiente compartido de desarrollo | Secretos gestionados fuera del repo. |
| `staging` | Pruebas previas a produccion | Datos anonimizados o controlados, secretos fuera del repo. |
| `production` | Produccion | Secretos en vault, variables de entorno o secretos Docker/servidor. |

## Backend Quarkus

- Leer configuracion desde variables de entorno o `application.properties` con placeholders.
- No escribir passwords ni tokens en `application.properties`.
- Usar rutas tipo `*_SECRET_PATH` cuando el secreto deba montarse como archivo.
- Exponer OpenAPI solo segun configuracion del entorno.
- No registrar secretos en logs.
- No exponer PostgreSQL ni Redis a internet.

Variables base esperadas:

```text
APP_ENV
API_PORT
DATABASE_URL
DATABASE_USERNAME
DATABASE_PASSWORD
REDIS_HOST
REDIS_PORT
JWT_ISSUER
JWT_SECRET_PATH
```

## Admin web Next.js

- Solo variables con prefijo `NEXT_PUBLIC_` pueden llegar al navegador.
- Nunca colocar secretos en variables `NEXT_PUBLIC_*`.
- El frontend no debe contener API keys privadas, tokens de servidor ni secretos de pagos.
- La URL publica de API puede existir como `NEXT_PUBLIC_API_BASE_URL`.

## Flutter cliente y proveedor

- No compilar secretos dentro de APK/AAB/IPA.
- Usar configuracion por ambiente para URLs publicas de API.
- Tokens de sesion deben guardarse en almacenamiento seguro.
- No dejar usuarios, passwords ni tokens hardcodeados para pruebas.
- Mocks solo permitidos bajo modo `dev` o `test`, nunca como flujo productivo.

## Docker y servidor fisico

- `docker-compose.yml` puede declarar nombres de variables, no secretos reales.
- Valores reales deben inyectarse desde `.env.local`, secretos Docker, vault o configuracion del servidor.
- No publicar puertos de PostgreSQL o Redis a internet.
- Nginx/Caddy termina HTTPS; certificados no se versionan.
- Backups no deben contener secretos dentro del repositorio.

## Integraciones futuras

Pagos, SUNAT, webhooks y ERP deben usar:

- Variables de entorno para identificadores no sensibles.
- Secretos montados por entorno para claves privadas o client secrets.
- Validacion de firma en webhooks.
- Logs sin payloads sensibles completos.

## Politica para ejemplos, seeds y mocks

Permitido:

- Datos ficticios claramente marcados como `dev`, `test`, `sample` o `seed`.
- Seeds locales que no representen clientes reales.
- Mocks para pruebas automatizadas.

Prohibido:

- Datos reales en fixtures.
- RUC, telefonos, direcciones o correos reales sin autorizacion y anonimizado.
- Mocks activos en produccion.
- Datos hardcodeados para simular comportamiento productivo.

## Checklist obligatorio antes de cerrar tareas

- No hay secretos reales versionados.
- `.env.example` solo contiene placeholders.
- `.env*` reales estan ignorados por Git.
- No hay secretos en variables publicas de Next.js.
- No hay secretos compilados en Flutter.
- No hay passwords en `application.properties`.
- No hay logs de tokens, passwords o payloads sensibles.
- Si se agregan integraciones, existe definicion de secreto por entorno.

## Respuesta ante incidente

Si se detecta un secreto en codigo o documentacion:

1. Detener la tarea.
2. Remover el secreto del repositorio.
3. Rotar el secreto expuesto.
4. Registrar el incidente y la correccion.
5. Revisar historial si el secreto fue commiteado.

## Handoff F1-002

Este documento debe ser usado por:

- `armora-security` como politica lider.
- `armora-devops` para Docker, servidor y CI.
- `armora-backend-quarkus` para Quarkus y secrets paths.
- `armora-frontend-web` para variables publicas.
- `armora-mobile-flutter` para configuracion mobile y almacenamiento seguro.
