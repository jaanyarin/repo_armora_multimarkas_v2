# 03 — Espaciado, bordes y sombras

## Espaciado (píxeles)

| Token | px | Uso típico |
|---|---|---|
| `spacing.1` | 4 | Micro-separación |
| `spacing.2` | 8 | Gap entre icono y texto |
| `spacing.3` | 12 | Padding interno compacto |
| `spacing.4` | 16 | Padding estándar |
| `spacing.5` | 20 | Separación entre secciones |
| `spacing.6` | 24 | Margen de tarjeta |
| `spacing.8` | 32 | Separación de página |

## Bordes (border-radius)

| Token | px | Uso |
|---|---|---|
| `radius.sm` | 6 | Inputs, botones pequeños |
| `radius.md` | 10 | TextField, Select |
| `radius.lg` | 14 | Tarjetas, diálogos |
| `radius.xl` | 20 | Contenedores grandes |
| `radius.full` | 999 | Badges, avatares |

## Sombras

| Token | Valor |
|---|---|
| `shadows.sm` | `0 1px 2px rgba(3,4,7,0.06)` |
| `shadows.md` | `0 8px 24px rgba(3,4,7,0.08)` |
| `shadows.lg` | `0 20px 45px rgba(3,4,7,0.12)` |

## Implementación

- **Web**: `packages/design-system/tokens/spacing.ts`, `radius.ts`, `shadows.ts` + CSS variables en `vanguard.css`
- **Mobile**: `packages/mobile-core/lib/core/design/spacing.dart` (clase `VanguardSpacing`)
