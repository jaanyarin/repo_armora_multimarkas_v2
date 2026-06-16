# DEPRECATED — Perfiles de agente

Esta carpeta ha sido reemplazada por skills en `.opencode/skills/armora-*/SKILL.md`.

**Motivo**: Los perfiles como documentos markdown requerian lectura manual. Los skills se cargan automaticamente cuando la tarea coincide con su descripcion, eliminando la necesidad de invocarlos manualmente.

**Migracion**: Cada `agentes/perfiles/XX_*.md` fue transformado a `.opencode/skills/armora-*/SKILL.md` manteniendo el mismo contenido adaptado al formato skill (YAML frontmatter + contenido).

**Referencias en `opencode.json`**: Los agentes en `opencode.json` ahora apuntan a `{file:.opencode/skills/armora-*/SKILL.md}` en lugar de `{file:./agentes/perfiles/XX_*.md}`.

Los archivos se conservan como referencia historica pero no deben editarse. Usar los skills correspondientes.
