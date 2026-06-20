'use client';

import { MouseEvent, Suspense, WheelEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BackspaceIcon from '@mui/icons-material/Backspace';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import DrawIcon from '@mui/icons-material/Draw';
import MapIcon from '@mui/icons-material/Map';
import SaveIcon from '@mui/icons-material/Save';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';
import { api } from '@/lib/api-client';

type Point = [number, number];
type MapMode = 'mover' | 'editar';
type PixelPoint = { x: number; y: number };
type Viewport = { width: number; height: number };

type GeoJsonPolygon = {
  type: 'Polygon';
  coordinates: number[][][];
};

type Zona = {
  id: string;
  codigo: string;
  nombreZona: string;
  color: string | null;
  estado: string;
  observacion: string | null;
  cantidadRutas: number;
  tienePoligono: boolean;
};

type PoligonoResponse = {
  id: string;
  coordenadas: GeoJsonPolygon;
  version: number;
  activo: boolean;
  creadoEn: string | null;
};

const ICA_POLYGON: GeoJsonPolygon = {
  type: 'Polygon',
  coordinates: [[
    [-75.7482, -14.0468],
    [-75.7063, -14.0543],
    [-75.7004, -14.0907],
    [-75.7443, -14.1034],
    [-75.7799, -14.0755],
    [-75.7482, -14.0468],
  ]],
};

function validatePolygon(value: unknown): value is GeoJsonPolygon {
  if (!value || typeof value !== 'object') return false;
  const polygon = value as GeoJsonPolygon;
  const ring = polygon.coordinates?.[0];
  if (polygon.type !== 'Polygon' || !Array.isArray(ring) || ring.length < 4) return false;
  const first = ring[0];
  const last = ring[ring.length - 1];
  return Array.isArray(first)
    && Array.isArray(last)
    && first[0] === last[0]
    && first[1] === last[1]
    && ring.every((p) => Array.isArray(p) && p.length >= 2 && typeof p[0] === 'number' && typeof p[1] === 'number');
}

function normalizeRing(points: Point[]) {
  if (points.length === 0) return [];
  const ring = points.slice();
  const first = ring[0];
  const last = ring[ring.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push([first[0], first[1]]);
  return ring;
}

function openRingFromPolygon(polygon: GeoJsonPolygon | null): Point[] {
  const ring = polygon?.coordinates?.[0] ?? [];
  if (ring.length <= 1) return [];
  return ring.slice(0, -1).map((p) => [p[0], p[1]]);
}

function polygonFromPoints(points: Point[]): GeoJsonPolygon | null {
  if (points.length < 3) return null;
  return { type: 'Polygon', coordinates: [normalizeRing(points)] };
}

const TILE_SIZE = 256;
const FALLBACK_VIEWPORT: Viewport = { width: 900, height: 620 };
const DEFAULT_CENTER: Point = [-75.739, -14.072];
const DEFAULT_ZOOM = 13;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lngLatToWorld([lng, lat]: Point, zoom: number): PixelPoint {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((clamp(lat, -85.05112878, 85.05112878) * Math.PI) / 180);
  return {
    x: ((lng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sinLat) / (1 - sinLat)) / (4 * Math.PI)) * scale,
  };
}

function worldToLngLat({ x, y }: PixelPoint, zoom: number): Point {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));
  return [Number(lng.toFixed(6)), Number(lat.toFixed(6))];
}

function screenToLngLat(x: number, y: number, center: Point, zoom: number, viewport: Viewport): Point {
  const centerWorld = lngLatToWorld(center, zoom);
  return worldToLngLat({
    x: centerWorld.x - viewport.width / 2 + x,
    y: centerWorld.y - viewport.height / 2 + y,
  }, zoom);
}

function lngLatToScreen(point: Point, center: Point, zoom: number, viewport: Viewport): PixelPoint {
  const centerWorld = lngLatToWorld(center, zoom);
  const pointWorld = lngLatToWorld(point, zoom);
  return {
    x: viewport.width / 2 + pointWorld.x - centerWorld.x,
    y: viewport.height / 2 + pointWorld.y - centerWorld.y,
  };
}

function pointsAttribute(points: Point[], center: Point, zoom: number, viewport: Viewport, closed: boolean) {
  const renderPoints = closed ? normalizeRing(points) : points;
  return renderPoints.map((point) => {
    const projected = lngLatToScreen(point, center, zoom, viewport);
    return `${projected.x},${projected.y}`;
  }).join(' ');
}

function InteractivePolygonEditor({
  points,
  setPoints,
  center,
  zoom,
  viewport,
  color,
}: {
  points: Point[];
  setPoints: (points: Point[]) => void;
  center: Point;
  zoom: number;
  viewport: Viewport;
  color: string;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const eventToSvgPoint = (event: MouseEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * viewport.width, 0, viewport.width),
      y: clamp(((event.clientY - rect.top) / rect.height) * viewport.height, 0, viewport.height),
    };
  };

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    if (dragIndex !== null) return;
    if ((event.target as SVGElement).tagName === 'circle') return;
    const { x, y } = eventToSvgPoint(event);
    setPoints([...points, screenToLngLat(x, y, center, zoom, viewport)]);
  };

  const handleMove = (event: MouseEvent<SVGSVGElement>) => {
    if (dragIndex === null) return;
    const { x, y } = eventToSvgPoint(event);
    const next = points.slice();
    next[dragIndex] = screenToLngLat(x, y, center, zoom, viewport);
    setPoints(next);
  };

  const stopDrag = () => setDragIndex(null);
  const polygonPoints = pointsAttribute(points, center, zoom, viewport, true);
  const linePoints = pointsAttribute(points, center, zoom, viewport, false);

  return (
    <svg
      viewBox={`0 0 ${viewport.width} ${viewport.height}`}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', cursor: dragIndex === null ? 'crosshair' : 'grabbing' }}
      onClick={handleClick}
      onMouseMove={handleMove}
      onMouseUp={stopDrag}
      onMouseLeave={stopDrag}
    >
      {points.length >= 3 ? <polygon points={polygonPoints} fill={`${color}44`} stroke={color} strokeWidth="5" /> : null}
      {points.length >= 2 ? <polyline points={linePoints} fill="none" stroke={color} strokeWidth="4" strokeDasharray="8 6" /> : null}
      {points.map((point, index) => {
        const { x, y } = lngLatToScreen(point, center, zoom, viewport);
        return (
          <g key={`${point[0]}-${point[1]}-${index}`}>
            <circle
              cx={x}
              cy={y}
              r="9"
              fill="#fff"
              stroke={color}
              strokeWidth="4"
              style={{ cursor: 'grab' }}
              onMouseDown={(event) => {
                event.stopPropagation();
                setDragIndex(index);
              }}
            />
            <text x={x + 12} y={y - 10} fontSize="13" fontWeight="800" fill={colors.neutral.text}>{index + 1}</text>
          </g>
        );
      })}
      {points.length === 0 ? (
        <foreignObject x="90" y="145" width="420" height="90">
          <Box sx={{ backgroundColor: '#ffffffee', borderRadius: 2, p: 1.5, textAlign: 'center', border: `1px solid ${colors.neutral.border}` }}>
            <Typography sx={{ fontWeight: 800 }}>Haz clic sobre el mapa para marcar vertices</Typography>
            <Typography sx={{ fontSize: 12, color: colors.neutral.textMuted }}>Luego arrastra cada punto para ajustar el area.</Typography>
          </Box>
        </foreignObject>
      ) : null}
    </svg>
  );
}

function MapaZona({ points, setPoints, color }: { points: Point[]; setPoints: (points: Point[]) => void; color: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<MapMode>('editar');
  const [center, setCenter] = useState<Point>(() => points[0] ?? DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [panStart, setPanStart] = useState<{ x: number; y: number; center: Point } | null>(null);
  const [viewport, setViewport] = useState<Viewport>(FALLBACK_VIEWPORT);

  useEffect(() => {
    if (points.length > 0) setCenter(points[0]);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      setViewport({
        width: Math.max(320, Math.round(rect.width)),
        height: Math.max(300, Math.round(rect.height)),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const centerWorld = useMemo(() => lngLatToWorld(center, zoom), [center, zoom]);
  const tiles = useMemo(() => {
    const topLeftX = centerWorld.x - viewport.width / 2;
    const topLeftY = centerWorld.y - viewport.height / 2;
    const minTileX = Math.floor(topLeftX / TILE_SIZE);
    const maxTileX = Math.floor((topLeftX + viewport.width) / TILE_SIZE);
    const minTileY = Math.floor(topLeftY / TILE_SIZE);
    const maxTileY = Math.floor((topLeftY + viewport.height) / TILE_SIZE);
    const tileCount = 2 ** zoom;
    const next = [];
    for (let x = minTileX; x <= maxTileX; x += 1) {
      for (let y = minTileY; y <= maxTileY; y += 1) {
        if (y < 0 || y >= tileCount) continue;
        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        next.push({
          key: `${zoom}-${wrappedX}-${y}`,
          url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
          left: x * TILE_SIZE - topLeftX,
          top: y * TILE_SIZE - topLeftY,
        });
      }
    }
    return next;
  }, [centerWorld, zoom, viewport]);

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (mode !== 'mover') return;
    setZoom((current) => clamp(current + (event.deltaY < 0 ? 1 : -1), 11, 18));
  };

  const handleDoubleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (mode !== 'mover') return;
    event.preventDefault();
    setZoom((current) => clamp(current + 1, 11, 18));
  };

  const startPan = (event: MouseEvent<HTMLDivElement>) => {
    if (mode !== 'mover') return;
    setPanStart({ x: event.clientX, y: event.clientY, center });
  };

  const movePan = (event: MouseEvent<HTMLDivElement>) => {
    if (mode !== 'mover' || !panStart) return;
    const startWorld = lngLatToWorld(panStart.center, zoom);
    setCenter(worldToLngLat({
      x: startWorld.x - (event.clientX - panStart.x),
      y: startWorld.y - (event.clientY - panStart.y),
    }, zoom));
  };

  return (
    <Box
      ref={containerRef}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
      onMouseDown={startPan}
      onMouseMove={movePan}
      onMouseUp={() => setPanStart(null)}
      onMouseLeave={() => setPanStart(null)}
      sx={{
        height: { xs: 380, md: 620 },
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${colors.neutral.border}`,
        position: 'relative',
        backgroundColor: colors.primary[50],
        cursor: mode === 'mover' ? (panStart ? 'grabbing' : 'grab') : 'default',
        userSelect: 'none',
      }}
    >
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {tiles.map((tile) => (
          <img
            key={tile.key}
            src={tile.url}
            alt=""
            draggable={false}
            style={{ position: 'absolute', left: tile.left, top: tile.top, width: TILE_SIZE, height: TILE_SIZE }}
          />
        ))}
      </Box>
      {mode === 'editar' ? (
        <InteractivePolygonEditor points={points} setPoints={setPoints} center={center} zoom={zoom} viewport={viewport} color={color} />
      ) : null}

      {mode === 'mover' ? (
        <svg viewBox={`0 0 ${viewport.width} ${viewport.height}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
          {points.length >= 3 ? <polygon points={pointsAttribute(points, center, zoom, viewport, true)} fill={`${color}44`} stroke={color} strokeWidth="5" /> : null}
          {points.map((point, index) => {
            const { x, y } = lngLatToScreen(point, center, zoom, viewport);
            return <circle key={`${point[0]}-${point[1]}-${index}`} cx={x} cy={y} r="7" fill="#fff" stroke={color} strokeWidth="3" />;
          })}
        </svg>
      ) : null}

      <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1, flexWrap: 'wrap', backgroundColor: '#ffffffee', p: 1, borderRadius: 1 }}>
        <Button
          size="small"
          variant={mode === 'mover' ? 'contained' : 'outlined'}
          startIcon={<MapIcon />}
          onClick={() => setMode('mover')}
        >
          Mover mapa
        </Button>
        <Button
          size="small"
          variant={mode === 'editar' ? 'contained' : 'outlined'}
          startIcon={<DrawIcon />}
          onClick={() => setMode('editar')}
        >
          Editar poligono
        </Button>
      </Box>

      <Box sx={{ position: 'absolute', left: 12, bottom: 12, backgroundColor: '#ffffffee', px: 1.5, py: 1, borderRadius: 1, maxWidth: 460 }}>
        <Typography sx={{ fontWeight: 800, fontSize: 12 }}>{mode === 'mover' ? 'Modo mover mapa' : 'Modo editar poligono'}</Typography>
        <Typography sx={{ fontSize: 12, color: colors.neutral.textMuted }}>
          {mode === 'mover'
            ? `Arrastra para desplazarte. Rueda o doble clic para zoom. Zoom ${zoom}.`
            : 'Clic agrega vertices. Arrastra puntos para ajustar. El mapa no se movera mientras dibujas.'}
        </Typography>
      </Box>
    </Box>
  );
}

function PoligonoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zonaId = searchParams.get('zonaId') ?? searchParams.get('id');
  const [zona, setZona] = useState<Zona | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [version, setVersion] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const polygon = useMemo(() => polygonFromPoints(points), [points]);
  const showMessage = (message: string, severity: 'success' | 'error') => setSnackbar({ open: true, message, severity });

  const loadData = useCallback(async () => {
    if (!zonaId) return;
    setLoading(true);
    try {
      const zonas = await api.get<Zona[]>('/zonas-rutas/zonas');
      setZona(zonas.find((z) => z.id === zonaId) ?? null);
      try {
        const p = await api.get<PoligonoResponse>(`/zonas-rutas/zonas/${zonaId}/poligono`);
        setPoints(openRingFromPolygon(p.coordenadas));
        setVersion(p.version);
      } catch {
        setPoints(openRingFromPolygon(ICA_POLYGON));
        setVersion(null);
      }
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al cargar zona', 'error');
    } finally {
      setLoading(false);
    }
  }, [zonaId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const save = async () => {
    if (!zonaId || !polygon || !validatePolygon(polygon)) {
      showMessage('Marca al menos 3 vertices para cerrar un poligono valido.', 'error');
      return;
    }
    setSaving(true);
    try {
      await api.put(`/zonas-rutas/zonas/${zonaId}/poligono`, { coordenadas: polygon });
      showMessage('Poligono guardado.', 'success');
      loadData();
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al guardar poligono', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!zonaId || !window.confirm('Eliminar el poligono activo de esta zona?')) return;
    try {
      await api.del(`/zonas-rutas/zonas/${zonaId}/poligono`);
      setPoints([]);
      setVersion(null);
      showMessage('Poligono eliminado.', 'success');
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Error al eliminar poligono', 'error');
    }
  };

  const undoPoint = () => setPoints(points.slice(0, -1));
  const clearPoints = () => setPoints([]);
  const loadExample = () => setPoints(openRingFromPolygon(ICA_POLYGON));

  if (!zonaId) {
    return (
      <AppLayout activePath="/zonas-rutas/gestion-zonas-rutas" username="ALEJANDRO ANYARIN" role="admin">
        <Alert severity="error">Falta el parametro zonaId.</Alert>
      </AppLayout>
    );
  }

  return (
    <AppLayout activePath="/zonas-rutas/gestion-zonas-rutas" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ maxWidth: 1500 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/zonas-rutas/gestion-zonas-rutas')} sx={{ mb: 1 }}>
              Volver a gestion
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.primary[600] }}>
              Mapa y poligono de zona
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.textMuted, mt: 0.5 }}>
              Dibuja el area con clics sobre el mapa y arrastra los vertices para ajustar la forma.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button variant="outlined" startIcon={<DrawIcon />} onClick={loadExample}>Ejemplo Ica</Button>
            <Button variant="outlined" startIcon={<BackspaceIcon />} onClick={undoPoint} disabled={points.length === 0}>Deshacer punto</Button>
            <Button variant="outlined" startIcon={<ClearIcon />} onClick={clearPoints} disabled={points.length === 0}>Limpiar</Button>
            <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={remove}>Eliminar guardado</Button>
            <Button variant="contained" startIcon={saving ? <CircularProgress size={18} /> : <SaveIcon />} onClick={save} disabled={saving || !polygon}>
              Guardar poligono
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>Cargando informacion...</Paper>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}`, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TravelExploreIcon sx={{ color: colors.primary[600] }} />
                  <Typography sx={{ fontWeight: 800 }}>Datos de zona</Typography>
                </Box>
                {zona ? (
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Typography><strong>Codigo:</strong> {zona.codigo}</Typography>
                    <Typography><strong>Zona:</strong> {zona.nombreZona}</Typography>
                    <Typography><strong>Estado:</strong> {zona.estado}</Typography>
                    <Typography><strong>Rutas asociadas:</strong> {zona.cantidadRutas}</Typography>
                    <Typography><strong>Vertices:</strong> {points.length}</Typography>
                    <Typography><strong>Version guardada:</strong> {version ?? '-'}</Typography>
                    <Chip
                      label={polygon ? 'Listo para guardar' : 'Marca minimo 3 vertices'}
                      sx={{
                        justifySelf: 'start',
                        fontWeight: 700,
                        backgroundColor: polygon ? colors.semanticBackground.success : colors.semanticBackground.warning,
                        color: polygon ? colors.semantic.success : colors.semantic.warning,
                      }}
                    />
                  </Box>
                ) : (
                  <Alert severity="warning">Zona no encontrada.</Alert>
                )}
              </Paper>

              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}` }}>
                <Typography sx={{ fontWeight: 800, mb: 1 }}>Coordenadas generadas</Typography>
                <Box
                  component="pre"
                  sx={{
                    m: 0,
                    p: 1.5,
                    minHeight: 260,
                    maxHeight: 420,
                    overflow: 'auto',
                    borderRadius: 2,
                    backgroundColor: '#0f172a',
                    color: '#e2e8f0',
                    fontSize: 12,
                    fontFamily: 'monospace',
                  }}
                >
                  {JSON.stringify(polygon ?? { type: 'Polygon', coordinates: [] }, null, 2)}
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, borderRadius: 2, border: `1px solid ${colors.neutral.border}` }}>
                <Typography sx={{ fontWeight: 800, mb: 1 }}>Mapa interactivo de cobertura</Typography>
                <MapaZona points={points} setPoints={setPoints} color={zona?.color ?? '#2563eb'} />
                <Alert severity="info" sx={{ mt: 2 }}>
                  Usa Mover mapa para desplazarte o hacer zoom. Usa Editar poligono para crear y ajustar vertices. Guardar persiste GeoJSON en BD.
                </Alert>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 7 }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </AppLayout>
  );
}

export default function PoligonoPage() {
  return (
    <Suspense fallback={<AppLayout activePath="/zonas-rutas/gestion-zonas-rutas"><CircularProgress /></AppLayout>}>
      <PoligonoContent />
    </Suspense>
  );
}
