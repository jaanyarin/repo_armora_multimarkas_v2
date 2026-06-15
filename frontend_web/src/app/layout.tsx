import type { Metadata } from 'next';
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
      <body>{children}</body>
    </html>
  );
}
