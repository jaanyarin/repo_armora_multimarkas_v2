'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControlLabel,
  Checkbox,
  Divider,
  Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';

interface PersonalDetalle {
  id: string;
  usuarioId: string;
  nombresCompletos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  sexo: string | null;
  estadoCivil: string | null;
  fechaNacimiento: string | null;
  emailContacto: string | null;
  telefonoFijo: string | null;
  telefonoCelular: string | null;
  direccion: string | null;
  referencia: string | null;
  usuario: string;
  estado: string;
  esVendedor: boolean;
  esTransportista: boolean;
}

interface EditForm {
  nombresCompletos: string;
  numeroDocumento: string;
  emailContacto: string;
  telefonoFijo: string;
  telefonoCelular: string;
  direccion: string;
  referencia: string;
  esVendedor: boolean;
  esTransportista: boolean;
}

export default function DetallePersonalPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [detalle, setDetalle] = useState<PersonalDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [saving, setSaving] = useState(false);
  const [exito, setExito] = useState('');
  const [form, setForm] = useState<EditForm>({
    nombresCompletos: '',
    numeroDocumento: '',
    emailContacto: '',
    telefonoFijo: '',
    telefonoCelular: '',
    direccion: '',
    referencia: '',
    esVendedor: false,
    esTransportista: false,
  });

  useEffect(() => {
    cargarDetalle();
  }, [id]);

  async function cargarDetalle() {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<PersonalDetalle>(`/personal/${id}`);
      setDetalle(data);
      setForm({
        nombresCompletos: data.nombresCompletos,
        numeroDocumento: data.numeroDocumento,
        emailContacto: data.emailContacto || '',
        telefonoFijo: data.telefonoFijo || '',
        telefonoCelular: data.telefonoCelular || '',
        direccion: data.direccion || '',
        referencia: data.referencia || '',
        esVendedor: data.esVendedor,
        esTransportista: data.esTransportista,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar detalle');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof EditForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleGuardar() {
    setError('');
    setExito('');

    if (!form.nombresCompletos.trim()) {
      setError('El nombre completo es obligatorio.');
      return;
    }
    if (!form.numeroDocumento.trim()) {
      setError('El numero de documento es obligatorio.');
      return;
    }

    setSaving(true);
    try {
      await api.put(`/personal/${id}`, {
        nombresCompletos: form.nombresCompletos.trim(),
        numeroDocumento: form.numeroDocumento.trim(),
        emailContacto: form.emailContacto.trim() || null,
        telefonoFijo: form.telefonoFijo.trim() || null,
        telefonoCelular: form.telefonoCelular.trim() || null,
        direccion: form.direccion.trim() || null,
        referencia: form.referencia.trim() || null,
        esVendedor: form.esVendedor,
        esTransportista: form.esTransportista,
      });
      setExito('Personal actualizado exitosamente.');
      setEditando(false);
      await cargarDetalle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar personal');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <AppLayout activePath="/personal/gestion-personal" username="ALEJANDRO ANYARIN" role="admin">
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </AppLayout>
    );
  }

  if (!detalle) {
    return (
      <AppLayout activePath="/personal/gestion-personal" username="ALEJANDRO ANYARIN" role="admin">
        <Box sx={{ p: 3 }}>
          <Alert severity="error">{error || 'Personal no encontrado'}</Alert>
          <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => router.push('/personal/gestion-personal')}>
            Volver a listado
          </Button>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout activePath="/personal/gestion-personal" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/personal/gestion-personal')}>
            Volver
          </Button>
          <Typography variant="h5" fontWeight={700} color={colors.primary[800]}>
            {editando ? 'Editar Personal' : 'Detalle de Personal'}
          </Typography>
          <Chip label={detalle.estado} size="small" color={detalle.estado === 'ACTIVO' ? 'success' : 'default'} />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {exito && <Alert severity="success" sx={{ mb: 2 }}>{exito}</Alert>}

        <Paper sx={{ p: 3 }}>
          {!editando ? (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" startIcon={<EditIcon />} onClick={() => setEditando(true)}>
                  Editar
                </Button>
              </Box>

              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Informacion general
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Nombres completos</Typography>
                  <Typography>{detalle.nombresCompletos}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">Usuario</Typography>
                  <Typography>{detalle.usuario}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">Documento</Typography>
                  <Typography>{detalle.tipoDocumento} {detalle.numeroDocumento}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">Sexo</Typography>
                  <Typography>{detalle.sexo || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">Estado civil</Typography>
                  <Typography>{detalle.estadoCivil || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="caption" color="text.secondary">Fecha nacimiento</Typography>
                  <Typography>{detalle.fechaNacimiento || '-'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Contacto
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Email</Typography>
                  <Typography>{detalle.emailContacto || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Telefono fijo</Typography>
                  <Typography>{detalle.telefonoFijo || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="caption" color="text.secondary">Celular</Typography>
                  <Typography>{detalle.telefonoCelular || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Direccion</Typography>
                  <Typography>{detalle.direccion || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Referencia</Typography>
                  <Typography>{detalle.referencia || '-'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Roles operativos
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {detalle.esVendedor && <Chip label="Vendedor" color="primary" />}
                {detalle.esTransportista && <Chip label="Transportista" color="secondary" />}
                {!detalle.esVendedor && !detalle.esTransportista && (
                  <Typography color="text.secondary">Sin roles asignados</Typography>
                )}
              </Box>
            </>
          ) : (
            <>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Datos personales
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Nombres completos"
                    value={form.nombresCompletos}
                    onChange={(e) => handleChange('nombresCompletos', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    required
                    label="Numero documento"
                    value={form.numeroDocumento}
                    onChange={(e) => handleChange('numeroDocumento', e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Contacto
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Email de contacto"
                    type="email"
                    value={form.emailContacto}
                    onChange={(e) => handleChange('emailContacto', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Telefono fijo"
                    value={form.telefonoFijo}
                    onChange={(e) => handleChange('telefonoFijo', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Telefono celular"
                    value={form.telefonoCelular}
                    onChange={(e) => handleChange('telefonoCelular', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Direccion"
                    value={form.direccion}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Referencia"
                    value={form.referencia}
                    onChange={(e) => handleChange('referencia', e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Roles operativos
              </Typography>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.esVendedor}
                      onChange={(e) => handleChange('esVendedor', e.target.checked)}
                    />
                  }
                  label="Es vendedor"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.esTransportista}
                      onChange={(e) => handleChange('esTransportista', e.target.checked)}
                    />
                  }
                  label="Es transportista"
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                  onClick={handleGuardar}
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setEditando(false);
                    setError('');
                    if (detalle) {
                      setForm({
                        nombresCompletos: detalle.nombresCompletos,
                        numeroDocumento: detalle.numeroDocumento,
                        emailContacto: detalle.emailContacto || '',
                        telefonoFijo: detalle.telefonoFijo || '',
                        telefonoCelular: detalle.telefonoCelular || '',
                        direccion: detalle.direccion || '',
                        referencia: detalle.referencia || '',
                        esVendedor: detalle.esVendedor,
                        esTransportista: detalle.esTransportista,
                      });
                    }
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </AppLayout>
  );
}
