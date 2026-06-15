# Docker local - ARMORA

## Objetivo

Levantar dependencias locales de Fase 1 sin exponer servicios a internet y sin versionar secretos reales.

Servicios definidos:

- PostgreSQL 16.
- Redis 7.

## Uso local

1. Crear archivo local de entorno:

```powershell
Copy-Item .env.example .env.local
```

2. Editar `.env.local` y reemplazar placeholders como `POSTGRES_PASSWORD=<local-dev-password>` por un valor local no productivo.

3. Levantar servicios:

```powershell
docker compose --env-file .env.local up -d postgres redis
```

4. Verificar estado:

```powershell
docker compose --env-file .env.local ps
```

5. Detener servicios:

```powershell
docker compose --env-file .env.local down
```

## Seguridad

- PostgreSQL y Redis se publican solo en `127.0.0.1`.
- No subir `.env.local`, `.env.development`, `.env.staging` ni `.env.production`.
- No colocar secretos reales en `docker-compose.yml` ni `.env.example`.
- No exponer PostgreSQL ni Redis directamente a internet.

## Variables usadas

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_PORT`
- `REDIS_PORT`
- `APP_TIMEZONE`

## Relacion con Fase 1

Este archivo cubre `F1-003` del tablero de agentes y habilita las siguientes tareas:

- `F1-004`: crear base backend Quarkus.
- `F1-005`: crear migracion inicial PostgreSQL.
