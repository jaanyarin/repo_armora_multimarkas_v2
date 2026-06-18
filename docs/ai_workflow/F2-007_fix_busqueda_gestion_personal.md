# Handoff F2-007 — Fix búsqueda rápida (pérdida de foco)

## Cambio realizado
Se corrigió la pérdida de foco en el input de búsqueda rápida de la página Gestión del Personal.

**Causa raíz:** Los componentes helper `FilterToolbar`, `KpiCards`, `PersonalTable`, `DetailDrawer` estaban definidos dentro del componente principal `GestionPersonalPage`, lo que provocaba que React los tratara como nuevos tipos de componente en cada render, forzando un remontaje del árbol DOM y perdiendo el foco del input.

**Solución:**
1. Se extrajeron todos los componentes helper al scope del módulo (fuera del componente principal)
2. Se agregó `key="search-input-fixed"` al TextField como respaldo

## Documentos consultados
- `frontend_web/src/app/personal/gestion-personal/page.tsx`
- `docs/ai_workflow/00_tablero_agentes.md`

## Archivos modificados
- `frontend_web/src/app/personal/gestion-personal/page.tsx` — refactor mayor: componentes extraídos, props tipadas

## Contratos API afectados
Ninguno

## Modelo de datos afectado
Ninguno

## Permisos/scopes afectados
Ninguno

## Pruebas ejecutadas
- `tsc --noEmit` → 0 errores
- `next build` → 0 errores

## Pruebas pendientes
- Verificación manual: al escribir en el input de búsqueda, el foco no se pierde

## Riesgos abiertos
Ninguno

## Validaciones pendientes
Ninguna

## Siguiente agente recomendado
`armora-qa` para verificación manual de foco
