'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import PeopleIcon from '@mui/icons-material/People';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MapIcon from '@mui/icons-material/Map';
import DescriptionIcon from '@mui/icons-material/Description';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BarChartIcon from '@mui/icons-material/BarChart';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupIcon from '@mui/icons-material/Group';
import SettingsIcon from '@mui/icons-material/Settings';
import { colors } from '../../tokens/colors';

const DRAWER_WIDTH = 270;

interface NavItem {
  label: string;
  path: string;
}

interface NavCategory {
  label: string;
  icon: React.ReactNode;
  children: NavItem[];
}

const sidebarIconSx = { minWidth: 40, color: colors.primary[500] };

const ICON_SIZE = { fontSize: 20 };

const sidebarCategories: NavCategory[] = [
  {
    label: 'Productos y Servicios',
    icon: <Inventory2Icon sx={ICON_SIZE} />,
    children: [
      { label: 'Clases y Subclases', path: '#' },
      { label: 'Crear Producto', path: '#' },
      { label: 'Gestion Productos', path: '#' },
      { label: 'Crear Servicio', path: '#' },
      { label: 'Gestion Servicios', path: '#' },
      { label: 'Crear Combo', path: '#' },
      { label: 'Gestion Combos', path: '#' },
      { label: 'Crear Lista de Precios', path: '#' },
      { label: 'Gestion Listas de Precios', path: '#' },
      { label: 'Reportes Productos', path: '#' },
    ],
  },
  {
    label: 'Compras y Proveedores',
    icon: <LocalShippingIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Crear Compra', path: '#' },
      { label: 'Gestion de Compras', path: '#' },
      { label: 'Crear Proveedor', path: '#' },
      { label: 'Gestion de Proveedores', path: '#' },
    ],
  },
  {
    label: 'Almacenes e Inventario',
    icon: <WarehouseIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Gestion Almacenes', path: '#' },
      { label: 'Inventario de Stocks', path: '#' },
      { label: 'Gestion de Inventarios', path: '#' },
      { label: 'Crear Unidad Trans.', path: '#' },
      { label: 'Gestion Unidades de Trans.', path: '#' },
      { label: 'Transportistas', path: '#' },
    ],
  },
  {
    label: 'Clientes y Preventas',
    icon: <PeopleIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Crear Cliente', path: '#' },
      { label: 'Gestion Clientes', path: '#' },
      { label: 'Habilitar Ventas Clientes', path: '#' },
      { label: 'Gestion Preventas', path: '#' },
      { label: 'Reportes Preventas', path: '#' },
    ],
  },
  {
    label: 'Ventas',
    icon: <PointOfSaleIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Crear Venta Productos', path: '#' },
      { label: 'Crear Venta Servicios', path: '#' },
      { label: 'Gestion de Ventas', path: '#' },
      { label: 'Puntos de Ventas', path: '#' },
      { label: 'Gestion Notas Pedido', path: '#' },
      { label: 'Impresion de Ventas', path: '#' },
      { label: 'Entregas Parciales', path: '#' },
      { label: 'Fileteo Automatico', path: '#' },
      { label: 'Reportes de Ventas', path: '#' },
    ],
  },
  {
    label: 'Postventa y Ajustes',
    icon: <AssignmentReturnIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Gestion Notas Credito', path: '#' },
      { label: 'Devolucion Transportista', path: '#' },
      { label: 'Impresion Notas Credito', path: '#' },
      { label: 'Crear Cambio Productos', path: '#' },
      { label: 'Gestion Cambio Productos', path: '#' },
      { label: 'Crear Canje', path: '#' },
      { label: 'Gestion Canjes', path: '#' },
      { label: 'Ajuste de Comisiones', path: '#' },
    ],
  },
  {
    label: 'Premios y Concursos',
    icon: <EmojiEventsIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Requisitos de Canjes', path: '#' },
      { label: 'Crear Premio Canje', path: '#' },
      { label: 'Gestion Premio Canje', path: '#' },
      { label: 'Crear Concurso', path: '#' },
      { label: 'Gestion Concursos', path: '#' },
    ],
  },
  {
    label: 'Distribucion, Zonas y Rutas',
    icon: <MapIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Gestion Zonas y Rutas', path: '#' },
      { label: 'Habilitar Ventas en Rutas', path: '#' },
      { label: 'Crear Mapa de Rutas', path: '#' },
      { label: 'Gestion de Mapas de Rutas', path: '#' },
      { label: 'Cambio dia Atencion', path: '#' },
    ],
  },
  {
    label: 'SUNAT y Documentos Electronicos',
    icon: <DescriptionIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Envios Pendientes Sunat', path: '#' },
      { label: 'Gestion Envios Sunat', path: '#' },
      { label: 'Crear Resumen', path: '#' },
      { label: 'Gestion de Resumenes', path: '#' },
      { label: 'Crear Baja', path: '#' },
      { label: 'Gestion de Bajas', path: '#' },
    ],
  },
  {
    label: 'Requerimientos y Liquidaciones',
    icon: <FactCheckIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Crear Requerimiento', path: '#' },
      { label: 'Gestion Requerimientos', path: '#' },
      { label: 'Crear Liquidacion', path: '#' },
      { label: 'Gestion Liquidaciones', path: '#' },
    ],
  },
  {
    label: 'Reportes e Informes',
    icon: <BarChartIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Informes de Requerimientos', path: '#' },
      { label: 'Informes de Liquidaciones', path: '#' },
      { label: 'Informes de Almacenes', path: '#' },
      { label: 'Entregas Parciales', path: '#' },
      { label: 'Crear Reporte Cobertura', path: '#' },
      { label: 'Gestion Reporte Cobertura', path: '#' },
    ],
  },
  {
    label: 'Vendedor',
    icon: <BadgeIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Crear Cliente', path: '#' },
      { label: 'Clientes', path: '#' },
      { label: 'Crear Preventa', path: '#' },
      { label: 'Preventas', path: '#' },
      { label: 'Ventas', path: '#' },
      { label: 'Crear Cambio Productos', path: '#' },
      { label: 'Cambios de Productos', path: '#' },
      { label: 'Crear Canje', path: '#' },
      { label: 'Canjes', path: '#' },
      { label: 'Stock de Productos', path: '#' },
      { label: 'Comisiones', path: '#' },
      { label: 'Concursos', path: '#' },
    ],
  },
  {
    label: 'Personal',
    icon: <GroupIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Crear Personal', path: '/personal/crear-personal' },
      { label: 'Gestion Personal', path: '/personal/gestion-personal' },
    ],
  },
  {
    label: 'Configuracion',
    icon: <SettingsIcon sx={ICON_SIZE} />,
    children: [
      { label: 'Configuracion Empresa', path: '#' },
      { label: 'Configuracion Impresion', path: '#' },
      { label: 'Configuracion Sunat', path: '#' },
      { label: 'Configuracion Alertas', path: '#' },
      { label: 'Perfil Personal', path: '#' },
    ],
  },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  activePath?: string;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function Sidebar({ open = true, onClose, activePath = '/dashboard' }: SidebarProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const isSearching = search.trim().length > 0;

  const toggleCategory = (label: string) => {
    if (isSearching) return;
    setOpenCategories((prev) => {
      const isOpen = prev[label];
      if (isOpen) return {};
      return { [label]: true };
    });
  };

  const handleClear = () => {
    setSearch('');
    setOpenCategories({});
  };

  const filtered = sidebarCategories.filter(
    (cat) =>
      cat.label.toLowerCase().includes(search.toLowerCase()) ||
      cat.children.some((c) => c.label.toLowerCase().includes(search.toLowerCase()))
  );

  const content = (
    <Box>
      {/* Logo */}
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: colors.primary[800],
            letterSpacing: 1,
          }}
        >
          ARMORA
        </Typography>
      </Toolbar>

      {/* Search */}
      <Box sx={{ px: 1.5, pb: 1 }}>
        <TextField
          size="small"
          placeholder="Busqueda"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: colors.neutral.textMuted }} />
              </InputAdornment>
            ),
            endAdornment: search ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={handleClear} sx={{ p: 0.3 }}>
                  <Typography sx={{ fontSize: 16, lineHeight: 1, color: colors.neutral.textMuted }}>
                    x
                  </Typography>
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: colors.neutral.background,
              fontSize: 13,
            },
          }}
        />
      </Box>

      {/* Nav */}
      <List sx={{ px: 1, pb: 4 }} dense>
        {filtered.map((cat) => {
          const isOpen = isSearching ? true : (openCategories[cat.label] ?? false);
          return (
            <Box key={cat.label}>
              {/* Categoria principal */}
              <ListItemButton
                onClick={() => toggleCategory(cat.label)}
                sx={{
                  borderRadius: 2,
                  py: 0.5,
                  color: colors.neutral.text,
                  '&:hover': {
                    backgroundColor: colors.primary[50],
                  },
                }}
              >
                <ListItemIcon sx={sidebarIconSx}>
                  {cat.icon}
                </ListItemIcon>
                <ListItemText
                  primary={cat.label}
                  sx={{
                    '& .MuiListItemText-primary': { fontSize: 13.5, fontWeight: 600, color: colors.neutral.text },
                  }}
                />
                {isOpen ? (
                  <ExpandLess fontSize="small" sx={{ color: colors.neutral.textMuted }} />
                ) : (
                  <ExpandMore fontSize="small" sx={{ color: colors.neutral.textMuted }} />
                )}
              </ListItemButton>

              {/* Hijos */}
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List dense disablePadding>
                  {cat.children.map((child) => (
                    <ListItemButton
                      key={child.label}
                      selected={activePath === child.path}
                      onClick={() => {
                        if (child.path !== '#') {
                          router.push(child.path);
                          if (isMobile && onClose) onClose();
                        }
                      }}
                      sx={{
                        pl: 5,
                        py: 0.3,
                        borderRadius: 2,
                        mx: 0.5,
                        '&:hover': {
                          backgroundColor: colors.primary[50],
                        },
                        '&.Mui-selected': {
                          backgroundColor: colors.primary[100],
                          color: colors.primary[700],
                          '&:hover': {
                            backgroundColor: colors.primary[200],
                          },
                        },
                      }}
                    >
                      <ListItemText
                        primary={child.label}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: 12.5,
                            fontWeight: activePath === child.path ? 700 : 400,
                            color: activePath === child.path ? colors.primary[700] : colors.neutral.text,
                          },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>

              <Divider sx={{ borderColor: colors.neutral.border, my: 0.3 }} />
            </Box>
          );
        })}
      </List>
    </Box>
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



