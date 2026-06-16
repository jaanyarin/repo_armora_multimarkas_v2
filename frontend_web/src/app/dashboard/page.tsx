'use client';

import { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import { api } from '@/lib/api-client';
import { AppLayout } from '@/design-system/web/layout';
import { StatusBadge } from '@/design-system/web/components';

export default function DashboardPage() {
  const [health, setHealth] = useState<string>('...');

  useEffect(() => {
    api
      .health()
      .then((res) => setHealth(res.status))
      .catch(() => setHealth('error'));
  }, []);

  return (
    <AppLayout activePath="/dashboard">
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>
        Panel principal
      </Typography>

      <Paper sx={{ p: 3, maxWidth: 400 }}>
        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
          Estado de la API
        </Typography>
        <StatusBadge status={health === 'UP' ? 'operativo' : 'critico'} />
      </Paper>
    </AppLayout>
  );
}
