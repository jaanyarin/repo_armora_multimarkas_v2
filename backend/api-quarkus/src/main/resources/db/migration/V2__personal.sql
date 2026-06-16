-- ARMORA Multimarkas v2 - Tabla personal (staff/employees)
-- Extiende usuarios con datos administrativos, contacto y recursos asociados.
-- V2: personal, mapas_rutas, y tablas de recursos (almacenes, listas_precios).

-- =============================================================================
-- TIPOS ENUM
-- =============================================================================

CREATE TYPE tipo_documento_personal AS ENUM (
    'DNI', 'CEXT', 'CDIP', 'RUC', 'PASS', 'NN',
    'IRES', 'TXTRIB', 'TAM', 'TXDOC'
);

CREATE TYPE sexo_personal AS ENUM (
    'MASCULINO', 'FEMENINO', 'AMBOS', 'INDETERMINADO'
);

CREATE TYPE estado_civil_personal AS ENUM (
    'SOLTERO', 'CASADO', 'DIVORCIADO', 'VIUDO'
);

-- =============================================================================
-- TABLA PERSONAL (staff / employees)
-- =============================================================================

CREATE TABLE personal (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id uuid NOT NULL,
    nombres_completos varchar(255) NOT NULL,
    tipo_documento tipo_documento_personal NOT NULL DEFAULT 'DNI',
    numero_documento varchar(20) NOT NULL,
    sexo sexo_personal,
    estado_civil estado_civil_personal,
    fecha_nacimiento date,
    email_contacto varchar(180),
    pais_id integer,
    telefono_fijo varchar(20),
    telefono_celular varchar(20),
    direccion text,
    referencia text,
    ubigeo_codigo varchar(10),
    foto_url text,
    es_vendedor boolean NOT NULL DEFAULT false,
    es_transportista boolean NOT NULL DEFAULT false,
    observaciones text,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_personal_usuario UNIQUE (usuario_id),
    CONSTRAINT uq_personal_documento UNIQUE (tipo_documento, numero_documento),
    CONSTRAINT fk_personal_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX idx_personal_tipo_documento ON personal(tipo_documento);
CREATE INDEX idx_personal_es_vendedor ON personal(es_vendedor)
    WHERE es_vendedor = true;
CREATE INDEX idx_personal_es_transportista ON personal(es_transportista)
    WHERE es_transportista = true;

CREATE TRIGGER trg_personal_actualizado_en
BEFORE UPDATE ON personal
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

-- =============================================================================
-- TABLA MAPAS_RUTAS (catalogo de rutas)
-- =============================================================================

CREATE TABLE mapas_rutas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(140) NOT NULL,
    descripcion text,
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_mapas_rutas_nombre UNIQUE (nombre)
);

CREATE TRIGGER trg_mapas_rutas_actualizado_en
BEFORE UPDATE ON mapas_rutas
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

-- =============================================================================
-- JUNCTION: personal <-> mapas_rutas
-- =============================================================================

CREATE TABLE personal_mapas_rutas (
    personal_id uuid NOT NULL REFERENCES personal(id) ON DELETE CASCADE,
    mapa_ruta_id uuid NOT NULL REFERENCES mapas_rutas(id) ON DELETE CASCADE,
    creado_en timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (personal_id, mapa_ruta_id)
);

-- =============================================================================
-- JUNCTION: personal <-> almacenes (recursos)
-- =============================================================================
-- NOTA: almacen_id referenciara futura tabla almacenes (V3+).
-- Por ahora se guarda el UUID sin FK constraint.

CREATE TABLE personal_almacenes (
    personal_id uuid NOT NULL REFERENCES personal(id) ON DELETE CASCADE,
    almacen_id uuid NOT NULL,
    creado_en timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (personal_id, almacen_id)
);

-- =============================================================================
-- JUNCTION: personal <-> listas_precios (recursos)
-- =============================================================================
-- NOTA: lista_precio_id referenciara futura tabla listas_precios (V3+).
-- Por ahora se guarda el UUID sin FK constraint.

CREATE TABLE personal_listas_precios (
    personal_id uuid NOT NULL REFERENCES personal(id) ON DELETE CASCADE,
    lista_precio_id uuid NOT NULL,
    creado_en timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (personal_id, lista_precio_id)
);

-- =============================================================================
-- ACTUALIZAR VERSION DEL ESQUEMA
-- =============================================================================

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '2')
ON CONFLICT (clave) DO UPDATE SET
    valor = '2',
    actualizado_en = now();
