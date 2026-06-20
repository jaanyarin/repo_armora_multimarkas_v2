# Headroom para Codex y OpenCode

Headroom es una capa local de compresion de contexto para agentes de IA. En este repo se integra como servidor MCP para que Codex y OpenCode puedan usar las herramientas `headroom_compress`, `headroom_retrieve` y `headroom_stats`.

## Instalacion local

Requisito: Python 3.10 o superior.

```powershell
pip install "headroom-ai[mcp,proxy]"
python -m headroom.cli --version
python -m headroom.cli mcp status
```

Para usar tambien el proxy HTTP:

```powershell
python -m headroom.cli proxy --port 8787
```

## OpenCode

OpenCode ya queda configurado en `opencode.json` con el servidor MCP local:

```json
"mcp": {
  "headroom": {
    "type": "local",
    "command": ["python", "-m", "headroom.cli", "mcp", "serve"],
    "enabled": true,
    "timeout": 30000
  }
}
```

Despues de instalar el paquete, reiniciar OpenCode desde la raiz del repo. Se usa `python -m headroom.cli` para no depender de que `headroom.exe` este en el `PATH`.

## Codex

Codex suele leer sus servidores MCP desde la configuracion TOML del usuario, no desde `opencode.json`. Por eso el repo incluye la plantilla `.codex/config.headroom.example.toml`.

Bloque a agregar en la configuracion activa de Codex:

```toml
[mcp_servers.headroom]
command = "python"
args = ["-m", "headroom.cli", "mcp", "serve"]
timeout_ms = 30000
```

## Uso recomendado

- Usar `headroom_compress` para salidas grandes de `rg`, logs, trazas Maven/NPM o JSON voluminoso.
- Usar `headroom_retrieve` solo cuando haga falta recuperar el original por hash.
- Usar `headroom_stats` para medir ahorro de tokens durante sesiones largas.

No se guardan claves en el repo. Si se usa el proxy con proveedores LLM, configurar `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` u otras variables solo en el entorno local del usuario.
