'use client';

import { useState } from 'react';
import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';

interface CrearPersonalForm {
  nombresCompletos: string;
  usuario: string;
  clave: string;
  tipoDocumento: string;
  numeroDocumento: string;
  sexo: string;
  estadoCivil: string;
  fechaNacimiento: string;
  emailContacto: string;
  telefonoFijo: string;
  telefonoCelular: string;
  direccion: string;
  referencia: string;
  esVendedor: boolean;
  esTransportista: boolean;
}

const INITIAL_FORM: CrearPersonalForm = {
  nombresCompletos: '',
  usuario: '',
  clave: '',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  sexo: '',
  estadoCivil: '',
  fechaNacimiento: '',
  emailContacto: '',
  telefonoFijo: '',
  telefonoCelular: '',
  direccion: '',
  referencia: '',
  esVendedor: false,
  esTransportista: false,
};

const TIPOS_DOCUMENTO = ['DNI', 'CEXT', 'CDIP', 'RUC', 'PASS', 'NN'];
const SEXOS = ['MASCULINO', 'FEMENINO', 'AMBOS', 'INDETERMINADO'];
const ESTADOS_CIVILES = ['SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO'];

export default function CrearPersonalPage() {
  const router = useRouter();
  const [form, setForm] = useState<CrearPersonalForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  function handleChange(field: keyof CrearPersonalForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setExito('');

    if (!form.nombresCompletos.trim()) {
      setError('El nombre completo es obligatorio.');
      return;
    }
    if (!form.usuario.trim()) {
      setError('El usuario es obligatorio.');
      return;
    }
    if (!form.clave.trim()) {
      setError('La clave es obligatoria.');
      return;
    }
    if (!form.numeroDocumento.trim()) {
      setError('El numero de documento es obligatorio.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/personal', {
        nombresCompletos: form.nombresCompletos.trim(),
        usuario: form.usuario.trim(),
        clave: form.clave,
        tipoDocumento: form.tipoDocumento,
        numeroDocumento: form.numeroDocumento.trim(),
        sexo: form.sexo || null,
        estadoCivil: form.estadoCivil || null,
        fechaNacimiento: form.fechaNacimiento || null,
        emailContacto: form.emailContacto.trim() || null,
        telefonoFijo: form.telefonoFijo.trim() || null,
        telefonoCelular: form.telefonoCelular.trim() || null,
        direccion: form.direccion.trim() || null,
        referencia: form.referencia.trim() || null,
        esVendedor: form.esVendedor,
        esTransportista: form.esTransportista,
      });
      setExito('Personal creado exitosamente.');
      setTimeout(() => router.push('/personal'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear personal');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout activePath="/personal/crear" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/personal')}>
            Volver
          </Button>
          <Typography variant="h5" fontWeight={700} color={colors.primary[800]}>
            Crear Personal
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {exito && <Alert severity="success" sx={{ mb: 2 }}>{exito}</Alert>}

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Datos de acceso
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Usuario"
                  value={form.usuario}
                  onChange={(e) => handleChange('usuario', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  required
                  label="Clave"
                  type="password"
                  value={form.clave}
                  onChange={(e) => handleChange('clave', e.target.value)}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
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
                <FormControl fullWidth>
                  <InputLabel>Tipo documento</InputLabel>
                  <Select
                    value={form.tipoDocumento}
                    label="Tipo documento"
                    onChange={(e) => handleChange('tipoDocumento', e.target.value)}
                  >
                    {TIPOS_DOCUMENTO.map((t) => (
                      <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Sexo</InputLabel>
                  <Select
                    value={form.sexo}
                    label="Sexo"
                    onChange={(e) => handleChange('sexo', e.target.value)}
                  >
                    <MenuItem value="">-- Sin especificar --</MenuItem>
                    {SEXOS.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Estado civil</InputLabel>
                  <Select
                    value={form.estadoCivil}
                    label="Estado civil"
                    onChange={(e) => handleChange('estadoCivil', e.target.value)}
                  >
                    <MenuItem value="">-- Sin especificar --</MenuItem>
                    {ESTADOS_CIVILES.map((ec) => (
                      <MenuItem key={ec} value={ec}>{ec}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Fecha nacimiento"
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Contacto y direccion
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
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button variant="outlined" onClick={() => router.push('/personal')} disabled={loading}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </AppLayout>
  );
}
