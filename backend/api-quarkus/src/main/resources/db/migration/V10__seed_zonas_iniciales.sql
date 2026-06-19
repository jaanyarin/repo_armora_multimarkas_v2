-- ARMORA Multimarkas v2 - Seed inicial de zonas
-- V10: Carga inicial de zonas comerciales heredadas.
-- =============================================================================

INSERT INTO zonas (codigo, nombre_zona, color, estado, observacion)
VALUES
    ('ZON-0001', 'DISTRIBUIDORES', '#2563eb', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0002', 'FILETEO', '#16a34a', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0003', 'ICA A', '#f59e0b', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0004', 'ICA B', '#dc2626', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0005', 'ICA C', '#7c3aed', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0006', 'ICA CENTRO A', '#0891b2', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0007', 'ICA CENTRO B', '#4f46e5', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0008', 'ICA CENTRO C', '#0f766e', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0009', 'ICA CENTRO D', '#be123c', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0010', 'ICA D', '#9333ea', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0011', 'ICA E', '#0284c7', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0012', 'ICA F', '#65a30d', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0013', 'ICA G', '#c2410c', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0014', 'ICA H', '#475569', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0015', 'ICA I', '#1d4ed8', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0016', 'ICA J', '#15803d', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0017', 'ICA K', '#b45309', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0018', 'ICA L', '#b91c1c', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0019', 'ICA M', '#6d28d9', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0020', 'ICA N', '#0e7490', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0021', 'ICA NORTE A', '#3730a3', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0022', 'ICA NORTE B', '#047857', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0023', 'ICA NORTE C', '#9f1239', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0024', 'ICA NORTE D', '#7e22ce', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0025', 'ICA O', '#0369a1', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0026', 'ICA P', '#4d7c0f', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0027', 'ICA SUR A', '#ea580c', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0028', 'LA TINGUIÑA', '#334155', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0029', 'MARCONA', '#1e40af', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0030', 'MARSHMALLOW ANGEL', '#166534', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0031', 'MERCADOS A', '#92400e', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0032', 'MERCADOS B', '#991b1b', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0033', 'MERCADOS C', '#5b21b6', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0034', 'MERCADOS E', '#155e75', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0035', 'MERCADOS F', '#312e81', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0036', 'PALPA', '#065f46', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0037', 'PARCONA A', '#881337', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0038', 'PARCONA B', '#581c87', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0039', 'SUBTANJALLA', '#0c4a6e', 'ACTIVO', 'Carga inicial heredada'),
    ('ZON-0040', 'TINGUIÑA', '#3f6212', 'ACTIVO', 'Carga inicial heredada')
ON CONFLICT (codigo) DO UPDATE SET
    nombre_zona = EXCLUDED.nombre_zona,
    color = EXCLUDED.color,
    estado = EXCLUDED.estado,
    observacion = EXCLUDED.observacion,
    actualizado_en = now();

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '10')
ON CONFLICT (clave) DO UPDATE SET
    valor = '10',
    actualizado_en = now();
