---
name: armora-sdd
description: "Skill de coherencia SDD para ARMORA. Verifica que implementaciones, contratos y decisiones respeten la documentacion SDD del proyecto. Cargar ante cambios de alcance, stack, modelo o contratos."
---

# Skill: ARMORA SDD Coherence

## Objetivo

Garantizar que toda implementacion, decision tecnica y cambio propuesto respete la documentacion SDD del proyecto ARMORA.

## Fuentes de verdad

- `AGENTS.md` - reglas raiz
- `docs/sdd/00_indice.md` - indice SDD y decision tecnica vigente
- `docs/sdd/05_sdd_arquitectura.md` - arquitectura objetivo
- `docs/sdd/06_sdd_modelo_datos_inicial.md` - modelo de datos
- `docs/sdd/07_sdd_api_contratos.md` - contratos API
- `docs/sdd/04_sdd_requerimientos.md` - requerimientos funcionales/no funcionales
- `docs/sdd/02_stack_recomendado.md` - stack tecnologico
- `docs/sdd/08_sdd_roadmap_mvp.md` - fases y alcance MVP
- `docs/sdd/15_stack_mobile_flutter_dart.md` - decision mobile
- `docs/sdd/17_convencion_nombres_tecnicos.md` - convencion de nombres fisicos en espanol
- `docs/adr/ADR-001-inicial-arquitectura.md` - ADR de stack y arquitectura

## Reglas de coherencia

1. SDD prevalece sobre suposiciones del agente.
2. Si una solicitud contradice SDD, mostrar el impacto y pedir validacion antes de continuar.
3. Todo cambio de stack, contrato, modelo o alcance debe registrar un ADR.
4. Backend es fuente de verdad de reglas de negocio. Web y mobile no calculan precios, stock ni permisos como verdad.
5. Toda API debe ser versionada (`/api/v1`).
6. No hardcodear secretos ni datos sensibles.

## Cuando cargar esta skill

- Antes de iniciar un nuevo modulo o funcionalidad.
- Cuando se propone un cambio de stack o tecnologia.
- Cuando se modifica un contrato API o modelo de datos.
- Cuando hay contradiccion entre lo pedido y la documentacion.
- Despues de una decision arquitectonica importante.
