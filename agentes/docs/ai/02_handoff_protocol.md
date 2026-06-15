# Protocolo de handoff entre agentes - ARMORA

## Objetivo

Evitar que un agente entregue trabajo incompleto o desconectado del resto del proyecto.

## Handoff obligatorio

Al finalizar una tarea, reportar:

```text
Cambio realizado:
Documentos consultados:
Archivos modificados:
Contratos API afectados:
Modelo de datos afectado:
Permisos/scopes afectados:
Pruebas necesarias:
Riesgos abiertos:
Validaciones pendientes:
```

## Handoff por tipo de cambio

### Cambio funcional

Product Owner debe entregar:

- Historia o regla actualizada.
- Criterios de aceptacion.
- Casos borde.
- Dependencias.

### Cambio API

Backend debe entregar:

- Endpoint.
- Request/response.
- Errores.
- Permisos/scopes.
- Idempotencia si aplica.
- Pruebas de contrato.

### Cambio de datos

Database debe entregar:

- Tablas afectadas.
- Migracion.
- Constraints.
- Indices.
- Rollback.
- Impacto en reportes o API.

### Cambio mobile Flutter

Mobile debe entregar:

- Pantallas afectadas.
- Cliente API usado.
- Estados UI.
- Manejo de errores.
- Configuracion por ambiente.
- Pruebas de build/analyze/test.

### Cambio infraestructura

DevOps debe entregar:

- Servicio afectado.
- Variables requeridas.
- Puertos.
- Red.
- Backups.
- Rollback.
- Riesgos de seguridad.

## Regla final

Si el cambio toca stock, pagos, SUNAT, permisos, seguridad o datos financieros, siempre incluir QA y Security en el handoff.
