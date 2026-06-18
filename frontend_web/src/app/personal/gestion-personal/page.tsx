'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Alert,
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
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CloseIcon from '@mui/icons-material/Close';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import GridViewIcon from '@mui/icons-material/GridView';
import TableChartIcon from '@mui/icons-material/TableChart';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';
import { api } from '@/lib/api-client';

// ─── Types ──────────────────────────────────────────────────────────────────

type PersonalRow = {
  id: string;
  nombresCompletos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefonoCelular: string;
  emailContacto: string;
  esVendedor: boolean;
  esTransportista: boolean;
  usuario: string;
  estado: string;
  ultimoAcceso: string | null;
};

type PersonalDetalle = PersonalRow & {
  usuarioId: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: string;
  telefonoFijo: string;
  direccion: string;
  referencia: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('');
}

function formatDate(iso: string | null) {
  if (!iso) return '\u2014';
  try {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    if (diffMin < 1) return 'Ahora';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHour < 8) return `Hace ${diffHour} h`;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm} ${hh}:${mi}`;
  } catch {
    return iso;
  }
}

function getPermisosStatus(person: PersonalRow): { label: string; color: 'success' | 'warning' | 'error' } {
  if (person.estado !== 'ACTIVO') return { label: 'Crítico', color: 'error' };
  if (person.esVendedor || person.esTransportista) return { label: 'Completo', color: 'success' };
  return { label: 'Revisar', color: 'warning' };
}

function getRolLabel(person: PersonalRow): string {
  if (person.esVendedor && person.esTransportista) return 'Vendedor / Transportista';
  if (person.esVendedor) return 'Vendedor';
  if (person.esTransportista) return 'Transportista';
  return 'Operador';
}

// ─── Componentes internos (sin estado) ───────────────────────────────────────

function EstadoChip({ estado }: { estado: string }) {
  const map: Record<string, { label: string; color: 'success' | 'error' | 'warning' | 'default' }> = {
    ACTIVO: { label: 'Activo', color: 'success' },
    INACTIVO: { label: 'Inactivo', color: 'default' },
    BLOQUEADO: { label: 'Bloqueado', color: 'error' },
  };
  const m = map[estado] ?? { label: estado, color: 'default' };
  return <Chip label={m.label} color={m.color} size="small" sx={{ fontWeight: 700, borderRadius: '8px' }} />;
}

function PermisosSemaforo({ person }: { person: PersonalRow }) {
  const s = getPermisosStatus(person);
  const dotColors: Record<string, string> = {
    success: colors.status.operativo,
    warning: colors.status.observado,
    error: colors.status.critico,
  };
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: dotColors[s.color],
          boxShadow: `0 0 0 4px ${dotColors[s.color]}22`,
        }}
      />
      <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>
        {s.label}
      </Typography>
    </Box>
  );
}

function RolChip({ person }: { person: PersonalRow }) {
  const label = getRolLabel(person);
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        fontWeight: 700,
        borderRadius: '8px',
        backgroundColor: '#e0e7ff',
        color: '#3730a3',
        fontSize: 12,
      }}
    />
  );
}

function DetailItem({ label, value, fullWidth }: { label: string; value: React.ReactNode; fullWidth?: boolean }) {
  return (
    <Box sx={{ gridColumn: fullWidth ? '1 / -1' : undefined }}>
      <Typography variant="caption" sx={{ color: colors.neutral.textMuted, fontSize: 12 }}>
        {label}
      </Typography>
      <Box sx={{ mt: 0.3 }}>
        {typeof value === 'string' ? (
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 14 }}>
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  );
}

// ─── Componentes con props ──────────────────────────────────────────────────

type KpiData = {
  total: number;
  activos: number;
  bloqueados: number;
  sinPermisos: number;
};

function KpiCards({ kpi }: { kpi: KpiData }) {
  const cards = [
    { label: 'Total personal', value: kpi.total, color: colors.primary[600] },
    { label: 'Activos', value: kpi.activos, color: colors.status.operativo },
    { label: 'Bloqueados', value: kpi.bloqueados, color: colors.status.critico },
    { label: 'Sin permisos completos', value: kpi.sinPermisos, color: colors.status.observado },
  ];
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 2,
        mb: 2,
      }}
    >
      {cards.map((card) => (
        <Paper
          key={card.label}
          sx={{
            p: 2,
            borderRadius: 3,
            border: `1px solid ${colors.neutral.border}`,
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Typography variant="body2" sx={{ color: colors.neutral.textMuted, fontSize: 13 }}>
            {card.label}
          </Typography>
          <Typography sx={{ fontSize: 30, fontWeight: 800, mt: 0.5, color: card.color }}>
            {card.value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

interface FilterToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  filterEstado: string;
  setFilterEstado: (v: string) => void;
  filterRol: string;
  setFilterRol: (v: string) => void;
  filterPermisos: string;
  setFilterPermisos: (v: string) => void;
  handleClearFilters: () => void;
}

function FilterToolbar({
  search,
  setSearch,
  filterEstado,
  setFilterEstado,
  filterRol,
  setFilterRol,
  filterPermisos,
  setFilterPermisos,
  handleClearFilters,
}: FilterToolbarProps) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 3,
        border: `1px solid ${colors.neutral.border}`,
        boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
        mb: 2,
      }}
    >
      <Grid container spacing={1.5} alignItems="end">
        <Grid item xs={12} sm={3} md={2.5}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#334155' }}>
              Búsqueda rápida
            </Typography>
            <TextField
              key="search-input-fixed"
              fullWidth
              size="small"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: colors.neutral.textMuted }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: 13 },
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={6} sm={2} md={1.5}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#334155' }}>
              Estado
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                sx={{ borderRadius: 2, fontSize: 13 }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="ACTIVO">Activo</MenuItem>
                <MenuItem value="INACTIVO">Inactivo</MenuItem>
                <MenuItem value="BLOQUEADO">Bloqueado</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={6} sm={2} md={1.5}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#334155' }}>
              Rol
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filterRol}
                onChange={(e) => setFilterRol(e.target.value)}
                sx={{ borderRadius: 2, fontSize: 13 }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="vendedor">Vendedor</MenuItem>
                <MenuItem value="transportista">Transportista</MenuItem>
                <MenuItem value="operador">Operador</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={6} sm={2} md={1.5}>
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, color: '#334155' }}>
              Permisos
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={filterPermisos}
                onChange={(e) => setFilterPermisos(e.target.value)}
                sx={{ borderRadius: 2, fontSize: 13 }}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="completos">Completos</MenuItem>
                <MenuItem value="pendientes">Pendientes</MenuItem>
                <MenuItem value="sin">Sin permisos</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={6} sm={2} md={1}>
          <Box>
            <Typography sx={{ visibility: 'hidden', mb: 0.5 }}>&nbsp;</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={handleClearFilters}
              startIcon={<FilterAltOffIcon />}
              sx={{ borderRadius: 2, fontSize: 12, height: 40 }}
            >
              Limpiar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

interface PersonalTableProps {
  loading: boolean;
  error: string;
  filtered: PersonalRow[];
  data: PersonalRow[];
  paged: PersonalRow[];
  page: number;
  pageCount: number;
  setPage: (n: number) => void;
  handleRowClick: (id: string) => void;
  handleOpenDetail: (id: string) => void;
  handleEditar: (id: string) => void;
  handleCambiarClave: (id: string) => void;
  fetchData: () => void;
}

function PersonalTable({
  loading,
  error,
  filtered,
  data,
  paged,
  page,
  pageCount,
  setPage,
  handleRowClick,
  handleOpenDetail,
  handleEditar,
  handleCambiarClave,
  fetchData,
}: PersonalTableProps) {
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary">Cargando personal...</Typography>
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="error">{error}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={fetchData}>
          Reintentar
        </Button>
      </Box>
    );
  }
  if (filtered.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="text.secondary">
          {data.length === 0 ? 'No hay personal registrado.' : 'No se encontraron resultados con los filtros actuales.'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }}>
                Código / Personal
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }}>
                Usuario
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }}>
                Contacto
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }}>
                Rol
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }}>
                Estado
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }}>
                Permisos
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }}>
                Último acceso
              </TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', color: '#475569', py: 2 }} align="right">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paged.map((person) => {
              const initials = getInitials(person.nombresCompletos);
              return (
                <TableRow
                  key={person.id}
                  hover
                  sx={{ cursor: 'pointer', '&:hover td': { backgroundColor: '#f8fbff' } }}
                  onClick={() => handleRowClick(person.id)}
                >
                  <TableCell sx={{ py: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius: 2,
                          backgroundColor: colors.primary[100],
                          color: colors.primary[600],
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: 800,
                          fontSize: 14,
                          flexShrink: 0,
                        }}
                      >
                        {initials}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 14 }}>
                          {person.nombresCompletos}
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>
                          {person.tipoDocumento} {person.numeroDocumento}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>
                      {person.usuario}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>
                      Autenticación local
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                      {person.emailContacto || '\u2014'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>
                      {person.telefonoCelular || ''}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <RolChip person={person} />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <EstadoChip estado={person.estado} />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <PermisosSemaforo person={person} />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                      {formatDate(person.ultimoAcceso)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }} align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Ver">
                        <IconButton
                          size="small"
                          sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}
                          onClick={(e) => { e.stopPropagation(); handleOpenDetail(person.id); }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}
                          onClick={(e) => { e.stopPropagation(); handleEditar(person.id); }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Cambiar contraseña">
                        <IconButton
                          size="small"
                          sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}
                          onClick={(e) => { e.stopPropagation(); handleCambiarClave(person.id); }}
                        >
                          <LockResetIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Permisos">
                        <IconButton
                          size="small"
                          sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}
                        >
                          <AdminPanelSettingsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 2,
          py: 1.5,
          borderTop: `1px solid ${colors.neutral.border}`,
          color: colors.neutral.textMuted,
          fontSize: 14,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ color: colors.neutral.textMuted }}>
          Mostrando {page * 10 + 1}–{Math.min((page + 1) * 10, filtered.length)} de {filtered.length} registros
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            size="small"
            disabled={page === 0}
            onClick={() => setPage(Math.max(0, page - 1))}
            sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>‹</Typography>
          </IconButton>
          {Array.from({ length: Math.min(pageCount, 7) }, (_, i) => {
            let pageNum: number;
            if (pageCount <= 7) {
              pageNum = i;
            } else if (page <= 3) {
              pageNum = i;
            } else if (page >= pageCount - 4) {
              pageNum = pageCount - 7 + i;
            } else {
              pageNum = page - 3 + i;
            }
            const isActive = pageNum === page;
            return (
              <IconButton
                key={pageNum}
                size="small"
                onClick={() => setPage(pageNum)}
                sx={{
                  border: `1px solid ${isActive ? colors.primary[600] : colors.neutral.border}`,
                  borderRadius: 1.5,
                  backgroundColor: isActive ? colors.primary[600] : 'transparent',
                  color: isActive ? '#fff' : colors.neutral.text,
                  fontWeight: 700,
                  minWidth: 36,
                  height: 36,
                }}
              >
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{pageNum + 1}</Typography>
              </IconButton>
            );
          })}
          <IconButton
            size="small"
            disabled={page >= pageCount - 1}
            onClick={() => setPage(Math.min(pageCount - 1, page + 1))}
            sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 16 }}>›</Typography>
          </IconButton>
        </Box>
      </Box>
    </>
  );
}

interface DetailDrawerProps {
  data: PersonalRow[];
  selectedId: string | null;
  detalle: PersonalDetalle | null;
  loadingDetalle: boolean;
  handleCloseDetail: () => void;
  handleEditar: (id: string) => void;
  handleCambiarClave: (id: string) => void;
}

function DetailDrawer({
  data,
  selectedId,
  detalle,
  loadingDetalle,
  handleCloseDetail,
  handleEditar,
  handleCambiarClave,
}: DetailDrawerProps) {
  const person = data.find((p) => p.id === selectedId);
  if (!person) return null;

  const initials = getInitials(person.nombresCompletos);

  return (
    <Drawer
      anchor="right"
      open={Boolean(selectedId)}
      onClose={handleCloseDetail}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '96vw', sm: 520 },
          p: 3,
          borderLeft: `1px solid ${colors.neutral.border}`,
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Detalle del personal
          </Typography>
          <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>
            Vista lateral para gestionar sin salir del listado
          </Typography>
        </Box>
        <IconButton onClick={handleCloseDetail} size="small" sx={{ border: `1px solid ${colors.neutral.border}`, borderRadius: 1.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {loadingDetalle ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">Cargando detalle...</Typography>
        </Box>
      ) : detalle ? (
        <>
          {/* Section: Main */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Datos principales
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <DetailItem label="Código" value={'\u2014'} />
              <DetailItem
                label="Estado"
                value={<EstadoChip estado={detalle.estado} />}
              />
              <DetailItem label="Nombre" value={detalle.nombresCompletos} />
              <DetailItem label="Usuario" value={detalle.usuario} />
              <DetailItem label="Documento" value={`${detalle.tipoDocumento} ${detalle.numeroDocumento}`} />
              <DetailItem label="Correo" value={detalle.emailContacto || '\u2014'} />
            </Box>
          </Paper>

          {/* Section: Access & Security */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Acceso y seguridad
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <DetailItem label="Rol" value={<RolChip person={person} />} />
              <DetailItem label="Último acceso" value={formatDate(detalle.ultimoAcceso)} />
              <DetailItem label="Celular" value={detalle.telefonoCelular || '\u2014'} />
              <DetailItem label="Teléfono" value={detalle.telefonoFijo || '\u2014'} />
              {detalle.direccion && <DetailItem label="Dirección" value={detalle.direccion} fullWidth />}
            </Box>
          </Paper>

          {/* Section: Permissions (placeholder) */}
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
              Permisos destacados
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {detalle.esVendedor && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    border: `1px solid ${colors.neutral.border}`,
                    borderRadius: 2,
                    fontSize: 13,
                  }}
                >
                  <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: colors.status.operativo, display: 'grid', placeItems: 'center' }}>
                    <Typography sx={{ color: '#fff', fontSize: 12, lineHeight: 1 }}>✓</Typography>
                  </Box>
                  Gestión Ventas
                </Box>
              )}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  border: `1px solid ${colors.neutral.border}`,
                  borderRadius: 2,
                  fontSize: 13,
                }}
              >
                <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: colors.status.operativo, display: 'grid', placeItems: 'center' }}>
                  <Typography sx={{ color: '#fff', fontSize: 12, lineHeight: 1 }}>✓</Typography>
                </Box>
                Gestión Personal
              </Box>
            </Box>
          </Paper>

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => handleEditar(person.id)}
            >
              Editar personal
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LockResetIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => handleCambiarClave(person.id)}
            >
              Cambiar contraseña
            </Button>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error">No se pudo cargar el detalle.</Typography>
        </Box>
      )}
    </Drawer>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

export default function GestionPersonalPage() {
  const router = useRouter();
  const [data, setData] = useState<PersonalRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Filters
  const [search, setSearch] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterRol, setFilterRol] = useState('todos');
  const [filterPermisos, setFilterPermisos] = useState('todos');

  // Side panel
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detalle, setDetalle] = useState<PersonalDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Password dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordTargetId, setPasswordTargetId] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // ── Fetch list ────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await api.get<PersonalRow[]>('/personal');
      setData(list ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar personal');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Fetch detalle ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!selectedId) {
      setDetalle(null);
      return;
    }
    setLoadingDetalle(true);
    api
      .get<PersonalDetalle>(`/personal/${selectedId}`)
      .then((d) => setDetalle(d))
      .catch(() => setDetalle(null))
      .finally(() => setLoadingDetalle(false));
  }, [selectedId]);

  // ── Filter & Paginate ─────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    let items = data;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.nombresCompletos.toLowerCase().includes(q) ||
          p.usuario.toLowerCase().includes(q) ||
          p.numeroDocumento.includes(q) ||
          (p.emailContacto && p.emailContacto.toLowerCase().includes(q)),
      );
    }

    // Estado
    if (filterEstado !== 'todos') {
      items = items.filter((p) => p.estado === filterEstado);
    }

    // Rol
    if (filterRol !== 'todos') {
      if (filterRol === 'vendedor') items = items.filter((p) => p.esVendedor);
      else if (filterRol === 'transportista') items = items.filter((p) => p.esTransportista);
      else if (filterRol === 'operador') items = items.filter((p) => !p.esVendedor && !p.esTransportista);
    }

    // Permisos
    if (filterPermisos === 'completos') {
      items = items.filter((p) => p.estado === 'ACTIVO' && (p.esVendedor || p.esTransportista));
    } else if (filterPermisos === 'pendientes') {
      items = items.filter((p) => p.estado === 'ACTIVO' && !p.esVendedor && !p.esTransportista);
    } else if (filterPermisos === 'sin') {
      items = items.filter((p) => p.estado !== 'ACTIVO');
    }

    return items;
  }, [data, search, filterEstado, filterRol, filterPermisos]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Reset page when filters change
  useEffect(() => {
    setPage(0);
  }, [search, filterEstado, filterRol, filterPermisos]);

  // ── KPI calculations ──────────────────────────────────────────────────────

  const kpi = useMemo(() => {
    const total = data.length;
    const activos = data.filter((p) => p.estado === 'ACTIVO').length;
    const bloqueados = data.filter((p) => p.estado === 'BLOQUEADO').length;
    const sinPermisos = data.filter((p) => p.estado !== 'ACTIVO' || (!p.esVendedor && !p.esTransportista)).length;
    return { total, activos, bloqueados, sinPermisos };
  }, [data]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleClearFilters = () => {
    setSearch('');
    setFilterEstado('todos');
    setFilterRol('todos');
    setFilterPermisos('todos');
  };

  const handleOpenDetail = (id: string) => {
    setSelectedId(id);
  };

  const handleCloseDetail = () => {
    setSelectedId(null);
  };

  const handleRowClick = (id: string) => {
    handleOpenDetail(id);
  };

  const handleEditar = (id: string) => {
    router.push('/personal/editar-personal?id=' + id);
  };

  const handleCambiarClave = (id: string) => {
    setPasswordTargetId(id);
    setPasswordValue('');
    setConfirmPasswordValue('');
    setPasswordError('');
    setPasswordDialogOpen(true);
  };

  // ── Password Dialog Logic ────────────────────────────────────────────────

  const passwordMismatch = confirmPasswordValue.length > 0 && passwordValue !== confirmPasswordValue;
  const passwordTooShort = passwordValue.length > 0 && passwordValue.length < 6;
  const passwordCanSubmit = passwordValue.length >= 6 && confirmPasswordValue.length >= 6 && !passwordMismatch;

  const handlePasswordClose = () => {
    setPasswordDialogOpen(false);
    setPasswordTargetId(null);
    setPasswordValue('');
    setConfirmPasswordValue('');
    setPasswordError('');
    setPasswordLoading(false);
  };

  const handlePasswordSubmit = async () => {
    if (!passwordTargetId || !passwordCanSubmit) return;
    setPasswordLoading(true);
    setPasswordError('');
    try {
      await api.patch(`/personal/${passwordTargetId}/cambiar-clave`, {
        nuevaClave: passwordValue,
        confirmarClave: confirmPasswordValue,
      });
      setSnackbarMessage('Contraseña actualizada correctamente.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handlePasswordClose();
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Error al cambiar la contraseña.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // ── Render: Main JSX ──────────────────────────────────────────────────────

  return (
    <AppLayout activePath="/personal/gestion-personal" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ maxWidth: 1400 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: colors.primary[600], letterSpacing: '-0.03em' }}>
              Gestión del Personal
            </Typography>
            <Typography variant="body2" sx={{ color: colors.neutral.textMuted, mt: 0.5 }}>
              Administra usuarios, estado de acceso, roles, almacén, lista de precios y permisos operativos.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ borderRadius: 2 }}
            >
              Exportar
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              sx={{ borderRadius: 2 }}
              onClick={() => { window.location.href = '/personal/crear-personal'; }}
            >
              Nuevo personal
            </Button>
          </Box>
        </Box>

        {/* KPI Cards */}
        <KpiCards kpi={kpi} />

        {/* Filters */}
        <FilterToolbar
          search={search}
          setSearch={setSearch}
          filterEstado={filterEstado}
          setFilterEstado={setFilterEstado}
          filterRol={filterRol}
          setFilterRol={setFilterRol}
          filterPermisos={filterPermisos}
          setFilterPermisos={setFilterPermisos}
          handleClearFilters={handleClearFilters}
        />

        {/* Content Card */}
        <Paper
          sx={{
            borderRadius: 3,
            border: `1px solid ${colors.neutral.border}`,
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Table header with view toggle */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${colors.neutral.border}`,
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Personal registrado
              </Typography>
              <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>
                Total: {data.length} registros
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                backgroundColor: colors.neutral.background,
                p: 0.5,
                borderRadius: 2,
                gap: 0.5,
              }}
            >
              <IconButton
                size="small"
                onClick={() => setViewMode('table')}
                sx={{
                  borderRadius: 1.5,
                  backgroundColor: viewMode === 'table' ? '#fff' : 'transparent',
                  boxShadow: viewMode === 'table' ? '0 4px 12px rgba(15,23,42,0.08)' : 'none',
                  color: viewMode === 'table' ? colors.primary[600] : colors.neutral.textMuted,
                }}
              >
                <TableChartIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => setViewMode('cards')}
                sx={{
                  borderRadius: 1.5,
                  backgroundColor: viewMode === 'cards' ? '#fff' : 'transparent',
                  boxShadow: viewMode === 'cards' ? '0 4px 12px rgba(15,23,42,0.08)' : 'none',
                  color: viewMode === 'cards' ? colors.primary[600] : colors.neutral.textMuted,
                }}
              >
                <GridViewIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Table / Cards view */}
          {viewMode === 'table' ? (
            <PersonalTable
              loading={loading}
              error={error}
              filtered={filtered}
              data={data}
              paged={paged}
              page={page}
              pageCount={pageCount}
              setPage={setPage}
              handleRowClick={handleRowClick}
              handleOpenDetail={handleOpenDetail}
              handleEditar={handleEditar}
              handleCambiarClave={handleCambiarClave}
              fetchData={fetchData}
            />
          ) : (
            <Box sx={{ p: 2 }}>
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Vista tarjetas próximamente.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Side panel */}
      <DetailDrawer
        data={data}
        selectedId={selectedId}
        detalle={detalle}
        loadingDetalle={loadingDetalle}
        handleCloseDetail={handleCloseDetail}
        handleEditar={handleEditar}
        handleCambiarClave={handleCambiarClave}
      />

      {/* Password Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={handlePasswordClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800, color: colors.primary[600] }}>
          Cambiar contraseña
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              type="password"
              label="Nueva contraseña"
              value={passwordValue}
              onChange={(e) => { setPasswordValue(e.target.value); setPasswordError(''); }}
              size="small"
              inputProps={{ minLength: 6 }}
            />
            <TextField
              fullWidth
              type="password"
              label="Repetir contraseña"
              value={confirmPasswordValue}
              onChange={(e) => { setConfirmPasswordValue(e.target.value); setPasswordError(''); }}
              size="small"
              inputProps={{ minLength: 6 }}
            />
            {passwordTooShort && (
              <Typography variant="caption" sx={{ color: colors.status.observado, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ⚠ Mínimo 6 caracteres
              </Typography>
            )}
            {passwordMismatch && (
              <Typography variant="caption" sx={{ color: colors.semantic.danger, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ✕ Las contraseñas no coinciden
              </Typography>
            )}
            {passwordError && (
              <Typography variant="caption" sx={{ color: colors.semantic.danger, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                ✕ {passwordError}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={handlePasswordClose}
            disabled={passwordLoading}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={!passwordCanSubmit || passwordLoading}
            onClick={handlePasswordSubmit}
            sx={{ borderRadius: 2, backgroundColor: colors.primary[600] }}
          >
            {passwordLoading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Aceptar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar global */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 7 }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%', boxShadow: 4 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </AppLayout>
  );
}
