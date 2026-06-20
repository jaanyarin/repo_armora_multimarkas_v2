# ARMORA Multimarkas v2

Plataforma de gestión comercial multimarca. Migración del sistema legado ARMORA (PHP/Yii) a stack moderno.

## Stack

| Capa | Tecnología |
|---|---|
| Admin web | Next.js 14 + React + TypeScript + Tailwind CSS |
| Backend API | Quarkus 3 + Java 21+ |
| Base de datos | PostgreSQL 16 |
| Cache / colas | Redis 7 |
| Mobile cliente | Flutter + Dart |
| Mobile proveedor | Flutter + Dart |
| Contratos | OpenAPI 3 REST (`/api/v1`) |
| Despliegue | Servidor físico, Docker Compose, Nginx/Caddy, HTTPS |
| Migraciones | Flyway |
| Design System | Sistema propio (paleta Vanguard, tipografía Calibri) |

## Estructura del repositorio

```
├── agentes/
│   ├── docs/ai/              # Orquestación entre agentes
│   └── perfiles/             # Perfiles de agente (deprecated, migrados a .opencode/skills)
├── backend/api-quarkus/       # Backend Quarkus (15 módulos dominio)
├── docs/
│   ├── adr/                   # Registro de decisiones técnicas (ADR)
│   ├── ai_workflow/           # Tablero operativo y handoffs de agentes
│   ├── design-system/         # Sistema de diseño (paleta, tipografía, componentes)
│   ├── scrapping/             # Scraping del sistema legado
│   └── sdd/                   # Documentación SDD (especificaciones, contratos, roadmap)
├── frontend_web/              # Admin web Next.js
├── infra/
│   └── docker/                # Dockerfiles y configuraciones de infra
├── mobile_cliente/            # App Flutter cliente
├── mobile_proveedor/          # App Flutter proveedor
├── packages/
│   ├── contracts/             # Contratos OpenAPI / schemas compartidos
│   ├── mobile-core/           # Código compartido Flutter
│   └── config/                # Convenciones y scripts
├── seguridad/
│   └── politica_transversal.md
├── .opencode/
│   └── skills/                # 16 skills ARMORA para agentes OpenCode
├── AGENTS.md                  # Reglas de operación para agentes OpenCode
├── opencode.json              # Configuración de agentes OpenCode
└── docker-compose.yml         # PostgreSQL + Redis locales
```

## Estado actual (Fase 2 en curso)

| Fase | Descripción | Estado |
|---|---|---|
| F0 | Validación y decisiones | ✅ Completa |
| F1 | Fundación técnica (monorepo, infra, CI) | ✅ Completa |
| **F2** | **Admin base (usuarios, maestros, personal)** | **En curso** |
| F3 | Catálogo y carrito Flutter cliente | Pendiente |
| F4 | Pedidos, inventario y ventas | Pendiente |
| F5 | Flutter proveedor | Pendiente |
| F6 | Pagos integrados | Pendiente |
| F7 | SUNAT y facturación completa | Pendiente |

Ver `docs/sdd/08_sdd_roadmap_mvp.md` para detalle de cada fase.

## Funcionalidades implementadas

### Fase 1 - Fundación técnica
- [x] Monorepo con backend Quarkus, frontend Next.js, apps Flutter
- [x] Docker Compose local (PostgreSQL + Redis)
- [x] OpenAPI inicial (health, version, auth)
- [x] CI base (lint, typecheck, build)

### Fase 2 - Admin base (en progreso)
- [x] Autenticación JWT con refresh token rotativo
- [x] Seed admin funcional
- [x] Design System: paleta Vanguard, tipografía Calibri, componentes base
- [x] Dashboard con sidebar (32 categorías), topbar y health check
- [x] CRUD Personal (29 campos): crear, editar, cambiar contraseña
- [x] Búsqueda rápida en Gestion Personal
- [x] Wizard de 6 pasos para crear/editar personal
- [x] Carga y visualización de foto de perfil
- [x] Asignación de permisos, rutas, almacenes y listas de precios al personal
- [x] Migraciones Flyway V2-V12 (personal, mapas_rutas, ubigeo, permisos, zonas/rutas)
- [x] Gestion de Mapas de Rutas: seed real de 26 mapas, columnas `codigo`, `nombre`, `cant_rutas` y endpoint `GET /api/v1/mapas-rutas`

## Documentación SDD

Los documentos de diseño están en `docs/sdd/` e incluyen:

| Documento | Descripción |
|---|---|
| `00_indice.md` | Índice general de documentos SDD |
| `03_sdd_contexto_glosario.md` | Vocabulario del dominio |
| `04_sdd_requerimientos.md` | Requerimientos funcionales y no funcionales |
| `05_sdd_arquitectura.md` | Arquitectura del sistema |
| `06_sdd_modelo_datos_inicial.md` | Modelo de datos |
| `07_sdd_api_contratos.md` | Contratos REST |
| `08_sdd_roadmap_mvp.md` | Roadmap y fases |
| `16_plan_ejecucion_fase_1_fundacion_tecnica.md` | Plan de Fase 1 |
| `17_convencion_nombres_tecnicos.md` | Nombres en español snake_case |

### Decisiones técnicas (ADR)

| ADR | Descripción |
|---|---|
| `ADR-001-inicial-arquitectura.md` | Stack, monorepo, convención de nombres, seguridad |
| `ADR-002-servicio-fotos-y-archivos.md` | Servicio de fotos (@PermitAll, DELETE, URL relativa) |

## Convenciones

- Backend es fuente de verdad de reglas de negocio.
- API versionada bajo `/api/v1/...` (incluyendo archivos estáticos).
- Mutaciones críticas auditan: stock, pedidos, pagos, ventas, SUNAT.
- Contrato único: web y mobile consumen la misma API.
- BD y Redis no se exponen a internet.
- Decisiones técnicas se registran como ADR en `docs/adr/`.
- Identificadores físicos persistentes usan español y `snake_case` según `docs/sdd/17_convencion_nombres_tecnicos.md`.
- Fotos servidas con `@PermitAll` para que `<img>` del frontend funcione sin JWT.
- La coordinación entre agentes sigue `AGENTS.md`, `agentes/docs/ai/` y el tablero en `docs/ai_workflow/00_tablero_agentes.md`.
- Este README se actualiza conforme evoluciona el proyecto.

## Servicios locales

| Servicio | Puerto | Acceso |
|---|---|---|
| PostgreSQL | 5454 | Solo red local |
| Redis | 6390 | Solo red local |
| Backend API (Quarkus) | 8885 | `http://localhost:8885/api/v1` |
| Frontend Web (Next.js) | 5775 | `http://localhost:5775` |

## Desarrollo local

1. Clonar el repositorio.
2. Copiar `.env.example` a `.env` y ajustar variables (no versionar secretos reales).
3. `docker compose up -d` (PostgreSQL + Redis).
4. `./mvnw compile quarkus:dev` en `backend/api-quarkus/`.
5. `npm run dev` en `frontend_web/`.
6. `flutter run` en `mobile_cliente/` o `mobile_proveedor/`.
