-- ARMORA Multimarkas v2 - Seed inicial de rutas
-- V11: carga 227 rutas heredadas y las vincula a las 40 zonas cargadas en V10.
-- Codigo tecnico generado: <codigo_zona>-R<codigo_ruta>. Nombre visible: codigo_ruta.

WITH seed_zonas(nombre_zona, codigos_ruta) AS (
VALUES
    ('DISTRIBUIDORES', '["10"]'::jsonb),
    ('FILETEO', '["01"]'::jsonb),
    ('ICA A', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA B', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA C', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA CENTRO A', '["40","50","60"]'::jsonb),
    ('ICA CENTRO B', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA CENTRO C', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA CENTRO D', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA D', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA E', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA F', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA G', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA H', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA I', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA J', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA K', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA L', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA M', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA N', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA NORTE A', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA NORTE B', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA NORTE C', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA NORTE D', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA O', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA P', '["10","20","30","40","50","60"]'::jsonb),
    ('ICA SUR A', '["10","20","30","40","50","60"]'::jsonb),
    ('LA TINGUIÑA', '["10","20","30","40","50","60"]'::jsonb),
    ('MARCONA', '["10","20","30","40","50","60"]'::jsonb),
    ('MARSHMALLOW ANGEL', '["10","20","30","40","50","60"]'::jsonb),
    ('MERCADOS A', '["10","20","30","40","50","60"]'::jsonb),
    ('MERCADOS B', '["10","20","30","40","50","60"]'::jsonb),
    ('MERCADOS C', '["10","20","30","40","50","60"]'::jsonb),
    ('MERCADOS E', '["10","20","30","40","50","60"]'::jsonb),
    ('MERCADOS F', '["10","20","30","40","50","60"]'::jsonb),
    ('PALPA', '["10","20","30","40","50","60"]'::jsonb),
    ('PARCONA A', '["10","20","30","40","50","60"]'::jsonb),
    ('PARCONA B', '["10","20","30","40","50","60"]'::jsonb),
    ('SUBTANJALLA', '["10","20","30","40","50","60"]'::jsonb),
    ('TINGUIÑA', '["10","20","30","40","50","60"]'::jsonb)
),
seed AS (
    SELECT
        nombre_zona,
        jsonb_array_elements_text(codigos_ruta)::varchar(20) AS codigo_ruta
    FROM seed_zonas
)
INSERT INTO rutas (codigo, zona_id, nombre_ruta, dias_atencion, estado, observacion)
SELECT
    z.codigo || '-R' || s.codigo_ruta AS codigo,
    z.id AS zona_id,
    s.codigo_ruta AS nombre_ruta,
    NULL::jsonb AS dias_atencion,
    'ACTIVO'::estado_registro AS estado,
    'Carga inicial heredada desde gestion-zonas-rutas' AS observacion
FROM seed s
JOIN zonas z ON z.nombre_zona = s.nombre_zona
ON CONFLICT (codigo) DO UPDATE SET
    zona_id = EXCLUDED.zona_id,
    nombre_ruta = EXCLUDED.nombre_ruta,
    estado = EXCLUDED.estado,
    observacion = EXCLUDED.observacion,
    actualizado_en = now();

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '11')
ON CONFLICT (clave) DO UPDATE SET
    valor = '11',
    actualizado_en = now();
