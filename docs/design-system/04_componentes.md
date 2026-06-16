# 04 — Componentes

## StatusBadge

Indicador de estado de negocio con chip coloreado.

| Estado | Web (MUI Chip) | Mobile (Chip) |
|---|---|---|
| `operativo` | `StatusBadge status="operativo"` | `StatusBadge(status: StatusType.operativo)` |
| `observado` | → | → |
| `critico` | → | → |
| `proceso` | → | → |
| `inactivo` | → | → |

## StatusSemaforo

Indicador de criticidad con punto + texto.

| Nivel | Web | Mobile |
|---|---|---|
| `critico` | `StatusSemaforo level="critico"` | `StatusSemaforo(level: StatusType.critico)` |
| `observado` | → | → |
| `operativo` | → | → |

## Botones (MUI / ElevatedButton)

| Variante | Web | Mobile |
|---|---|---|
| Primario | `Button variant="contained"` | `ElevatedButton` |
| Secundario | `Button variant="contained" color="secondary"` | `OutlinedButton` |
| Texto | `Button variant="text"` | `TextButton` |

## Campos de texto

| Web | Mobile |
|---|---|
| `TextField variant="outlined" size="small"` | `TextField` con `InputDecorationTheme` Vanguard |

## Layout

| Web | Mobile |
|---|---|
| `AppLayout` (Topbar + Sidebar + main) | Scaffold + AppBar + Drawer (MD3) |

## Implementación

- **Web**: `packages/design-system/web/components/` + `packages/design-system/web/layout/`
- **Mobile**: `packages/mobile-core/lib/core/design/status.dart`
