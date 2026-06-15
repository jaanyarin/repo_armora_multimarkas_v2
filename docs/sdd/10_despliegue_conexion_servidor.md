# Despliegue y conexion en servidor

## Objetivo

Explicar como parece estar conectado el sistema actual, y como deberia conectarse el nuevo sistema con el stack recomendado en un servidor fisico.

## Conexion actual observada

Segun el scraping, el sistema actual funciona asi:

```text
Usuario navegador
  |
  | HTTPS
  v
https://armorasac.com/app/
  |
  | HTML server-rendered + archivos estaticos
  v
Servidor web/app actual
  |
  | XHR POST internos
  v
/app/{modulo}/{pantalla}/rest/{accion}
  |
  | consultas internas no visibles en scraping
  v
Base de datos actual
```

Evidencia:

- La app vive bajo `https://armorasac.com/app/`.
- Las pantallas son rutas como `/app/productos/gestion-productos`.
- Los scripts y estilos se sirven desde el mismo dominio: `/app/static/...` y `/app/resources/...`.
- Las llamadas de datos usan endpoints internos como `/app/productos/gestion-productos/rest/list-productos`.
- Cuando no hay sesion, varias rutas redirigen a `/app/login`.

Inferencia:

- El frontend y backend parecen estar acoplados en una misma aplicacion web.
- La sesion probablemente se maneja con cookie de servidor.
- La base de datos no esta expuesta publicamente; solo la usa el backend.
- No hay una API publica versionada para mobile.

## Problema para el nuevo enfoque

El modelo actual sirve para una web administrativa, pero no es ideal para:

- Apps mobile separadas para clientes y proveedores.
- API estable y versionada.
- Pagos por webhooks.
- Integracion ordenada con SUNAT.
- Separar permisos por cliente, proveedor, sucursal y almacen.
- Escalar web, API, jobs y base de datos por separado.

## Conexion recomendada en servidor fisico

Arquitectura recomendada:

```text
Internet
  |
  | HTTPS 443
  v
Nginx o Caddy Reverse Proxy
  |
  |-- admin.armorasac.com        -> Next.js admin web
  |-- api.armorasac.com/api/v1   -> Quarkus API
  |-- files.armorasac.com        -> MinIO/S3 compatible, opcional
  |
  v
Docker network privada
  |
  |-- admin-web container
  |-- api container
  |-- worker container
  |-- postgres container o servicio dedicado
  |-- redis container
  |-- minio container, opcional
```

Apps mobile:

```text
Flutter Cliente App / Flutter Proveedor App
  |
  | HTTPS
  v
api.armorasac.com/api/v1
  |
  v
API + PostgreSQL + Redis
```

La app mobile no queda "dentro" del servidor. La app se instala en el celular, pero se conecta por HTTPS al API del servidor. Lo que queda dentro del servidor es:

- API.
- Web admin.
- Base de datos.
- Redis/colas.
- Archivos.
- Jobs de SUNAT, pagos, correos y backups.


## Nota sobre apps Flutter

Las aplicaciones Flutter no se alojan dentro del servidor fisico. Se compilan como APK/AAB, se instalan en los celulares y se conectan por HTTPS a `api.armorasac.com/api/v1`.

El servidor fisico aloja:

- API Quarkus.
- Admin web Next.js.
- PostgreSQL.
- Redis.
- Workers/jobs.
- Archivos.
- Backups y monitoreo.

## Dominios sugeridos

Opcion limpia:

- `admin.armorasac.com`: panel administrativo.
- `api.armorasac.com`: API para web y mobile.
- `proveedores.armorasac.com`: portal web proveedor, si se decide web separada.
- `files.armorasac.com`: imagenes/documentos si se usa MinIO publico controlado.

Opcion con una sola raiz:

- `armorasac.com/admin`
- `armorasac.com/api/v1`
- `armorasac.com/proveedores`

Recomendacion: usar subdominios. Es mas claro para certificados, CORS, logs, seguridad y despliegue.

## Puertos internos sugeridos

Solo el reverse proxy debe exponer internet:

- `443`: HTTPS publico.
- `80`: solo redireccion a HTTPS.

Puertos internos:

- `3000`: Next.js admin.
- `4000`: Quarkus API.
- `5432`: PostgreSQL, solo red interna.
- `6379`: Redis, solo red interna.
- `9000/9001`: MinIO, solo interno o restringido.

PostgreSQL nunca debe quedar abierto a internet.

## Componentes del servidor

Sistema operativo:

- Ubuntu Server LTS o Debian estable.

Runtime:

- Docker + Docker Compose.
- Nginx o Caddy.

Servicios:

- `admin-web`: Next.js compilado.
- `api`: Quarkus compilado en JVM jar dentro de Docker.
- `worker`: procesos de cola para pagos, SUNAT, emails, alertas.
- `postgres`: base de datos.
- `redis`: cache y colas.
- `minio`: archivos locales compatible S3, opcional.

Backups:

- Backup diario de PostgreSQL.
- Backup de archivos/documentos.
- Copia externa: disco externo, NAS o cloud storage.

## Flujo de login recomendado

Web admin:

```text
Navegador -> admin.armorasac.com -> API /auth/login -> cookie httpOnly o token seguro
```

Mobile:

```text
App Flutter -> api.armorasac.com/api/v1/auth/login -> access token + refresh token en almacenamiento seguro
```

## Flujo de pedido con pago

```text
Cliente mobile Flutter
  |
  | crea carrito
  v
API valida productos, proveedor, precio y stock
  |
  | crea nota de pedido / order
  v
Reserva stock con expiracion
  |
  | cliente paga
  v
Proveedor de pago envia webhook
  |
  v
API confirma pago
  |
  v
Pedido queda listo para proceso de compra/venta
```

## Flujo SUNAT

```text
Admin confirma venta o sistema emite automatico
  |
  v
API crea comprobante
  |
  v
Worker SUNAT envia documento
  |
  v
SUNAT responde aceptado/rechazado
  |
  v
Sistema guarda XML/PDF/CDR y estado
```

## Recomendacion para servidor fisico

Minimo para el volumen indicado:

- CPU: 4 cores.
- RAM: 16 GB.
- Disco: SSD/NVMe 500 GB.
- RAID o disco espejo si es posible.
- UPS.
- Internet estable con IP publica fija o DNS dinamico empresarial.
- Backups externos obligatorios.

Recomendado:

- CPU: 8 cores.
- RAM: 32 GB.
- SSD/NVMe 1 TB.
- RAID 1.
- Firewall dedicado o reglas estrictas.
- Monitoreo con Uptime Kuma/Prometheus/Grafana.

## Riesgos de servidor fisico

- Si se corta internet local, clientes/proveedores no podran usar la app.
- Si se corta energia y no hay UPS, el sistema cae.
- Backups dependen de disciplina operativa.
- Exponer pagos y mobile desde una red local exige buena configuracion de seguridad.

## Opcion hibrida recomendada

Para optimizar costo sin perder disponibilidad:

- Servidor fisico para operacion interna y base principal si se desea.
- Backup externo diario cifrado.
- Dominio/API expuesto con proxy seguro.
- Considerar VPS pequeno para monitoreo, DNS, backups o replica.

Si clientes y proveedores dependen del celular, lo mas estable suele ser alojar API y DB en cloud/VPS y dejar el servidor fisico como respaldo o nodo interno. Si se mantiene todo en servidor fisico, la red y energia deben tratarse como infraestructura critica.

## Checklist de despliegue

1. Comprar/configurar dominio y DNS.
2. Preparar servidor Ubuntu/Debian.
3. Instalar Docker, Docker Compose, firewall.
4. Crear `docker-compose.prod.yml`.
5. Configurar Nginx/Caddy con HTTPS.
6. Configurar variables de entorno.
7. Levantar PostgreSQL y Redis.
8. Ejecutar migraciones.
9. Levantar API, worker y admin web.
10. Configurar backups automaticos.
11. Configurar monitoreo.
12. Probar login web, login mobile, pedido, pago sandbox y SUNAT sandbox.
