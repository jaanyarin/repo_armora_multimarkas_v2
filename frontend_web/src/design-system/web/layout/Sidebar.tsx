'use client';
import { useState, useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import DescriptionIcon from '@mui/icons-material/Description';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VerifiedIcon from '@mui/icons-material/Verified';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import MapIcon from '@mui/icons-material/Map';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InventoryIcon from '@mui/icons-material/Inventory';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PercentIcon from '@mui/icons-material/Percent';
import PublicIcon from '@mui/icons-material/Public';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { colors } from '../../tokens/colors';

const DRAWER_WIDTH = 260;

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface NavCategory {
  label: string;
  icon: React.ReactNode;
  children: NavItem[];
}

const sidebarCategories: NavCategory[] = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    children: [{ label: 'Panel Principal', icon: <DashboardIcon />, path: '/dashboard' }],
  },
  {
    label: 'Compras',
    icon: <ShoppingBagIcon />,
    children: [
      { label: 'Crear Compra', icon: <ShoppingBagIcon />, path: '#' },
      { label: 'Gestión de Compras', icon: <ShoppingBagIcon />, path: '#' },
    ],
  },
  {
    label: 'Proveedores',
    icon: <ShoppingCartIcon />,
    children: [
      { label: 'Crear Proveedor', icon: <ShoppingCartIcon />, path: '#' },
      { label: 'Gestión de Proveedores', icon: <ShoppingCartIcon />, path: '#' },
    ],
  },
  {
    label: 'Preventas',
    icon: <AssignmentIcon />,
    children: [
      { label: 'Gestión Preventas', icon: <AssignmentIcon />, path: '#' },
      { label: 'Reportes Preventas', icon: <AssignmentIcon />, path: '#' },
    ],
  },
  {
    label: 'Ventas',
    icon: <TaskAltIcon />,
    children: [
      { label: 'Crear Venta Productos', icon: <TaskAltIcon />, path: '#' },
      { label: 'Crear Venta Servicios', icon: <TaskAltIcon />, path: '#' },
      { label: 'Gestión de Ventas', icon: <TaskAltIcon />, path: '#' },
      { label: 'Puntos de Ventas', icon: <TaskAltIcon />, path: '#' },
      { label: 'Gestión Notas Pedido', icon: <TaskAltIcon />, path: '#' },
      { label: 'Impresión de Ventas', icon: <TaskAltIcon />, path: '#' },
      { label: 'Entregas Parciales', icon: <TaskAltIcon />, path: '#' },
      { label: 'Fileteo Automatico', icon: <TaskAltIcon />, path: '#' },
      { label: 'Reportes de Ventas', icon: <TaskAltIcon />, path: '#' },
    ],
  },
  {
    label: 'Notas de Credito',
    icon: <NewspaperIcon />,
    children: [
      { label: 'Gestión Notas Credito', icon: <NewspaperIcon />, path: '#' },
      { label: 'Devolucion Transportista', icon: <NewspaperIcon />, path: '#' },
      { label: 'Impresión Notas Credito', icon: <NewspaperIcon />, path: '#' },
      { label: 'Reportes Notas Credito', icon: <NewspaperIcon />, path: '#' },
    ],
  },
  {
    label: 'Informes',
    icon: <DescriptionIcon />,
    children: [
      { label: 'Informes de Requerimientos', icon: <DescriptionIcon />, path: '#' },
      { label: 'Informes de Liquidaciones', icon: <DescriptionIcon />, path: '#' },
      { label: 'Informes de Almacenes', icon: <DescriptionIcon />, path: '#' },
      { label: 'Entregas Parciales', icon: <DescriptionIcon />, path: '#' },
    ],
  },
  {
    label: 'Cambios de Productos',
    icon: <SwapHorizIcon />,
    children: [
      { label: 'Crear Cambio Productos', icon: <SwapHorizIcon />, path: '#' },
      { label: 'Asignar Fecha de Entrega', icon: <SwapHorizIcon />, path: '#' },
      { label: 'Gestion Cambio Productos', icon: <SwapHorizIcon />, path: '#' },
      { label: 'Impresion Cambio Productos', icon: <SwapHorizIcon />, path: '#' },
      { label: 'Crear Req/Liq Cambios', icon: <SwapHorizIcon />, path: '#' },
      { label: 'Gestion Req/Liq Cambios', icon: <SwapHorizIcon />, path: '#' },
      { label: 'Reporte Cambios Productos', icon: <SwapHorizIcon />, path: '#' },
    ],
  },
  {
    label: 'Canjes de Productos',
    icon: <CompareArrowsIcon />,
    children: [
      { label: 'Crear Canje', icon: <CompareArrowsIcon />, path: '#' },
      { label: 'Asignar Fecha de Entrega', icon: <CompareArrowsIcon />, path: '#' },
      { label: 'Gestion Canjes', icon: <CompareArrowsIcon />, path: '#' },
      { label: 'Impresion Canjes', icon: <CompareArrowsIcon />, path: '#' },
      { label: 'Crear Req/Liq Canjes', icon: <CompareArrowsIcon />, path: '#' },
      { label: 'Gestion Req/Liq Canjes', icon: <CompareArrowsIcon />, path: '#' },
      { label: 'Reportes Canjes', icon: <CompareArrowsIcon />, path: '#' },
    ],
  },
  {
    label: 'Sunat',
    icon: <VerifiedIcon />,
    children: [
      { label: 'Envios Pendientes Sunat', icon: <VerifiedIcon />, path: '#' },
      { label: 'Gestion Envios Sunat', icon: <VerifiedIcon />, path: '#' },
      { label: 'Reportes Envios Sunat', icon: <VerifiedIcon />, path: '#' },
    ],
  },
  {
    label: 'Resumenes Diarios',
    icon: <ContentCopyIcon />,
    children: [
      { label: 'Crear Resumen', icon: <ContentCopyIcon />, path: '#' },
      { label: 'Gestion de Resumenes', icon: <ContentCopyIcon />, path: '#' },
      { label: 'Reportes de Resumenes', icon: <ContentCopyIcon />, path: '#' },
    ],
  },
  {
    label: 'Comunicacion de Baja',
    icon: <CalendarTodayIcon />,
    children: [
      { label: 'Crear Baja', icon: <CalendarTodayIcon />, path: '#' },
      { label: 'Gestion de Bajas', icon: <CalendarTodayIcon />, path: '#' },
      { label: 'Reportes de Baja', icon: <CalendarTodayIcon />, path: '#' },
    ],
  },
  {
    label: 'Requerimientos',
    icon: <AssignmentIcon />,
    children: [
      { label: 'Crear Requerimiento', icon: <AssignmentIcon />, path: '#' },
      { label: 'Gestion Requerimientos', icon: <AssignmentIcon />, path: '#' },
      { label: 'Reportes Requerimientos', icon: <AssignmentIcon />, path: '#' },
    ],
  },
  {
    label: 'Liquidaciones',
    icon: <ReceiptIcon />,
    children: [
      { label: 'Crear Liquidacion', icon: <ReceiptIcon />, path: '#' },
      { label: 'Gestion Liquidaciones', icon: <ReceiptIcon />, path: '#' },
      { label: 'Reportes Liquidaciones', icon: <ReceiptIcon />, path: '#' },
    ],
  },
  {
    label: 'Personal',
    icon: <PeopleIcon />,
    children: [
      { label: 'Crear Personal', icon: <PeopleIcon />, path: '#' },
      { label: 'Gestion Personal', icon: <PeopleIcon />, path: '#' },
      { label: 'Reportes Personal', icon: <PeopleIcon />, path: '#' },
    ],
  },
  {
    label: 'Mapas de Rutas',
    icon: <MapIcon />,
    children: [
      { label: 'Crear Mapa de Rutas', icon: <MapIcon />, path: '#' },
      { label: 'Gestion de Mapas de Rutas', icon: <MapIcon />, path: '#' },
      { label: 'Reportes de Mapas de Rutas', icon: <MapIcon />, path: '#' },
    ],
  },
  {
    label: 'Clientes',
    icon: <PeopleIcon />,
    children: [
      { label: 'Crear Cliente', icon: <PeopleIcon />, path: '#' },
      { label: 'Gestion Clientes', icon: <PeopleIcon />, path: '#' },
      { label: 'Habilitar Ventas Clientes', icon: <PeopleIcon />, path: '#' },
      { label: 'Cambio dia Atencion', icon: <PeopleIcon />, path: '#' },
      { label: 'Reportes Clientes', icon: <PeopleIcon />, path: '#' },
    ],
  },
  {
    label: 'Zonas y Rutas',
    icon: <MapIcon />,
    children: [
      { label: 'Gestion Zonas y Rutas', icon: <MapIcon />, path: '#' },
      { label: 'Habilitar Ventas en Rutas', icon: <MapIcon />, path: '#' },
      { label: 'Reportes Zonas y Rutas', icon: <MapIcon />, path: '#' },
    ],
  },
  {
    label: 'Almacenes',
    icon: <WarehouseIcon />,
    children: [
      { label: 'Gestion Almacenes', icon: <WarehouseIcon />, path: '#' },
      { label: 'Reportes Almacenes', icon: <WarehouseIcon />, path: '#' },
      { label: 'Inventario de Stocks', icon: <WarehouseIcon />, path: '#' },
      { label: 'Gestion de Inventarios', icon: <WarehouseIcon />, path: '#' },
    ],
  },
  {
    label: 'Unidades de Trans.',
    icon: <LocalShippingIcon />,
    children: [
      { label: 'Crear Unidad Trans.', icon: <LocalShippingIcon />, path: '#' },
      { label: 'Gestion Unidades de Trans.', icon: <LocalShippingIcon />, path: '#' },
      { label: 'Reportes Unidades de Trans.', icon: <LocalShippingIcon />, path: '#' },
    ],
  },
  {
    label: 'Premios Canjes',
    icon: <CardGiftcardIcon />,
    children: [
      { label: 'Requisitos de Canjes', icon: <CardGiftcardIcon />, path: '#' },
      { label: 'Crear Premio Canje', icon: <CardGiftcardIcon />, path: '#' },
      { label: 'Gestion Premio Canje', icon: <CardGiftcardIcon />, path: '#' },
      { label: 'Reportes Premio Canje', icon: <CardGiftcardIcon />, path: '#' },
    ],
  },
  {
    label: 'Productos',
    icon: <InventoryIcon />,
    children: [
      { label: 'Clases y Subclases', icon: <InventoryIcon />, path: '#' },
      { label: 'Crear Producto', icon: <InventoryIcon />, path: '#' },
      { label: 'Gestion Productos', icon: <InventoryIcon />, path: '#' },
      { label: 'Reportes Productos', icon: <InventoryIcon />, path: '#' },
    ],
  },
  {
    label: 'Servicios',
    icon: <RoomServiceIcon />,
    children: [
      { label: 'Crear Servicio', icon: <RoomServiceIcon />, path: '#' },
      { label: 'Gestion Servicios', icon: <RoomServiceIcon />, path: '#' },
    ],
  },
  {
    label: 'Combos de Productos',
    icon: <AllInclusiveIcon />,
    children: [
      { label: 'Crear Combo', icon: <AllInclusiveIcon />, path: '#' },
      { label: 'Gestion Combos', icon: <AllInclusiveIcon />, path: '#' },
      { label: 'Reportes Combos', icon: <AllInclusiveIcon />, path: '#' },
    ],
  },
  {
    label: 'Concursos',
    icon: <EmojiEventsIcon />,
    children: [
      { label: 'Crear Concurso', icon: <EmojiEventsIcon />, path: '#' },
      { label: 'Gestion Concursos', icon: <EmojiEventsIcon />, path: '#' },
      { label: 'Reportes Concursos', icon: <EmojiEventsIcon />, path: '#' },
    ],
  },
  {
    label: 'Comisiones',
    icon: <PercentIcon />,
    children: [
      { label: 'Crear Reporte Comisiones', icon: <PercentIcon />, path: '#' },
      { label: 'Gestion Reporte Comisiones', icon: <PercentIcon />, path: '#' },
      { label: 'Ajuste de Comisiones', icon: <PercentIcon />, path: '#' },
    ],
  },
  {
    label: 'Cobertura',
    icon: <PublicIcon />,
    children: [
      { label: 'Crear Reporte Cobertura', icon: <PublicIcon />, path: '#' },
      { label: 'Gestion Reporte Cobertura', icon: <PublicIcon />, path: '#' },
    ],
  },
  {
    label: 'Listas de Precios',
    icon: <AttachMoneyIcon />,
    children: [
      { label: 'Crear Lista de Precios', icon: <AttachMoneyIcon />, path: '#' },
      { label: 'Gestion Listas de Precios', icon: <AttachMoneyIcon />, path: '#' },
      { label: 'Copiar Listas de Precios', icon: <AttachMoneyIcon />, path: '#' },
      { label: 'Reportes Listas de Precios', icon: <AttachMoneyIcon />, path: '#' },
    ],
  },
  {
    label: 'Vendedor',
    icon: <PersonIcon />,
    children: [
      { label: 'Crear Cliente', icon: <PersonIcon />, path: '#' },
      { label: 'Clientes', icon: <PersonIcon />, path: '#' },
      { label: 'Crear Preventa', icon: <PersonIcon />, path: '#' },
      { label: 'Preventas', icon: <PersonIcon />, path: '#' },
      { label: 'Ventas', icon: <PersonIcon />, path: '#' },
      { label: 'Crear Cambio Productos', icon: <PersonIcon />, path: '#' },
      { label: 'Cambios de Productos', icon: <PersonIcon />, path: '#' },
      { label: 'Crear Canje', icon: <PersonIcon />, path: '#' },
      { label: 'Canjes', icon: <PersonIcon />, path: '#' },
      { label: 'Stock de Productos', icon: <PersonIcon />, path: '#' },
      { label: 'Comisiones', icon: <PersonIcon />, path: '#' },
      { label: 'Concursos', icon: <PersonIcon />, path: '#' },
    ],
  },
  {
    label: 'Configuracion',
    icon: <SettingsIcon />,
    children: [
      { label: 'Configuracion Empresa', icon: <SettingsIcon />, path: '#' },
      { label: 'Configuracion Impresión', icon: <SettingsIcon />, path: '#' },
      { label: 'Configuracion Sunat', icon: <SettingsIcon />, path: '#' },
      { label: 'Configuracion Alertas', icon: <SettingsIcon />, path: '#' },
    ],
  },
  {
    label: 'Transportistas',
    icon: <LocalShippingTwoToneIcon />,
    children: [
      { label: 'Mis Devoluciones', icon: <LocalShippingTwoToneIcon />, path: '#' },
      { label: 'Mis Requerimientos', icon: <LocalShippingTwoToneIcon />, path: '#' },
      { label: 'Mis Liquidaciones', icon: <LocalShippingTwoToneIcon />, path: '#' },
    ],
  },
  {
    label: 'General',
    icon: <AccountTreeIcon />,
    children: [
      { label: 'Perfil Personal', icon: <AccountTreeIcon />, path: '#' },
      { label: 'Home', icon: <AccountTreeIcon />, path: '/dashboard' },
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
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (label: string) => {
    setOpenCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const filtered = sidebarCategories.filter(
    (cat) =>
      cat.label.toLowerCase().includes(search.toLowerCase()) ||
      cat.children.some((c) => c.label.toLowerCase().includes(search.toLowerCase()))
  );

  const content = (
    <Box>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 800, color: colors.primary[800], letterSpacing: 1 }}>
          ARMORA
        </Typography>
      </Toolbar>
      <Box sx={{ px: 1.5, pb: 1 }}>
        <TextField
          size="small"
          placeholder="Búsqueda"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
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
      <List sx={{ px: 1, pb: 4 }} dense>
        {filtered.map((cat) => {
          const isOpen = openCategories[cat.label] ?? (cat.label === 'Dashboard');
          return (
            <Box key={cat.label} sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => toggleCategory(cat.label)}
                sx={{ borderRadius: 2, py: 0.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: colors.primary[700] }}>
                  {cat.icon}
                </ListItemIcon>
                <ListItemText
                  primary={cat.label}
                  sx={{
                    '& .MuiListItemText-primary': { fontSize: 13.5, fontWeight: 600 },
                  }}
                />
                {isOpen ? (
                  <ExpandLess fontSize="small" sx={{ color: colors.neutral.textMuted }} />
                ) : (
                  <ExpandMore fontSize="small" sx={{ color: colors.neutral.textMuted }} />
                )}
              </ListItemButton>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List dense disablePadding>
                  {cat.children.map((child) => (
                    <ListItemButton
                      key={child.label}
                      selected={activePath === child.path}
                      sx={{
                        pl: 5,
                        py: 0.3,
                        borderRadius: 2,
                        mx: 0.5,
                        '&.Mui-selected': {
                          backgroundColor: colors.primary[100],
                          color: colors.primary[700],
                          '&:hover': { backgroundColor: colors.primary[200] },
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 28, color: colors.neutral.textMuted }}>
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={child.label}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontSize: 12.5,
                            fontWeight: activePath === child.path ? 700 : 400,
                          },
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
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
