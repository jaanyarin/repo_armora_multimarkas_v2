# ARMORA Multimarkas v2

Plataforma de gestión comercial multimarca. Migración del sistema legado ARMORA (PHP/Yii) a stack moderno.

## Stack

| Capa | Tecnología |
|---|---|
| Admin web | Next.js + React + TypeScript |
| Backend API | Quarkus + Java 21+ |
| Base de datos | PostgreSQL |
| Cache / colas | Redis |
| Mobile cliente | Flutter + Dart |
| Mobile proveedor | Flutter + Dart |
| Contratos | OpenAPI REST (`/api/v1`) |
| Despliegue | Servidor físico, Docker Compose, Nginx/Caddy, HTTPS |

## Estructura del repositorio

```
├── agentes/
│   ├── docs/ai/              # Orquestación entre agentes
│   └── perfiles/             # 13 perfiles de agente OpenCode
├── backend/api-quarkus/       # Backend Quarkus (15 módulos dominio)
├── docs/
│   ├── scrapping/             # Scraping del sistema legado
│   └── sdd/                   # Documentación SDD (decisiones técnicas)
├── frontend_web/              # Admin web Next.js
├── mobile_cliente/            # App Flutter cliente
├── mobile_proveedor/          # App Flutter proveedor
├── packages/
│   ├── contracts/             # Contratos OpenAPI / schemas compartidos
│   ├── mobile-core/           # Código compartido Flutter
│   └── config/                # Convenciones y scripts
├── seguridad/
│   └── politica_transversal.md
├── AGENTS.md                  # Reglas de operación para agentes OpenCode
├── opencode.json              # Configuración de agentes OpenCode
└── .gitignore
```

## Fases del proyecto (F0-F7)

| Fase | Descripción |
|---|---|
| F0 | Validación y decisiones |
| F1 | Fundación técnica (monorepo, infra, CI) |
| F2 | Admin base (usuarios, maestros, catálogo) |
| F3 | Catalogo y carrito Flutter cliente |
| F4 | Pedidos, inventario y ventas |
| F5 | Flutter proveedor |
| F6 | Pagos integrados |
| F7 | SUNAT y facturación completa |

Ver `docs/sdd/08_sdd_roadmap_mvp.md` para detalle de cada fase.

## Documentación SDD

Los documentos de diseño están en `docs/sdd/` e incluyen arquitectura, modelo de datos, contratos API, cronograma, y decisiones técnicas registradas como ADR.

## Convenciones

- Backend es fuente de verdad de reglas de negocio.
- API versionada bajo `/api/v1/...`.
- Mutaciones críticas auditan: stock, pedidos, pagos, ventas, SUNAT.
- Contrato único: web y mobile consumen la misma API.
- BD y Redis no se exponen a internet.
- Decisiones técnicas se registran como ADR en `docs/sdd/`.
- Este README se actualiza conforme evoluciona el proyecto.
