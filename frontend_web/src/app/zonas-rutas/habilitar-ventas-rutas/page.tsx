'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
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
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import RouteIcon from '@mui/icons-material/Route';
import MapIcon from '@mui/icons-material/Map';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';
import { api } from '@/lib/api-client';

type Estado = 'ACTIVO' | 'INACTIVO';
type FiltroEstado = 'TODOS' | 'HABILITADA' | 'BLOQUEADA';

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
  actualizadoEn?: string | null;
};

type AccionMasiva = 'HABILITAR' | 'DESHABILITAR';

const DIAS = ['TODOS', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

function estadoVentasLabel(estado: Estado) {
  return estado === 'ACTIVO' ? 'Habilitada' : 'Bloqueada';
}

function EstadoVentasChip({ estado }: { estado: Estado }) {
  const habilitada = estado === 'ACTIVO';
  return (
    <Chip
      label={estadoVentasLabel(estado)}
      size="small"
      icon={habilitada ? <CheckCircleIcon /> : <BlockIcon />}
      sx={{
        borderRadius: '10px',
        fontWeight: 800,
        backgroundColor: habilitada ? colors.semanticBackground.success : colors.semanticBackground.danger,
        color: habilitada ? colors.semantic.success : colors.semantic.danger,
        '& .MuiChip-icon': { color: 'inherit' },
      }}
    />
  );
}

function diasLabel(dias: string[] | null) {
  return dias?.length ? dias.map((dia) => dia.slice(0, 3)).join(', ') : '-';
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

export default function HabilitarVentasRutasPage() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [zonaFiltro, setZonaFiltro] = useState('TODAS');
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>('TODOS');
  const [diaFiltro, setDiaFiltro] = useState('TODOS');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<AccionMasiva | null>(null);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showMessage = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<Ruta[]>('/zonas-rutas/rutas');
      setRutas(data ?? []);
      setSelectedIds([]);
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al cargar rutas', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const zonas = useMemo(() => {
    const unique = new Map<string, string>();
    rutas.forEach((ruta) => unique.set(ruta.nombreZona, ruta.nombreZona));
    return Array.from(unique.values()).sort((a, b) => a.localeCompare(b));
  }, [rutas]);

  const rutasFiltradas = useMemo(() => {
    const q = normalize(search);
    return rutas.filter((ruta) => {
      const matchSearch = !q || [ruta.codigo, ruta.nombreRuta, ruta.nombreZona, ruta.observacion ?? '']
        .some((value) => normalize(value).includes(q));
      const matchZona = zonaFiltro === 'TODAS' || ruta.nombreZona === zonaFiltro;
      const matchEstado = estadoFiltro === 'TODOS'
        || (estadoFiltro === 'HABILITADA' && ruta.estado === 'ACTIVO')
        || (estadoFiltro === 'BLOQUEADA' && ruta.estado === 'INACTIVO');
      const matchDia = diaFiltro === 'TODOS' || Boolean(ruta.diasAtencion?.includes(diaFiltro));
      return matchSearch && matchZona && matchEstado && matchDia;
    });
  }, [rutas, search, zonaFiltro, estadoFiltro, diaFiltro]);

  const kpi = useMemo(() => {
    const habilitadas = rutas.filter((ruta) => ruta.estado === 'ACTIVO').length;
    const bloqueadas = rutas.filter((ruta) => ruta.estado === 'INACTIVO').length;
    return {
      total: rutas.length,
      habilitadas,
      bloqueadas,
      zonas: zonas.length,
    };
  }, [rutas, zonas.length]);

  const allVisibleSelected = rutasFiltradas.length > 0 && rutasFiltradas.every((ruta) => selectedIds.includes(ruta.id));
  const selectedRutas = rutas.filter((ruta) => selectedIds.includes(ruta.id));

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !rutasFiltradas.some((ruta) => ruta.id === id)));
      return;
    }
    setSelectedIds((prev) => Array.from(new Set([...prev, ...rutasFiltradas.map((ruta) => ruta.id)])));
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((current) => current !== id) : [...prev, id]);
  };

  const applyMassAction = async () => {
    if (!confirmAction || selectedIds.length === 0) return;
    const nextEstado: Estado = confirmAction === 'HABILITAR' ? 'ACTIVO' : 'INACTIVO';
    setSaving(true);
    try {
      await Promise.all(selectedIds.map((id) => api.patch(`/zonas-rutas/rutas/${id}/estado`, { estado: nextEstado })));
      showMessage(
        confirmAction === 'HABILITAR'
          ? 'Ventas habilitadas para las rutas seleccionadas.'
          : 'Ventas bloqueadas para las rutas seleccionadas.',
        'success'
      );
      setConfirmAction(null);
      await fetchData();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al guardar cambios', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout activePath="/zonas-rutas/habilitar-ventas-rutas" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ maxWidth: 1440 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: colors.primary[600] }}>
              Habilitar Ventas en Rutas
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.textMuted, mt: 0.5 }}>
              Control operativo para activar o bloquear la venta por ruta, con filtros y acciones masivas.
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData} disabled={loading} sx={{ borderRadius: 2 }}>
            Actualizar
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          {[
            ['Total rutas', kpi.total, colors.primary[600], <RouteIcon key="total" />],
            ['Ventas habilitadas', kpi.habilitadas, colors.semantic.success, <CheckCircleIcon key="ok" />],
            ['Ventas bloqueadas', kpi.bloqueadas, colors.semantic.danger, <BlockIcon key="block" />],
            ['Zonas comerciales', kpi.zonas, colors.semantic.info, <MapIcon key="zone" />],
          ].map(([label, value, color, icon]) => (
            <Grid item xs={12} sm={6} md={3} key={String(label)}>
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}`, height: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: colors.neutral.textMuted, fontWeight: 700 }}>{label}</Typography>
                  <Box sx={{ color: String(color) }}>{icon}</Box>
                </Box>
                <Typography sx={{ mt: 1, fontSize: 32, fontWeight: 900, color: String(color) }}>{value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper sx={{ p: 2, mb: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}` }}>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar codigo, zona, ruta u observacion"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth size="small">
                <Select value={zonaFiltro} onChange={(e) => setZonaFiltro(e.target.value)}>
                  <MenuItem value="TODAS">Todas las zonas</MenuItem>
                  {zonas.map((zona) => <MenuItem key={zona} value={zona}>{zona}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth size="small">
                <Select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value as FiltroEstado)}>
                  <MenuItem value="TODOS">Todos los estados</MenuItem>
                  <MenuItem value="HABILITADA">Ventas habilitadas</MenuItem>
                  <MenuItem value="BLOQUEADA">Ventas bloqueadas</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2.5}>
              <FormControl fullWidth size="small">
                <Select value={diaFiltro} onChange={(e) => setDiaFiltro(e.target.value)}>
                  {DIAS.map((dia) => <MenuItem key={dia} value={dia}>{dia === 'TODOS' ? 'Todos los dias' : dia}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 1.5, mb: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ color: colors.neutral.textMuted }}>
            {selectedIds.length} ruta(s) seleccionada(s) de {rutasFiltradas.length} visible(s)
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              disabled={selectedIds.length === 0}
              onClick={() => setConfirmAction('HABILITAR')}
              sx={{ borderRadius: 2 }}
            >
              Habilitar ventas
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<BlockIcon />}
              disabled={selectedIds.length === 0}
              onClick={() => setConfirmAction('DESHABILITAR')}
              sx={{ borderRadius: 2 }}
            >
              Bloquear ventas
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ borderRadius: 2, border: `1px solid ${colors.neutral.border}`, overflow: 'hidden' }}>
          <TableContainer>
            <Table sx={{ minWidth: 1020 }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox checked={allVisibleSelected} indeterminate={selectedIds.length > 0 && !allVisibleSelected} onChange={toggleSelectAllVisible} />
                  </TableCell>
                  {['Codigo', 'Zona', 'Ruta', 'Dia de atencion', 'Estado venta', 'Ultima actualizacion', 'Observaciones'].map((header) => (
                    <TableCell key={header} sx={{ fontWeight: 700, color: colors.primary[900], textTransform: 'uppercase', fontSize: 12 }}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={8}>Cargando rutas...</TableCell></TableRow>
                ) : rutasFiltradas.length === 0 ? (
                  <TableRow><TableCell colSpan={8}>No hay rutas para los filtros aplicados.</TableCell></TableRow>
                ) : rutasFiltradas.map((ruta) => (
                  <TableRow key={ruta.id} hover selected={selectedIds.includes(ruta.id)}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selectedIds.includes(ruta.id)} onChange={() => toggleSelected(ruta.id)} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>{ruta.codigo}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: ruta.zonaColor ?? '#64748b' }} />
                        {ruta.nombreZona}
                      </Box>
                    </TableCell>
                    <TableCell>{ruta.nombreRuta}</TableCell>
                    <TableCell>{diasLabel(ruta.diasAtencion)}</TableCell>
                    <TableCell><EstadoVentasChip estado={ruta.estado} /></TableCell>
                    <TableCell>{ruta.actualizadoEn ?? '-'}</TableCell>
                    <TableCell>{ruta.observacion ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <Dialog open={Boolean(confirmAction)} onClose={() => setConfirmAction(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 900 }}>
          {confirmAction === 'HABILITAR' ? 'Confirmar habilitacion de ventas' : 'Confirmar bloqueo de ventas'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: colors.neutral.textMuted, mb: 2 }}>
            Se actualizaran {selectedRutas.length} ruta(s). Revisa el resumen antes de guardar.
          </Typography>
          <Box sx={{ maxHeight: 260, overflow: 'auto', border: `1px solid ${colors.neutral.border}`, borderRadius: 2 }}>
            {selectedRutas.map((ruta) => (
              <Box key={ruta.id} sx={{ p: 1.5, borderBottom: `1px solid ${colors.neutral.border}` }}>
                <Typography sx={{ fontWeight: 800 }}>{ruta.codigo} - {ruta.nombreRuta}</Typography>
                <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>{ruta.nombreZona} · actual: {estadoVentasLabel(ruta.estado)}</Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmAction(null)} disabled={saving}>Cancelar</Button>
          <Button variant="contained" color={confirmAction === 'DESHABILITAR' ? 'error' : 'primary'} onClick={applyMassAction} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
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
