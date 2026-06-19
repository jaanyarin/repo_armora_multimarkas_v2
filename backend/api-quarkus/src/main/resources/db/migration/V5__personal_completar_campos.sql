-- ARMORA Multimarkas v2 - Completar campos faltantes de personal
-- V5: Agrega columnas faltantes, tabla de permisos por personal,
--     y campos de ubicacion como texto legible.
-- =============================================================================

-- =============================================================================
-- 1. AGREGAR COLUMNAS FALTANTES A personal
-- =============================================================================

ALTER TABLE personal
    ADD COLUMN IF NOT EXISTS cargo varchar(180),
    ADD COLUMN IF NOT EXISTS area varchar(180),
    ADD COLUMN IF NOT EXISTS sede varchar(180),
    ADD COLUMN IF NOT EXISTS email_personal varchar(180),
    ADD COLUMN IF NOT EXISTS contacto_emergencia text,
    ADD COLUMN IF NOT EXISTS departamento_nombre varchar(100),
    ADD COLUMN IF NOT EXISTS provincia_nombre varchar(100),
    ADD COLUMN IF NOT EXISTS distrito_nombre varchar(100);

-- =============================================================================
-- 2. TABLA DE PERMISOS POR PERSONAL (modulos del sistema)
-- =============================================================================
-- Almacena los permisos de modulo asignados a cada personal.
-- codigo_permiso = "GRUPO > Nombre Permiso" ej. "Almacenes > Crear Inventario de Stocks"

CREATE TABLE IF NOT EXISTS personal_permisos (
    personal_id uuid NOT NULL REFERENCES personal(id) ON DELETE CASCADE,
    codigo_permiso varchar(255) NOT NULL,
    grupo varchar(100) NOT NULL,
    creado_en timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (personal_id, codigo_permiso)
);

CREATE INDEX IF NOT EXISTS idx_personal_permisos_grupo ON personal_permisos(grupo);

-- =============================================================================
-- 3. ACTUALIZAR VERSION DEL ESQUEMA
-- =============================================================================

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '5')
ON CONFLICT (clave) DO UPDATE SET
    valor = '5',
    actualizado_en = now();
