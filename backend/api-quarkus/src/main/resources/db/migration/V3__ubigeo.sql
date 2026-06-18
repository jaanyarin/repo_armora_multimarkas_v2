-- =============================================================================
-- ARMORA Multimarkas v2 - V3: UBIGEO Peru
-- Tablas de departamentos, provincias y distritos segun codigos INEI/SUNAT.
-- Convencion: nombres en espanol snake_case.
-- =============================================================================

-- =============================================================================
-- DEPARTAMENTOS
-- =============================================================================
CREATE TABLE departamentos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(2) NOT NULL,
    nombre varchar(100) NOT NULL,
    CONSTRAINT uq_departamentos_codigo UNIQUE (codigo),
    CONSTRAINT uq_departamentos_nombre UNIQUE (nombre)
);

-- =============================================================================
-- PROVINCIAS
-- =============================================================================
CREATE TABLE provincias (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    departamento_id uuid NOT NULL REFERENCES departamentos(id) ON DELETE CASCADE,
    codigo varchar(4) NOT NULL,
    nombre varchar(100) NOT NULL,
    CONSTRAINT uq_provincias_codigo UNIQUE (codigo),
    CONSTRAINT uq_provincias_departamento_nombre UNIQUE (departamento_id, nombre)
);

CREATE INDEX idx_provincias_departamento_id ON provincias(departamento_id);

-- =============================================================================
-- DISTRITOS
-- =============================================================================
CREATE TABLE distritos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provincia_id uuid NOT NULL REFERENCES provincias(id) ON DELETE CASCADE,
    codigo varchar(6) NOT NULL,
    nombre varchar(100) NOT NULL,
    CONSTRAINT uq_distritos_codigo UNIQUE (codigo),
    CONSTRAINT uq_distritos_provincia_nombre UNIQUE (provincia_id, nombre)
);

CREATE INDEX idx_distritos_provincia_id ON distritos(provincia_id);

-- =============================================================================
-- ACTUALIZAR VERSION DEL ESQUEMA
-- =============================================================================
INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '3')
ON CONFLICT (clave) DO UPDATE SET
    valor = '3',
    actualizado_en = now();
