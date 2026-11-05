/**
 * FRECUENCIAS MÍNIMAS DE MUESTREO (para la calculadora y su tabla de referencia)
 * ------------------------------------------------------------------
 * Fuente principal: RD 487/2022 (texto consolidado con el RD 614/2024), anexo V, tablas 2 y 3.
 * Son los mínimos cuando el titular sigue un plan de prevención y control (PPCL). Con un plan
 * sanitario frente a Legionella (PSL) o por criterio de la autoridad sanitaria pueden cambiar.
 * Consultado en el BOE el 5 de noviembre de 2026. Si cambia la norma, se cambia aquí.
 */

export const BOE = {
  rd487: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-10297',
  rd487AnexoV: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-10297#av',
  rd3: 'https://www.boe.es/buscar/act.php?id=BOE-A-2023-628',
  rd742: 'https://www.boe.es/buscar/act.php?id=BOE-A-2013-10580',
  faqSanidad:
    'https://www.sanidad.gob.es/areas/sanidadAmbiental/calidadAguas/legionelosis/docs/preguntasRespuestasLegionella_7082024.pdf',
} as const;

/** Veces al año de cada frecuencia. */
export const perYear = {
  mensual: 12,
  trimestral: 4,
  semestral: 2,
  anual: 1,
} as const;

/**
 * RD 487/2022, anexo V, tabla 3: frecuencia de Legionella y de los parámetros
 * que se analizan en laboratorio (los diarios y semanales se miden in situ).
 */
export const tabla3 = [
  {
    id: 'sanitaria',
    instalacion: 'Agua sanitaria (agua caliente y fría de consumo)',
    legionella: 'trimestral',
    aerobios: 'trimestral',
    hierro: 'trimestral',
    nota: 'Hierro solo si la instalación tiene partes metálicas con hierro. Aerobios y hierro se toman en el mismo acto y punto que la Legionella.',
  },
  {
    id: 'torre',
    instalacion: 'Torres de refrigeración y condensadores evaporativos',
    legionella: 'mensual',
    aerobios: 'trimestral',
    hierro: 'mensual',
    nota: 'Además, conductividad mensual. Al menos un punto por muestreo: retorno o, si no, depósito o balsa.',
  },
  {
    id: 'spa',
    instalacion: 'Agua climatizada con aerosolización (spa, hidromasaje)',
    legionella: 'mensual',
    aerobios: 'mensual',
    hierro: null,
    nota: 'Con recirculación, dos puntos por muestreo; sin recirculación, una muestra del vaso. Si es una piscina de uso público, se aplica además el RD 742/2013.',
  },
  {
    id: 'pulverizacion',
    instalacion: 'Enfriamiento evaporativo por pulverización',
    legionella: 'semestral',
    aerobios: 'semestral',
    hierro: null,
    nota: '',
  },
  {
    id: 'termal',
    instalacion: 'Agua minero-medicinal o termal',
    legionella: 'mensual',
    aerobios: 'trimestral',
    hierro: null,
    nota: '',
  },
  {
    id: 'recirculacion',
    instalacion:
      'Otras con depósito y recirculación (fuentes ornamentales y lavado de vehículos con recirculación, humectadores de evaporación)',
    legionella: 'anual',
    aerobios: 'semestral',
    hierro: null,
    nota: 'Ejemplos según la clasificación del anexo IV.',
  },
  {
    id: 'sin-recirculacion',
    instalacion:
      'Otras sin recirculación (riego por aspersión, fuentes sin recirculación, humectadores de atomización, sistemas contra incendios)',
    legionella: 'anual',
    aerobios: null,
    hierro: null,
    nota: 'Ejemplos según la clasificación del anexo IV.',
  },
] as const;

/**
 * RD 487/2022, anexo V, tabla 2: puntos terminales que hay que muestrear en cada
 * muestreo de agua sanitaria de uso colectivo, según los puntos terminales que tenga.
 * `max` es el límite superior del tramo. Por encima de 350, se aumenta proporcionalmente.
 */
export const tabla2 = [
  { max: 10, caliente: 1, fria: 1 },
  { max: 20, caliente: 3, fria: 1 },
  { max: 50, caliente: 4, fria: 1 },
  { max: 100, caliente: 4, fria: 2 },
  { max: 150, caliente: 5, fria: 2 },
  { max: 200, caliente: 6, fria: 3 },
  { max: 250, caliente: 7, fria: 3 },
  { max: 300, caliente: 8, fria: 4 },
  { max: 350, caliente: 9, fria: 4 },
] as const;

/**
 * RD 3/2023, anexo II, tabla 13: análisis de control en grifo al año en un edificio
 * prioritario, según sus puntos de acceso al agua. Incluye Legionella en edificios prioritarios.
 */
export const tabla13 = [
  { max: 49, analisis: 2 },
  { max: 99, analisis: 4 },
  { max: 200, analisis: 6 },
] as const;

/** Edificios prioritarios (RD 3/2023, anexo VIII, tabla 20). */
export const edificiosPrioritarios = [
  'Hospitales y clínicas: 200 camas o con unidades de cuidados aumentados',
  'Residencias: 200 camas',
  'Hoteles y similares: 500 plazas',
  'Centros de enseñanza: 1.000 plazas o con internado de más de 200 camas',
  'Instalaciones deportivas cubiertas: 3.000 m²',
  'Centros penitenciarios: 1.000 plazas',
] as const;
