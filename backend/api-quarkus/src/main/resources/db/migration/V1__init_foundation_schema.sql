-- ARMORA Multimarkas v2 - Esquema inicial de fundacion
-- F1-005: identidad, control de acceso, estructura empresarial y auditoria.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION asignar_actualizado_en()
RETURNS trigger AS $$
BEGIN
    NEW.actualizado_en = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TYPE tipo_usuario AS ENUM ('ADMINISTRADOR', 'OPERADOR', 'CLIENTE', 'PROVEEDOR');
CREATE TYPE estado_registro AS ENUM ('ACTIVO', 'INACTIVO', 'BLOQUEADO');
CREATE TYPE tipo_alcance_acceso AS ENUM ('EMPRESA', 'ALMACEN', 'PROVEEDOR', 'CLIENTE', 'RUTA', 'ZONA');

CREATE TABLE empresas (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    razon_social varchar(180) NOT NULL,
    nombre_comercial varchar(180),
    ruc varchar(11) NOT NULL,
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_empresas_ruc UNIQUE (ruc),
    CONSTRAINT ck_empresas_ruc_formato CHECK (ruc ~ '^[0-9]{11}$')
);

CREATE TRIGGER trg_empresas_actualizado_en
BEFORE UPDATE ON empresas
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

CREATE TABLE sucursales (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    empresa_id uuid NOT NULL REFERENCES empresas(id) ON DELETE RESTRICT,
    nombre varchar(140) NOT NULL,
    direccion text,
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_sucursales_empresa_nombre UNIQUE (empresa_id, nombre)
);

CREATE INDEX idx_sucursales_empresa_id ON sucursales(empresa_id);

CREATE TRIGGER trg_sucursales_actualizado_en
BEFORE UPDATE ON sucursales
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

CREATE TABLE usuarios (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario varchar(80) NOT NULL,
    correo varchar(180) NOT NULL,
    clave_hash varchar(255) NOT NULL,
    tipo tipo_usuario NOT NULL,
    estado estado_registro NOT NULL DEFAULT 'ACTIVO',
    ultimo_acceso_en timestamptz,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_usuarios_usuario UNIQUE (usuario),
    CONSTRAINT uq_usuarios_correo UNIQUE (correo),
    CONSTRAINT ck_usuarios_correo_minusculas CHECK (correo = lower(correo))
);

CREATE INDEX idx_usuarios_tipo ON usuarios(tipo);
CREATE INDEX idx_usuarios_estado ON usuarios(estado);

CREATE TRIGGER trg_usuarios_actualizado_en
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

CREATE TABLE roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre varchar(80) NOT NULL,
    descripcion text,
    es_sistema boolean NOT NULL DEFAULT false,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
);

CREATE TRIGGER trg_roles_actualizado_en
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

CREATE TABLE permisos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo varchar(120) NOT NULL,
    descripcion text,
    modulo varchar(80) NOT NULL,
    creado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_permisos_codigo UNIQUE (codigo)
);

CREATE INDEX idx_permisos_modulo ON permisos(modulo);

CREATE TABLE usuarios_roles (
    usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    rol_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    creado_en timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (usuario_id, rol_id)
);

CREATE INDEX idx_usuarios_roles_rol_id ON usuarios_roles(rol_id);

CREATE TABLE roles_permisos (
    rol_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permiso_id uuid NOT NULL REFERENCES permisos(id) ON DELETE CASCADE,
    creado_en timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (rol_id, permiso_id)
);

CREATE INDEX idx_roles_permisos_permiso_id ON roles_permisos(permiso_id);

CREATE TABLE alcances_acceso (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id uuid NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_alcance tipo_alcance_acceso NOT NULL,
    alcance_id uuid NOT NULL,
    creado_en timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_alcances_acceso_usuario_alcance UNIQUE (usuario_id, tipo_alcance, alcance_id)
);

CREATE INDEX idx_alcances_acceso_usuario_id ON alcances_acceso(usuario_id);
CREATE INDEX idx_alcances_acceso_alcance ON alcances_acceso(tipo_alcance, alcance_id);

CREATE TABLE registros_auditoria (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_usuario_id uuid REFERENCES usuarios(id) ON DELETE SET NULL,
    accion varchar(120) NOT NULL,
    entidad_tipo varchar(120) NOT NULL,
    entidad_id uuid,
    antes_json jsonb,
    despues_json jsonb,
    direccion_ip inet,
    agente_usuario text,
    creado_en timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_registros_auditoria_actor_usuario_id ON registros_auditoria(actor_usuario_id);
CREATE INDEX idx_registros_auditoria_entidad ON registros_auditoria(entidad_tipo, entidad_id);
CREATE INDEX idx_registros_auditoria_creado_en ON registros_auditoria(creado_en);

CREATE TABLE metadatos_plataforma (
    clave varchar(120) PRIMARY KEY,
    valor text NOT NULL,
    creado_en timestamptz NOT NULL DEFAULT now(),
    actualizado_en timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_metadatos_plataforma_actualizado_en
BEFORE UPDATE ON metadatos_plataforma
FOR EACH ROW
EXECUTE FUNCTION asignar_actualizado_en();

INSERT INTO metadatos_plataforma (clave, valor)
VALUES ('esquema.version', '1');