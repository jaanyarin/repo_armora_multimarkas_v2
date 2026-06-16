'use client';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Topbar from './Topbar';
import Sidebar, { DRAWER_WIDTH } from './Sidebar';
import { colors } from '../../tokens/colors';

interface AppLayoutProps {
  children: React.ReactNode;
  username?: string;
  role?: string;
  activePath?: string;
}

export default function AppLayout({ children, username, role, activePath }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.neutral.background }}>
      <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} username={username} role={role} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePath={activePath} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          ml: { md: `${DRAWER_WIDTH}px` },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
