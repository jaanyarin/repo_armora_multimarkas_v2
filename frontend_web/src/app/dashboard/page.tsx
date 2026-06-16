'use client';

import { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';

const chartData = [
  { name: 'Ene', ventas: 4000, devoluciones: 240 },
  { name: 'Feb', ventas: 3000, devoluciones: 1398 },
  { name: 'Mar', ventas: 2000, devoluciones: 980 },
  { name: 'Abr', ventas: 2780, devoluciones: 390 },
  { name: 'May', ventas: 1890, devoluciones: 480 },
  { name: 'Jun', ventas: 2390, devoluciones: 380 },
];

export default function DashboardPage() {
  const [health, setHealth] = useState<string>('...');
  const [listaPrecios, setListaPrecios] = useState('Todas');
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    setChartReady(true);
  }, []);

  useEffect(() => {
    api
      .health()
      .then((res: any) => setHealth(res.status))
      .catch(() => setHealth('error'));
  }, []);

  return (
    <AppLayout activePath="/dashboard" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ maxWidth: 1200 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 800 }}>
          Grafico de Ventas
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <FormControl size="small" fullWidth>
                <InputLabel>Lista de Precios</InputLabel>
                <Select
                  value={listaPrecios}
                  label="Lista de Precios"
                  onChange={(e) => setListaPrecios(e.target.value)}
                >
                  <MenuItem value="Todas">Todas las listas de precios</MenuItem>
                  <MenuItem value="M1P">LISTA DE PRECIO M1P</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" color="primary" fullWidth>
                Actualizar
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 600, color: colors.neutral.textMuted }}>
              {listaPrecios === 'Todas' ? 'Todas las listas de precios' : listaPrecios}
            </Typography>
            <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>
              Lista Precios
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[
              { label: 'Total Ventas', value: 'S/ 12,580.00', color: '#2e7d32' },
              { label: 'Total Devoluciones', value: 'S/ 1,868.00', color: '#d32f2f' },
              { label: 'Total', value: 'S/ 10,712.00', color: colors.neutral.text },
            ].map((stat) => (
              <Grid key={stat.label} item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.neutral.textMuted }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ height: 300, minWidth: 0 }}>
            {chartReady ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="ventas" fill={colors.primary[500]} name="Ventas" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="devoluciones" fill="#d32f2f" name="Devoluciones" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : null}
          </Box>
        </Paper>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Gestion Transportista
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>2026-06-15</Typography>
                <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>Fecha</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>3</Typography>
                <Typography variant="caption" sx={{ color: colors.neutral.textMuted }}>Requerimientos</Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2e7d32', textAlign: 'center' }}>
                S/ 8,450.00
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: colors.neutral.textMuted }}>
                Total Requerimientos
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#d32f2f', textAlign: 'center' }}>
                S/ 320.00
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: colors.neutral.textMuted }}>
                Total Devoluciones Aprox
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, textAlign: 'center' }}>
                S/ 8,130.00
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: colors.neutral.textMuted }}>
                Total Aprox
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Button variant="outlined" fullWidth sx={{ textTransform: 'none' }}>
                B001
              </Button>
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: colors.neutral.textMuted }}>
                Serie
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <input
                type="number"
                placeholder="Numero"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: `1px solid ${colors.neutral.border}`,
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" color="primary" fullWidth>
                Buscar
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Estado de la API</Typography>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: health === 'UP' ? '#e8f5e9' : '#ffebee',
              color: health === 'UP' ? '#2e7d32' : '#d32f2f',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: health === 'UP' ? '#2e7d32' : '#d32f2f',
              }}
            />
            {health === 'UP' ? 'Operativo' : health === 'error' ? 'Error' : health}
          </Box>
        </Paper>
      </Box>
    </AppLayout>
  );
}

