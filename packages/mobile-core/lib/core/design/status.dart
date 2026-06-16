import 'package:flutter/material.dart';
import 'tokens.dart';

enum StatusType { operativo, observado, critico, proceso, inactivo }

extension StatusTypeX on StatusType {
  Color get color {
    switch (this) {
      case StatusType.operativo:
        return VanguardColors.statusOperativo;
      case StatusType.observado:
        return VanguardColors.statusObservado;
      case StatusType.critico:
        return VanguardColors.statusCritico;
      case StatusType.proceso:
        return VanguardColors.statusProceso;
      case StatusType.inactivo:
        return VanguardColors.statusInactivo;
    }
  }

  Color get backgroundColor {
    switch (this) {
      case StatusType.operativo:
        return VanguardColors.bgSuccess;
      case StatusType.observado:
        return VanguardColors.bgWarning;
      case StatusType.critico:
        return VanguardColors.bgDanger;
      case StatusType.proceso:
        return VanguardColors.bgInfo;
      case StatusType.inactivo:
        return VanguardColors.surfaceAlt;
    }
  }

  String get label {
    switch (this) {
      case StatusType.operativo:
        return 'Operativo';
      case StatusType.observado:
        return 'Observado';
      case StatusType.critico:
        return 'Crítico';
      case StatusType.proceso:
        return 'En Proceso';
      case StatusType.inactivo:
        return 'Inactivo';
    }
  }
}

class StatusBadge extends StatelessWidget {
  const StatusBadge({super.key, required this.status});

  final StatusType status;

  @override
  Widget build(BuildContext context) {
    return Chip(
      label: Text(
        status.label,
        style: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: status.color,
        ),
      ),
      backgroundColor: status.backgroundColor,
      side: BorderSide.none,
      materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
      visualDensity: VisualDensity.compact,
    );
  }
}

class StatusSemaforo extends StatelessWidget {
  const StatusSemaforo({
    super.key,
    required this.level,
  });

  final StatusType level;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            color: level.color,
            shape: BoxShape.circle,
          ),
        ),
        const SizedBox(width: 6),
        Text(
          level.label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w600,
            color: level.color,
          ),
        ),
      ],
    );
  }
}
