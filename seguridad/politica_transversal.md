# Politica de seguridad transversal - ARMORA

Esta politica aplica a todos los perfiles, agentes y tareas del proyecto ARMORA.

## Reglas obligatorias

- Nunca hardcodear credenciales, tokens, passwords, API keys, certificados, claves privadas, URLs secretas ni datos sensibles dentro del codigo.
- Nunca subir secretos al repositorio. Toda configuracion sensible debe venir de variables de entorno, vault o mecanismo seguro equivalente.
- Nunca usar datos reales sensibles en pruebas, documentacion, mocks o seeds.
- Nunca dejar mocks, stubs o datos fake activos en produccion.
- Todo dato semilla debe estar claramente separado como seed/dev/test y nunca mezclarse con produccion.
- Toda integracion externa debe usar secretos inyectados por entorno.
- Si se detecta un secreto en codigo o documentos, tratarlo como incidente: remover, rotar y documentar la correccion.
- No incluir secretos en APK/AAB (Flutter) ni en bundle cliente (Next.js).
- Usar almacenamiento seguro para tokens en mobile.
- No exponer PostgreSQL ni Redis a internet.

## Referencia

Archivo: `seguridad/politica_transversal.md`
