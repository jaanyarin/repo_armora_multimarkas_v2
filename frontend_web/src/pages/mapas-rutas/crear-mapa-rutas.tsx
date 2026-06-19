import { MouseEvent, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import BackspaceIcon from '@mui/icons-material/Backspace';
import ClearIcon from '@mui/icons-material/Clear';
import DrawIcon from '@mui/icons-material/Draw';
import SaveIcon from '@mui/icons-material/Save';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';
import { api } from '@/lib/api-client';

type Estado = 'ACTIVO' | 'INACTIVO';
type Point = [number, number];
type Zona = { id: string; codigo: string; nombreZona: string; color: string | null; estado: Estado; cantidadRutas: number; tienePoligono: boolean; observacion: string | null };
type Ruta = { id: string; codigo: string; zonaId: string; nombreRuta: string; nombreZona: string; zonaColor: string | null; diasAtencion: string[] | null; estado: Estado; observacion: string | null };
type GeoJsonPolygon = { type: 'Polygon'; coordinates: number[][][] };

const demoZonas: Zona[] = [
  { id: 'demo-z1', codigo: 'ZON-0001', nombreZona: 'ICA CENTRO', color: '#2563eb', estado: 'ACTIVO', cantidadRutas: 2, tienePoligono: false, observacion: null },
  { id: 'demo-z2', codigo: 'ZON-0002', nombreZona: 'PARCONA', color: '#16a34a', estado: 'ACTIVO', cantidadRutas: 1, tienePoligono: true, observacion: null },
];
const demoRutas: Ruta[] = [
  { id: 'demo-r1', codigo: 'RUT-0001', zonaId: 'demo-z1', nombreZona: 'ICA CENTRO', zonaColor: '#2563eb', nombreRuta: 'Ruta Ica Norte', diasAtencion: ['LUNES', 'MIERCOLES'], estado: 'ACTIVO', observacion: null },
  { id: 'demo-r2', codigo: 'RUT-0002', zonaId: 'demo-z1', nombreZona: 'ICA CENTRO', zonaColor: '#2563eb', nombreRuta: 'Ruta Ica Sur', diasAtencion: ['MARTES', 'JUEVES'], estado: 'ACTIVO', observacion: null },
  { id: 'demo-r3', codigo: 'RUT-0003', zonaId: 'demo-z2', nombreZona: 'PARCONA', zonaColor: '#16a34a', nombreRuta: 'Ruta Parcona', diasAtencion: ['SABADO'], estado: 'ACTIVO', observacion: null },
];
const demoPoints: Point[] = [[20, 24], [78, 18], [86, 66], [34, 82]];

function toGeoJson(points: Point[]): GeoJsonPolygon | null {
  if (points.length < 3) return null;
  const ring = points.map(([x, y]) => [Number(x.toFixed(4)), Number(y.toFixed(4))]);
  ring.push([ring[0][0], ring[0][1]]);
  return { type: 'Polygon', coordinates: [ring] };
}

function CanvasMapa({ points, setPoints, color }: { points: Point[]; setPoints: (points: Point[]) => void; color: string }) {
  const openLine = points.map(([x, y]) => `${x},${y}`).join(' ');
  const closedLine = points.length >= 3 ? `${openLine} ${points[0][0]},${points[0][1]}` : openLine;
  const addPoint = (event: MouseEvent<SVGSVGElement>) => {
    if ((event.target as SVGElement).tagName === 'circle') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Number((((event.clientX - rect.left) / rect.width) * 100).toFixed(2));
    const y = Number((((event.clientY - rect.top) / rect.height) * 100).toFixed(2));
    setPoints([...points, [x, y]]);
  };
  return (
    <Box sx={{ height: { xs: 360, md: 560 }, borderRadius: 2, border: `1px solid ${colors.neutral.border}`, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #e0f2fe, #f8fafc 50%, #dcfce7)' }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" onClick={addPoint} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: 'crosshair' }}>
        <path d="M5 72 C24 54 28 38 44 42 C61 46 64 20 94 26" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <path d="M10 25 C28 34 43 28 58 36 C73 44 80 58 94 62" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" strokeLinecap="round" />
        {points.length >= 3 ? <polygon points={closedLine} fill={`${color}33`} stroke={color} strokeWidth="1.2" /> : null}
        {points.length >= 2 ? <polyline points={openLine} fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 1" /> : null}
        {points.map(([x, y], i) => <circle key={`${x}-${y}-${i}`} cx={x} cy={y} r="1.9" fill="#fff" stroke={color} strokeWidth="1" />)}
      </svg>
      <Box sx={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#ffffffee', borderRadius: 2, p: 1, border: `1px solid ${colors.neutral.border}` }}>
        <Typography sx={{ fontWeight: 800, fontSize: 13 }}>Clic para agregar vertices</Typography>
        <Typography sx={{ fontSize: 12, color: colors.neutral.textMuted }}>3 vertices como minimo para guardar.</Typography>
      </Box>
    </Box>
  );
}

export default function CrearMapaRutasPage() {
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [zonaId, setZonaId] = useState('');
  const [rutaIds, setRutaIds] = useState<string[]>([]);
  const [nombreMapa, setNombreMapa] = useState('');
  const [observacion, setObservacion] = useState('');
  const [points, setPoints] = useState<Point[]>(demoPoints);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'success' | 'error' | 'info' });

  const zona = zonas.find((item) => item.id === zonaId) ?? null;
  const rutasZona = rutas.filter((ruta) => ruta.zonaId === zonaId && ruta.estado === 'ACTIVO');
  const polygon = useMemo(() => toGeoJson(points), [points]);
  const color = zona?.color ?? colors.primary[500];

  useEffect(() => {
    Promise.all([api.get<Zona[]>('/zonas-rutas/zonas'), api.get<Ruta[]>('/zonas-rutas/rutas')])
      .then(([zonasData, rutasData]) => {
        const nextZonas = zonasData?.length ? zonasData : demoZonas;
        const nextRutas = rutasData?.length ? rutasData : demoRutas;
        setZonas(nextZonas);
        setRutas(nextRutas);
        setZonaId(nextZonas[0]?.id ?? '');
        setNombreMapa(nextZonas[0] ? `Mapa ${nextZonas[0].nombreZona}` : 'Nuevo mapa de rutas');
      })
      .catch(() => {
        setZonas(demoZonas);
        setRutas(demoRutas);
        setZonaId(demoZonas[0].id);
        setNombreMapa(`Mapa ${demoZonas[0].nombreZona}`);
        setSnackbar({ open: true, message: 'API no disponible: mostrando datos demo para revisar la UX.', severity: 'info' });
      });
  }, []);

  useEffect(() => {
    const activas = rutas.filter((ruta) => ruta.zonaId === zonaId && ruta.estado === 'ACTIVO').map((ruta) => ruta.id);
    setRutaIds(activas);
    const nextZona = zonas.find((item) => item.id === zonaId);
    if (nextZona) setNombreMapa(`Mapa ${nextZona.nombreZona}`);
  }, [zonaId, zonas, rutas]);

  const save = async () => {
    if (!zonaId || rutaIds.length === 0 || !polygon) {
      setSnackbar({ open: true, message: 'Completa zona, rutas y poligono valido.', severity: 'error' });
      return;
    }
    try {
      await api.put(`/zonas-rutas/zonas/${zonaId}/poligono`, { coordenadas: polygon, nombreMapa, rutasIds: rutaIds, observacion: observacion.trim() || null });
      setSnackbar({ open: true, message: 'Mapa de rutas guardado.', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err instanceof Error ? err.message : 'Error al guardar mapa de rutas.', severity: 'error' });
    }
  };

  return (
    <AppLayout activePath="/mapas-rutas/crear-mapa-rutas" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ maxWidth: 1500 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.primary[600] }}>Crear Mapa de Rutas</Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.textMuted }}>Relaciona una zona comercial, sus rutas activas y un poligono visual de cobertura.</Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="outlined" startIcon={<BackspaceIcon />} disabled={!points.length} onClick={() => setPoints(points.slice(0, -1))}>Deshacer</Button>
            <Button variant="outlined" startIcon={<ClearIcon />} disabled={!points.length} onClick={() => setPoints([])}>Limpiar</Button>
            <Button variant="contained" startIcon={<SaveIcon />} disabled={!polygon || !zonaId || rutaIds.length === 0} onClick={save}>Guardar mapa</Button>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}`, mb: 2 }}>
              <Typography sx={{ fontWeight: 800, mb: 2 }}>Datos del mapa</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField fullWidth size="small" label="Nombre del mapa" value={nombreMapa} onChange={(e) => setNombreMapa(e.target.value)} /></Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small"><InputLabel>Zona</InputLabel><Select label="Zona" value={zonaId} onChange={(e) => setZonaId(e.target.value)}>{zonas.map((item) => <MenuItem key={item.id} value={item.id}>{item.codigo} - {item.nombreZona}</MenuItem>)}</Select></FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small"><InputLabel>Rutas</InputLabel><Select multiple label="Rutas" value={rutaIds} onChange={(e) => setRutaIds(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)} renderValue={(selected) => `${selected.length} ruta(s) seleccionada(s)`}>{rutasZona.map((ruta) => <MenuItem key={ruta.id} value={ruta.id}>{ruta.codigo} - {ruta.nombreRuta}</MenuItem>)}</Select></FormControl>
                </Grid>
                <Grid item xs={12}><TextField fullWidth multiline minRows={3} label="Observacion" value={observacion} onChange={(e) => setObservacion(e.target.value)} /></Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}` }}>
              <Typography sx={{ fontWeight: 800, mb: 1 }}>Validacion</Typography>
              <Stack spacing={1}>
                <Chip label={zona ? `Zona: ${zona.nombreZona}` : 'Zona pendiente'} color={zona ? 'success' : 'warning'} sx={{ justifyContent: 'flex-start', fontWeight: 700 }} />
                <Chip label={`${rutaIds.length} ruta(s) asociada(s)`} color={rutaIds.length ? 'success' : 'warning'} sx={{ justifyContent: 'flex-start', fontWeight: 700 }} />
                <Chip label={`${points.length} vertice(s)`} color={polygon ? 'success' : 'warning'} sx={{ justifyContent: 'flex-start', fontWeight: 700 }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}` }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                <Box><Typography sx={{ fontWeight: 800 }}>Mapa de cobertura</Typography><Typography sx={{ fontSize: 12, color: colors.neutral.textMuted }}>Index funcional integrado. Luego puede reemplazarse por Leaflet/OpenStreetMap manteniendo el mismo flujo.</Typography></Box>
                <Chip icon={<DrawIcon />} label={polygon ? 'Poligono valido' : 'Pendiente'} sx={{ fontWeight: 800, backgroundColor: polygon ? colors.semanticBackground.success : colors.semanticBackground.warning, color: polygon ? colors.semantic.success : '#92400e' }} />
              </Box>
              <CanvasMapa points={points} setPoints={setPoints} color={color} />
              <Box component="pre" sx={{ mt: 2, p: 1.5, maxHeight: 220, overflow: 'auto', borderRadius: 2, backgroundColor: '#0f172a', color: '#e2e8f0', fontSize: 12, fontFamily: 'monospace' }}>{JSON.stringify(polygon ?? { type: 'Polygon', coordinates: [] }, null, 2)}</Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}><Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert></Snackbar>
    </AppLayout>
  );
}
