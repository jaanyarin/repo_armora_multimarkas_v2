'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AppLayout } from '@/design-system/web/layout';
import { colors } from '@/design-system/tokens/colors';
import { api } from '@/lib/api-client';

// ─── Helper: resolver URL de foto ────────────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8885/api/v1';

function resolveFotoUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/')) {
    // Las fotos se sirven desde el mismo API base (incluye /api/v1)
    return `${API_BASE_URL}${url}`;
  }
  return url;
}

// ─── Types ──────────────────────────────────────────────────────────────────

type UbicacionItem = {
  id: string;
  codigo: string;
  nombre: string;
};

type EditarPersonalForm = {
  codigo: string;
  usuario: string;
  tipoDocumento: string;
  numeroDocumento: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  sexo: string;
  estadoCivil: string;
  cargo: string;
  area: string;
  sede: string;
  estado: string;
  observaciones: string;
  emailCorporativo: string;
  emailPersonal: string;
  celular: string;
  telefono: string;
  departamentoId: string;
  departamentoNombre: string;
  provinciaId: string;
  provinciaNombre: string;
  distritoId: string;
  distritoNombre: string;
  ubigeoCodigo: string;
  contactoEmergencia: string;
  direccion: string;
  referencia: string;
  fotografiaNombre: string;
  fotografiaPreview: string;
  permisos: string[];
  mapaRuta: string;
  listasPrecios: string[];
  almacenes: string[];
  esVendedor: boolean;
  esTransportista: boolean;
};

type PersonalResponse = {
  id: string;
  usuarioId: string;
  nombresCompletos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  sexo?: string | null;
  estadoCivil?: string | null;
  fechaNacimiento?: string | null;
  cargo?: string | null;
  area?: string | null;
  sede?: string | null;
  emailContacto?: string | null;
  emailPersonal?: string | null;
  telefonoCelular?: string | null;
  telefonoFijo?: string | null;
  direccion?: string | null;
  referencia?: string | null;
  contactoEmergencia?: string | null;
  departamentoNombre?: string | null;
  provinciaNombre?: string | null;
  distritoNombre?: string | null;
  ubigeoCodigo?: string | null;
  observaciones?: string | null;
  fotoUrl?: string | null;
  esVendedor: boolean;
  esTransportista: boolean;
  usuario: string;
  estado: string;
  ultimoAcceso: string | null;
};

type EditarPersonalPayload = {
  nombresCompletos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  sexo?: string | null;
  estadoCivil?: string | null;
  fechaNacimiento?: string | null;
  cargo?: string | null;
  area?: string | null;
  sede?: string | null;
  observaciones?: string | null;
  emailContacto?: string | null;
  emailPersonal?: string | null;
  telefonoCelular?: string | null;
  telefonoFijo?: string | null;
  ubigeoCodigo?: string | null;
  departamentoNombre?: string | null;
  provinciaNombre?: string | null;
  distritoNombre?: string | null;
  direccion?: string | null;
  referencia?: string | null;
  contactoEmergencia?: string | null;
  fotoUrl?: string | null;
  estado?: string | null;
  esVendedor: boolean;
  esTransportista: boolean;
};

type PermisoResponse = {
  codigoPermiso: string;
  grupo: string;
};

type RecursosResponse = {
  rutasIds: string[];
  rutasNombres: string[];
  almacenesIds: string[];
  listasPreciosIds: string[];
};

type UploadResponse = {
  url: string;
  fileName: string;
  originalName: string;
  size: number;
};

// ─── Constants ──────────────────────────────────────────────────────────────

const SECTION_IDS = [
  'div-datos-personales',
  'div-contactos',
  'div-permisos',
  'div-fotografia',
  'div-recursos',
  'div-confirmacion',
];

const SECTION_LABELS = [
  '1 Datos',
  '2 Contactos',
  '3 Permisos',
  '4 Fotografía',
  '5 Recursos',
  '6 Confirmación',
];

const tiposDocumento = [
  { label: 'DNI', value: 'DNI' },
  { label: 'Carnet de Extranjería', value: 'CEXT' },
  { label: 'Pasaporte', value: 'PASS' },
];
const sexos = [
  { label: 'Masculino', value: 'MASCULINO' },
  { label: 'Femenino', value: 'FEMENINO' },
];
const estadosCivil = [
  { label: 'Soltero(a)', value: 'SOLTERO' },
  { label: 'Casado(a)', value: 'CASADO' },
  { label: 'Divorciado(a)', value: 'DIVORCIADO' },
  { label: 'Viudo(a)', value: 'VIUDO' },
];
const sedes = ['BROCKER MESA 1', 'ALMACÉN CENTRAL'];
const mapasRutas = [
  'MAPA ICA A', 'MAPA ICA B', 'MAPA ICA C', 'MAPA ICA D', 'MAPA ICA E',
  'MAPA ICA F', 'MAPA ICA G', 'MAPA ICA H', 'MAPA ICA I', 'MAPA ICA J',
  'MAPA ICA K', 'MAPA MAYORISTAS', 'MAPA MERCADOS A', 'VENTA DIRECTA',
];
const listasPrecios = [
  'LISTA DE PRECIO M1F', 'LISTA DE PRECIO M1P',
  'LISTA DE PRECIOS MESA 1P', 'LISTA DE PRECIOS MESA 2',
  'LISTA DE PRECIOS MESA 3',
];
const almacenes = [
  'BROCKER MESA 1', 'BROCKER MESA 2',
  'FALTANTE INVENTARIOS', 'PRODUCTOS EN MAL ESTADO',
];

// Permisos organizados por grupos (igual que el HTML)
const PERMISSION_GROUPS: Record<string, string[]> = {
  Almacenes: [
    'Crear Inventario de Stocks', 'Gestion Almacenes',
    'Gestion de Inventarios', 'Reportes Almacenes',
  ],
  Cambios: [
    'Asignar Fecha Entrega Cambios', 'Crear Cambio Producto',
    'Crear Reporte Cambios de Productos', 'Gestion de Cambios de Producto',
    'Gestion de Reportes Cambios de Productos', 'Impresión de Cambios de Productos',
    'Reportes de Cambios',
  ],
  Canjes: [
    'Asignar Fecha Entrega Canjes', 'Crear Canje',
    'Crear Reporte Canjes', 'Gestion de Canjes',
    'Gestion de Reportes Canjes', 'Impresión de Canjes',
    'Reportes de Canjes',
  ],
  Clientes: [
    'Cambio dia Atencion Lotes', 'Crear Cliente',
    'Gestion Clientes', 'Habilitar Ventas Clientes', 'Reportes Clientes',
  ],
  Cobertura: ['Crear Reporte de Cobertura', 'Gestion de Coberturas'],
  Combos: ['Crear Combo', 'Gestion de Combos', 'Reportes de Combos'],
  Comisiones: [
    'Ajuste de Comisiones', 'Crear Reporte de Comision', 'Gestion de Comisiones',
  ],
  Compras: ['Crear Compra', 'Gestion Compras'],
  'Comunicación de Baja': [
    'Crear Comunicación de Baja', 'Gestion Comunicaciones de Baja',
    'Reportes Comunicaciones de Baja',
  ],
  Concursos: ['Crear Concurso', 'Gestion de Concursos', 'Reportes de Concursos'],
  Configuracion: [
    'Configuracion Alertas', 'Configuracion Empresa',
    'Configuracion Impresión', 'Configuracion Sunat',
  ],
  Informes: [
    'Informes de Almacenes', 'Informes de Entregas Parciales',
    'Informes de Liquidaciones', 'Informes de Requerimientos',
  ],
  Liquidaciones: [
    'Crear Liquidacion', 'Gestion de Liquidaciones', 'Reportes de Liquidaciones',
  ],
  'Listas de Precios': [
    'Copiar Listas de Precios', 'Crear Lista de Precios',
    'Gestion de Listas de Precios', 'Reportes Listas de Precios',
  ],
  'Mapas de Rutas': [
    'Crear Mapa de Rutas', 'Gestion de Mapas de Rutas', 'Reportes de Mapas de Rutas',
  ],
  'Notas de Credito': [
    'Devoluciones Transportistas', 'Gestion de Notas de Credito',
    'Impresión de Notas de Credito', 'Reportes de Notas de Credito',
  ],
  Personal: ['Crear Personal', 'Gestion del Personal', 'Reportes del Personal'],
  'Premios de Canjes': [
    'Crear Premio de Canje', 'Gestion de Premio de Canje',
    'Gestion de Requisitos de Canje', 'Reporte de Premios de Canjes',
  ],
  Preventas: ['Gestion Preventas', 'Reportes Preventas'],
  Productos: [
    'Crear Producto', 'Gestion de Clases y Subclases',
    'Gestion de Productos', 'Reportes de Productos',
  ],
  Proveedores: ['Crear Proveedor', 'Gestion Proveedores'],
  Requerimientos: [
    'Crear Requerimiento', 'Gestion de Requerimientos', 'Reportes de Requerimientos',
  ],
  'Resumen Diario': [
    'Crear Resumen Diario', 'Gestion de Resumenes Diarios',
    'Reportes de Resumenes Diarios',
  ],
  Servicios: ['Crear Servicio', 'Gestion de Servicios'],
  Sunat: [
    'Envios Pendientes Sunat', 'Gestion Envios Sunat', 'Reportes Envios Sunat',
  ],
  Transferencias: [
    'Crear Transferencia', 'Gestion de Transferencias', 'Reportes de Transferencias',
  ],
  Transportista: [
    'Mis Devoluciones', 'Mis Liquidaciones', 'Mis Requerimientos',
  ],
  'Unidades de Transporte': [
    'Crear Unidad de Transporte', 'Gestion de Unidades de Transporte',
    'Reportes de Unidades de Transporte',
  ],
  Vendedor: [
    'Crear Cambio Producto', 'Crear Canje', 'Crear Cliente', 'Crear Preventa',
    'Gestion de Cambios de Producto', 'Gestion de Canjes', 'Gestion de Clientes',
    'Gestion de Comisiones', 'Gestion de Concursos', 'Gestion de Preventas',
    'Gestion de Ventas', 'Stock Productos',
  ],
  Ventas: [
    'Crear Venta', 'Crear Venta de Servicios', 'Entregas Parciales',
    'Fileteo Automatico', 'Gestion de Notas de Pedido', 'Gestion Ventas',
    'Impresión Ventas', 'Puntos de Ventas', 'Reportes de Ventas',
  ],
  'Zonas y Rutas': [
    'Gestion Zonas y Rutas', 'Habilitar Ventas', 'Reportes de Zonas y Rutas',
  ],
};

const allPermissionValues = Object.entries(PERMISSION_GROUPS).flatMap(
  ([group, items]) => items.map((item) => `${group} > ${item}`),
);

const initialForm: EditarPersonalForm = {
  codigo: '',
  usuario: '',
  tipoDocumento: 'DNI',
  numeroDocumento: '',
  nombres: '',
  apellidos: '',
  fechaNacimiento: '',
  sexo: '',
  estadoCivil: '',
  cargo: '',
  area: '',
  sede: '',
  estado: 'Activo',
  observaciones: '',
  emailCorporativo: '',
  emailPersonal: '',
  celular: '',
  telefono: '',
  departamentoId: '',
  departamentoNombre: '',
  provinciaId: '',
  provinciaNombre: '',
  distritoId: '',
  distritoNombre: '',
  ubigeoCodigo: '',
  contactoEmergencia: '',
  direccion: '',
  referencia: '',
  fotografiaNombre: '',
  fotografiaPreview: '',
  permisos: [],
  mapaRuta: '',
  listasPrecios: [],
  almacenes: [],
  esVendedor: true,
  esTransportista: false,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function normalize(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function cleanOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function toEditPayload(form: EditarPersonalForm): EditarPersonalPayload {
  return {
    nombresCompletos: `${form.nombres.trim()} ${form.apellidos.trim()}`.trim(),
    tipoDocumento: form.tipoDocumento,
    numeroDocumento: form.numeroDocumento.trim(),
    sexo: cleanOptional(form.sexo),
    estadoCivil: cleanOptional(form.estadoCivil),
    fechaNacimiento: cleanOptional(form.fechaNacimiento),
    cargo: cleanOptional(form.cargo),
    area: cleanOptional(form.area),
    sede: cleanOptional(form.sede),
    observaciones: cleanOptional(form.observaciones),
    emailContacto: cleanOptional(form.emailCorporativo)?.toLowerCase() || null,
    emailPersonal: cleanOptional(form.emailPersonal)?.toLowerCase() || null,
    telefonoCelular: cleanOptional(form.celular),
    telefonoFijo: cleanOptional(form.telefono),
    ubigeoCodigo: cleanOptional(form.ubigeoCodigo),
    departamentoNombre: cleanOptional(form.departamentoNombre) || null,
    provinciaNombre: cleanOptional(form.provinciaNombre) || null,
    distritoNombre: cleanOptional(form.distritoNombre) || null,
    direccion: cleanOptional(form.direccion),
    referencia: cleanOptional(form.referencia),
    contactoEmergencia: cleanOptional(form.contactoEmergencia),
    fotoUrl: form.fotografiaPreview || null,
    estado: form.estado?.toUpperCase() || null,
    esVendedor: form.esVendedor,
    esTransportista: form.esTransportista,
  };
}

function mapPersonalToForm(response: PersonalResponse): Partial<EditarPersonalForm> {
  const nameParts = (response.nombresCompletos ?? '').split(/\s+/).filter(Boolean);
  const nombres = nameParts[0] ?? '';
  const apellidos = nameParts.slice(1).join(' ') ?? '';

  // Parse fechaNacimiento to yyyy-MM-dd
  let fechaNacimiento = '';
  if (response.fechaNacimiento) {
    try {
      const d = new Date(response.fechaNacimiento);
      if (!isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        fechaNacimiento = `${yyyy}-${mm}-${dd}`;
      }
    } catch {
      fechaNacimiento = response.fechaNacimiento;
    }
  }

  return {
    codigo: response.id,
    usuario: response.usuario ?? '',
    tipoDocumento: response.tipoDocumento ?? 'DNI',
    numeroDocumento: response.numeroDocumento ?? '',
    nombres,
    apellidos,
    fechaNacimiento,
    sexo: response.sexo ?? '',
    estadoCivil: response.estadoCivil ?? '',
    cargo: response.cargo ?? '',
    area: response.area ?? '',
    sede: response.sede ?? '',
    estado: response.estado ?? 'Activo',
    observaciones: response.observaciones ?? '',
    emailCorporativo: response.emailContacto ?? '',
    emailPersonal: response.emailPersonal ?? '',
    celular: response.telefonoCelular ?? '',
    telefono: response.telefonoFijo ?? '',
    ubigeoCodigo: response.ubigeoCodigo ?? '',
    departamentoNombre: response.departamentoNombre ?? '',
    provinciaNombre: response.provinciaNombre ?? '',
    distritoNombre: response.distritoNombre ?? '',
    direccion: response.direccion ?? '',
    referencia: response.referencia ?? '',
    contactoEmergencia: response.contactoEmergencia ?? '',
    fotografiaPreview: resolveFotoUrl(response.fotoUrl),
    esVendedor: response.esVendedor,
    esTransportista: response.esTransportista,
  };
}

// ─── Inner component (uses useSearchParams, needs Suspense wrapper) ─────────

function EditarPersonalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [form, setForm] = useState<EditarPersonalForm>(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Scroll spy: qué sección está visible
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // UBIGEO cascade
  const [departamentos, setDepartamentos] = useState<UbicacionItem[]>([]);
  const [provincias, setProvincias] = useState<UbicacionItem[]>([]);
  const [distritos, setDistritos] = useState<UbicacionItem[]>([]);
  const [loadingDep, setLoadingDep] = useState(false);
  const [loadingProv, setLoadingProv] = useState(false);
  const [loadingDist, setLoadingDist] = useState(false);
  const [editandoUbicacion, setEditandoUbicacion] = useState(false);

  // Almacena la fotoUrl original del servidor para eliminarla al reemplazar
  const originalFotoUrlRef = useRef<string | null>(null);

  // ── Load personal data ─────────────────────────────────────────────────

  useEffect(() => {
    if (!id) {
      setError('No se especificó un ID de personal.');
      setLoadingData(false);
      return;
    }

    setLoadingData(true);
    setError('');

    api
      .get<PersonalResponse>(`/personal/${id}`)
      .then(async (response) => {
        if (!response) {
          setError('No se encontraron datos del personal.');
          return;
        }
        // Guardar fotoUrl original del servidor para eliminarla al reemplazar
        originalFotoUrlRef.current = response.fotoUrl ?? null;
        const mapped = mapPersonalToForm(response);

        // Load permisos
        try {
          const permisos = await api.get<PermisoResponse[]>(`/personal/${id}/permisos`);
          if (permisos && permisos.length > 0) {
            mapped.permisos = permisos.map((p: PermisoResponse) => p.codigoPermiso);
          }
        } catch {
          // permisos may not exist yet, that's ok
        }

        // Load recursos
        try {
          const recursos = await api.get<RecursosResponse>(`/personal/${id}/recursos`);
          if (recursos) {
            if (recursos.rutasIds && recursos.rutasIds.length > 0) {
              mapped.mapaRuta = recursos.rutasIds[0];
            }
            if (recursos.almacenesIds) {
              mapped.almacenes = recursos.almacenesIds;
            }
            if (recursos.listasPreciosIds) {
              mapped.listasPrecios = recursos.listasPreciosIds;
            }
          }
        } catch {
          // recursos may not exist yet, that's ok
        }

        setForm((prev) => ({ ...prev, ...mapped }));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error al cargar datos del personal.');
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [id]);

  // ── Scroll spy ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (loadingData) return;
    const observers: IntersectionObserver[] = [];
    const handleIntersect = (index: number) => (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(index);
          break;
        }
      }
    };

    for (let i = 0; i < SECTION_IDS.length; i++) {
      const el = sectionRefs.current[i];
      if (!el) continue;
      const observer = new IntersectionObserver(handleIntersect(i), {
        rootMargin: '-80px 0px -40% 0px',
        threshold: 0,
      });
      observer.observe(el);
      observers.push(observer);
    }

    return () => {
      observers.forEach((o) => o.disconnect());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingData]);

  // ── Cargar UBIGEO ───────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      setLoadingDep(true);
      try {
        const data = await api.get<UbicacionItem[]>('/ubigeo/departamentos');
        setDepartamentos(data ?? []);
      } catch {
        // silencioso
      } finally {
        setLoadingDep(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const dep = departamentos.find((d) => d.id === form.departamentoId);
    updateField('departamentoNombre', dep?.nombre ?? '');
    if (!form.departamentoId) {
      setProvincias([]);
      setDistritos([]);
      updateField('provinciaId', '');
      updateField('provinciaNombre', '');
      updateField('distritoId', '');
      updateField('distritoNombre', '');
      updateField('ubigeoCodigo', '');
      return;
    }
    async function load() {
      setLoadingProv(true);
      setProvincias([]);
      setDistritos([]);
      updateField('provinciaId', '');
      updateField('provinciaNombre', '');
      updateField('distritoId', '');
      updateField('distritoNombre', '');
      updateField('ubigeoCodigo', '');
      try {
        const data = await api.get<UbicacionItem[]>(
          `/ubigeo/departamentos/${form.departamentoId}/provincias`,
        );
        setProvincias(data ?? []);
      } catch {
        // silencioso
      } finally {
        setLoadingProv(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.departamentoId]);

  useEffect(() => {
    const prov = provincias.find((p) => p.id === form.provinciaId);
    updateField('provinciaNombre', prov?.nombre ?? '');
    if (!form.provinciaId) {
      setDistritos([]);
      updateField('distritoId', '');
      updateField('distritoNombre', '');
      updateField('ubigeoCodigo', '');
      return;
    }
    async function load() {
      setLoadingDist(true);
      setDistritos([]);
      updateField('distritoId', '');
      updateField('distritoNombre', '');
      updateField('ubigeoCodigo', '');
      try {
        const data = await api.get<UbicacionItem[]>(
          `/ubigeo/provincias/${form.provinciaId}/distritos`,
        );
        setDistritos(data ?? []);
      } catch {
        // silencioso
      } finally {
        setLoadingDist(false);
      }
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.provinciaId]);

  useEffect(() => {
    if (form.distritoId && distritos.length > 0) {
      const distrito = distritos.find((d) => d.id === form.distritoId);
      if (distrito) {
        updateField('ubigeoCodigo', distrito.codigo);
        updateField('distritoNombre', distrito.nombre);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.distritoId, distritos]);

  // ── Permisos derivados ──────────────────────────────────────────────────

  const totalPermisos = allPermissionValues.length;
  const selectedPermisosCount = form.permisos.length;
  const allSelected = selectedPermisosCount === totalPermisos;
  const noneSelected = selectedPermisosCount === 0;

  const getGroupPermissionCounts = useCallback(
    (group: string) => {
      const items = PERMISSION_GROUPS[group] ?? [];
      const selected = items.filter((p) => form.permisos.includes(`${group} > ${p}`));
      return { total: items.length, selected: selected.length, all: selected.length === items.length, none: selected.length === 0 };
    },
    [form.permisos],
  );

  // ── Handlers ────────────────────────────────────────────────────────────

  const updateField = <K extends keyof EditarPersonalForm>(
    field: K,
    value: EditarPersonalForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectAllPermissions = () => {
    if (allSelected) {
      updateField('permisos', []);
    } else {
      updateField('permisos', [...allPermissionValues]);
    }
  };

  const handleGroupSelectAll = (group: string, select: boolean) => {
    const items = PERMISSION_GROUPS[group] ?? [];
    const groupPermissions = items.map((item) => `${group} > ${item}`);
    if (select) {
      const newPerms = [...new Set([...form.permisos, ...groupPermissions])];
      updateField('permisos', newPerms);
    } else {
      updateField('permisos', form.permisos.filter((p) => !groupPermissions.includes(p)));
    }
  };

  const togglePermission = (value: string) => {
    if (form.permisos.includes(value)) {
      updateField('permisos', form.permisos.filter((p) => p !== value));
    } else {
      updateField('permisos', [...form.permisos, value]);
    }
  };

  const handleScrollTo = (index: number) => {
    const el = sectionRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // ── Validación y submit ────────────────────────────────────────────────

  const canSubmit = useMemo(
    () =>
      Boolean(
        form.nombres.trim() &&
          form.apellidos.trim() &&
          form.usuario.trim() &&
          form.numeroDocumento.trim(),
      ),
    [form],
  );

  const tipoPersonalLabel = useMemo(() => {
    if (form.esVendedor && form.esTransportista) return 'vendedor / transportista';
    if (form.esVendedor) return 'vendedor';
    if (form.esTransportista) return 'transportista';
    return 'sin tipo';
  }, [form.esTransportista, form.esVendedor]);

  const validate = () => {
    if (!form.nombres.trim()) return 'Ingresa los nombres.';
    if (!form.apellidos.trim()) return 'Ingresa los apellidos.';
    if (!form.usuario.trim()) return 'Ingresa el login de usuario.';
    if (!form.numeroDocumento.trim()) return 'Ingresa el número de documento.';
    return '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!id) {
      setError('No se especificó un ID de personal.');
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      // 1. Delete old photo if user is changing or removing it
      const oldFotoUrl = originalFotoUrlRef.current;
      const userChangedPhoto = form.fotografiaPreview.startsWith('data:');
      const userRemovedPhoto = !form.fotografiaPreview && Boolean(oldFotoUrl);

      if (oldFotoUrl && (userChangedPhoto || userRemovedPhoto)) {
        const fileName = oldFotoUrl.replace('/files/photos/', '');
        try {
          await api.del(`/files/photos/${fileName}`);
        } catch (e) {
          console.warn('No se pudo eliminar foto anterior (puede no existir):', e);
        }
      }

      // 2. Upload new photo if changed (base64 only)
      let payload = toEditPayload(form);
      if (userChangedPhoto) {
        const blob = await (await fetch(form.fotografiaPreview)).blob();
        const formData = new FormData();
        formData.append('file', blob, form.fotografiaNombre || 'photo.jpg');
        const uploadResult = await api.upload('/files/upload', formData) as UploadResponse;
        payload.fotoUrl = uploadResult.url;
      }

      // 3. Save personal data
      await api.put(`/personal/${id}`, payload);

      // 4. Save permisos
      if (form.permisos.length > 0) {
        const permisosPayload = form.permisos.map((p: string) => {
          const [grupo, ...rest] = p.split(' > ');
          return { codigoPermiso: p, grupo };
        });
        await api.put(`/personal/${id}/permisos`, permisosPayload);
      } else {
        await api.put(`/personal/${id}/permisos`, []);
      }

      // 5. Save recursos
      const recursosPayload: Record<string, unknown> = {};
      if (form.mapaRuta) {
        recursosPayload.rutasIds = [form.mapaRuta];
      } else {
        recursosPayload.rutasIds = [];
      }
      if (form.almacenes.length > 0) {
        recursosPayload.almacenesIds = form.almacenes;
      } else {
        recursosPayload.almacenesIds = [];
      }
      if (form.listasPrecios.length > 0) {
        recursosPayload.listasPreciosIds = form.listasPrecios;
      } else {
        recursosPayload.listasPreciosIds = [];
      }
      await api.put(`/personal/${id}/recursos`, recursosPayload);

      setSuccess('Cambios guardados correctamente.');
      setTimeout(() => {
        router.push('/personal/gestion-personal');
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudieron guardar los cambios.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLimpiar = () => {
    setError('');
    setSuccess('');
  };

  // ── Render helpers ──────────────────────────────────────────────────────

  function renderPill(index: number) {
    const isActive = activeSection === index;
    return (
      <Box
        key={SECTION_LABELS[index]}
        component="span"
        onClick={() => handleScrollTo(index)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          cursor: 'pointer',
          border: '1px solid',
          borderColor: isActive ? colors.primary[600] : colors.neutral.border,
          bgcolor: isActive ? colors.primary[600] : colors.neutral.white,
          color: isActive ? '#fff' : colors.neutral.textMuted,
          borderRadius: 999,
          px: 1.5,
          py: 0.6,
          fontSize: 13,
          fontWeight: isActive ? 700 : 400,
          transition: 'all 0.15s',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          '&:hover': { opacity: 0.85 },
        }}
      >
        {SECTION_LABELS[index]}
      </Box>
    );
  }

  function renderCard(
    id: string,
    index: number,
    title: string,
    badge?: string,
    children?: React.ReactNode,
  ) {
    return (
      <Paper
        ref={(el) => { sectionRefs.current[index] = el; }}
        id={id}
        sx={{
          borderRadius: '16px',
          border: `1px solid ${colors.neutral.border}`,
          boxShadow: '0 10px 25px rgba(15, 23, 42, 0.08)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 2.5,
            py: 2,
            borderBottom: `1px solid ${colors.neutral.border}`,
            background: 'linear-gradient(180deg, #fff, #f9fbff)',
          }}
        >
          <Typography variant="h4" sx={{ color: colors.primary[600], m: 0 }}>
            {title}
          </Typography>
          {badge && (
            <Box
              sx={{
                borderRadius: 999,
                bgcolor: '#eef3ff',
                color: colors.primary[600],
                px: 1.5,
                py: 0.3,
                fontSize: 12,
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {badge}
            </Box>
          )}
        </Box>
        <Box sx={{ p: 2.5 }}>{children}</Box>
      </Paper>
    );
  }

  function renderField(
    label: string,
    children: React.ReactNode,
    fullWidth?: boolean,
  ) {
    return (
      <Box sx={{ gridColumn: fullWidth ? '1 / -1' : undefined }}>
        <Typography
          variant="caption"
          sx={{ display: 'block', fontWeight: 700, mb: 0.5, color: '#344054', fontSize: 13 }}
        >
          {label}
        </Typography>
        {children}
      </Box>
    );
  }

  // ── Loading state ──────────────────────────────────────────────────────

  if (loadingData) {
    return (
      <AppLayout activePath="/personal/editar-personal" username="ALEJANDRO ANYARIN" role="admin">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">Cargando datos del personal...</Typography>
        </Box>
      </AppLayout>
    );
  }

  if (error && !form.usuario && !loadingData) {
    return (
      <AppLayout activePath="/personal/editar-personal" username="ALEJANDRO ANYARIN" role="admin">
        <Box sx={{ maxWidth: 640, mx: 'auto', textAlign: 'center', py: 8 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="outlined" onClick={() => router.push('/personal/gestion-personal')}>
            Volver a gestión de personal
          </Button>
        </Box>
      </AppLayout>
    );
  }

  // ── JSX ─────────────────────────────────────────────────────────────────

  return (
    <AppLayout activePath="/personal/editar-personal" username="ALEJANDRO ANYARIN" role="admin">
      <Box sx={{ maxWidth: 1280 }}>
        {/* Header with Title + Pills */}
        <Box
          sx={{
            position: 'sticky',
            top: '56px',
            zIndex: 20,
            background: 'rgba(244,246,251,0.92)',
            backdropFilter: 'blur(8px)',
            pb: 1.5,
            mb: 2,
            borderBottom: `1px solid rgba(216,222,234,0.7)`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography variant="h2" sx={{ color: colors.primary[600], m: 0 }}>
                Editar Personal
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: colors.neutral.textMuted, mt: 0.25 }}
              >
                Modifica los datos del personal seleccionado.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {SECTION_LABELS.map((_, i) => renderPill(i))}
            </Box>
          </Box>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}
        >
          {error ? (
            <Alert severity="error" sx={{ mb: 1 }}>
              {error}
            </Alert>
          ) : null}
          <Snackbar
            open={Boolean(success)}
            autoHideDuration={5000}
            onClose={() => setSuccess('')}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            sx={{ mt: 7 }}
          >
            <Alert severity="success" onClose={() => setSuccess('')} sx={{ width: '100%', boxShadow: 4 }}>
              {success}
            </Alert>
          </Snackbar>

          {/* ── DIV 1 – Datos Personales ──────────────────────────────── */}
          {renderCard(
            SECTION_IDS[0],
            0,
            'DIV 1 - Datos Personales',
            'Edición de datos',
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 1.75,
              }}
            >
              {renderField('Código', (
                <TextField
                  fullWidth
                  disabled
                  value={form.codigo}
                  onChange={(e) => updateField('codigo', e.target.value)}
                  helperText="Registro existente."
                />
              ))}
              {renderField('Usuario / Login', (
                <TextField
                  fullWidth
                  required
                  disabled
                  placeholder="ej. aanyarin"
                  value={form.usuario}
                  onChange={(e) => updateField('usuario', e.target.value)}
                  inputProps={{ minLength: 5, maxLength: 32 }}
                />
              ))}
              {renderField('Tipo Documento', (
                <FormControl fullWidth size="small">
                  <Select
                    value={form.tipoDocumento}
                    onChange={(e) => updateField('tipoDocumento', e.target.value)}
                  >
                    {tiposDocumento.map((x) => (
                      <MenuItem key={x.value} value={x.value}>
                        {x.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
              {renderField('N° Documento', (
                <TextField
                  fullWidth
                  required
                  placeholder="00000000"
                  value={form.numeroDocumento}
                  onChange={(e) => updateField('numeroDocumento', e.target.value)}
                />
              ))}
              {renderField('Nombres', (
                <TextField
                  fullWidth
                  required
                  placeholder="Nombres"
                  value={form.nombres}
                  onChange={(e) => updateField('nombres', e.target.value)}
                />
              ))}
              {renderField('Apellidos', (
                <TextField
                  fullWidth
                  required
                  placeholder="Apellidos"
                  value={form.apellidos}
                  onChange={(e) => updateField('apellidos', e.target.value)}
                />
              ))}
              {renderField('Fecha Nacimiento', (
                <TextField
                  fullWidth
                  type="date"
                  value={form.fechaNacimiento}
                  onChange={(e) => updateField('fechaNacimiento', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              ))}
              {renderField('Sexo', (
                <FormControl fullWidth size="small">
                  <Select
                    value={form.sexo}
                    onChange={(e) => updateField('sexo', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Seleccione</MenuItem>
                    {sexos.map((x) => (
                      <MenuItem key={x.value} value={x.value}>
                        {x.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
              {renderField('Estado Civil', (
                <FormControl fullWidth size="small">
                  <Select
                    value={form.estadoCivil}
                    onChange={(e) => updateField('estadoCivil', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Seleccione</MenuItem>
                    {estadosCivil.map((x) => (
                      <MenuItem key={x.value} value={x.value}>
                        {x.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
              {renderField('Cargo', (
                <TextField
                  fullWidth
                  placeholder="Cargo"
                  value={form.cargo}
                  onChange={(e) => updateField('cargo', e.target.value)}
                />
              ))}
              {renderField('Área', (
                <TextField
                  fullWidth
                  placeholder="Área"
                  value={form.area}
                  onChange={(e) => updateField('area', e.target.value)}
                />
              ))}
              {renderField('Sede', (
                <FormControl fullWidth size="small">
                  <Select
                    value={form.sede}
                    onChange={(e) => updateField('sede', e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="">Seleccione</MenuItem>
                    {sedes.map((x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
              {renderField('Estado', (
                <FormControl fullWidth size="small">
                  <Select
                    value={form.estado}
                    onChange={(e) => updateField('estado', e.target.value)}
                  >
                    <MenuItem value="Activo">Activo</MenuItem>
                    <MenuItem value="Inactivo">Inactivo</MenuItem>
                  </Select>
                </FormControl>
              ))}
              {renderField('Observaciones', (
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  placeholder="Observaciones internas"
                  value={form.observaciones}
                  onChange={(e) => updateField('observaciones', e.target.value)}
                />
              ), true)}
            </Box>,
          )}

          {/* ── DIV 2 – Contactos ─────────────────────────────────────── */}
          {renderCard(
            SECTION_IDS[1],
            1,
            'DIV 2 - Contactos',
            undefined,
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
                gap: 1.75,
              }}
            >
              {renderField('Email Corporativo', (
                <TextField
                  fullWidth
                  disabled
                  placeholder="correo@empresa.com"
                  value={form.emailCorporativo}
                  onChange={(e) => updateField('emailCorporativo', e.target.value)}
                />
              ))}
              {renderField('Email Personal', (
                <TextField
                  fullWidth
                  placeholder="correo personal"
                  value={form.emailPersonal}
                  onChange={(e) => updateField('emailPersonal', e.target.value)}
                />
              ))}
              {renderField('Celular', (
                <TextField
                  fullWidth
                  placeholder="999 999 999"
                  value={form.celular}
                  onChange={(e) => updateField('celular', e.target.value)}
                />
              ))}
              {renderField('Teléfono', (
                <TextField
                  fullWidth
                  placeholder="056 000000"
                  value={form.telefono}
                  onChange={(e) => updateField('telefono', e.target.value)}
                />
              ))}
              {!editandoUbicacion && form.departamentoNombre ? (
                <Box sx={{ gridColumn: '1 / -1' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1D2939' }}>
                      {form.departamentoNombre} / {form.provinciaNombre} / {form.distritoNombre}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#667085' }}>
                      (Código: {form.ubigeoCodigo || '—'})
                    </Typography>
                    <Button size="small" variant="outlined" onClick={() => setEditandoUbicacion(true)}>
                      Editar ubicación
                    </Button>
                  </Box>
                </Box>
              ) : (
                <>
                  {renderField('Departamento', (
                    <FormControl fullWidth size="small" disabled={loadingDep}>
                      <Select
                        value={form.departamentoId}
                        onChange={(e) => updateField('departamentoId', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccione departamento</MenuItem>
                        {departamentos.map((dep) => (
                          <MenuItem key={dep.id} value={dep.id}>
                            {dep.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                  {renderField('Provincia', (
                    <FormControl
                      fullWidth
                      size="small"
                      disabled={!form.departamentoId || loadingProv}
                    >
                      <Select
                        value={form.provinciaId}
                        onChange={(e) => updateField('provinciaId', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccione provincia</MenuItem>
                        {provincias.map((prov) => (
                          <MenuItem key={prov.id} value={prov.id}>
                            {prov.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                  {renderField('Distrito', (
                    <FormControl
                      fullWidth
                      size="small"
                      disabled={!form.provinciaId || loadingDist}
                    >
                      <Select
                        value={form.distritoId}
                        onChange={(e) => updateField('distritoId', e.target.value)}
                        displayEmpty
                      >
                        <MenuItem value="">Seleccione distrito</MenuItem>
                        {distritos.map((dist) => (
                          <MenuItem key={dist.id} value={dist.id}>
                            {dist.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ))}
                  {form.departamentoNombre && (
                    <Box sx={{ gridColumn: '1 / -1' }}>
                      <Button size="small" onClick={() => setEditandoUbicacion(false)}>
                        Cancelar cambio
                      </Button>
                    </Box>
                  )}
                </>
              )}
              {renderField('Contacto Emergencia', (
                <TextField
                  fullWidth
                  placeholder="Nombre / Celular"
                  value={form.contactoEmergencia}
                  onChange={(e) => updateField('contactoEmergencia', e.target.value)}
                />
              ))}
              {renderField('Dirección', (
                <TextField
                  fullWidth
                  placeholder="Dirección completa"
                  value={form.direccion}
                  onChange={(e) => updateField('direccion', e.target.value)}
                />
              ), true)}
              {renderField('Referencia', (
                <TextField
                  fullWidth
                  placeholder="Referencia de ubicación"
                  value={form.referencia}
                  onChange={(e) => updateField('referencia', e.target.value)}
                />
              ), true)}
            </Box>,
          )}

          {/* ── DIV 3 – Permisos ──────────────────────────────────────── */}
          {renderCard(
            SECTION_IDS[2],
            2,
            'DIV 3 - Permisos',
            `${selectedPermisosCount} seleccionados`,
            <Box>
              {/* Toolbar */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  bgcolor: colors.neutral.background,
                  border: `1px solid ${colors.neutral.border}`,
                  borderRadius: '14px',
                  p: 1.75,
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 700, color: colors.primary[600] }}
                  >
                    Permisos por módulos
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Usa &ldquo;Seleccionar todo&rdquo; general o por grupo para
                    evitar marcar 1 x 1.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Button
                    size="small"
                    variant="contained"
                    disabled={allSelected}
                    onClick={() => handleSelectAllPermissions()}
                    sx={{ borderRadius: '8px', fontSize: 12, minHeight: 32, px: 1.5 }}
                  >
                    {allSelected ? 'Todo seleccionado' : 'Seleccionar todo'}
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    disabled={noneSelected}
                    onClick={() => updateField('permisos', [])}
                    sx={{ borderRadius: '8px', fontSize: 12, minHeight: 32, px: 1.5 }}
                  >
                    Deseleccionar todo
                  </Button>
                </Box>
              </Box>

              {/* Grupos de permisos */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                  gap: 1.75,
                }}
              >
                {Object.entries(PERMISSION_GROUPS).map(([group, items]) => {
                  const { total, selected, all, none } =
                    getGroupPermissionCounts(group);
                  return (
                    <Paper
                      key={group}
                      variant="outlined"
                      sx={{
                        borderRadius: '14px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Cabecera del grupo */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 1,
                          bgcolor: colors.neutral.background,
                          borderBottom: `1px solid ${colors.neutral.border}`,
                          px: 1.75,
                          py: 1.25,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, color: '#263957' }}
                          >
                            {group}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {selected}/{total} seleccionados
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            disabled={all}
                            onClick={() => handleGroupSelectAll(group, true)}
                            sx={{
                              borderRadius: '8px',
                              fontSize: 11,
                              minHeight: 28,
                              px: 1,
                              color: colors.primary[600],
                              borderColor: colors.primary[600],
                            }}
                          >
                            Seleccionar todo
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            disabled={none}
                            onClick={() => handleGroupSelectAll(group, false)}
                            sx={{
                              borderRadius: '8px',
                              fontSize: 11,
                              minHeight: 28,
                              px: 1,
                            }}
                          >
                            Deseleccionar
                          </Button>
                        </Box>
                      </Box>

                      {/* Lista de checkboxes */}
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: 1,
                          p: 1.75,
                        }}
                      >
                        {items.map((item) => {
                          const value = `${group} > ${item}`;
                          const checked = form.permisos.includes(value);
                          return (
                            <FormControlLabel
                              key={value}
                              control={
                                <Checkbox
                                  size="small"
                                  checked={checked}
                                  onChange={() => togglePermission(value)}
                                />
                              }
                              label={
                                <Typography variant="body2" sx={{ fontSize: 13 }}>
                                  {item}
                                </Typography>
                              }
                              sx={{ alignItems: 'center', m: 0 }}
                            />
                          );
                        })}
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            </Box>,
          )}

          {/* ── DIV 4 – Fotografía ────────────────────────────────────── */}
          {renderCard(
            SECTION_IDS[3],
            3,
            'DIV 4 - Fotografía',
            undefined,
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '220px 1fr' },
                gap: 2.25,
                alignItems: 'start',
              }}
            >
              {/* Preview */}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 220,
                  height: 220,
                  border: '2px dashed #aeb8c9',
                  borderRadius: '16px',
                  bgcolor: colors.neutral.background,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: colors.neutral.textMuted,
                  fontSize: 14,
                  overflow: 'hidden',
                }}
              >
                {form.fotografiaPreview ? (
                  <Box
                    component="img"
                    src={form.fotografiaPreview}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '14px' }}
                  />
                ) : (
                  <Box>
                    Vista previa
                    <br />
                    Sin fotografía
                  </Box>
                )}
              </Box>

              {/* Controls */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', fontWeight: 700, mb: 0.5, color: '#344054', fontSize: 13 }}
                >
                  Subir Fotografía
                </Typography>
                <Button variant="outlined" component="label" sx={{ mb: 1.5 }}>
                  Seleccionar archivo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        updateField('fotografiaNombre', file.name);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateField('fotografiaPreview', event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </Button>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    disabled
                    sx={{ borderRadius: '8px' }}
                  >
                    Tomar Foto
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={!form.fotografiaNombre}
                    onClick={() => {
                      updateField('fotografiaNombre', '');
                      updateField('fotografiaPreview', '');
                    }}
                    sx={{ borderRadius: '8px' }}
                  >
                    Quitar Foto
                  </Button>
                </Box>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 1, color: colors.neutral.textMuted }}
                >
                  {form.fotografiaNombre
                    ? `Archivo: ${form.fotografiaNombre}`
                    : 'Recomendado: imagen frontal, fondo claro, formato JPG/PNG.'}
                </Typography>
              </Box>
            </Box>,
          )}

          {/* ── DIV 5 – Recursos ──────────────────────────────────────── */}
          {renderCard(
            SECTION_IDS[4],
            4,
            'DIV 5 - Recursos Asignados',
            undefined,
            <Box>
              {/* Rutas de Ventas */}
              <Box
                sx={{
                  borderBottom: `1px solid ${colors.neutral.border}`,
                  pb: 2,
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: colors.primary[600], fontWeight: 700, mb: 1.5, pb: 1, borderBottom: `1px solid #e7ebf3` }}
                >
                  Rutas de Ventas
                </Typography>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ bgcolor: 'transparent' }}>
                    Mapa de Rutas
                  </InputLabel>
                  <Select
                    value={form.mapaRuta}
                    label="Mapa de Rutas"
                    onChange={(e) => updateField('mapaRuta', e.target.value)}
                  >
                    <MenuItem value="">Seleccione mapa de rutas</MenuItem>
                    {mapasRutas.map((x) => (
                      <MenuItem key={x} value={x}>
                        {x}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Tipo de Personal */}
              <Box
                sx={{
                  borderBottom: `1px solid ${colors.neutral.border}`,
                  pb: 2,
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: colors.primary[600], fontWeight: 700, mb: 1.5, pb: 1, borderBottom: `1px solid #e7ebf3` }}
                >
                  Tipo de Personal
                </Typography>
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.esVendedor}
                        onChange={(e) =>
                          updateField('esVendedor', e.target.checked)
                        }
                      />
                    }
                    label="Vendedor"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.esTransportista}
                        onChange={(e) =>
                          updateField('esTransportista', e.target.checked)
                        }
                      />
                    }
                    label="Transportista"
                  />
                </Box>
              </Box>

              {/* Recursos */}
              <Box>
                <Typography
                  variant="body1"
                  sx={{ color: colors.primary[600], fontWeight: 700, mb: 1.5, pb: 1, borderBottom: `1px solid #e7ebf3` }}
                >
                  Recursos
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', fontWeight: 700, mb: 0.5, color: '#344054', fontSize: 13 }}
                    >
                      Listas de Precios
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        value={form.listasPrecios}
                        onChange={(e) =>
                          updateField('listasPrecios', e.target.value as string[])
                        }
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {selected.map((x) => (
                              <Chip key={x} label={x} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {listasPrecios.map((x) => (
                          <MenuItem key={x} value={x}>
                            <Checkbox
                              size="small"
                              checked={form.listasPrecios.includes(x)}
                            />
                            <ListItemText primary={x} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', fontWeight: 700, mb: 0.5, color: '#344054', fontSize: 13 }}
                    >
                      Almacenes
                    </Typography>
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        value={form.almacenes}
                        onChange={(e) =>
                          updateField('almacenes', e.target.value as string[])
                        }
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {selected.map((x) => (
                              <Chip key={x} label={x} size="small" />
                            ))}
                          </Box>
                        )}
                      >
                        {almacenes.map((x) => (
                          <MenuItem key={x} value={x}>
                            <Checkbox
                              size="small"
                              checked={form.almacenes.includes(x)}
                            />
                            <ListItemText primary={x} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </Box>
            </Box>,
          )}

          {/* ── DIV 6 – Confirmación ──────────────────────────────────── */}
          {renderCard(
            SECTION_IDS[5],
            5,
            'DIV 6 - Confirmación',
            undefined,
            <Box>
              <TextField
                fullWidth
                disabled
                size="small"
                label="Nombre Completo"
                value={`${form.nombres} ${form.apellidos}`.trim() || '-'}
                sx={{ mb: 1.75 }}
              />
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                  gap: 1.75,
                  mb: 1.75,
                }}
              >
                <TextField
                  fullWidth
                  disabled
                  size="small"
                  label="Login"
                  value={form.usuario || '-'}
                />
                <TextField
                  fullWidth
                  disabled
                  size="small"
                  label="Documento"
                  value={
                    form.numeroDocumento
                      ? `${form.tipoDocumento} ${form.numeroDocumento}`
                      : '-'
                  }
                />
              </Box>
              <TextField
                fullWidth
                disabled
                size="small"
                label="Dirección"
                value={form.direccion || '-'}
                sx={{ mb: 2 }}
              />

              {/* Resumen de recursos */}
              <Paper
                variant="outlined"
                sx={{
                  borderRadius: '14px',
                  bgcolor: colors.neutral.background,
                  p: 2,
                  mt: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 700, color: colors.primary[600], mb: 1 }}
                >
                  Recursos Disponibles:
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                  <Typography
                    component="li"
                    variant="body2"
                    sx={{ mb: 0.5 }}
                  >
                    El personal tiene{' '}
                    <strong>
                      {form.esVendedor || form.esTransportista
                        ? [form.esVendedor ? 'Vendedor' : '', form.esTransportista ? 'Transportista' : '']
                            .filter(Boolean)
                            .join(' / ')
                        : '0'}
                    </strong>{' '}
                    tipo(s) seleccionado(s)
                  </Typography>
                  <Typography
                    component="li"
                    variant="body2"
                    sx={{ mb: 0.5 }}
                  >
                    El personal tiene{' '}
                    <strong>{selectedPermisosCount}</strong> permisos en la
                    aplicación
                  </Typography>
                  <Typography
                    component="li"
                    variant="body2"
                    sx={{ mb: 0.5 }}
                  >
                    El personal tiene{' '}
                    <strong>{form.listasPrecios.length}</strong> listas de
                    precios accesibles
                  </Typography>
                  <Typography component="li" variant="body2">
                    El personal tiene{' '}
                    <strong>{form.almacenes.length}</strong> almacenes
                    accesibles
                  </Typography>
                </Box>
              </Paper>
            </Box>,
          )}

          {/* ── Footer actions ────────────────────────────────────────── */}
          <Box
            sx={{
              position: 'sticky',
              bottom: 0,
              background: 'rgba(244,246,251,0.92)',
              backdropFilter: 'blur(8px)',
              borderTop: `1px solid ${colors.neutral.border}`,
              py: 1.5,
              mt: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1.5,
            }}
          >
            <Button
              type="button"
              variant="outlined"
              color="secondary"
              onClick={handleLimpiar}
              disabled={loading}
              sx={{ borderRadius: '10px' }}
            >
              Limpiar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !canSubmit}
              sx={{ borderRadius: '10px' }}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </Box>
        </Box>
      </Box>
    </AppLayout>
  );
}

// ─── Exported wrapper with Suspense boundary for useSearchParams ──────────

import { Suspense } from 'react';

export default function EditarPersonalPage() {
  return (
    <Suspense fallback={
      <AppLayout activePath="/personal/editar-personal" username="ALEJANDRO ANYARIN" role="admin">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <Typography color="text.secondary">Cargando...</Typography>
        </Box>
      </AppLayout>
    }>
      <EditarPersonalForm />
    </Suspense>
  );
}
