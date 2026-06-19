-- ARMORA Multimarkas v2 - Zonas y rutas
-- V7: Tabla de zonas y rutas, responsable asignado, dÃ­as de atenciÃ³n y color.
-- =============================================================================

-- =============================================================================
-- TABLA ZONAS_RUTAS
-- =============================================================================

CREATE TABLE zonas_rutas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(30) NOT NULL,
    nombre_zona varchar(150) NOT NULL,
    nombre_ruta varchar(150) NOT NULL,
    responsable_id uuid,
    dias_atencion jsonb,
    color varchar(20),
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    observacion text,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_zonas_rutas_codigo UNIQUE (codigo),
    CONSTRAINT fk_zonas_rutas_responsable FOREIGN KEY (responsable_id)
        REFERENCES personal(id) ON DELETE SET NULL
);

CREATE INDEX idx_zonas_rutas_nombre_zona ON zonas_rutas(nombre_zona);
CREATE INDEX idx_zonas_rutas_responsable_id ON zonas_rutas(responsable_id)
    WHERE responsable_id IS NOT NULL;

CREATE TRIGGER trg_zonas_rutas_actualizado_en
BEFORE UPDATE ON zonas_rutas
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

-- =============================================================================
-- ACTUALIZAR VERSION DEL ESQUEMA
-- =============================================================================

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '7')
ON CONFLICT (clave) DO UPDATE SET
    valor = '7',
    actualizado_en = now();
