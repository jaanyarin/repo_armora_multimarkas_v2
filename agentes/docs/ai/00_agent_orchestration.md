# Orquestacion de agentes - ARMORA

## Objetivo

Definir como trabajan entre si los perfiles de agentes para evitar respuestas aisladas, contradicciones y cambios sin trazabilidad.

## Decision tecnica vigente

- Admin web: Next.js.
- Mobile cliente: Flutter.
- Mobile proveedor: Flutter.
- Backend: Quarkus.
- Base: PostgreSQL.
- Contratos: OpenAPI.
- Infraestructura: servidor fisico con Docker.

## Reglas de coordinacion

1. Toda tarea inicia leyendo `AGENTS.md`.
2. Toda tarea tecnica identifica el dominio SDD.
3. Todo cambio funcional pasa por Product Owner.
4. Todo cambio de contrato API pasa por Backend, Frontend/Mobile y QA.
5. Todo cambio de modelo pasa por Database Architect y Backend.
6. Todo cambio de mobile pasa por UI/UX, Mobile y Security si toca sesion o datos sensibles.
7. Todo cambio de pagos/SUNAT pasa por Integration, Backend, Security y QA.
8. Todo cambio de despliegue pasa por DevOps y Security.
9. Todo cambio de alcance o fecha pasa por Delivery Manager.
10. Todo cambio documental final pasa por SDD Manager.

## Matriz de agente principal por tarea

| Tarea | Agente principal | Agentes de apoyo |
|---|---|---|
| Definir modulo nuevo | Product Owner | Arquitecto, SDD Manager |
| Crear endpoint | Backend Quarkus | QA, Security, Frontend/Mobile |
| Crear tabla/migracion | Database Architect | Backend, QA |
| Crear pantalla admin | Frontend Web | UI/UX, Backend, QA |
| Crear pantalla Flutter cliente | Mobile Specialist | UI/UX, Backend, Security, QA |
| Crear pantalla Flutter proveedor | Mobile Specialist | UI/UX, Backend, Security, QA |
| Cambiar permisos/scopes | Security Engineer | Backend, Product Owner, QA |
| Integrar pagos | Integration Engineer | Backend, Security, QA |
| Integrar SUNAT | Integration Engineer | Backend, Database, QA |
| Desplegar servidor | DevOps | Security, Backend |
| Actualizar SDD | SDD Manager | Agente dueño del cambio |
| Cambiar cronograma | Delivery Manager | Arquitecto, Product Owner |

## Criterio de bloqueo

Bloquear o pedir validacion si:

- Falta decision de negocio.
- Hay contradiccion entre SDD y solicitud.
- Se requiere secreto real.
- Se expone dato sensible.
- Se rompe contrato API.
- Se cambia flujo critico de pago, stock, SUNAT o permisos.
