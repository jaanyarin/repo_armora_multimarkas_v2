# OPENCODE UI DESIGN SYSTEM - ARMORA SAC / VANGUARD MD3

## 1. Propósito del archivo

Este documento debe ser leído por OpenCode, VSCode Copilot, agentes de desarrollo o cualquier asistente de IA que participe en el proyecto.

Su objetivo es asegurar que todo el Frontend Web y Mobile del proyecto mantenga una misma identidad visual, estructura de componentes, reglas de diseño, paleta de colores y comportamiento UI basado en Material Design 3.

Este archivo NO es una maqueta visual. Es una guía técnica obligatoria para implementar pantallas reales.

---

## 2. Contexto del proyecto

El proyecto corresponde a ARMORA SAC y debe implementar una solución web y mobile con arquitectura moderna.

Stack recomendado del proyecto:

```txt
Backend: Quarkus / Java
Base de datos: MySQL
Frontend Web: React
Mobile: React Native
Autenticación: Microsoft Identity + JWT
UI Base: Material Design 3
Web UI recomendada: MUI personalizado o Material Web
Mobile UI recomendada: React Native Paper con MD3
```

La UI debe mantener una estética corporativa sobria, moderna, legible y escalable.

---

## 3. Objetivo del Design System

Todo desarrollo de interfaz debe cumplir lo siguiente:

1. Usar Material Design 3 como base visual.
2. Usar la paleta Vanguard definida en este documento.
3. Usar tipografía Calibri.
4. Evitar colores hardcodeados en pantallas.
5. Centralizar colores, espaciados, radios, sombras y tipografía en tokens.
6. Reutilizar componentes base.
7. Mantener equivalencia visual entre Web y Mobile.
8. Usar estados tipo semáforo para una identificación rápida.
9. Mantener accesibilidad, contraste y consistencia.
10. Separar documentación, tokens, theme y componentes.

---

## 4. Estructura recomendada del repositorio

La estructura mínima esperada debe ser:

```txt
repo_armora_sac/
│
├── docs/
│   └── design-system/
│       ├── 01_design_tokens.md
│       ├── 02_material_design_3.md
│       ├── 03_componentes_web.md
│       ├── 04_componentes_mobile.md
│       └── 05_reglas_uso_ui.md
│
├── packages/
│   └── design-system/
│       ├── tokens/
│       │   ├── colors.ts
│       │   ├── typography.ts
│       │   ├── spacing.ts
│       │   ├── radius.ts
│       │   └── shadows.ts
│       │
│       ├── web/
│       │   ├── theme.ts
│       │   ├── Button.tsx
│       │   ├── TextField.tsx
│       │   ├── Select.tsx
│       │   ├── StatusBadge.tsx
│       │   ├── StatusSemaforo.tsx
│       │   ├── DataTable.tsx
│       │   ├── AppLayout.tsx
│       │   ├── Sidebar.tsx
│       │   └── Topbar.tsx
│       │
│       └── mobile/
│           ├── theme.ts
│           ├── Button.tsx
│           ├── TextInput.tsx
│           ├── Select.tsx
│           ├── StatusBadge.tsx
│           ├── StatusSemaforo.tsx
│           ├── Card.tsx
│           └── ScreenLayout.tsx
│
├── apps/
│   ├── web/
│   └── mobile/
│
└── .opencode/
    └── agents/
        └── ui_design_system.md
```

Si el proyecto actual no usa exactamente esta estructura, adaptar la implementación respetando los mismos conceptos: tokens compartidos, temas separados, componentes reutilizables y documentación.

---

## 5. Reglas obligatorias para OpenCode

Antes de crear o modificar una pantalla, OpenCode debe:

1. Revisar este archivo.
2. Revisar si ya existe un componente base en `packages/design-system`.
3. No crear colores directos dentro de pantallas.
4. No crear botones, inputs, selects, badges o cards desde cero si ya existe componente base.
5. No mezclar estilos sin criterio.
6. Usar tokens importados.
7. Mantener Material Design 3 como referencia visual.
8. Mantener layout responsive en Web.
9. Mantener compatibilidad táctil en Mobile.
10. Usar semáforos para estados operativos, observados y críticos.

---

## 6. Paleta oficial Vanguard

La siguiente paleta debe usarse como base `primary` y `secondary`.

Aunque originalmente pueda llamarse `black`, visualmente funciona como una escala azul/gris corporativa.

```ts
export const colors = {
  primary: {
    50: "#f4f6fb",
    100: "#e8ebf6",
    200: "#cbd5ec",
    300: "#9db2dc",
    400: "#6889c8",
    500: "#456ab2",
    600: "#335296",
    700: "#2b4279",
    800: "#273a65",
    900: "#253355",
    950: "#030407",
  },
};
```

### Uso recomendado de la escala

```txt
primary-50: fondo general claro
primary-100: fondos suaves, hover suave, chips claros
primary-200: bordes suaves, divisores, contenedores secundarios
primary-300: elementos desactivados visuales o bordes destacados
primary-400: foco, acentos suaves, íconos secundarios
primary-500: color secundario activo
primary-600: acción principal
primary-700: hover principal / activo
primary-800: navegación activa / headers fuertes
primary-900: textos fuertes / paneles oscuros
primary-950: sidebar oscuro / contraste máximo
```

---

## 7. Tokens de color completos

Crear o actualizar:

```txt
packages/design-system/tokens/colors.ts
```

Contenido recomendado:

```ts
export const colors = {
  primary: {
    50: "#f4f6fb",
    100: "#e8ebf6",
    200: "#cbd5ec",
    300: "#9db2dc",
    400: "#6889c8",
    500: "#456ab2",
    600: "#335296",
    700: "#2b4279",
    800: "#273a65",
    900: "#253355",
    950: "#030407",
  },

  secondary: {
    50: "#f4f6fb",
    100: "#e8ebf6",
    200: "#cbd5ec",
    300: "#9db2dc",
    400: "#6889c8",
    500: "#456ab2",
    600: "#335296",
    700: "#2b4279",
    800: "#273a65",
    900: "#253355",
    950: "#030407",
  },

  semantic: {
    success: "#16a34a",
    warning: "#f59e0b",
    danger: "#dc2626",
    info: "#2563eb",
  },

  semanticBackground: {
    success: "#dcfce7",
    warning: "#fef3c7",
    danger: "#fee2e2",
    info: "#dbeafe",
  },

  status: {
    operativo: "#16a34a",
    observado: "#f59e0b",
    critico: "#dc2626",
    proceso: "#2563eb",
    inactivo: "#64748b",
  },

  neutral: {
    white: "#ffffff",
    black: "#030407",
    background: "#f4f6fb",
    surface: "#ffffff",
    surfaceAlt: "#e8ebf6",
    border: "#cbd5ec",
    text: "#030407",
    textStrong: "#253355",
    textMuted: "#64748b",
    disabled: "#cbd5e1",
  },
};
```

---

## 8. Tipografía oficial

La tipografía principal del sistema debe ser Calibri.

Crear o actualizar:

```txt
packages/design-system/tokens/typography.ts
```

```ts
export const typography = {
  fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif',

  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 34,
  },

  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extraBold: 800,
  },

  lineHeight: {
    tight: 1.15,
    normal: 1.4,
    relaxed: 1.6,
  },
};
```

Reglas:

```txt
- Títulos principales: 28px a 34px, peso 700 u 800.
- Títulos de sección: 22px, peso 700.
- Labels: 14px, peso 700.
- Texto normal: 16px, peso 400.
- Texto auxiliar: 12px a 14px, color muted.
- Botones: 14px a 16px, peso 700.
```

---

## 9. Spacing

Crear:

```txt
packages/design-system/tokens/spacing.ts
```

```ts
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};
```

Reglas:

```txt
- Padding estándar de pantalla web: 24px a 32px.
- Padding estándar mobile: 16px.
- Separación entre campos: 16px.
- Separación entre secciones: 24px.
- Separación entre cards: 16px a 20px.
```

---

## 10. Radius

Crear:

```txt
packages/design-system/tokens/radius.ts
```

```ts
export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};
```

Reglas:

```txt
- Inputs: 10px a 12px.
- Botones: 10px a 12px.
- Cards: 14px a 20px.
- Chips y badges: 999px.
- Modales: 20px.
```

---

## 11. Sombras

Crear:

```txt
packages/design-system/tokens/shadows.ts
```

```ts
export const shadows = {
  sm: "0 1px 2px rgba(3, 4, 7, 0.06)",
  md: "0 8px 24px rgba(3, 4, 7, 0.08)",
  lg: "0 20px 45px rgba(3, 4, 7, 0.12)",
};
```

Reglas:

```txt
- Usar sombras suaves.
- No abusar de sombras fuertes.
- Preferir bordes claros para separación de contenido.
```

---

## 12. Integración Web recomendada

Para Web con React, se recomienda usar MUI personalizado con el tema Vanguard.

Instalación:

```bash
cd apps/web
npm install @mui/material @emotion/react @emotion/styled
```

Tema recomendado:

```txt
packages/design-system/web/theme.ts
```

```ts
import { createTheme } from "@mui/material/styles";
import { colors } from "../tokens/colors";
import { typography } from "../tokens/typography";

export const webTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary[600],
      light: colors.primary[300],
      dark: colors.primary[800],
      contrastText: "#ffffff",
    },
    secondary: {
      main: colors.primary[500],
      light: colors.primary[200],
      dark: colors.primary[700],
      contrastText: "#ffffff",
    },
    success: {
      main: colors.semantic.success,
    },
    warning: {
      main: colors.semantic.warning,
    },
    error: {
      main: colors.semantic.danger,
    },
    info: {
      main: colors.semantic.info,
    },
    background: {
      default: colors.neutral.background,
      paper: colors.neutral.surface,
    },
    text: {
      primary: colors.neutral.text,
      secondary: colors.neutral.textMuted,
    },
    divider: colors.neutral.border,
  },

  typography: {
    fontFamily: typography.fontFamily,
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: "outlined",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.neutral.border}`,
          boxShadow: "0 1px 2px rgba(3, 4, 7, 0.06)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: colors.primary[900],
          backgroundColor: colors.primary[50],
        },
      },
    },
  },
});
```

Configurar en `main.tsx` o archivo equivalente:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { webTheme } from "../../packages/design-system/web/theme";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={webTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

---

## 13. Integración Mobile recomendada

Para React Native se recomienda usar React Native Paper con Material Design 3.

Instalación:

```bash
cd apps/mobile
npm install react-native-paper
```

Crear:

```txt
packages/design-system/mobile/theme.ts
```

```ts
import { MD3LightTheme } from "react-native-paper";
import { colors } from "../tokens/colors";

export const mobileTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    primary: colors.primary[600],
    onPrimary: "#ffffff",

    primaryContainer: colors.primary[100],
    onPrimaryContainer: colors.primary[900],

    secondary: colors.primary[500],
    onSecondary: "#ffffff",

    secondaryContainer: colors.primary[100],
    onSecondaryContainer: colors.primary[900],

    background: colors.neutral.background,
    onBackground: colors.neutral.text,

    surface: colors.neutral.surface,
    onSurface: colors.neutral.text,

    error: colors.semantic.danger,
    onError: "#ffffff",

    outline: colors.neutral.border,
  },
};
```

Configurar en `App.tsx`:

```tsx
import React from "react";
import { PaperProvider } from "react-native-paper";
import { mobileTheme } from "../packages/design-system/mobile/theme";
import { AppNavigator } from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <PaperProvider theme={mobileTheme}>
      <AppNavigator />
    </PaperProvider>
  );
}
```

---

## 14. Estados tipo semáforo

Todo estado operativo debe poder identificarse rápidamente con color, texto e indicador visual.

Estados oficiales:

```txt
Verde: Operativo / Correcto / Aprobado / Completado
Amarillo: Observado / Pendiente / Advertencia / En revisión
Rojo: Crítico / Bloqueado / Error / Rechazado
Azul: Informativo / En proceso / Nuevo
Gris: Inactivo / Archivado / Deshabilitado
```

No usar únicamente color. Siempre acompañar con texto.

---

## 15. Componente Web StatusBadge

Crear:

```txt
packages/design-system/web/StatusBadge.tsx
```

```tsx
import React from "react";

export type StatusType =
  | "operativo"
  | "observado"
  | "critico"
  | "proceso"
  | "inactivo";

const statusConfig = {
  operativo: {
    label: "Operativo",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  observado: {
    label: "Observado",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  critico: {
    label: "Crítico",
    color: "#dc2626",
    bg: "#fee2e2",
  },
  proceso: {
    label: "En proceso",
    color: "#2563eb",
    bg: "#dbeafe",
  },
  inactivo: {
    label: "Inactivo",
    color: "#64748b",
    bg: "#f1f5f9",
  },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const item = statusConfig[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "5px 10px",
        borderRadius: 999,
        background: item.bg,
        color: item.color,
        fontWeight: 700,
        fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif',
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: item.color,
        }}
      />
      {item.label}
    </span>
  );
}
```

---

## 16. Componente Mobile StatusBadge

Crear:

```txt
packages/design-system/mobile/StatusBadge.tsx
```

```tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export type StatusType =
  | "operativo"
  | "observado"
  | "critico"
  | "proceso"
  | "inactivo";

const statusConfig = {
  operativo: {
    label: "Operativo",
    color: "#16a34a",
    bg: "#dcfce7",
  },
  observado: {
    label: "Observado",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  critico: {
    label: "Crítico",
    color: "#dc2626",
    bg: "#fee2e2",
  },
  proceso: {
    label: "En proceso",
    color: "#2563eb",
    bg: "#dbeafe",
  },
  inactivo: {
    label: "Inactivo",
    color: "#64748b",
    bg: "#f1f5f9",
  },
};

export function StatusBadge({ status }: { status: StatusType }) {
  const item = statusConfig[status];

  return (
    <View style={[styles.badge, { backgroundColor: item.bg }]}>
      <View style={[styles.dot, { backgroundColor: item.color }]} />
      <Text style={[styles.text, { color: item.color }]}>{item.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  text: {
    fontWeight: "700",
    fontFamily: "Calibri",
  },
});
```

---

## 17. Componente Web StatusSemaforo

Crear:

```txt
packages/design-system/web/StatusSemaforo.tsx
```

```tsx
import React from "react";

export type SemaforoStatus = "ok" | "warning" | "danger";

export function StatusSemaforo({ status }: { status: SemaforoStatus }) {
  const activeColor = {
    ok: "#16a34a",
    warning: "#f59e0b",
    danger: "#dc2626",
  }[status];

  return (
    <span
      style={{
        display: "inline-grid",
        gridTemplateColumns: "12px 12px 12px",
        gap: 4,
        padding: "5px 8px",
        borderRadius: 999,
        background: "#f1f5f9",
        border: "1px solid #cbd5ec",
      }}
    >
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: status === "danger" ? activeColor : "#cbd5e1",
          opacity: status === "danger" ? 1 : 0.35,
        }}
      />
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: status === "warning" ? activeColor : "#cbd5e1",
          opacity: status === "warning" ? 1 : 0.35,
        }}
      />
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: status === "ok" ? activeColor : "#cbd5e1",
          opacity: status === "ok" ? 1 : 0.35,
        }}
      />
    </span>
  );
}
```

---

## 18. Componentes Material Design 3 que deben cubrirse

El sistema debe cubrir, como mínimo, los siguientes grupos de componentes.

### 18.1 Acciones

```txt
- Button
- IconButton
- FloatingActionButton
- SegmentedButton
```

Reglas:

```txt
- Acción principal: primary-600.
- Hover web: primary-700.
- Acción secundaria: primary-100 con texto primary-800.
- Destructive: danger.
- No usar mayúsculas forzadas.
```

### 18.2 Inputs

```txt
- TextField
- TextArea
- Select
- Autocomplete
- DatePicker
- TimePicker
- FileInput
- SearchInput
```

Reglas:

```txt
- Label visible obligatorio.
- Placeholder no reemplaza label.
- Mensaje de error claro.
- Foco con primary-500.
- Campos requeridos deben marcarse visualmente.
```

### 18.3 Selección

```txt
- Checkbox
- RadioButton
- Switch
- Chips seleccionables
```

Reglas:

```txt
- Usar primary-600 como color activo.
- Cada opción debe tener texto legible.
- No depender solo de color.
```

### 18.4 Navegación

```txt
- Sidebar
- Topbar
- BottomNavigation mobile
- Tabs
- Breadcrumbs
- Drawer
- Menu
- TreeView
```

Reglas:

```txt
- Sidebar web oscuro con primary-950 / primary-900.
- Topbar blanco con borde inferior suave.
- Estado activo visible con primary-100 o contraste sobre fondo oscuro.
- Mobile debe usar navegación inferior o drawer según densidad de módulos.
```

### 18.5 Contención

```txt
- Card
- Dialog
- Modal
- Sheet
- Accordion
- Expansion Panel
- Layout Panel
```

Reglas:

```txt
- Cards con borde suave y radio 14px a 20px.
- Modales con radius 20px.
- Dialogs con acciones claras.
- Separar visualmente header, body y footer.
```

### 18.6 Comunicación

```txt
- Alert
- Snackbar
- Toast
- Badge
- Tooltip
- Progress
- Skeleton
- EmptyState
```

Reglas:

```txt
- Alertas deben usar colores semánticos.
- Snackbar no debe reemplazar errores críticos.
- EmptyState debe indicar próxima acción.
```

### 18.7 Datos

```txt
- Table
- DataTable
- Pagination
- Filters
- Search
- Sort
- Status column
- Action column
```

Reglas:

```txt
- Toda tabla debe tener columna de acciones cuando aplica.
- Los estados deben mostrarse con StatusBadge y/o StatusSemaforo.
- Filtros deben estar visibles o agrupados en panel superior.
- No saturar filas con demasiados botones.
```

---

## 19. Layout Web recomendado

Pantallas administrativas deben usar este patrón:

```txt
AppLayout
├── Sidebar
├── Topbar
└── MainContent
    ├── Breadcrumb
    ├── PageHeader
    ├── ActionBar
    ├── FilterPanel
    ├── ContentCard / DataTable / Form
    └── FooterActions opcional
```

Reglas:

```txt
- Sidebar fijo o colapsable.
- Topbar con buscador, usuario y acciones globales.
- PageHeader con título, descripción y acción principal.
- ContentCard para formularios o tablas.
- Mantener máximo 3 niveles de jerarquía visual.
```

---

## 20. Layout Mobile recomendado

Pantallas mobile deben usar este patrón:

```txt
ScreenLayout
├── AppBar
├── Content ScrollView
│   ├── SectionHeader
│   ├── Card
│   ├── FormFields
│   └── StatusBadge
└── BottomAction opcional
```

Reglas:

```txt
- Padding horizontal de 16px.
- Botones principales con ancho completo cuando sean acción final.
- Formularios largos deben dividirse en secciones.
- Evitar tablas complejas en mobile; usar cards o listas.
- Estados deben ser visibles sin abrir detalle.
```

---

## 21. Reglas de formularios

Todo formulario debe cumplir:

```txt
- Label visible.
- Validación clara.
- Mensaje de error debajo del campo.
- Acción principal visible.
- Botón cancelar o volver si hay cambios no guardados.
- Campos requeridos marcados.
- Orden lógico de lectura.
```

Estructura de formulario web recomendada:

```txt
Fila 1: Campo principal | Campo secundario | Estado
Fila 2: Select / autocomplete | Fecha | Responsable
Fila 3: Dirección o descripción full width
Fila 4: Observaciones full width
Fila 5: Adjuntos
Fila 6: Acciones
```

Para mobile, los campos deben ir en una columna.

---

## 22. Reglas de tablas

Toda tabla debe usar:

```txt
- Header con fondo primary-50.
- Texto de header primary-900.
- Hover suave en filas.
- Estado con StatusBadge.
- Acciones agrupadas.
- Paginación.
- Filtros.
```

Columnas recomendadas:

```txt
ID / Código
Nombre / Descripción
Categoría / Tipo
Responsable / Proveedor
Sede / Área
Fecha
Estado
Acciones
```

---

## 23. Reglas de menú lateral

Sidebar web:

```txt
Fondo: primary-950 o gradiente primary-950 -> primary-900
Texto: primary-100
Activo: fondo rgba blanco 12% o primary-700
Íconos: contenedor suave
Separadores: rgba blanco 12%
```

Ejemplo visual esperado:

```txt
[Logo] ARMORA SAC

Principal
- Dashboard
- Equipos
- PSR / OSR
- Averías
- Reportes

Administración
- Usuarios
- Sedes
- Campañas
- Proveedores
- Configuración
```

---

## 24. Reglas para estados de negocio

Usar estos estados visuales:

```txt
Operativo      -> verde
Aprobado       -> verde
Completado     -> verde

Pendiente      -> amarillo
Observado      -> amarillo
En revisión    -> amarillo
Por validar    -> amarillo

Crítico        -> rojo
Bloqueado      -> rojo
Error          -> rojo
Rechazado      -> rojo
Averiado       -> rojo

Nuevo          -> azul
En proceso     -> azul
Informativo    -> azul

Inactivo       -> gris
Archivado      -> gris
Deshabilitado  -> gris
```

Prohibido:

```txt
- Mostrar estados solo como texto plano.
- Usar colores distintos para el mismo estado en distintas pantallas.
- Usar rojo para advertencias menores.
- Usar verde para procesos incompletos.
```

---

## 25. Ejemplo de pantalla Web usando el Design System

```tsx
import { Button, Card, CardContent, TextField } from "@mui/material";
import { StatusBadge } from "@design-system/web/StatusBadge";

export function EquipoForm() {
  return (
    <Card>
      <CardContent>
        <h2>Registro de equipo</h2>

        <TextField label="Código interno" fullWidth margin="normal" />
        <TextField label="Número de serie" fullWidth margin="normal" />
        <TextField label="Proveedor" fullWidth margin="normal" />

        <StatusBadge status="operativo" />

        <Button sx={{ mt: 2 }}>
          Guardar
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 26. Ejemplo de pantalla Mobile usando el Design System

```tsx
import React from "react";
import { View } from "react-native";
import { Button, TextInput, Card } from "react-native-paper";
import { StatusBadge } from "@design-system/mobile/StatusBadge";

export function EquipoFormScreen() {
  return (
    <View style={{ padding: 16 }}>
      <Card>
        <Card.Content>
          <TextInput label="Código interno" mode="outlined" />
          <TextInput label="Número de serie" mode="outlined" />
          <TextInput label="Proveedor" mode="outlined" />

          <View style={{ marginTop: 12 }}>
            <StatusBadge status="operativo" />
          </View>

          <Button mode="contained" style={{ marginTop: 16 }}>
            Guardar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}
```

---

## 27. Documentación adicional recomendada

Crear estos archivos para ampliar el estándar:

```txt
docs/design-system/01_design_tokens.md
docs/design-system/02_material_design_3.md
docs/design-system/03_componentes_web.md
docs/design-system/04_componentes_mobile.md
docs/design-system/05_reglas_uso_ui.md
```

Contenido sugerido:

### 01_design_tokens.md

```txt
- Paleta oficial
- Tipografía
- Espaciado
- Radius
- Sombras
- Estados
```

### 02_material_design_3.md

```txt
- Principios de Material Design 3
- Componentes permitidos
- Comportamiento visual esperado
- Diferencias entre Web y Mobile
```

### 03_componentes_web.md

```txt
- Button
- TextField
- Select
- StatusBadge
- DataTable
- Sidebar
- Topbar
- Modal
- Alert
```

### 04_componentes_mobile.md

```txt
- Button
- TextInput
- Card
- StatusBadge
- AppBar
- BottomNavigation
- ListItem
- Dialog
```

### 05_reglas_uso_ui.md

```txt
- Reglas obligatorias
- Errores comunes
- Checklist de validación
- Prohibiciones
```

---

## 28. Agente OpenCode recomendado

Crear:

```txt
.opencode/agents/ui_design_system.md
```

Contenido sugerido:

```md
# Agente UI Design System

Eres responsable de mantener la coherencia visual del proyecto ARMORA SAC.

Debes usar siempre:

- Material Design 3 como base visual.
- Paleta Vanguard definida en `OPENCODE_UI_DESIGN_SYSTEM.md`.
- Tipografía Calibri.
- Estados tipo semáforo.
- Tokens centralizados.
- Componentes reutilizables.

Para Web:

- Usar React.
- Preferir MUI personalizado con `webTheme`.
- No crear estilos aislados si existe token o componente base.
- No usar colores hardcodeados en pantallas.

Para Mobile:

- Usar React Native Paper.
- Usar `mobileTheme`.
- No usar colores hardcodeados.
- Usar cards/listas en lugar de tablas complejas.

Antes de crear una pantalla:

1. Revisar tokens.
2. Revisar componentes existentes.
3. Reutilizar layout base.
4. Aplicar estados visuales consistentes.
5. Mantener accesibilidad y contraste.
6. Validar que los estados usen semáforo.

Nunca debes:

- Crear botones desde cero si existe componente base.
- Inventar colores.
- Cambiar significado de los colores de estado.
- Usar solo color para representar estado.
- Crear pantallas con estilos inconsistentes.
```

---

## 29. Cuándo crear un skill

No crear un skill al inicio.

Primero debe existir:

```txt
1. Tokens
2. Theme web
3. Theme mobile
4. Componentes base
5. Documentación
6. Agente OpenCode
```

Crear un skill recién cuando se quiera automatizar:

```txt
- Generación de pantallas CRUD.
- Conversión de HTML a React.
- Conversión de vistas Web a React Native.
- Validación automática de uso de tokens.
- Revisión de cumplimiento de Material Design 3.
```

---

## 30. Checklist obligatorio antes de aceptar una pantalla

Toda pantalla debe cumplir:

```txt
[ ] Usa theme global.
[ ] Usa tokens de color.
[ ] Usa Calibri.
[ ] Usa componentes reutilizables.
[ ] No tiene colores hardcodeados innecesarios.
[ ] Usa estados semáforo cuando corresponde.
[ ] Tiene labels visibles en inputs.
[ ] Tiene validaciones visibles.
[ ] Tiene acción principal clara.
[ ] Tiene layout responsive en Web.
[ ] Tiene layout táctil correcto en Mobile.
[ ] Usa contraste suficiente.
[ ] Mantiene consistencia con Material Design 3.
[ ] No duplica componentes existentes.
```

---

## 31. Orden recomendado de implementación

Implementar en este orden:

```txt
1. Crear carpeta `packages/design-system/tokens`.
2. Crear `colors.ts`.
3. Crear `typography.ts`.
4. Crear `spacing.ts`.
5. Crear `radius.ts`.
6. Crear `shadows.ts`.
7. Crear `packages/design-system/web/theme.ts`.
8. Instalar y configurar MUI en Web.
9. Crear `StatusBadge` Web.
10. Crear `StatusSemaforo` Web.
11. Crear layout Web base: Sidebar, Topbar, AppLayout.
12. Crear `packages/design-system/mobile/theme.ts`.
13. Instalar y configurar React Native Paper en Mobile.
14. Crear `StatusBadge` Mobile.
15. Crear `StatusSemaforo` Mobile.
16. Crear `ScreenLayout` Mobile.
17. Documentar reglas en `docs/design-system`.
18. Crear agente `.opencode/agents/ui_design_system.md`.
```

---

## 32. Regla final para OpenCode

Cuando se solicite crear una pantalla nueva, OpenCode debe responder e implementar bajo esta lógica:

```txt
1. Identificar si la pantalla es Web o Mobile.
2. Revisar si existen tokens y componentes base.
3. Si no existen, crearlos primero.
4. Usar el theme global.
5. Usar Material Design 3.
6. Usar paleta Vanguard.
7. Usar Calibri.
8. Usar estados tipo semáforo.
9. No crear estilos aislados.
10. Dejar la pantalla lista para escalar.
```

Este documento tiene prioridad sobre estilos improvisados o decisiones visuales aisladas.
