-- ARMORA Multimarkas v2 - Gestion de Mapas de Rutas
-- V12: ajusta columnas del catalogo mapas_rutas y reemplaza data previa por data real heredada.
-- Fuente funcional: endpoint legado /app/mapas-rutas/gestion-mapas-rutas.

ALTER TABLE mapas_rutas
    ADD COLUMN IF NOT EXISTS codigo varchar(30);

ALTER TABLE mapas_rutas
    ADD COLUMN IF NOT EXISTS cant_rutas integer NOT NULL DEFAULT 0;

-- Se borra la informacion previa porque no refleja el catalogo real indicado por negocio.
DELETE FROM personal_mapas_rutas;
DELETE FROM mapas_rutas;

ALTER TABLE mapas_rutas
    ALTER COLUMN codigo SET NOT NULL;

ALTER TABLE mapas_rutas
    ALTER COLUMN cant_rutas SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_mapas_rutas_codigo'
    ) THEN
        ALTER TABLE mapas_rutas ADD CONSTRAINT uq_mapas_rutas_codigo UNIQUE (codigo);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_mapas_rutas_codigo ON mapas_rutas(codigo);
CREATE INDEX IF NOT EXISTS idx_mapas_rutas_nombre ON mapas_rutas(nombre);

INSERT INTO mapas_rutas (codigo, nombre, cant_rutas, descripcion, estado)
VALUES
    ('MAP210100005', 'MAPA ICA A', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100006', 'MAPA ICA B', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100007', 'MAPA ICA C', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100008', 'MAPA ICA D', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100009', 'MAPA ICA E', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100010', 'MAPA ICA F', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100011', 'MAPA ICA G', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100012', 'MAPA ICA H', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100013', 'MAPA ICA I', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210100014', 'MAPA ICA J', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP221100006', 'MAPA ICA K', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP231100001', 'MAPA ICA L', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP231100002', 'MAPA ICA M', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP231100003', 'MAPA ICA N', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP231100004', 'MAPA ICA O', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP231100005', 'MAPA ICA P', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP201100002', 'MAPA MAYORISTAS', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP221100001', 'MAPA MERCADO B', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP221100002', 'MAPA MERCADO C', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP211000001', 'MAPA MERCADOS A', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP201000003', 'MAPA MERCADOS D', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP221100004', 'MAPA MERCADOS E', 3, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP221100005', 'MAPA MERCADOS F', 3, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP211200001', 'MAPA PALPA', 6, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP200900005', 'MAPA TOTAL', 79, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO'),
    ('MAP210600001', 'VENTA DIRECTA', 1, 'Carga real heredada desde gestion-mapas-rutas', 'ACTIVO')
ON CONFLICT (codigo) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    cant_rutas = EXCLUDED.cant_rutas,
    descripcion = EXCLUDED.descripcion,
    estado = EXCLUDED.estado,
    actualizado_en = now();

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '12')
ON CONFLICT (clave) DO UPDATE SET
    valor = '12',
    actualizado_en = now();
