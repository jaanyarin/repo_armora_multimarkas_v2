# Revisión UI/UX — Módulo "Gestión Zonas y Rutas"

> **Fecha:** 2026-06-19  
> **Revisor:** armora-ui-ux (Design System Vanguard MD3)  
> **Versión DS:** 1.0  
> **Páginas revisadas:** 3 páginas del módulo Zonas-Rutas + comparativa con Gestion Personal

---

## Resumen Ejecutivo

| Métrica | Valor |
|---|---|
| Hallazgos totales | 22 |
| Críticos (prioridad alta) | 1 |
| Altos (prioridad alta) | 5 |
| Medios (prioridad media) | 8 |
| Bajos (prioridad baja) | 8 |
| Estado general | **Requiere correcciones antes de pasar a QA** |

El hallazgo crítico (#H1) es un **bug funcional**: la página "Habilitar Ventas en Rutas" referencia `colors.semantic.error` y `colors.semanticBackground.error`, pero el token correcto es `danger`. Esto provoca que los chips de estado "Bloqueada" y los KPI de ventas bloqueadas no tengan color aplicado (se renderizan como `undefined`).

---

## 1. Página: Gestión Zonas y Rutas (CRUD admin)

**Archivo:** `frontend_web/src/app/zonas-rutas/gestion-zonas-rutas/page.tsx`

### H1 — Hardcoded `'#475569'` en TableCell headers (ALTA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Líneas 338, 371 |
| **Problema** | `color: '#475569'` es un valor hardcodeado no perteneciente a la paleta Vanguard |
| **Referencia DS** | `04_componentes.md` — MuiTableCell.head debe usar `colors.primary[900]` (#253355) y `backgroundColor: colors.primary[50]` según `theme.ts` línea 76 |
| **Corrección** | Reemplazar `color: '#475569'` por `color: colors.primary[900]` (o `colors.neutral.textStrong`). Eliminar el sx inline de TableCell cuando sea posible para que el theme lo herede automáticamente. |
| **Además** | `fontWeight: 800` sobreescribe el `fontWeight: 700` del theme. El DS define Label = 12px Bold (700). Usar `fontWeight: 700`. |

```diff
- <TableCell sx={{ fontWeight: 800, color: '#475569', textTransform: 'uppercase', fontSize: 12 }}>
+ <TableCell sx={{ fontWeight: 700, color: colors.primary[900], textTransform: 'uppercase', fontSize: 12 }}>
```

### H2 — `color="secondary"` en Button "Nueva ruta" (MEDIA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 286 |
| **Problema** | El botón usa `color="secondary"` que en el theme tiene `main: colors.primary[500]` (#456AB2), idéntico al primary `main` (#335296). La sobreescritura `containedSecondary` le asigna fondo `primary[100]` y texto `primary[800]`. **Funciona correctamente**, pero la diferencia visual entre "Nueva zona" (primary-600) y "Nueva ruta" (primary-100 bg) puede confundir al usuario sobre cuál es la acción principal. |
| **Referencia DS** | `04_componentes.md` — Botón secundario = `variant="contained" color="secondary"` |
| **Corrección** | No es un error de código, pero se recomienda evaluar si ambos botones deben tener el mismo peso visual (ambos primary) o si el secundario debe ser `variant="outlined"` para reflejar menor prioridad. |

### H3 — PoligonoChip usa `'#92400e'` hardcodeado (ALTA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 107 |
| **Problema** | `color: '#92400e'` no es un token Vanguard. Es un ámbar oscuro. |
| **Referencia DS** | `01_paleta_vanguard.md` — Color warning = `#F59E0B` (para estados "Observado" o pendiente) |
| **Corrección** | Usar `colors.semantic.warning` (#F59E0B) en lugar de `#92400e` |

```diff
- color: ok ? colors.semantic.success : '#92400e',
+ color: ok ? colors.semantic.success : colors.semantic.warning,
```

### H4 — EstadoChip no usa tokens Vanguard para Inactivo (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 95 |
| **Problema** | Para estado `INACTIVO`, se usa `color="default"` de MUI que aplica un gris genérico. El DS Vanguard define Inactivo con `color: #64748B` y fondo `#E8EBF6`. |
| **Referencia DS** | `01_paleta_vanguard.md` — Estado Inactivo = `#64748B` con fondo `#E8EBF6` |
| **Corrección** | Crear un chip específico para Inactivo usando tus tokens, o sobrescribir el chip default del theme. |
| **Prioridad** | Baja — el color default de MUI es visualmente aceptable aunque no sea pixel-perfect. |

### H5 — Página sin estado de error explícito en la tabla (ALTA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Líneas 343, 376 |
| **Problema** | Si la API falla, la tabla solo muestra un mensaje genérico en el catch (vía snackbar). No hay un estado de error dedicado con opción de reintentar. |
| **Referencia DS** | Principio ARMORA UI/UX: "Cada pantalla: estados loading, empty, error, success, disabled" |
| **Corrección** | Agregar un estado de error con botón "Reintentar", siguiendo el patrón de `gestion-personal` (líneas 413-422). |

### H6 — Empty states inconsistentes con Gestion Personal (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Líneas 343-344, 376-377 |
| **Problema** | El empty state es un texto simple dentro de un TableCell. Gestion Personal usa un Box centrado con padding (líneas 423-431). |
| **Corrección** | Unificar el patrón de empty state con el de Gestion Personal. |

### H7 — Sin sombras Vanguard en KPI cards (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 300 |
| **Problema** | Las KPI cards no tienen `boxShadow`. Gestion Personal las tiene con `boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)'` (que tampoco es un token Vanguard). |
| **Referencia DS** | `03_espaciado_bordes_sombras.md` — Sombras: sm (0 1px 2px rgba(3,4,7,0.06)), md (0 8px 24px rgba(3,4,7,0.08)), lg (0 20px 45px rgba(3,4,7,0.12)) |
| **Corrección** | Agregar `boxShadow: '0 8px 24px rgba(3, 4, 7, 0.08)'` (token md) a las KPI cards. |

### H8 — Snackbar en posición bottom (inconsistente) (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 465 |
| **Problema** | Snackbar usa posición bottom por defecto. Gestion Personal usa `anchorOrigin={{ vertical: 'top', horizontal: 'center' }}` con `mt: 7`. Habilitar Ventas en Rutas también usa bottom. |
| **Corrección** | Unificar todas las páginas a la misma posición de snackbar. La posición top-center de Gestion Personal es preferible porque no se superpone con la tabla. |

---

## 2. Página: Mapa y Polígono

**Archivo:** `frontend_web/src/app/zonas-rutas/gestion-zonas-rutas/poligono/page.tsx`

### H9 — Hardcoded `'#0f172a'` en texto de vértices SVG (MEDIA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 226 |
| **Problema** | `fill="#0f172a"` en etiquetas de texto de vértices. Este color slate oscuro no es un token Vanguard. |
| **Referencia DS** | `colors.neutral.text` (#030407) o `colors.primary[950]` (#030407) |
| **Corrección** | Usar `colors.neutral.text` (#030407) o un tono del primary. |

```diff
- <text x={x + 12} y={y - 10} fontSize="13" fontWeight="800" fill="#0f172a">
+ <text x={x + 12} y={y - 10} fontSize="13" fontWeight="800" fill={colors.neutral.text}>
```

### H10 — Hardcoded `'#dbe3ee'` en fondo del contenedor del mapa (MEDIA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 338 |
| **Problema** | `backgroundColor: '#dbe3ee'` es un azul grisáceo no Vanguard. |
| **Referencia DS** | `colors.neutral.background` (#F4F6FB) para fondos de página, o `colors.primary[50]` (#F4F6FB) para fondos de tabla/header. |
| **Corrección** | Usar `colors.primary[50]` (#F4F6FB) que es el color de fondo estándar Vanguard. |

```diff
- backgroundColor: '#dbe3ee',
+ backgroundColor: colors.primary[50],
```

### H11 — Hardcoded `'#0f172a'` y `'#e2e8f0'` en bloque de coordenadas (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Líneas 553-554 |
| **Problema** | `backgroundColor: '#0f172a'` y `color: '#e2e8f0'` en el `<pre>` de coordenadas generadas. Son colores slate propios de terminal/code blocks pero no Vanguard. |
| **Referencia DS** | No hay un token para fondos de code blocks. |
| **Corrección** | Considerar usar `colors.primary[950]` (#030407) como fondo y `colors.primary[50]` como texto, o mantener colores slate si es intencional (un code block puede justificar colores propios). Prioridad baja por ser un elemento utilitario. |

### H12 — Migajas de estado con `'#92400e'` (ALTA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 533 |
| **Problema** | Mismo problema que H3: `color: '#92400e'` hardcodeado para el estado de advertencia del polígono. |
| **Corrección** | Usar `colors.semantic.warning` (#F59E0B). |

### H13 — Sin estado de error en el Mapa (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Función `loadData` línea 417 |
| **Problema** | Si falla la carga de la zona, solo se muestra un snackbar. No hay estado de error en la interfaz con opción de reintentar. |
| **Corrección** | Agregar estado de error con botón reintentar, siguiendo el patrón de Gestion Personal. |

### H14 — Título de página sin `letterSpacing` (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 491 |
| **Problema** | Gestion Personal usa `letterSpacing: '-0.03em'` en el título `h4` (línea 1026). Esta página no lo usa. |
| **Corrección** | Agregar `letterSpacing: '-0.03em'` para consistencia con Gestion Personal. |

---

## 3. Página: Habilitar Ventas en Rutas

**Archivo:** `frontend_web/src/app/zonas-rutas/habilitar-ventas-rutas/page.tsx`

### 🔴 H15 — CRÍTICO: `colors.semantic.error` no existe en tokens (ALTA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Líneas 74-75, 213 |
| **Problema** | El código referencia `colors.semantic.error` y `colors.semanticBackground.error`, pero el token correcto en `colors.ts` es `danger` (no `error`). En TypeScript sin modo strict, esto resuelve a `undefined`; en modo strict, es un error de compilación. |
| **Impacto** | - El chip de "Bloqueada" en EstadoVentasChip no tendrá color de fondo ni de texto (se renderiza sin estilos de peligro).<br>- El KPI de "Ventas bloqueadas" (línea 213) no tendrá color (resuelve a `undefined`). |
| **Referencia DS** | `colors.ts` líneas 30-35: `semantic: { success, warning, danger, info }` — no existe `.error` |
| **Corrección** | Reemplazar todas las ocurrencias de `colors.semantic.error` → `colors.semantic.danger` y `colors.semanticBackground.error` → `colors.semanticBackground.danger` |

```diff
- backgroundColor: habilitada ? colors.semanticBackground.success : colors.semanticBackground.error,
- color: habilitada ? colors.semantic.success : colors.semantic.error,
+ backgroundColor: habilitada ? colors.semanticBackground.success : colors.semanticBackground.danger,
+ color: habilitada ? colors.semantic.success : colors.semantic.danger,
```

```diff
- ['Ventas bloqueadas', kpi.bloqueadas, colors.semantic.error, <BlockIcon key="block" />],
+ ['Ventas bloqueadas', kpi.bloqueadas, colors.semantic.danger, <BlockIcon key="block" />],
```

### H16 — Hardcoded `'#475569'` en TableCell headers (ALTA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 303 |
| **Problema** | Mismo que H1: `color: '#475569'` hardcodeado en headers de tabla. |
| **Corrección** | Reemplazar con `color: colors.primary[900]` y `fontWeight: 700` en lugar de 900. O mejor aún, eliminar el sx y dejar que el theme herede. |

### H17 — `fontWeight: 900` en KPI numbers no está en la escala tipográfica (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Líneas 197, 222, 303 |
| **Problema** | `fontWeight: 900` se usa en varios lugares. La escala tipográfica Vanguard (`02_tipografia.md`) solo define pesos: 400, 600, 700, 800. El peso 900 no existe en la escala. |
| **Referencia DS** | `02_tipografia.md` — Display: 800, H1/H2: 700, H3: 600, Body: 400, Button: 700, Label: 700 |
| **Corrección** | Los títulos de página deben usar `fontWeight: 800` (Display). Los KPI numbers pueden mantener 800 o 900 según preferencia del DS — se recomienda definirlo en el token y unificar. Si se usa 900, agregarlo a la escala tipográfica del DS. |

### H18 — Snackbar en posición bottom (BAJA)

| Ítem | Detalle |
|---|---|
| **Ubicación** | Línea 362 |
| **Problema** | Mismo que H8 — Snackbar usa posición bottom por defecto. Inconsistente con Gestion Personal. |
| **Corrección** | Unificar posición top-center con `anchorOrigin={{ vertical: 'top', horizontal: 'center' }}` y `mt: 7`. |

---

## 4. Hallazgos Transversales (afectan a 2+ páginas)

### H19 — Inconsistencia en TableCell header styling entre las 3 páginas (MEDIA)

| Página | fontWeight | color | fontSize | textTransform |
|---|---|---|---|---|
| Gestion Zonas y Rutas | 800 | `#475569` | 12 | uppercase |
| Habilitar Ventas en Rutas | 900 | `#475569` | 12 | uppercase |
| Gestion Personal | 700 | `#475569` | 12 | uppercase |
| **Theme MUI** | **700** | **primary[900]** | — | — |

**Corrección:** Unificar las 3 páginas usando el valor del theme (`fontWeight: 700, color: colors.primary[900]`) o eliminando el sx inline para heredar del `MuiTableCell.head` definido en `theme.ts`.

### H20 — KPI cards: borderRadius inconsistente (BAJA)

| Página | borderRadius (MUI units) | px equivalente |
|---|---|---|
| Gestion Zonas y Rutas | 2 | 16px |
| Habilitar Ventas en Rutas | 2 | 16px |
| Gestion Personal | 3 | 24px |
| **DS Vanguard** | **radius.lg = 14px** | — |

**Corrección:** Unificar usando `borderRadius: '14px'` (token radius.lg) para todas las KPI cards.

### H21 — KPI cards: boxShadow inconsistente (BAJA)

| Página | boxShadow |
|---|---|
| Gestion Zonas y Rutas | Sin sombra |
| Habilitar Ventas en Rutas | Sin sombra |
| Gestion Personal | `'0 10px 25px rgba(15, 23, 42, 0.08)'` (no Vanguard) |
| **DS Vanguard** | md: `'0 8px 24px rgba(3, 4, 7, 0.08)'` |

**Corrección:** Unificar las 3 páginas usando el token `shadows.md` de Vanguard: `'0 8px 24px rgba(3, 4, 7, 0.08)'`.

### H22 — Sin loading states con spinner (MEDIA)

| Página | Loading state actual |
|---|---|
| Gestion Zonas y Rutas | Texto "Cargando..." en TableCell |
| Habilitar Ventas en Rutas | Texto "Cargando rutas..." en TableCell |
| Gestion Personal | Texto "Cargando personal..." centrado |
| Polígono | Texto "Cargando informacion..." en Paper |

**Corrección:** Implementar un componente `VanguardLoading` compartido que muestre un CircularProgress + texto descriptivo, usado en todas las páginas.

---

## 5. Resumen de Correcciones por Prioridad

### Prioridad Alta (Debe corregirse antes de QA)

| ID | Archivo | Línea(s) | Descripción |
|---|---|---|---|
| H15 | habilitar-ventas-rutas/page.tsx | 74, 75, 213 | `colors.semantic.error` no existe → usar `danger` |
| H1 | gestion-zonas-rutas/page.tsx | 338, 371 | `#475569` hardcodeado → usar `colors.primary[900]` |
| H3 | gestion-zonas-rutas/page.tsx | 107 | `#92400e` hardcodeado → usar `colors.semantic.warning` |
| H12 | poligono/page.tsx | 533 | `#92400e` hardcodeado → usar `colors.semantic.warning` |
| H16 | habilitar-ventas-rutas/page.tsx | 303 | `#475569` hardcodeado → usar `colors.primary[900]` |
| H5 | gestion-zonas-rutas/page.tsx | 343 | Falta estado de error con reintentar |

### Prioridad Media

| ID | Archivo | Línea(s) | Descripción |
|---|---|---|---|
| H2 | gestion-zonas-rutas/page.tsx | 286 | Evaluar si `color="secondary"` es la variante correcta |
| H9 | poligono/page.tsx | 226 | `#0f172a` hardcodeado → `colors.neutral.text` |
| H10 | poligono/page.tsx | 338 | `#dbe3ee` hardcodeado → `colors.primary[50]` |
| H19 | todas | múltiples | Inconsistencia fontWeight/color en TableCell headers |
| H22 | todas | múltiples | Sin loading states con spinner consistente |

### Prioridad Baja

| ID | Archivo | Línea(s) | Descripción |
|---|---|---|---|
| H4 | gestion-zonas-rutas/page.tsx | 95 | Chip Inactivo no usa token `#64748B` |
| H6 | gestion-zonas-rutas/page.tsx | 343 | Empty state inconsistente |
| H7 | gestion-zonas-rutas/page.tsx | 300 | KPI sin sombra Vanguard |
| H8 | gestion-zonas-rutas/page.tsx | 465 | Snackbar bottom vs top |
| H11 | poligono/page.tsx | 553 | Code block con colores no Vanguard |
| H13 | poligono/page.tsx | 417 | Sin estado de error |
| H14 | poligono/page.tsx | 491 | Sin `letterSpacing` en título |
| H17 | habilitar-ventas-rutas/page.tsx | 197, 222 | fontWeight 900 fuera de escala |
| H18 | habilitar-ventas-rutas/page.tsx | 362 | Snackbar bottom vs top |
| H20 | todas | múltiples | borderRadius inconsistente en KPI |
| H21 | todas | múltiples | boxShadow inconsistente en KPI |

---

## 6. Patrón Correcto Recomendado (basado en Gestion Personal)

Para lograr consistencia, las 3 páginas deben alinearse al patrón establecido en **Gestion Personal**:

| Elemento | Patrón correcto | Referencia |
|---|---|---|
| Page title | `variant="h4" sx={{ fontWeight: 800, color: colors.primary[600], letterSpacing: '-0.03em' }}` | gestion-personal:1026 |
| KPI cards | `Paper sx={{ p: 2, borderRadius: 3, border: '1px solid ${colors.neutral.border}', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)' }}` | gestion-personal:222-226 |
| Table headers | `MuiTableCell.head` theme o `sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }}` | gestion-personal:439-462 |
| Estado Chip | `Chip label={...} color={...} size="small" sx={{ fontWeight: 700, borderRadius: '8px' }}` | gestion-personal:122-130 |
| Empty state | `Box sx={{ textAlign: 'center', py: 6 }} > Typography` con texto diferenciado | gestion-personal:423-431 |
| Error state | `Box sx={{ textAlign: 'center', py: 6 }} > Typography + Button reintentar` | gestion-personal:413-422 |
| Loading | Mismo patrón que empty pero con texto de carga | gestion-personal:406-411 |
| Snackbar | `anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 7 }}` | gestion-personal:1244 |
| Dialog title | `sx={{ fontWeight: 800, color: colors.primary[600] }}` | gestion-personal:1179 |

> **Nota:** El patrón actual de Gestion Personal **también tiene desviaciones del DS Vanguard** (sombras no token, `#475569` hardcodeado, colores slate). Se recomienda una limpieza general transversal del DS en todos los módulos como tarea separada.

---

## 7. Recomendaciones Adicionales

1. **Crear componentes compartidos de tabla Vanguard** (`VanguardTable`, `VanguardTableHeader`, `VanguardKpiCard`) que encapsulen los tokens y eviten la repetición de sx inline en cada página.

2. **Unificar el patrón de estados** (loading, empty, error, success) en un componente reutilizable `VanguardStateWrapper`.

3. **Corregir el bug de `colors.semantic.error` en todo el proyecto** (puede haber más ocurrencias en otras páginas).

4. **Agregar tipado estricto al objeto `colors`** para que TypeScript detecte automáticamente referencias a propiedades inexistentes como `colors.semantic.error`.

5. **Auditar todas las páginas existentes** contra los tokens de color Vanguard para eliminar hardcodeos residuales.

---

## Checklist de Corrección Inmediata

- [ ] **H15** — Reemplazar `colors.semantic.error` → `colors.semantic.danger` y `colors.semanticBackground.error` → `colors.semanticBackground.danger` en habilitar-ventas-rutas
- [ ] **H1, H16** — Reemplazar `'#475569'` por `colors.primary[900]` en headers de tabla
- [ ] **H3, H12** — Reemplazar `'#92400e'` por `colors.semantic.warning`
- [ ] **H5** — Agregar estado de error con botón reintentar en gestion-zonas-rutas
- [ ] **H9** — Reemplazar `'#0f172a'` por `colors.neutral.text`
- [ ] **H10** — Reemplazar `'#dbe3ee'` por `colors.primary[50]`
- [ ] **H19** — Unificar fontWeight a 700 y color a primary[900] en headers de tabla
