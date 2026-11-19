/**
 * RECURSOS DESCARGABLES (lead magnets: PDF a cambio del email)
 * Cada PDF se genera con `npm run descargables` desde la página `printPath`.
 * Para añadir uno: una entrada aquí y su documento en
 * `src/pages/recursos/<id>/documento.astro` (con `DocLayout`). Lo demás sale solo:
 * página del recurso, página de gracias, PDF, vistas previas y bloque de descarga.
 *
 * Este archivo también lo lee `scripts/descargables.mjs`: no importes nada aquí.
 */
export interface Recurso {
  /** Carpeta en /recursos/ y prefijo de las vistas previas en `src/assets/recursos/`. */
  id: string;
  title: string;
  short: string;
  /** Icono de `Icon.astro`. */
  icon: string;
  /** Descripción para buscadores de la página del recurso (70–160 caracteres). */
  description: string;
  /** Resumen bajo el título de la página del recurso. */
  summary: string;
  pitch: string;
  bullets: readonly string[];
  /** Texto del botón del formulario. */
  submit: string;
  /** Páginas del PDF (el script avisa si no coincide). */
  pages: number;
  /** Guías (id) en las que se ofrece este recurso en lugar de la checklist. */
  guias: readonly string[];
  /** Segundo botón de la página de gracias. */
  next: { label: string; href: string };
  landing: string;
  thanks: string;
  printPath: string;
  pdf: string;
  formName: string;
}

const rutas = (id: string, archivo: string) => ({
  landing: `/recursos/${id}/`,
  thanks: `/recursos/${id}/gracias/`,
  printPath: `/recursos/${id}/documento/`,
  pdf: `/descargas/${archivo}`,
  formName: id,
});

export const checklist: Recurso = {
  id: 'checklist-legionella',
  title: 'Checklist de cumplimiento de Legionella 2027',
  short: 'Checklist de Legionella 2027',
  icon: 'clipboard',
  description:
    'Descarga gratis la checklist de cumplimiento de Legionella: frecuencias del RD 487/2022, toma de muestras, niveles de actuación y fechas hasta 2030.',
  summary:
    'Todo lo que exige la norma de Legionella en dos páginas, para tenerlo a mano en cada visita y planificar el año sin dejarte ningún muestreo.',
  pitch:
    'Las obligaciones del RD 487/2022 y del RD 3/2023 en dos páginas: frecuencias, puntos, quién toma y analiza, niveles de actuación y fechas hasta 2030. Con plantilla de calendario anual.',
  bullets: [
    'Frecuencias mínimas por tipo de instalación (anexo V)',
    'Qué medir in situ en cada toma y qué analizar en laboratorio',
    'Niveles de actuación y qué hacer ante un positivo',
    'Fechas clave hasta 2030, con su artículo del BOE',
    'Plantilla de calendario de muestreo para todo el año',
  ],
  submit: 'Descargar la checklist',
  pages: 3,
  guias: [],
  next: { label: 'Calcula tus muestras al año', href: '/calculadora/' },
  ...rutas('checklist-legionella', 'checklist-legionella-2027-ensayum.pdf'),
};

export const registroLegionella: Recurso = {
  id: 'registro-legionella',
  title: 'Plantilla de registro de mantenimiento de Legionella',
  short: 'Plantilla de registro de Legionella',
  icon: 'file',
  description:
    'Descarga gratis la plantilla de registro de Legionella del RD 487/2022: temperaturas, controles, toma de muestras, positivos, paradas y limpiezas.',
  summary:
    'Las hojas que pide el registro del plan de Legionella, listas para imprimir y rellenar: lo que hay que anotar según el RD 487/2022, sin dejarte ningún dato.',
  pitch:
    'Ocho hojas para imprimir y rellenar con lo que el RD 487/2022 obliga a registrar: controles diarios, toma de muestras, positivos, paradas y limpiezas. Cada hoja indica su artículo o anexo.',
  bullets: [
    'Control diario de temperaturas del agua caliente, con los valores exigidos',
    'Hoja de control diario para torres de refrigeración',
    'Registro de toma de muestras con todos los datos del anexo VI',
    'Positivos, componentes deteriorados, paradas y puestas en marcha',
    'Índice de limpiezas y desinfecciones con su certificado',
  ],
  submit: 'Descargar la plantilla',
  pages: 5,
  guias: ['registro-mantenimiento-legionella', 'temperaturas-acs-legionella'],
  next: {
    label: 'Qué anotar y cuánto guardarlo',
    href: '/guias/registro-mantenimiento-legionella/',
  },
  ...rutas('registro-legionella', 'plantilla-registro-legionella-ensayum.pdf'),
};

export const carpetaInspeccion: Recurso = {
  id: 'carpeta-inspeccion-legionella',
  title: 'Carpeta de inspección de Legionella: qué documentos tener listos',
  short: 'Carpeta de inspección de Legionella',
  icon: 'shield',
  description:
    'Descarga gratis la lista de documentos del plan de Legionella que puede revisar la autoridad sanitaria según el RD 487/2022, para tenerlos listos.',
  summary:
    'La lista de documentos que puede pedirte la autoridad sanitaria en una inspección de Legionella, para repasar la carpeta de cada instalación antes de que llegue.',
  pitch:
    'Los documentos del plan de Legionella que puede revisar la autoridad sanitaria, uno a uno y con su artículo del RD 487/2022. Repasa la carpeta de cada instalación y anota qué falta y dónde está.',
  bullets: [
    'El plan: diagnóstico, plano actualizado y los cuatro programas',
    'Registros de controles, tomas de muestras e informes de laboratorio',
    'Certificados de limpieza y desinfección del anexo X',
    'Formación del personal, biocidas, contratos y notificaciones',
    'Qué puede hacer la inspección y qué es infracción grave',
  ],
  submit: 'Descargar la lista',
  pages: 3,
  guias: ['torres-de-refrigeracion-legionella', 'positivo-legionella'],
  next: {
    label: 'Descarga también la plantilla de registro',
    href: '/recursos/registro-legionella/',
  },
  ...rutas('carpeta-inspeccion-legionella', 'carpeta-inspeccion-legionella-ensayum.pdf'),
};

export const checklistPiscinas: Recurso = {
  id: 'checklist-piscinas-madrid',
  title: 'Checklist de temporada de piscinas en Madrid',
  short: 'Checklist de piscinas en Madrid',
  icon: 'waves',
  description:
    'Descarga gratis la checklist de piscinas en Madrid: control inicial, diario y mensual según el RD 742/2013 y el Decreto 99/2024, y qué hacer si algo incumple.',
  summary:
    'Los controles del agua de una piscina de Madrid durante toda la temporada, desde antes de abrir hasta el cierre, con calendario para tus vasos.',
  pitch:
    'Lo que piden el RD 742/2013 y el Decreto 99/2024 a una piscina de Madrid, en orden: antes de abrir, cada día, cada mes y si un resultado sale mal. Con calendario de temporada y registro de incumplimientos.',
  bullets: [
    'Qué controles te tocan y qué comunidades de vecinos están exentas',
    'Antes de abrir: control inicial, filtros y protocolo de autocontrol',
    'Control diario y mensual, con los valores del anexo I',
    'Los seis pasos ante un incumplimiento, con su artículo',
    'Calendario de temporada por vaso y registro de incumplimientos',
  ],
  submit: 'Descargar la checklist',
  pages: 3,
  guias: ['piscinas-decreto-99-2024', 'pseudomonas-piscinas'],
  next: { label: 'Calcula tus controles al año', href: '/calculadora/' },
  ...rutas('checklist-piscinas-madrid', 'checklist-piscinas-madrid-ensayum.pdf'),
};

export const edificiosPrioritarios: Recurso = {
  id: 'checklist-edificios-prioritarios',
  title: 'Checklist de edificios prioritarios del RD 3/2023',
  short: 'Checklist de edificios prioritarios',
  icon: 'building',
  description:
    'Descarga gratis la checklist de edificios prioritarios del RD 3/2023: si te aplica, control en grifo con Legionella, análisis al año, SINAC y fechas clave.',
  summary:
    'Cómo saber si tu edificio es prioritario según el RD 3/2023 y qué te toca: control en grifo con Legionella, Plan Sanitario del Agua y notificación en SINAC.',
  pitch:
    'Las obligaciones de hospitales, residencias, hoteles y otros grandes edificios con el agua de consumo, en dos páginas: umbrales, parámetros, número de análisis, plazos de SINAC y fechas. Con calendario de muestreo.',
  bullets: [
    'Qué edificios son prioritarios y a partir de qué tamaño',
    'Parámetros del control en grifo y análisis al año según tus puntos de agua',
    'Plazos para notificar en SINAC, con y sin incumplimiento',
    'Plan Sanitario del Agua y fechas clave',
    'Calendario para cuadrarlo con la Legionella del RD 487/2022',
  ],
  submit: 'Descargar la checklist',
  pages: 2,
  guias: ['edificios-prioritarios-rd-3-2023', 'control-en-grifo-rd-3-2023'],
  next: { label: 'Calcula tus muestras al año', href: '/calculadora/' },
  ...rutas('checklist-edificios-prioritarios', 'checklist-edificios-prioritarios-ensayum.pdf'),
};

/** Todos los recursos con formulario, en el orden en que se muestran en /recursos/. */
export const recursos: readonly Recurso[] = [
  checklist,
  registroLegionella,
  carpetaInspeccion,
  checklistPiscinas,
  edificiosPrioritarios,
];

/** Recurso por id; si no existe, la checklist. */
export const recursoPorId = (id?: string): Recurso =>
  recursos.find((r) => r.id === id) ?? checklist;

/** Recurso que se ofrece en una guía: el suyo si tiene, y si no la checklist. */
export const recursoDeGuia = (guiaId: string): Recurso =>
  recursos.find((r) => r.guias.includes(guiaId)) ?? checklist;

/**
 * Hojas de una página que se descargan sin formulario. Su documento está en
 * `src/pages/recursos/<id>/documento.astro` y `npm run descargables` genera el PDF.
 */
export const hojasLibres = [
  {
    id: 'protocolo-positivo-legionella',
    title: 'Protocolo ante un positivo de Legionella',
    description:
      'Hoja en PDF con los pasos ante un positivo de Legionella según el RD 487/2022: niveles de actuación, medidas, nuevo análisis y registro.',
    text: 'Los seis pasos y los niveles de actuación del anexo VIII en una hoja, para tenerla en la sala técnica.',
    icon: 'bell',
    printPath: '/recursos/protocolo-positivo-legionella/documento/',
    pdf: '/descargas/protocolo-positivo-legionella-ensayum.pdf',
  },
  {
    id: 'calendario-normativo',
    title: 'Calendario normativo de aguas hasta 2030',
    description:
      'Calendario en PDF con las fechas clave de la normativa de Legionella, agua de consumo y biocidas hasta 2030, cada una con su fuente en el BOE.',
    text: 'Las fechas de Legionella, agua de consumo y biocidas hasta 2030, con su fuente, para imprimir.',
    icon: 'clock',
    printPath: '/recursos/calendario-normativo/documento/',
    pdf: '/descargas/calendario-normativo-ensayum.pdf',
  },
] as const;

/** Lo que se descarga sin formulario, para el índice /recursos/. */
export const descargasLibres = [
  ...hojasLibres.map((h) => ({
    title: h.title,
    text: h.text,
    href: h.pdf,
    icon: h.icon,
    cta: 'Descargar el PDF',
  })),
  {
    title: 'Informe de ejemplo',
    text: 'Un informe de Legionella en co-marca, con cada campo explicado. Los datos son ficticios.',
    href: '/informe-de-ejemplo/',
    icon: 'file',
    cta: 'Ver y descargar',
  },
  {
    title: 'Hoja de cadena de custodia',
    text: 'La hoja que acompaña a las muestras enviadas sin pedido en el portal, con los campos de Legionella.',
    href: '/cadena-de-custodia/',
    icon: 'truck',
    cta: 'Ver y descargar',
  },
];
