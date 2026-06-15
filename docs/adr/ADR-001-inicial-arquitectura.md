# ADR-001: Stack tecnologico y estructura de monorepo

## Estado

Aceptado

## Contexto

Se necesita definir la base tecnologica para construir ARMORA Multimarkas v2, un sistema de gestion empresarial con admin web, app cliente y app proveedor. El sistema debe ser mantenible, seguro y escalable.

## Decision

### Stack principal

| Componente | Tecnologia | Version |
|---|---|---|
| Backend API | Quarkus | Java 21+ |
| Admin web | Next.js | 14+ (App Router) |
| Mobile cliente | Flutter | 3.x |
| Mobile proveedor | Flutter | 3.x |
| Base de datos | PostgreSQL | 16 |
| Cache / colas | Redis | 7 |
| Contrato API | OpenAPI 3 | Generado desde Quarkus |
| Infra local | Docker Compose | - |
| Proxy reverso | Nginx / Caddy | Produccion |

### Estructura de monorepo

```
/
  backend/api-quarkus/     # API REST
  frontend_web/            # Admin web Next.js
  mobile_cliente/          # App cliente Flutter
  mobile_proveedor/        # App proveedor Flutter
  packages/
    contracts/             # Contratos OpenAPI / tipos compartidos
    mobile-core/           # Core compartido Flutter
    config/                # Configuraciones base
  infra/
    docker/                # Dockerfiles
  docs/
    sdd/                   # Documentacion SDD
    adr/                   # Registro de decisiones tecnicas
    ai_workflow/           # Tablero operativo de agentes
```

### Convencion de nombres fisicos

Todo identificador fisico persistente (tablas, columnas, enums, funciones, migraciones) se nombra en espanol y `snake_case` segun `docs/sdd/17_convencion_nombres_tecnicos.md`.

### Seguridad

- No hardcodear credenciales, tokens, API keys ni datos sensibles.
- Configuracion sensible via variables de entorno.
- `.env.example` como unico archivo de entorno versionado.
- JWT como mecanismo de autenticacion stateless.
- OpenAPI como contrato unico entre frontends y backend.

### Contrato API

- Base path: `/api/v1/`
- Formato de respuesta estandar: `{ data, meta, errors }`
- Endpoints minimos Fase 1: health, version, auth/login, auth/refresh, auth/logout, me

## Consecuencias

### Positivas

- Stack moderno y alineado con el mercado.
- Flutter permite compartir logica entre apps cliente y proveedor via `mobile-core`.
- OpenAPI como fuente de verdad evita divergencia backend-frontend.
- Monorepo facilita trazabilidad de cambios transversales.

### Negativas

- Equipo debe conocer Java, TypeScript y Dart simultaneamente.
- Monorepo grande requiere disciplina en estructura y CI.
- Flutter no comparte codigo con web admin (Next.js).

### Riesgos

- Si OpenAPI no se usa como contrato central, web y mobile divergiran.
- Si no se valida la convencion de nombres espanol, se generara deuda tecnica.

## Referencias

- `docs/sdd/02_stack_recomendado.md`
- `docs/sdd/05_sdd_arquitectura.md`
- `docs/sdd/11_stack_alternativo_backend_quarkus.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `docs/sdd/17_convencion_nombres_tecnicos.md`
