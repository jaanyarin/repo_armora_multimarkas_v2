-- ARMORA Multimarkas v2 - Zonas y rutas normalizadas
-- V9: Separa zonas, rutas y poligonos por zona.
-- =============================================================================

CREATE TABLE zonas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(30) NOT NULL,
    nombre_zona varchar(150) NOT NULL,
    color varchar(20),
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    observacion text,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_zonas_codigo UNIQUE (codigo)
);

CREATE INDEX idx_zonas_nombre_zona ON zonas(nombre_zona);
CREATE INDEX idx_zonas_estado ON zonas(estado);

CREATE TRIGGER trg_zonas_actualizado_en
BEFORE UPDATE ON zonas
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

CREATE TABLE rutas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(30) NOT NULL,
    zona_id uuid NOT NULL,
    nombre_ruta varchar(150) NOT NULL,
    dias_atencion jsonb,
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    observacion text,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_rutas_codigo UNIQUE (codigo),
    CONSTRAINT fk_rutas_zona FOREIGN KEY (zona_id)
        REFERENCES zonas(id) ON DELETE RESTRICT
);

CREATE INDEX idx_rutas_zona_id ON rutas(zona_id);
CREATE INDEX idx_rutas_nombre_ruta ON rutas(nombre_ruta);
CREATE INDEX idx_rutas_estado ON rutas(estado);

CREATE TRIGGER trg_rutas_actualizado_en
BEFORE UPDATE ON rutas
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

CREATE TABLE zonas_poligonos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    zona_id uuid NOT NULL,
    coordenadas jsonb NOT NULL,
    version integer NOT NULL DEFAULT 1,
    activo boolean NOT NULL DEFAULT true,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_zonas_poligonos_zona FOREIGN KEY (zona_id)
        REFERENCES zonas(id) ON DELETE CASCADE,
    CONSTRAINT uq_zonas_poligonos_version UNIQUE (zona_id, version)
);

CREATE INDEX idx_zonas_poligonos_zona_id ON zonas_poligonos(zona_id);
CREATE INDEX idx_zonas_poligonos_zona_activo ON zonas_poligonos(zona_id, activo);

CREATE TRIGGER trg_zonas_poligonos_actualizado_en
BEFORE UPDATE ON zonas_poligonos
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '9')
ON CONFLICT (clave) DO UPDATE SET
    valor = '9',
    actualizado_en = now();
