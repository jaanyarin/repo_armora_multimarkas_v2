'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import RouteIcon from '@mui/icons-material/Route';
import SearchIcon from '@mui/icons-material/Search';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';
import { api } from '@/lib/api-client';

type EstadoMapaRuta = 'ACTIVO' | 'INACTIVO' | 'BORRADOR' | 'OBSERVADO';

type MapaRutaRow = {
  id: string;
  codigo: string;
  nombre: string;
  zona: string;
  ruta: string;
  vendedor: string;
  almacen: string;
  clientesAsignados: number;
  diaAtencion: string;
  estado: EstadoMapaRuta;
  actualizado: string;
  observacion?: string;
};

const PAGE_SIZE = 10;

const sampleData: MapaRutaRow[] = [
  {
    id: 'MR-001',
    codigo: 'MR-2026-001',
    nombre: 'Mapa Ruta Centro Ica',
    zona: 'Zona Ica Centro',
    ruta: 'Ruta ICA-01',
    vendedor: 'Carlos Medina',
    almacen: 'Almacen Principal',
    clientesAsignados: 48,
    diaAtencion: 'Lunes / Jueves',
    estado: 'ACTIVO',
    actualizado: '2026-06-18T10:20:00',
    observacion: 'Ruta operativa con cobertura completa para clientes mayoristas.',
  },
  {
    id: 'MR-002',
    codigo: 'MR-2026-002',
    nombre: 'Mapa Ruta La Tinguiña',
    zona: 'Zona Este',
    ruta: 'Ruta ICA-04',
    vendedor: 'Mariela Torres',
    almacen: 'Almacen Principal',
    clientesAsignados: 31,
    diaAtencion: 'Martes',
    estado: 'OBSERVADO',
    actualizado: '2026-06-17T16:05:00',
    observacion: 'Revisar clientes sin frecuencia comercial definida.',
  },
  {
    id: 'MR-003',
    codigo: 'MR-2026-003',
    nombre: 'Mapa Ruta Parcona',
    zona: 'Zona Norte',
    ruta: 'Ruta ICA-02',
    vendedor: 'Luis Carrasco',
    almacen: 'Almacen Secundario',
    clientesAsignados: 26,
    diaAtencion: 'Miercoles',
    estado: 'BORRADOR',
    actualizado: '2026-06-16T09:15:00',
    observacion: 'Pendiente validar asignacion de vendedor.',
  },
  {
    id: 'MR-004',
    codigo: 'MR-2026-004',
    nombre: 'Mapa Ruta Pisco Norte',
    zona: 'Zona Pisco',
    ruta: 'Ruta PIS-01',
    vendedor: 'Rosa Quispe',
    almacen: 'Almacen Pisco',
    clientesAsignados: 42,
    diaAtencion: 'Viernes',
    estado: 'ACTIVO',
    actualizado: '2026-06-15T11:40:00',
  },
  {
    id: 'MR-005',
    codigo: 'MR-2026-005',
    nombre: 'Mapa Ruta Chincha Sur',
    zona: 'Zona Chincha',
    ruta: 'Ruta CHI-03',
    vendedor: 'Sin asignar',
    almacen: 'Almacen Chincha',
    clientesAsignados: 0,
    diaAtencion: 'Sin definir',
    estado: 'INACTIVO',
    actualizado: '2026-06-10T08:30:00',
    observacion: 'Ruta inactiva hasta completar configuracion comercial.',
  },
];

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function EstadoChip({ estado }: { estado: EstadoMapaRuta }) {
  const map: Record<EstadoMapaRuta, { label: string; color: 'success' | 'warning' | 'error' | 'default' }> = {
    ACTIVO: { label: 'Activo', color: 'success' },
    INACTIVO: { label: 'Inactivo', color: 'default' },
    BORRADOR: { label: 'Borrador', color: 'warning' },
    OBSERVADO: { label: 'Observado', color: 'error' },
  };
  const item = map[estado];
  return <Chip size="small" color={item.color} label={item.label} sx={{ borderRadius: 2, fontWeight: 800 }} />;
}

function SemaforoCobertura({ clientes }: { clientes: number }) {
  const status = clientes >= 35
    ? { label: 'Alta', color: colors.status.operativo }
    : clientes > 0
      ? { label: 'Media', color: colors.status.observado }
      : { label: 'Sin cobertura', color: colors.status.critico };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: status.color, boxShadow: `0 0 0 4px ${status.color}22` }} />
      <Typography variant="body2" sx={{ fontWeight: 800, fontSize: 13 }}>{status.label}</Typography>
    </Box>
  );
}

function KpiCards({ rows }: { rows: MapaRutaRow[] }) {
  const kpi = useMemo(() => ({
    total: rows.length,
    activos: rows.filter((r) => r.estado === 'ACTIVO').length,
    observados: rows.filter((r) => r.estado === 'OBSERVADO').length,
    clientes: rows.reduce((acc, r) => acc + r.clientesAsignados, 0),
  }), [rows]);

  const cards = [
    { label: 'Mapas registrados', value: kpi.total, icon: <RouteIcon />, color: colors.primary[600] },
    { label: 'Activos', value: kpi.activos, icon: <SyncAltIcon />, color: colors.status.operativo },
    { label: 'Observados', value: kpi.observados, icon: <Inventory2Icon />, color: colors.status.critico },
    { label: 'Clientes asignados', value: kpi.clientes, icon: <AddLocationAltIcon />, color: colors.status.observado },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 2 }}>
      {cards.map((card) => (
        <Paper key={card.label} sx={{ p: 2, borderRadius: 3, border: `1px solid ${colors.neutral.border}`, boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Typography variant="body2" sx={{ color: colors.neutral.textMuted, fontSize: 13 }}>{card.label}</Typography>
            <Box sx={{ color: card.color, display: 'grid', placeItems: 'center' }}>{card.icon}</Box>
          </Box>
          <Typography sx={{ fontSize: 30, fontWeight: 900, mt: 0.5, color: card.color }}>{card.value}</Typography>
        </Paper>
      ))}
    </Box>
  );
}

export default function GestionMapasRutasPage() {
  const [rows, setRows] = useState<MapaRutaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('todos');
  const [zona, setZona] = useState('todos');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<MapaRutaRow | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<MapaRutaRow[]>('/mapas-rutas');
      setRows(Array.isArray(response) ? response : sampleData);
    } catch (err) {
      setRows(sampleData);
      setError(err instanceof Error ? err.message : 'No se pudo conectar al API. Se muestra data referencial.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const zonas = useMemo(() => Array.from(new Set(rows.map((r) => r.zona))).sort(), [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !q || [row.codigo, row.nombre, row.zona, row.ruta, row.vendedor, row.almacen].some((v) => v.toLowerCase().includes(q));
      const matchesEstado = estado === 'todos' || row.estado === estado;
      const matchesZona = zona === 'todos' || row.zona === zona;
      return matchesSearch && matchesEstado && matchesZona;
    });
  }, [rows, search, estado, zona]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [search, estado, zona]);

  const clearFilters = () => {
    setSearch('');
    setEstado('todos');
    setZona('todos');
  };

  const handlePendingAction = () => setSnackbarOpen(true);

  return (
    <AppLayout activePath="/mapas-rutas/gestion-mapas-rutas">
      <Box sx={{ p: { xs: 2, md: 3 }, fontFamily: 'Calibri, Arial, sans-serif' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: colors.primary[800], letterSpacing: -0.5 }}>
              Gestion de Mapas de Rutas
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.textMuted, mt: 0.5 }}>
              Administracion de rutas comerciales, zonas, vendedores, almacenes y cobertura de clientes. Sin componente de mapa.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<DownloadIcon />} sx={{ borderRadius: 2 }} onClick={handlePendingAction}>
              Exportar
            </Button>
            <Button variant="contained" startIcon={<AddLocationAltIcon />} sx={{ borderRadius: 2, fontWeight: 800 }} onClick={handlePendingAction}>
              Nuevo mapa ruta
            </Button>
          </Box>
        </Box>

        <KpiCards rows={rows} />

        <Paper sx={{ p: 2, borderRadius: 3, border: `1px solid ${colors.neutral.border}`, boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)', mb: 2 }}>
          <Grid container spacing={1.5} alignItems="end">
            <Grid item xs={12} md={5}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: '#334155' }}>Busqueda rapida</Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar por codigo, ruta, zona, vendedor o almacen"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" sx={{ color: colors.neutral.textMuted }} /></InputAdornment>,
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 } }}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: '#334155' }}>Estado</Typography>
              <FormControl fullWidth size="small">
                <Select value={estado} onChange={(event) => setEstado(event.target.value)} sx={{ borderRadius: 2, fontSize: 13 }}>
                  <MenuItem value="todos">Todos</MenuItem>
                  <MenuItem value="ACTIVO">Activo</MenuItem>
                  <MenuItem value="OBSERVADO">Observado</MenuItem>
                  <MenuItem value="BORRADOR">Borrador</MenuItem>
                  <MenuItem value="INACTIVO">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="caption" sx={{ fontWeight: 800, display: 'block', mb: 0.5, color: '#334155' }}>Zona</Typography>
              <FormControl fullWidth size="small">
                <Select value={zona} onChange={(event) => setZona(event.target.value)} sx={{ borderRadius: 2, fontSize: 13 }}>
                  <MenuItem value="todos">Todas</MenuItem>
                  {zonas.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined" startIcon={<FilterAltOffIcon />} onClick={clearFilters} sx={{ height: 40, borderRadius: 2 }}>
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ borderRadius: 3, border: `1px solid ${colors.neutral.border}`, overflow: 'hidden', boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)' }}>
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 6 }}><Typography color="text.secondary">Cargando mapas de rutas...</Typography></Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}><Typography color="text.secondary">No se encontraron resultados con los filtros actuales.</Typography></Box>
          ) : (
            <>
              {error && (
                <Alert severity="warning" sx={{ borderRadius: 0 }}>
                  API no disponible: se muestra informacion referencial para validar la interfaz.
                </Alert>
              )}
              <TableContainer>
                <Table sx={{ minWidth: 1120 }}>
                  <TableHead>
                    <TableRow>
                      {['Codigo / mapa', 'Zona y ruta', 'Vendedor', 'Almacen', 'Clientes', 'Dia atencion', 'Estado', 'Actualizado', 'Acciones'].map((head) => (
                        <TableCell key={head} sx={{ fontWeight: 800, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }} align={head === 'Acciones' ? 'right' : 'left'}>
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paged.map((row) => (
                      <TableRow key={row.id} hover sx={{ cursor: 'pointer', '&:hover td': { backgroundColor: '#f8fbff' } }} onClick={() => setSelected(row)}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 900, color: colors.primary[700] }}>{row.codigo}</Typography>
                          <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>{row.nombre}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{row.zona}</Typography>
                          <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>{row.ruta}</Typography>
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}><Typography variant="body2" sx={{ fontSize: 13 }}>{row.vendedor}</Typography></TableCell>
                        <TableCell sx={{ py: 1.5 }}><Typography variant="body2" sx={{ fontSize: 13 }}>{row.almacen}</Typography></TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 900 }}>{row.clientesAsignados}</Typography>
                          <SemaforoCobertura clientes={row.clientesAsignados} />
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}><Typography variant="body2" sx={{ fontSize: 13 }}>{row.diaAtencion}</Typography></TableCell>
                        <TableCell sx={{ py: 1.5 }}><EstadoChip estado={row.estado} /></TableCell>
                        <TableCell sx={{ py: 1.5 }}><Typography variant="body2" sx={{ fontSize: 13 }}>{formatDate(row.actualizado)}</Typography></TableCell>
                        <TableCell sx={{ py: 1.5 }} align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="Ver detalle"><IconButton size="small" onClick={(event) => { event.stopPropagation(); setSelected(row); }} sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}><VisibilityIcon fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Editar"><IconButton size="small" onClick={(event) => { event.stopPropagation(); handlePendingAction(); }} sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                            <Tooltip title="Eliminar"><IconButton size="small" onClick={(event) => { event.stopPropagation(); handlePendingAction(); }} sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}><DeleteOutlineIcon fontSize="small" /></IconButton></Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5, borderTop: `1px solid ${colors.neutral.border}`, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" sx={{ color: colors.neutral.textMuted }}>
                  Mostrando {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length} registros
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Button size="small" variant="outlined" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>Anterior</Button>
                  <Button size="small" variant="outlined" disabled={page >= pageCount - 1} onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>Siguiente</Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>
      </Box>

      <Drawer anchor="right" open={Boolean(selected)} onClose={() => setSelected(null)} sx={{ '& .MuiDrawer-paper': { width: { xs: '96vw', sm: 520 }, p: 3, borderLeft: `1px solid ${colors.neutral.border}` } }}>
        {selected && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Detalle del mapa ruta</Typography>
                <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>Consulta administrativa sin salir del listado</Typography>
              </Box>
              <IconButton size="small" onClick={() => setSelected(null)} sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}><CloseIcon fontSize="small" /></IconButton>
            </Box>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>Datos principales</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Codigo</Typography><Typography sx={{ fontWeight: 800 }}>{selected.codigo}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Estado</Typography><Box sx={{ mt: 0.4 }}><EstadoChip estado={selected.estado} /></Box></Grid>
                <Grid item xs={12}><Typography variant="caption" color="text.secondary">Nombre</Typography><Typography sx={{ fontWeight: 800 }}>{selected.nombre}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Zona</Typography><Typography sx={{ fontWeight: 800 }}>{selected.zona}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Ruta</Typography><Typography sx={{ fontWeight: 800 }}>{selected.ruta}</Typography></Grid>
              </Grid>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1.5 }}>Asignacion comercial</Typography>
              <Grid container spacing={1.5}>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Vendedor</Typography><Typography sx={{ fontWeight: 800 }}>{selected.vendedor}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Almacen</Typography><Typography sx={{ fontWeight: 800 }}>{selected.almacen}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Clientes</Typography><Typography sx={{ fontWeight: 800 }}>{selected.clientesAsignados}</Typography></Grid>
                <Grid item xs={6}><Typography variant="caption" color="text.secondary">Dia atencion</Typography><Typography sx={{ fontWeight: 800 }}>{selected.diaAtencion}</Typography></Grid>
              </Grid>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1 }}>Auditoria</Typography>
              <Typography variant="body2" sx={{ color: colors.neutral.textMuted }}>Ultima actualizacion: {formatDate(selected.actualizado)}</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="caption" color="text.secondary">Observacion</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{selected.observacion || 'Sin observaciones registradas.'}</Typography>
            </Paper>
          </Box>
        )}
      </Drawer>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity="info" variant="filled" onClose={() => setSnackbarOpen(false)}>
          Accion preparada para conectar con el CRUD del backend.
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}
