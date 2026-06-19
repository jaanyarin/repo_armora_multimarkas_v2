-- ARMORA Multimarkas v2 - Agregar estado a personal
-- V6: Agrega la columna estado a la tabla personal usando el enum
--     existente estado_registro, con default ACTIVO y NOT NULL.
-- =============================================================================

-- =============================================================================
-- 1. AGREGAR COLUMNA estado A personal
-- =============================================================================
-- NOTA: estado_registro fue creado en V1 con valores:
--       'ACTIVO', 'INACTIVO', 'BLOQUEADO'
-- Se usa IF NOT EXISTS para asegurar idempotencia parcial.

ALTER TABLE personal
    ADD COLUMN IF NOT EXISTS estado estado_registro NOT NULL DEFAULT 'ACTIVO';

-- =============================================================================
-- 2. ACTUALIZAR VERSION DEL ESQUEMA EN METADATOS
-- =============================================================================

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '6')
ON CONFLICT (clave) DO UPDATE SET
    valor = '6',
    actualizado_en = now();
