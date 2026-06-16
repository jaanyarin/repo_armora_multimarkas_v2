# 01 — Paleta Vanguard

## Colores primarios (azul ARMORA)

| Token | Hex | Uso |
|---|---|---|
| `primary-50` | `#F4F6FB` | Fondos de tabla, headers |
| `primary-100` | `#E8EBF6` | Sidebar seleccionado, botón secundario |
| `primary-200` | `#CBD5EC` | Bordes, divisores |
| `primary-300` | `#9DB2DC` | Hover, estados light |
| `primary-400` | `#6889C8` | Acento |
| `primary-500` | `#456AB2` | Botón primario, links |
| `primary-600` | `#335296` | Texto fuerte, header activo |
| `primary-700` | `#2B4279` | Títulos, hover primary |
| `primary-800` | `#273A65` | Dark mode |
| `primary-900` | `#253355` | Texto más fuerte |
| `primary-950` | `#030407` | Casi negro |

## Colores semánticos

| Token | Hex | Fondo |
|---|---|---|
| `success` | `#16A34A` | `#DCFCE7` |
| `warning` | `#F59E0B` | `#FEF3C7` |
| `danger` | `#DC2626` | `#FEE2E2` |
| `info` | `#2563EB` | `#DBEAFE` |

## Estados de negocio

| Estado | Color | Fondo |
|---|---|---|
| Operativo | `#16A34A` | `#DCFCE7` |
| Observado | `#F59E0B` | `#FEF3C7` |
| Crítico | `#DC2626` | `#FEE2E2` |
| En Proceso | `#2563EB` | `#DBEAFE` |
| Inactivo | `#64748B` | `#E8EBF6` |

## Neutrales

| Token | Hex |
|---|---|
| `white` | `#FFFFFF` |
| `black` | `#030407` |
| `background` | `#F4F6FB` |
| `surface` | `#FFFFFF` |
| `surface-alt` | `#E8EBF6` |
| `border` | `#CBD5EC` |
| `text` | `#030407` |
| `text-strong` | `#253355` |
| `text-muted` | `#64748B` |
| `disabled` | `#CBD5E1` |

## Implementación

- **Web**: `packages/design-system/tokens/colors.ts` + CSS variables en `packages/design-system/web/vanguard.css`
- **Mobile**: `packages/mobile-core/lib/core/design/colors.dart` (clase `VanguardColors`)
