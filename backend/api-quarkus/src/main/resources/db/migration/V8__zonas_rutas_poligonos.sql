-- ARMORA Multimarkas v2 - Poligonos de zonas y rutas
-- V8: Tabla de polÃ­gonos geogrÃ¡ficos asociados a zonas/rutas,
--     con versionado y control de activo.
-- =============================================================================

-- =============================================================================
-- TABLA ZONAS_RUTAS_POLIGONOS
-- =============================================================================

CREATE TABLE zonas_rutas_poligonos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    zona_ruta_id uuid NOT NULL,
    coordenadas jsonb NOT NULL,
    version integer NOT NULL DEFAULT 1,
    activo boolean NOT NULL DEFAULT true,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_zrp_zona_ruta FOREIGN KEY (zona_ruta_id)
        REFERENCES zonas_rutas(id) ON DELETE CASCADE
);

CREATE INDEX idx_zrp_zona_ruta_id ON zonas_rutas_poligonos(zona_ruta_id);
CREATE INDEX idx_zrp_zona_ruta_activo ON zonas_rutas_poligonos(zona_ruta_id, activo);

CREATE TRIGGER trg_zonas_rutas_poligonos_actualizado_en
BEFORE UPDATE ON zonas_rutas_poligonos
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

-- =============================================================================
-- ACTUALIZAR VERSION DEL ESQUEMA
-- =============================================================================

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '8')
ON CONFLICT (clave) DO UPDATE SET
    valor = '8',
    actualizado_en = now();
