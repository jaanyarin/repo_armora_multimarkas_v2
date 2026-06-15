# Nuevo proyecto ARMORA - Documentacion SDD

Fecha: 2026-06-13  
Base analizada: scraping local de `https://armorasac.com/app/` en `docs/scrapping/`

## Objetivo

Definir la documentacion inicial para construir un nuevo sistema basado en la estructura funcional detectada en ARMORA, pero preparado para un nuevo contexto:

- Admin web: gestion de usuarios, proveedores, clientes, productos, almacenes, ventas y reportes.
- Clientes mobile Flutter: catalogo, perfil, carrito, notas de pedido, pagos y seguimiento desde celular.
- Proveedores mobile Flutter: gestion de stock, productos asignados, movimientos, ventas, pedidos y reportes.

## Documentos

1. `01_diagnostico_stack_actual.md`: stack detectado, modulos observados y limites del scraping.
2. `02_stack_recomendado.md`: stack moderno recomendado y alternativas descartadas.
3. `03_sdd_contexto_glosario.md`: vision, actores, dominios y glosario.
4. `04_sdd_requerimientos.md`: requerimientos funcionales y no funcionales.
5. `05_sdd_arquitectura.md`: arquitectura objetivo, modulos, seguridad e integraciones.
6. `06_sdd_modelo_datos_inicial.md`: modelo de datos inicial por dominios.
7. `07_sdd_api_contratos.md`: propuesta de APIs y eventos.
8. `08_sdd_roadmap_mvp.md`: fases de implementacion y criterios de aceptacion.
9. `09_preguntas_validacion.md`: decisiones pendientes para aprobacion.
10. `10_despliegue_conexion_servidor.md`: como esta conectado hoy y como quedaria en servidor fisico con el stack recomendado.
11. `11_stack_alternativo_backend_quarkus.md`: variante tecnica usando Quarkus como backend.
12. `12_revision_respuestas_validacion.md`: comentarios sobre respuestas de validacion y decisiones recomendadas.
13. `13_cronograma_quarkus_gantt.md`: estimacion de tiempos, tabla por tarea y Gantt tomando Quarkus como backend principal.
15. `15_stack_mobile_flutter_dart.md`: decision mobile final usando Flutter + Dart para las apps cliente y proveedor.


## Decision tecnica vigente

Decision aprobada por validacion del usuario:

- Admin web: Next.js + React + TypeScript.
- Mobile cliente: Flutter + Dart.
- Mobile proveedor: Flutter + Dart.
- Backend API: Quarkus + Java.
- Base de datos: PostgreSQL.
- Cache/colas: Redis.
- Contratos: OpenAPI generado desde Quarkus y consumido por Next.js/Flutter.
- Despliegue objetivo: servidor fisico con Docker, Nginx/Caddy, HTTPS, backups y monitoreo.

## Convenciones SDD

En esta documentacion SDD significa Spec-Driven Development: primero se documentan comportamiento, contratos, datos, reglas y criterios de aceptacion; despues se implementa. Cada funcionalidad deberia avanzar con este flujo:

1. Spec funcional aprobada.
2. Modelo de datos y contratos API revisados.
3. Casos de prueba definidos antes o junto con la implementacion.
4. Implementacion.
5. Validacion contra criterios de aceptacion.
6. Registro de decisiones tecnicas en ADR.

## Fuentes usadas

- `docs/scrapping/00_resumen_general.md`
- `docs/scrapping/01_stack_detectado.json`
- `docs/scrapping/02_mapa_sitio.json`
- `docs/scrapping/03_apis_detectadas.json`
- `docs/scrapping/endpoints/**`
- Documentacion oficial consultada para stack recomendado:
  - Next.js docs: https://nextjs.org/docs
  - Flutter docs: https://docs.flutter.dev/
  - Dart docs: https://dart.dev/guides
  - PostgreSQL docs: https://www.postgresql.org/docs/current/
  - Quarkus docs: https://quarkus.io/guides/
