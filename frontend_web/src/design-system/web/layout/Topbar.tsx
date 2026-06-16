'use client';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { colors } from '../../tokens/colors';

interface TopbarProps {
  onToggleSidebar?: () => void;
  username?: string;
  role?: string;
  listaPrecios?: string;
  almacen?: string;
}

export default function Topbar({
  onToggleSidebar,
  username = 'Admin',
  role = 'admin',
  listaPrecios = 'LISTA DE PRECIO M1P',
  almacen = 'ALMACEN PRINCIPAL',
}: TopbarProps) {
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
      <Toolbar sx={{ gap: 1, minHeight: '56px !important', flexWrap: 'wrap' }}>
        <IconButton edge="start" onClick={onToggleSidebar} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, flexWrap: 'wrap' }}>
          <Typography variant="h6" sx={{ color: colors.primary[800], fontWeight: 800, letterSpacing: 1 }}>
            ARMORA
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, color: colors.neutral.text }}>
            <Typography variant="body2">
              <strong>Personal:</strong> {username}
            </Typography>
            <Typography variant="body2">
              <strong>Lista Precios:</strong> {listaPrecios}
            </Typography>
            <Typography variant="body2">
              <strong>Almacen:</strong> {almacen}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton sx={{ color: colors.neutral.text }}>
            <HomeIcon />
          </IconButton>
          <IconButton sx={{ color: colors.neutral.text }}>
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Toolbar>

      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          px: 2,
          pb: 0.5,
          gap: 1.5,
          color: colors.neutral.text,
          fontSize: 12,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="caption">
          <strong>Personal:</strong> {username}
        </Typography>
        <Typography variant="caption">
          <strong>Lista Precios:</strong> {listaPrecios}
        </Typography>
        <Typography variant="caption">
          <strong>Almacen:</strong> {almacen}
        </Typography>
      </Box>
    </AppBar>
  );
}
