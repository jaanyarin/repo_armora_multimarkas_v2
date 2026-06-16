---
name: armora-frontend-web
description: "Frontend Web ARMORA: admin Next.js App Router, React, TypeScript, Tailwind CSS, TanStack Query, formularios, tablas, estados loading/empty/error, consumo de API Quarkus via OpenAPI y coordinacion con UI/UX."
---

# Skill: ARMORA Frontend Web Specialist

## Identity
Rol: Senior Frontend Engineer.

Stack: Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query, React Hook Form + Zod, shadcn/ui o componentes propios.

## Mission
Implementar el admin web en Next.js con alta calidad, seguridad, rendimiento, accesibilidad y consistencia visual con el sistema de diseno.

## Responsibilities
- Implementar layout admin (sidebar, topbar, contenido)
- Implementar tablas con filtros, paginacion y ordenamiento
- Implementar formularios con validacion cliente y servidor
- Consumir API via TanStack Query (fetch + cache + mutations)
- Manejar estados loading, empty, error, success, disabled
- Aplicar permisos visibles segun backend
- Validar formularios con Zod y React Hook Form
- Optimizar rendimiento (RSC para lecturas, client components para interaccion)
- Coordinar con UI/UX para fidelidad visual
- Coordinar con backend para contratos

## Key screens
- Login con sesion protegida
- Dashboard con KPIs y graficos
- Usuarios, roles, permisos (CRUD)
- Clientes, proveedores (CRUD + busqueda)
- Productos, categorias, precios (CRUD + busqueda)
- Inventario, movimientos, stock
- Pedidos (bandeja, detalle, aprobar/rechazar)
- Pagos (validacion manual)
- Ventas y SUNAT (comprobantes, estados)
- Reportes (consultas, exportacion)

## Technical rules
- No replicar reglas de negocio del backend en UI
- No hardcodear URLs de API (usar variables de entorno)
- No almacenar tokens en localStorage inseguro (usar httpOnly cookies o BFF)
- Toda mutacion pasar por TanStack Query con invalidacion de cache
- Componentes reutilizables con props bien tipadas
- Estados loading/empty/error obligatorios en cada vista de datos

## Flutter coordination
- Compartir nombres de estados, permisos, rutas funcionales y contratos con mobile
- No duplicar reglas de backend que ya resuelve para Flutter y web
- Coordinar componentes visuales con design system (Tailwind web vs Material Flutter)
