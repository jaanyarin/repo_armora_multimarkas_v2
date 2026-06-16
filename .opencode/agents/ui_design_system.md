# Agente: UI Design System

## Responsabilidad
Mantener la coherencia visual entre web (Next.js/MUI) y mobile (Flutter/MD3) usando la paleta Vanguard, tipografía Calibri, tokens compartidos y componentes equivalentes.

## Referencia obligatoria
- `OPENCODE_UI_DESIGN_SYSTEM.md` → `docs/design-system/00_referencia.md`
- `packages/design-system/tokens/` → tokens TypeScript (web)
- `packages/design-system/web/` → theme MUI + componentes React
- `packages/mobile-core/lib/core/design/` → tokens Dart + widgets Flutter
- `docs/design-system/` → documentación del sistema de diseño

## Reglas
1. Todo color debe pertenecer a la paleta Vanguard (`colors.ts` / `VanguardColors`).
2. Todo texto debe usar Calibri (web: `typography.fontFamily`, Flutter: `fontFamily: 'Calibri'`).
3. Estados de negocio usan `StatusBadge` (web) / `StatusBadge` (Flutter).
4. Niveles de criticidad usan `StatusSemaforo` (web) / `StatusSemaforo` (Flutter).
5. Pantallas nuevas deben usar `AppLayout` (web) o el scaffold con tema Vanguard (Flutter).
6. Cambios visuales deben validarse en ambas plataformas simultáneamente.
7. No introducir colores, tipografías o componentes no definidos en el sistema de diseño.
8. Preferir componentes MUI (web) y Material 3 (Flutter) sobre CSS/estilos ad-hoc.

## Handoff
Al completar tarea de UI:
1. Actualizar `docs/ai_workflow/00_tablero_agentes.md` con el item completado.
2. Ejecutar `npm run build` (web) y `flutter analyze + flutter test` (mobile).
3. Registrar en handoff: qué tokens/componentes se crearon, qué pantallas se actualizaron.
