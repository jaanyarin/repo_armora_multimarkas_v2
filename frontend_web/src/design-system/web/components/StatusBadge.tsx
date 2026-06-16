import Chip from '@mui/material/Chip';
import { colors } from '../../tokens/colors';

const statusMap: Record<string, { color: string; bg: string; label: string }> = {
  operativo: { color: colors.status.operativo, bg: colors.semanticBackground.success, label: 'Operativo' },
  observado: { color: colors.status.observado, bg: colors.semanticBackground.warning, label: 'Observado' },
  critico: { color: colors.status.critico, bg: colors.semanticBackground.danger, label: 'Crítico' },
  proceso: { color: colors.status.proceso, bg: colors.semanticBackground.info, label: 'En Proceso' },
  inactivo: { color: colors.status.inactivo, bg: colors.neutral.surfaceAlt, label: 'Inactivo' },
};

interface StatusBadgeProps {
  status: keyof typeof statusMap;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = statusMap[status] ?? statusMap.inactivo;
  return (
    <Chip
      label={s.label}
      size="small"
      sx={{
        fontWeight: 700,
        fontSize: 12,
        color: s.color,
        backgroundColor: s.bg,
        borderRadius: 999,
        height: 28,
      }}
    />
  );
}
