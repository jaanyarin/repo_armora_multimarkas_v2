# 05 — Checklist de consistencia UI

Usar esta checklist al implementar o revisar una pantalla.

## Tokens
- [ ] Colores provienen de `VanguardColors` (mobile) o `colors` (web)
- [ ] Tipografía usa Calibri con pesos correctos
- [ ] Espaciado sigue escala `VanguardSpacing` (mobile) o `spacing` (web)
- [ ] Bordes usan radio definido (sm/md/lg/xl/full)

## Componentes
- [ ] Estados de negocio usan `StatusBadge` (no chips ad-hoc)
- [ ] Criticidad usa `StatusSemaforo` (no colores sueltos)
- [ ] Botones siguen variante definida (contained/outlined/text)
- [ ] Inputs usan variante outlined + radio 10px
- [ ] Tarjetas usan radio 16px + borde `#CBD5EC` + sombra sm

## Layout
- [ ] Web admin usa `AppLayout` como wrapper
- [ ] Mobile usa Scaffold + AppBar con tema Vanguard
- [ ] Sidebar (web) usa items con `primary-100` seleccionado
- [ ] Topbar (web) muestra username + avatar + logo

## Accesibilidad
- [ ] Contraste texto/fondo ≥ 4.5:1
- [ ] Estados no dependen solo de color (tienen icono o texto)
- [ ] Touch targets ≥ 44px en mobile

## Equivalencia
- [ ] Misma información se muestra igual en web y mobile
- [ ] Mismo estado de negocio usa mismo color en ambas plataformas
- [ ] Misma jerarquía visual en ambas plataformas
