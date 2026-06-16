# 02 — Tipografía

## Familia
**Calibri** (fallback: Segoe UI, Arial, sans-serif)

## Escala

| Nivel | Tamaño | Peso | Altura línea | Token web | Token Flutter |
|---|---|---|---|---|---|
| Display | 34px | ExtraBold (800) | 1.15 | `h1` | `VanguardTypography.display` |
| H1 | 28px | Bold (700) | 1.15 | `h2` | `VanguardTypography.h1` |
| H2 | 22px | Bold (700) | 1.2 | `h3` | `VanguardTypography.h2` |
| H3 | 18px | Semibold (600) | 1.3 | `h4` | `VanguardTypography.h3` |
| Body | 16px | Regular (400) | 1.4 | `body1` | `VanguardTypography.body` |
| Body small | 14px | Regular (400) | 1.4 | `body2` | `VanguardTypography.bodySmall` |
| Caption | 12px | Regular (400) | 1.4 | `caption` | `VanguardTypography.caption` |
| Button | 14px | Bold (700) | — | `button` | `VanguardTypography.button` |
| Label | 12px | Bold (700) | — | — | `VanguardTypography.label` |

## Implementación

- **Web**: `packages/design-system/tokens/typography.ts` → mapeado a `createTheme.typography` en `packages/design-system/web/theme.ts`
- **Mobile**: `packages/mobile-core/lib/core/design/typography.dart` (clase `VanguardTypography`)
