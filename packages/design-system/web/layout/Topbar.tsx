'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { colors } from '../../tokens/colors';

interface TopbarProps {
  onToggleSidebar?: () => void;
  username?: string;
  role?: string;
}

export default function Topbar({ onToggleSidebar, username = 'Admin', role = 'admin' }: TopbarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: 1201,
        backgroundColor: colors.neutral.surface,
        borderBottom: `1px solid ${colors.neutral.border}`,
        boxShadow: 'none',
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" onClick={onToggleSidebar} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, color: colors.primary[800], fontWeight: 800 }}>
          ARMORA
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: colors.neutral.text }}>
              {username}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.neutral.textMuted, textTransform: 'capitalize' }}>
              {role}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: colors.primary[500], width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
