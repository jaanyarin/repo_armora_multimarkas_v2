import Box from '@mui/material/Box';
import { colors } from '../../tokens/colors';

const semaforoLevels = {
  critico: { color: colors.status.critico, label: 'Crítico', nivel: 0 },
  observado: { color: colors.status.observado, label: 'Observado', nivel: 1 },
  operativo: { color: colors.status.operativo, label: 'Operativo', nivel: 2 },
} as const;

interface StatusSemaforoProps {
  level: keyof typeof semaforoLevels;
}

export default function StatusSemaforo({ level }: StatusSemaforoProps) {
  const s = semaforoLevels[level] ?? semaforoLevels.operativo;
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: s.color, display: 'inline-block' }} />
      <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
    </Box>
  );
}
