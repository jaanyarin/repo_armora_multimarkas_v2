'use client';

import { useState } from 'react';
import { Box, Card, CardContent, TextField, Typography, Button, Alert, CircularProgress } from '@mui/material';
import { api } from '@/lib/api-client';
import { colors } from '@/design-system/tokens/colors';

interface LoginResponse {
  token: string;
  refreshToken?: string;
  tipo?: string;
  correo?: string;
}

function getErrorMessage(err: unknown) {
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return 'Error al iniciar sesion. Verifica tus credenciales.';
}

export default function LoginPage() {
  const [identificador, setIdentificador] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!identificador.trim()) {
      setError('Ingresa tu usuario, correo, DNI o RUC.');
      return;
    }

    if (!clave.trim()) {
      setError('Ingresa tu contrasena.');
      return;
    }

    setLoading(true);
    try {
      const data = await api.post<LoginResponse>('/auth/login', {
        identificador: identificador.trim(),
        clave,
      });

      if (!data.token) {
        throw new Error('La API no devolvio token de sesion.');
      }

      localStorage.setItem('armora_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('armora_refresh', data.refreshToken);
      }
      if (data.tipo) {
        localStorage.setItem('armora_tipo_usuario', data.tipo);
      }
      if (data.correo) {
        localStorage.setItem('armora_correo', data.correo);
      }

      window.location.href = '/dashboard';
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: colors.neutral.background,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} textAlign="center" gutterBottom color={colors.primary[800]}>
            ARMORA ERP
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Iniciar sesion
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Usuario, Correo, DNI o RUC"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              margin="normal"
              required
              autoFocus
              helperText="Ingresa tu usuario o correo registrado."
            />
            <TextField
              fullWidth
              label="Contrasena"
              type="password"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              margin="normal"
              required
              autoComplete="current-password"
            />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 2 }}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
