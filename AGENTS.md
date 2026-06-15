# AGENTS.md - ARMORA Multimarkas v2

## Estado del repositorio

Este repositorio contiene **solo documentacion y especificaciones SDD**.
No hay codigo fuente (no hay `pom.xml`, `package.json`, `pubspec.yaml`, etc).
Las estructuras de directorios para backend, frontend web y apps mobile aun no existen.
No ejecutes comandos de build/test/lint — no hay nada que compilar.

## Flujo de desarrollo (SDD)

1. Leer SDD relevante en `docs/sdd/` antes de proponer cambios.
2. Verificar `docs/scrapping/` si se necesita entender el sistema heredado.
3. Confirmar que la tarea no contradice la decision tecnica vigente.
4. Usar el agente correspondiente segun la matriz de ruteo.
5. Si la tarea implica crear codigo nuevo, iniciar con spec, modelo y contrato, no con implementacion.
6. Registrar decisiones tecnicas como ADR cuando cambie stack, modelo, contrato o alcance.

## Stack (decision tecnica vigente)

- Web admin: Next.js + React + TypeScript
- Mobile: Flutter + Dart (dos apps separadas: `mobile_cliente`, `mobile_proveedor`)
- Backend API: Quarkus + Java 21+
- BD: PostgreSQL, Cache/colas: Redis
- Contratos: OpenAPI REST versionado (`/api/v1`), generado desde Quarkus
- Despliegue: servidor fisico, Docker Compose, Nginx/Caddy, HTTPS

## Agentes y ruteo

| Tarea | Agente principal (en opencode.json) | Apoyo |
|---|---|---|
| Arquitectura / coordinacion | `armora-architect` | — |
| UI/UX diseno | `armora-ui-ux` | — |
| Alcance / reglas de negocio | `armora-product-owner` | Arquitecto, SDD Manager |
| Endpoints / APIs / logica backend | `armora-backend-quarkus` | QA, Security |
| Tablas / migraciones / modelo | `armora-database` | Backend, QA |
| Pruebas unitarias / integracion / E2E | `armora-qa` | Segun dominio |
| Infraestructura / Docker / despliegue | `armora-devops` | Security, Backend |
| Pantallas admin web | `armora-frontend-web` | UI/UX, Backend, QA |
| Pantallas Flutter (cliente o proveedor) | `armora-mobile-flutter` | UI/UX, Backend, Security, QA |
| Permisos / RBAC / seguridad | `armora-security` | Backend, Product Owner, QA |
| SUNAT / pagos / webhooks | `armora-integrations` | Backend, Security, QA |
| Documentacion SDD / ADRs | `armora-sdd-manager` | Agente dueno del cambio |
| Cronograma / releases / riesgos | `armora-delivery` | Arquitecto, Product Owner |

Usar `armora-architect` para tareas ambiguas o multidominio.

## Reglas de arquitectura (no obvias)

- **Backend es fuente de verdad** de reglas de negocio. Web y mobile no calculan precios, stock, permisos ni estados tributarios como verdad.
- **API versionada**: siempre `/api/v1/...`.
- **Mutaciones criticas auditan**: stock, pedidos, pagos, ventas, SUNAT.
- **Contrato unico**: Next.js y Flutter consumen la misma API, no APIs paralelas.
- **BD y Redis no se exponen** a internet.

## Seguridad (obligatorio)

- No hardcodear credenciales, tokens, API keys, certs, URLs secretas ni datos reales.
- No subir secretos al repo. Usar variables de entorno / vault.
- No dejar mocks o datos fake activos en produccion.
- Si se detecta un secreto en codigo: remover, rotar y documentar como incidente.

## Coordinacion entre agentes

- Cambio funcional → pasa por Product Owner
- Cambio de contrato API → Backend + Frontend/Mobile + QA
- Cambio de modelo de datos → Database + Backend
- Cambio mobile que toque sesion/datos sensibles → UI/UX + Mobile + Security
- Cambio de pagos/SUNAT → Integration + Backend + Security + QA
- Cambio de despliegue → DevOps + Security
- Cambio de alcance/fecha → Delivery Manager
- Cambio documental final → SDD Manager

## Donde profundizar

- `agentes/perfiles/` — perfiles de 13 agentes con roles, responsabilidades y reglas tecnicas
- `agentes/docs/ai/00_agent_orchestration.md` — matriz de coordinacion
- `agentes/docs/ai/02_handoff_protocol.md` — protocolo de handoff
- `.opencode/skills/armora-agent-routing/SKILL.md` — ruteo por palabras clave
- `.opencode/skills/armora-sdd/SKILL.md` — coherencia SDD
