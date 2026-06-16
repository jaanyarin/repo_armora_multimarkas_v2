'use client';
import { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { colors } from '../../tokens/colors';

const DRAWER_WIDTH = 240;
const MOBILE_BREAKPOINT = 900;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const defaultNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  activePath?: string;
  navItems?: NavItem[];
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function Sidebar({
  open = true,
  onClose,
  activePath = '/dashboard',
  navItems = defaultNavItems,
}: SidebarProps) {
  const isMobile = useIsMobile();

  const content = (
    <div>
      <Toolbar />
      <List sx={{ px: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={activePath === item.path}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: colors.primary[100],
                color: colors.primary[700],
                '&:hover': { backgroundColor: colors.primary[200] },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: activePath === item.path ? colors.primary[600] : colors.neutral.textMuted,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: 14,
                  fontWeight: activePath === item.path ? 700 : 500,
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </div>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? open : true}
      onClose={onClose}
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          borderRight: `1px solid ${colors.neutral.border}`,
          backgroundColor: colors.neutral.surface,
        },
      }}
    >
      {content}
    </Drawer>
  );
}

export { DRAWER_WIDTH };
