---
name: armora-init
description: "Inicializa el proyecto ARMORA: verifica configuracion de agentes, carga skills de ruteo y SDD, valida documentacion y activa el modo de desarrollo multi-agente."
command: "/init"
---

# /init - Inicializar proyecto ARMORA

## Que hace este comando

1. **Verifica estructura** - Confirma que existan todos los archivos de configuracion de agentes y documentacion SDD.
2. **Carga skills activas** - Las skills ARMORA se cargan automaticamente al coincidir con la descripcion de la tarea. Skills disponibles:
   - `armora-agent-routing` — ruteo entre agentes
   - `armora-sdd` — coherencia SDD
   - `armora-architect` — orquestacion y arquitectura
   - `armora-backend-quarkus` — backend Quarkus
   - `armora-frontend-web` — admin web Next.js
   - `armora-mobile-flutter` — apps Flutter
   - `armora-database` — base de datos PostgreSQL
   - `armora-qa` — pruebas y calidad
   - `armora-security` — seguridad y permisos
   - `armora-devops` — infraestructura y despliegue
   - `armora-ui-ux` — diseno UI/UX
   - `armora-product-owner` — alcance y reglas de negocio
   - `armora-integrations` — pagos/SUNAT/integraciones
   - `armora-sdd-manager` — documentacion SDD
   - `armora-delivery` — cronograma y coordinacion
3. **Establece agente por defecto** - El agente `armora-architect` queda como orquestador principal.
4. **Valida coherencia** - Revisa que la decision tecnica vigente este alineada entre AGENTS.md, opencode.json y SDD docs.
5. **Reporta readiness** - Muestra que agentes estan disponibles y como invocarlos.

## Flujo de ejecucion

Paso 1: Verificar archivos requeridos
- `opencode.json` (raiz)
- `agentes/README.md`
- `docs/sdd/00_indice.md`
- Skills ARMORA en `.opencode/skills/armora-*/`
- Skills: `armora-agent-routing`, `armora-sdd`, `armora-init`

Paso 2: Verificar skills disponibles
- Skills ARMORA deben existir en `.opencode/skills/armora-*/SKILL.md` (minimo 15 skills incluyendo routing, init y sdd)

Paso 3: Validar stack tecnico
Confirmar que el stack coincide entre todos los documentos:
- Admin web: Next.js + React + TypeScript
- Mobile: Flutter + Dart (cliente y proveedor)
- Backend: Quarkus + Java 21+
- Base de datos: PostgreSQL
- Cache/colas: Redis
- Contratos: OpenAPI REST `/api/v1`
- Despliegue: Docker + servidor fisico

Paso 4: Reportar resultado
Si todo OK -> "Proyecto ARMORA inicializado. 13 agentes disponibles. Usar /help para lista de comandos."
Si falta algo -> listar lo faltante y pedir accion.

## Output esperado

```
=== ARMORA INIT ===
Proyecto: ARMORA Multimarkas v2
Stack: Next.js + Quarkus + Flutter + PostgreSQL + Redis
Agentes: 13 configurados en opencode.json
Skills: 15 skills ARMORA en .opencode/skills/
Default agent: armora-architect
Estado: LISTO
```
