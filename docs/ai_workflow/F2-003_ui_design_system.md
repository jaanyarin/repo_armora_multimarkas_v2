# Handoff F2-003 — UI Design System

## Cambio realizado
Implementación completa del UI Design System basado en `OPENCODE_UI_DESIGN_SYSTEM.md` (paleta Vanguard, tipografía Calibri, tokens, componentes MD3).

## Documentos consultados
- `OPENCODE_UI_DESIGN_SYSTEM.md`
- `docs/sdd/16_plan_ejecucion_fase_1_fundacion_tecnica.md`
- `agentes/docs/ai/02_handoff_protocol.md`

## Archivos modificados/creados

### Web (Next.js + MUI v5)
- `frontend_web/src/design-system/tokens/colors.ts`, `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `index.ts`
- `frontend_web/src/design-system/web/vanguard.css`, `theme.ts`
- `frontend_web/src/design-system/web/components/StatusBadge.tsx`, `StatusSemaforo.tsx`, `index.ts`
- `frontend_web/src/design-system/web/layout/AppLayout.tsx`, `Sidebar.tsx`, `Topbar.tsx`, `index.ts`
- `frontend_web/src/app/layout.tsx` — ThemeProvider + CssBaseline
- `frontend_web/src/app/dashboard/page.tsx` — AppLayout + StatusBadge
- `frontend_web/next.config.mjs` — transpilePackages
- `frontend_web/tsconfig.json` — path alias

### Mobile (Flutter + MD3)
- `packages/mobile-core/lib/core/design/colors.dart`, `typography.dart`, `spacing.dart`, `tokens.dart`, `status.dart`
- `packages/mobile-core/lib/core/theme/app_theme.dart` — MD3 + paleta Vanguard
- `mobile_cliente/lib/core/theme/app_theme.dart` — sincronizado
- `mobile_proveedor/lib/core/theme/app_theme.dart` — sincronizado
- `mobile_cliente/lib/features/home/presentation/home_page.dart` — StatusBadge
- `mobile_proveedor/lib/features/home/presentation/home_page.dart` — StatusBadge
- `mobile_cliente/pubspec.yaml` — dependencia armora_mobile_core
- `mobile_proveedor/pubspec.yaml` — dependencia armora_mobile_core

### Documentación
- `.opencode/agents/ui_design_system.md` — perfil del agente UI Design System
- `docs/design-system/00_referencia.md` — copia del documento original
- `docs/design-system/01_paleta_vanguard.md`
- `docs/design-system/02_tipografia.md`
- `docs/design-system/03_espaciado_bordes_sombras.md`
- `docs/design-system/04_componentes.md`
- `docs/design-system/05_checklist_consistencia.md`

### Infraestructura
- `.env` — creado con PostgreSQL en puerto 5434, password `armorar_bd_set`
- `backend/api-quarkus/README.md` — actualizado con setup real

## Contratos API afectados
Ninguno. Solo cambios UI/UX.

## Modelo de datos afectado
Ninguno.

## Pruebas ejecutadas
- `npm run build` → PASS (6 rutas, 87.3 kB first load JS)
- `flutter analyze` → PASS (mobile-core, mobile_cliente, mobile_proveedor)
- `flutter test` → PASS (1/1 cada app)

## Riesgos abiertos
- La tipografia Calibri debe instalarse en el sistema para que Flutter la renderice correctamente. Fallback a sans-serif.
- MUI v5 envuelve la app en ThemeProvider; verificar compatibilidad si se agregan componentes server-side de Next.js.

## Siguiente agente recomendado
`armora-frontend-web` para aplicar componentes del design system en nuevas pantallas.
