'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Tab,
  Tabs,
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
import AltRouteIcon from '@mui/icons-material/AltRoute';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MapIcon from '@mui/icons-material/Map';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';
import { api } from '@/lib/api-client';

type Estado = 'ACTIVO' | 'INACTIVO';

type Zona = {
  id: string;
  codigo: string;
  nombreZona: string;
  color: string | null;
  estado: Estado;
  observacion: string | null;
  cantidadRutas: number;
  tienePoligono: boolean;
};

type Ruta = {
  id: string;
  codigo: string;
  zonaId: string;
  nombreZona: string;
  zonaColor: string | null;
  nombreRuta: string;
  diasAtencion: string[] | null;
  estado: Estado;
  observacion: string | null;
};

type ZonaForm = {
  id?: string;
  codigo: string;
  nombreZona: string;
  color: string;
  estado: Estado;
  observacion: string;
};

type RutaForm = {
  id?: string;
  codigo: string;
  zonaId: string;
  nombreRuta: string;
  diasAtencion: string[];
  estado: Estado;
  observacion: string;
};

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];
const initialZona: ZonaForm = { codigo: '', nombreZona: '', color: '#2563eb', estado: 'ACTIVO', observacion: '' };
const initialRuta: RutaForm = { codigo: '', zonaId: '', nombreRuta: '', diasAtencion: [], estado: 'ACTIVO', observacion: '' };

function EstadoChip({ estado }: { estado: string }) {
  return <Chip label={estado === 'ACTIVO' ? 'Activo' : 'Inactivo'} size="small" color={estado === 'ACTIVO' ? 'success' : 'default'} sx={{ borderRadius: '8px', fontWeight: 700 }} />;
}

function PoligonoChip({ ok }: { ok: boolean }) {
  return (
    <Chip
      label={ok ? 'Definido' : 'Pendiente'}
      size="small"
      sx={{
        borderRadius: '8px',
        fontWeight: 700,
        backgroundColor: ok ? colors.semanticBackground.success : colors.semanticBackground.warning,
        color: ok ? colors.semantic.success : colors.semantic.warning,
      }}
    />
  );
}

function diasLabel(dias: string[] | null) {
  return dias?.length ? dias.map((d) => d.slice(0, 3)).join(', ') : '-';
}

function nextCode(prefix: string, count: number) {
  return `${prefix}-${String(count + 1).padStart(4, '0')}`;
}

export default function GestionZonasRutasPage() {
  const router = useRouter();
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'zonas' | 'rutas'>('zonas');
  const [search, setSearch] = useState('');
  const [zonaDialog, setZonaDialog] = useState(false);
  const [rutaDialog, setRutaDialog] = useState(false);
  const [zonaForm, setZonaForm] = useState<ZonaForm>(initialZona);
  const [rutaForm, setRutaForm] = useState<RutaForm>(initialRuta);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showMessage = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = search.trim() ? `?q=${encodeURIComponent(search.trim())}` : '';
      const [zonasData, rutasData] = await Promise.all([
        api.get<Zona[]>(`/zonas-rutas/zonas${params}`),
        api.get<Ruta[]>(`/zonas-rutas/rutas${params}`),
      ]);
      setZonas(zonasData ?? []);
      setRutas(rutasData ?? []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar zonas y rutas';
      setError(msg);
      showMessage(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const kpi = useMemo(() => ({
    zonas: zonas.length,
    rutas: rutas.length,
    zonasActivas: zonas.filter((z) => z.estado === 'ACTIVO').length,
    poligonos: zonas.filter((z) => z.tienePoligono).length,
  }), [zonas, rutas]);

  const openNewZona = () => {
    setZonaForm({ ...initialZona, codigo: nextCode('ZON', zonas.length) });
    setZonaDialog(true);
  };

  const openNewRuta = () => {
    setRutaForm({ ...initialRuta, codigo: nextCode('RUT', rutas.length), zonaId: zonas[0]?.id ?? '' });
    setRutaDialog(true);
  };

  const editZona = (zona: Zona) => {
    setZonaForm({
      id: zona.id,
      codigo: zona.codigo,
      nombreZona: zona.nombreZona,
      color: zona.color ?? '#2563eb',
      estado: zona.estado,
      observacion: zona.observacion ?? '',
    });
    setZonaDialog(true);
  };

  const editRuta = (ruta: Ruta) => {
    setRutaForm({
      id: ruta.id,
      codigo: ruta.codigo,
      zonaId: ruta.zonaId,
      nombreRuta: ruta.nombreRuta,
      diasAtencion: ruta.diasAtencion ?? [],
      estado: ruta.estado,
      observacion: ruta.observacion ?? '',
    });
    setRutaDialog(true);
  };

  const saveZona = async () => {
    if (!zonaForm.codigo.trim() || !zonaForm.nombreZona.trim()) {
      showMessage('Codigo y nombre de zona son obligatorios.', 'error');
      return;
    }
    const payload = {
      codigo: zonaForm.codigo.trim(),
      nombreZona: zonaForm.nombreZona.trim(),
      color: zonaForm.color,
      estado: zonaForm.estado,
      observacion: zonaForm.observacion.trim() || null,
    };
    try {
      if (zonaForm.id) await api.put(`/zonas-rutas/zonas/${zonaForm.id}`, payload);
      else await api.post('/zonas-rutas/zonas', payload);
      setZonaDialog(false);
      showMessage('Zona guardada.', 'success');
      fetchData();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al guardar zona', 'error');
    }
  };

  const saveRuta = async () => {
    if (!rutaForm.codigo.trim() || !rutaForm.zonaId || !rutaForm.nombreRuta.trim()) {
      showMessage('Codigo, zona y nombre de ruta son obligatorios.', 'error');
      return;
    }
    const payload = {
      codigo: rutaForm.codigo.trim(),
      zonaId: rutaForm.zonaId,
      nombreRuta: rutaForm.nombreRuta.trim(),
      diasAtencion: rutaForm.diasAtencion,
      estado: rutaForm.estado,
      observacion: rutaForm.observacion.trim() || null,
    };
    try {
      if (rutaForm.id) await api.put(`/zonas-rutas/rutas/${rutaForm.id}`, payload);
      else await api.post('/zonas-rutas/rutas', payload);
      setRutaDialog(false);
      showMessage('Ruta guardada.', 'success');
      fetchData();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al guardar ruta', 'error');
    }
  };

  const toggleEstado = async (tipo: 'zonas' | 'rutas', id: string, estado: Estado) => {
    try {
      await api.patch(`/zonas-rutas/${tipo}/${id}/estado`, { estado: estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' });
      fetchData();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al cambiar estado', 'error');
    }
  };

  const remove = async (tipo: 'zonas' | 'rutas', id: string, label: string) => {
    if (!window.confirm(`Eliminar ${label}?`)) return;
    try {
      await api.del(`/zonas-rutas/${tipo}/${id}`);
      showMessage('Registro eliminado.', 'success');
      fetchData();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al eliminar', 'error');
    }
  };

  return (
    <AppLayout activePath="/zonas-rutas/gestion-zonas-rutas" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ maxWidth: 1440 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.primary[600] }}>
              Gestion Zonas y Rutas
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.textMuted, mt: 0.5 }}>
              Crea zonas comerciales, registra rutas asociadas y define poligonos de cobertura por zona.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="contained" startIcon={<AddLocationAltIcon />} sx={{ borderRadius: 2 }} onClick={openNewZona}>
              Nueva zona
            </Button>
            <Button variant="contained" color="secondary" startIcon={<AltRouteIcon />} sx={{ borderRadius: 2 }} onClick={openNewRuta} disabled={zonas.length === 0}>
              Nueva ruta
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[
            ['Zonas', kpi.zonas, colors.primary[600]],
            ['Zonas activas', kpi.zonasActivas, colors.semantic.success],
            ['Rutas', kpi.rutas, colors.semantic.info],
            ['Poligonos', kpi.poligonos, colors.semantic.warning],
          ].map(([label, value, color]) => (
            <Grid item xs={6} md={3} key={String(label)}>
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}` }}>
                <Typography variant="body2" sx={{ color: colors.neutral.textMuted }}>{label}</Typography>
                <Typography sx={{ fontSize: 30, fontWeight: 800, color: String(color) }}>{value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}` }}>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar codigo, zona o ruta"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>Actualizar</Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ borderRadius: 2, border: `1px solid ${colors.neutral.border}`, overflow: 'hidden' }}>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ px: 2, borderBottom: `1px solid ${colors.neutral.border}` }}>
            <Tab value="zonas" label="Zonas" />
            <Tab value="rutas" label="Rutas" />
          </Tabs>

          {tab === 'zonas' ? (
            <TableContainer>
              <Table sx={{ minWidth: 980 }}>
                <TableHead>
                  <TableRow>
                    {['Codigo', 'Zona', 'Color', 'Rutas', 'Poligono', 'Estado', 'Observaciones', 'Acciones'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: colors.primary[900], textTransform: 'uppercase', fontSize: 12 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {error ? (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Typography color="error" gutterBottom>{error}</Typography>
                          <Button variant="outlined" onClick={fetchData}>Reintentar</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : loading ? <TableRow><TableCell colSpan={8}>Cargando...</TableCell></TableRow> : zonas.length === 0 ? (
                    <TableRow><TableCell colSpan={8}>No hay zonas registradas.</TableCell></TableRow>
                  ) : zonas.map((zona) => (
                    <TableRow key={zona.id} hover>
                      <TableCell sx={{ fontWeight: 800 }}>{zona.codigo}</TableCell>
                      <TableCell>{zona.nombreZona}</TableCell>
                      <TableCell><Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: zona.color ?? '#64748b' }} /></TableCell>
                      <TableCell>{zona.cantidadRutas}</TableCell>
                      <TableCell><PoligonoChip ok={zona.tienePoligono} /></TableCell>
                      <TableCell><EstadoChip estado={zona.estado} /></TableCell>
                      <TableCell>{zona.observacion ?? '-'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar zona"><IconButton onClick={() => editZona(zona)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Mapa y poligono"><IconButton onClick={() => router.push(`/zonas-rutas/gestion-zonas-rutas/poligono?zonaId=${zona.id}`)}><MapIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Activar/Inactivar"><IconButton onClick={() => toggleEstado('zonas', zona.id, zona.estado)}><ToggleOnIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar"><IconButton onClick={() => remove('zonas', zona.id, zona.codigo)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 980 }}>
                <TableHead>
                  <TableRow>
                    {['Codigo', 'Zona', 'Ruta', 'Dia de atencion', 'Estado', 'Observaciones', 'Acciones'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, color: colors.primary[900], textTransform: 'uppercase', fontSize: 12 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {error ? (
                    <TableRow>
                      <TableCell colSpan={7}>
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                          <Typography color="error" gutterBottom>{error}</Typography>
                          <Button variant="outlined" onClick={fetchData}>Reintentar</Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : loading ? <TableRow><TableCell colSpan={7}>Cargando...</TableCell></TableRow> : rutas.length === 0 ? (
                    <TableRow><TableCell colSpan={7}>No hay rutas registradas.</TableCell></TableRow>
                  ) : rutas.map((ruta) => (
                    <TableRow key={ruta.id} hover>
                      <TableCell sx={{ fontWeight: 800 }}>{ruta.codigo}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: ruta.zonaColor ?? '#64748b' }} />
                          {ruta.nombreZona}
                        </Box>
                      </TableCell>
                      <TableCell>{ruta.nombreRuta}</TableCell>
                      <TableCell>{diasLabel(ruta.diasAtencion)}</TableCell>
                      <TableCell><EstadoChip estado={ruta.estado} /></TableCell>
                      <TableCell>{ruta.observacion ?? '-'}</TableCell>
                      <TableCell align="right">
                        <Tooltip title="Editar ruta"><IconButton onClick={() => editRuta(ruta)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Activar/Inactivar"><IconButton onClick={() => toggleEstado('rutas', ruta.id, ruta.estado)}><ToggleOnIcon fontSize="small" /></IconButton></Tooltip>
                        <Tooltip title="Eliminar"><IconButton onClick={() => remove('rutas', ruta.id, ruta.codigo)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      <Dialog open={zonaDialog} onClose={() => setZonaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{zonaForm.id ? 'Editar zona' : 'Nueva zona'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={5}><TextField fullWidth label="Codigo" value={zonaForm.codigo} InputProps={{ readOnly: true }} size="small" /></Grid>
            <Grid item xs={12} md={7}><TextField fullWidth label="Nombre de la zona" value={zonaForm.nombreZona} onChange={(e) => setZonaForm({ ...zonaForm, nombreZona: e.target.value })} size="small" /></Grid>
            <Grid item xs={6}><TextField fullWidth type="color" label="Color" value={zonaForm.color} onChange={(e) => setZonaForm({ ...zonaForm, color: e.target.value })} size="small" /></Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <Select value={zonaForm.estado} onChange={(e) => setZonaForm({ ...zonaForm, estado: e.target.value as Estado })}>
                  <MenuItem value="ACTIVO">Activo</MenuItem>
                  <MenuItem value="INACTIVO">Inactivo</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={3} label="Observaciones" value={zonaForm.observacion} onChange={(e) => setZonaForm({ ...zonaForm, observacion: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setZonaDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveZona}>Guardar zona</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={rutaDialog} onClose={() => setRutaDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{rutaForm.id ? 'Editar ruta' : 'Nueva ruta'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={5}><TextField fullWidth label="Codigo" value={rutaForm.codigo} InputProps={{ readOnly: true }} size="small" /></Grid>
            <Grid item xs={12} md={7}>
              <FormControl fullWidth size="small">
                <Select value={rutaForm.zonaId} displayEmpty onChange={(e) => setRutaForm({ ...rutaForm, zonaId: e.target.value })}>
                  <MenuItem value="">Elegir zona creada</MenuItem>
                  {zonas.map((zona) => <MenuItem key={zona.id} value={zona.id}>{zona.codigo} - {zona.nombreZona}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Nombre de la ruta" value={rutaForm.nombreRuta} onChange={(e) => setRutaForm({ ...rutaForm, nombreRuta: e.target.value })} size="small" /></Grid>
            <Grid item xs={12}>
              <FormControl fullWidth size="small">
                <Select
                  multiple
                  displayEmpty
                  value={rutaForm.diasAtencion}
                  onChange={(e) => setRutaForm({ ...rutaForm, diasAtencion: e.target.value as string[] })}
                  renderValue={(selected) => selected.length ? selected.join(', ') : 'Dia de atencion'}
                >
                  {DIAS.map((dia) => <MenuItem key={dia} value={dia}>{dia}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}><TextField fullWidth multiline minRows={3} label="Observaciones" value={rutaForm.observacion} onChange={(e) => setRutaForm({ ...rutaForm, observacion: e.target.value })} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRutaDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={saveRuta}>Guardar ruta</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 7 }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
}
