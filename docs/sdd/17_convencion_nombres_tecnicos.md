# Convencion de nombres tecnicos - ARMORA

## Objetivo

Definir la regla obligatoria de nombres para base de datos, migraciones, funciones, procedimientos, constraints, indices y artefactos tecnicos persistentes del proyecto ARMORA.

## Regla vigente

A partir de esta decision, todo identificador fisico persistente debe estar en espanol y en `snake_case`.

Aplica a:

- Tablas.
- Columnas.
- Tipos `ENUM`.
- Valores de enums cuando representen dominio de negocio.
- Funciones.
- Procedimientos.
- Triggers.
- Indices.
- Constraints.
- Secuencias.
- Vistas.
- Nombres de migraciones cuando describan dominio.
- Campos persistidos en contratos internos cuando representen datos de negocio propios.

## Ejemplos correctos

| Concepto | Nombre fisico correcto |
|---|---|
| Users | `usuarios` |
| User roles | `usuarios_roles` |
| Companies | `empresas` |
| Branches | `sucursales` |
| Access scopes | `alcances_acceso` |
| Audit logs | `registros_auditoria` |
| Updated at | `actualizado_en` |
| Created at | `creado_en` |
| Password hash | `clave_hash` |
| User type | `tipo_usuario` |
| Record status | `estado_registro` |
| Set updated at | `asignar_actualizado_en()` |

## Valores enum

Los valores enum de dominio tambien deben estar en espanol y en mayusculas:

```sql
CREATE TYPE estado_registro AS ENUM ('ACTIVO', 'INACTIVO', 'BLOQUEADO');
CREATE TYPE tipo_usuario AS ENUM ('ADMINISTRADOR', 'OPERADOR', 'CLIENTE', 'PROVEEDOR');
```

## Excepciones permitidas

Se permite mantener nombres en ingles solo cuando sean estandar tecnico externo o palabra reservada de herramienta:

- Tipos nativos: `uuid`, `jsonb`, `inet`, `timestamptz`.
- Keywords SQL: `CREATE`, `TABLE`, `PRIMARY KEY`, `REFERENCES`.
- Formatos tecnicos inevitables: `json`, `jwt`, `api`, `openapi`, `redis`, `docker`.
- Nombres de librerias/frameworks: Quarkus, Flyway, PostgreSQL, Next.js, Flutter.

## Regla para documentos SDD

Los documentos funcionales pueden mencionar equivalentes conceptuales en ingles si vienen del scraping o de una libreria, pero toda propuesta implementable debe incluir el nombre fisico en espanol.

Formato recomendado:

```text
Entidad conceptual: Usuario
Tabla fisica: usuarios
Columnas fisicas: usuario, correo, clave_hash, tipo, estado, creado_en, actualizado_en
```

## Regla para agentes

Todo agente que cree o modifique persistencia debe validar esta convencion antes de entregar handoff.

Si un agente detecta nombres fisicos en ingles en una nueva migracion, debe bloquear la tarea o corregirla antes de marcarla como lista.

## Decision

Esta convencion aplica desde `F1-005` y debe mantenerse para todas las migraciones y documentos tecnicos futuros.