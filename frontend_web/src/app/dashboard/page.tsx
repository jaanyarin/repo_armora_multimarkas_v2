'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

export default function DashboardPage() {
  const [health, setHealth] = useState<string>('...');

  useEffect(() => {
    api
      .health()
      .then((res) => setHealth(res.status))
      .catch(() => setHealth('error'));
  }, []);

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Panel principal</h1>
      <p>API health: {health}</p>
    </main>
  );
}
