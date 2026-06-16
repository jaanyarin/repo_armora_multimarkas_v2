import { createTheme } from '@mui/material/styles';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';

export const webTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary[600],
      light: colors.primary[300],
      dark: colors.primary[800],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.primary[500],
      light: colors.primary[200],
      dark: colors.primary[700],
      contrastText: '#ffffff',
    },
    success: { main: colors.semantic.success },
    warning: { main: colors.semantic.warning },
    error: { main: colors.semantic.danger },
    info: { main: colors.semantic.info },
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
    h1: { fontSize: 34, fontWeight: 800, lineHeight: 1.15 },
    h2: { fontSize: 28, fontWeight: 700, lineHeight: 1.15 },
    h3: { fontSize: 22, fontWeight: 700, lineHeight: 1.2 },
    h4: { fontSize: 18, fontWeight: 600, lineHeight: 1.3 },
    body1: { fontSize: 16, fontWeight: 400, lineHeight: 1.4 },
    body2: { fontSize: 14, fontWeight: 400, lineHeight: 1.4 },
    button: { fontSize: 14, fontWeight: 700, textTransform: 'none' },
    caption: { fontSize: 12, fontWeight: 400, color: colors.neutral.textMuted },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiButton: {
      defaultProps: { variant: 'contained', disableElevation: true },
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, borderRadius: 12, padding: '8px 20px' },
        containedSecondary: { backgroundColor: colors.primary[100], color: colors.primary[800] },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small', variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 10 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: `1px solid ${colors.neutral.border}`,
          boxShadow: '0 1px 2px rgba(3, 4, 7, 0.06)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontWeight: 700, color: colors.primary[900], backgroundColor: colors.primary[50] },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { fontFamily: typography.fontFamily, backgroundColor: colors.neutral.background },
      },
    },
  },
});
