# F2-018 - Integracion Headroom para Codex y OpenCode

Cambio realizado:
Se agrego configuracion de Headroom como servidor MCP local para OpenCode y una plantilla equivalente para Codex.

Documentos consultados:
- `AGENTS.md`
- `opencode.json`
- `agentes/docs/ai/02_handoff_protocol.md`
- Documentacion publica de Headroom: instalacion y MCP.

Archivos modificados:
- `opencode.json`
- `.codex/config.headroom.example.toml`
- `docs/dev/headroom_codex_opencode.md`
- `docs/ai_workflow/00_tablero_agentes.md`
- `docs/ai_workflow/F2-018_headroom_codex_opencode.md`

Contratos API afectados:
Ninguno.

Modelo de datos afectado:
Ninguno.

Permisos/scopes afectados:
Ninguno.

Pruebas ejecutadas:
- Validacion JSON de `opencode.json` con `ConvertFrom-Json`.
- Instalacion local de `headroom-ai[mcp,proxy]` desde PyPI.
- Verificacion de CLI con `python -m headroom.cli --version`.
- Verificacion de ayuda MCP con `python -m headroom.cli mcp --help`.

Pruebas pendientes:
- Reiniciar OpenCode/Codex y verificar que listen el MCP `headroom`.

Riesgos abiertos:
- El entorno local tiene `headroom.exe` fuera del `PATH`; la configuracion usa `python -m headroom.cli` para evitar esa dependencia.
- La configuracion activa de Codex depende del archivo global/local que use la instalacion del usuario.

Validaciones pendientes:
- Ejecutar `headroom mcp status` tras instalar el paquete.
- Reiniciar OpenCode y Codex para comprobar herramientas disponibles.

Siguiente agente recomendado:
`armora-qa` para smoke test manual de MCP despues de instalar dependencias locales.
