import type { Metadata } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { webTheme } from '@/design-system/web/theme';
import './globals.css';

export const metadata: Metadata = {
  title: 'ARMORA',
  description: 'ARMORA Multimarkas v2 - Admin Web',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-PE">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={webTheme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
