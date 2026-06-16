'use client';

import { useEffect, useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';

interface PersonalItem {
  id: string;
  nombresCompletos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  telefonoCelular: string | null;
  esVendedor: boolean;
  esTransportista: boolean;
  usuario: string;
  estado: string;
}

export default function GestionPersonalPage() {
  const router = useRouter();
  const [personal, setPersonal] = useState<PersonalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarPersonal();
  }, []);

  async function cargarPersonal() {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<PersonalItem[]>('/personal');
      setPersonal(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar personal');
    } finally {
      setLoading(false);
    }
  }

  const personalFiltrado = personal.filter((p) => {
    if (!busqueda.trim()) return true;
    const termino = busqueda.toLowerCase();
    return (
      p.nombresCompletos.toLowerCase().includes(termino) ||
      p.numeroDocumento.toLowerCase().includes(termino) ||
      p.usuario.toLowerCase().includes(termino)
    );
  });

  return (
    <AppLayout activePath="/personal" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={700} color={colors.primary[800]}>
            Gestion de Personal
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/personal/crear')}
          >
            Crear Personal
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nombre, documento o usuario..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: colors.primary[50] }}>
                  <TableCell sx={{ fontWeight: 700 }}>Nombres</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Documento</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Celular</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Usuario</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Roles</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Estado</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personalFiltrado.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        {busqueda ? 'No se encontraron resultados' : 'No hay personal registrado'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  personalFiltrado.map((p) => (
                    <TableRow key={p.id} hover sx={{ cursor: 'pointer' }} onClick={() => router.push(`/personal/${p.id}`)}>
                      <TableCell>{p.nombresCompletos}</TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {p.tipoDocumento}
                        </Typography>{' '}
                        {p.numeroDocumento}
                      </TableCell>
                      <TableCell>{p.telefonoCelular || '-'}</TableCell>
                      <TableCell>{p.usuario}</TableCell>
                      <TableCell>
                        {p.esVendedor && (
                          <Chip label="Vendedor" size="small" color="primary" sx={{ mr: 0.5 }} />
                        )}
                        {p.esTransportista && (
                          <Chip label="Transportista" size="small" color="secondary" />
                        )}
                        {!p.esVendedor && !p.esTransportista && (
                          <Typography variant="caption" color="text.secondary">-</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={p.estado}
                          size="small"
                          color={p.estado === 'ACTIVO' ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/personal/${p.id}`);
                          }}
                        >
                          Ver
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
