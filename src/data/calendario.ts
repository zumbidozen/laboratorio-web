/**
 * CALENDARIO NORMATIVO (página /calendario-normativo/)
 * Fechas verificadas en el BOE (textos consolidados) y en la FAQ del Ministerio de Sanidad
 * el 5 de noviembre de 2026. Cada entrada lleva su fuente.
 */
import { BOE } from '@/data/frecuencias';

export interface Hito {
  /** AAAA-MM-DD */
  date: string;
  title: string;
  text: string;
  source: string;
  sourceUrl: string;
  /** Afecta sobre todo a… */
  who: 'Titulares' | 'Mantenedores' | 'Laboratorios' | 'Edificios prioritarios';
}

export const hitos: Hito[] = [
  {
    date: '2023-01-02',
    title: 'Entra en vigor el RD 487/2022',
    text: 'Nuevo marco de prevención y control de la legionelosis: plan de prevención y control (PPCL) o plan sanitario (PSL) para cada instalación de riesgo.',
    source: 'RD 487/2022',
    sourceUrl: BOE.rd487,
    who: 'Titulares',
  },
  {
    date: '2023-01-12',
    title: 'Entra en vigor el RD 3/2023',
    text: 'Nuevos criterios de calidad del agua de consumo, control en grifo y frecuencias del anexo II.',
    source: 'RD 3/2023',
    sourceUrl: BOE.rd3,
    who: 'Titulares',
  },
  {
    date: '2024-07-04',
    title: 'Entra en vigor el RD 614/2024',
    text: 'Modifica el RD 487/2022. Entre otros cambios, exige que la toma de muestras de Legionella la haga una entidad acreditada, con periodo transitorio hasta 2030.',
    source: 'RD 614/2024 y art. 11.5 del RD 487/2022',
    sourceUrl: BOE.rd487,
    who: 'Mantenedores',
  },
  {
    date: '2025-01-02',
    title: 'Cultivo de Legionella en laboratorio acreditado',
    text: 'El análisis de Legionella por cultivo debe hacerlo un laboratorio acreditado según UNE-EN ISO/IEC 17025. Ya es obligatorio.',
    source: 'RD 487/2022, art. 12.1 y disposición transitoria 2.ª',
    sourceUrl: BOE.rd487,
    who: 'Laboratorios',
  },
  {
    date: '2025-01-02',
    title: 'Plan Sanitario del Agua en edificios prioritarios',
    text: 'Los edificios prioritarios debían tener documentado su Plan Sanitario del Agua.',
    source: 'RD 3/2023, disposición adicional 9.ª',
    sourceUrl: BOE.rd3,
    who: 'Edificios prioritarios',
  },
  {
    date: '2025-07-01',
    title: 'Planes de Legionella adaptados al RD 614/2024',
    text: 'Los PPCL y PSL existentes debían estar actualizados a la nueva redacción.',
    source: 'RD 487/2022, disposición transitoria 5.ª',
    sourceUrl: BOE.rd487,
    who: 'Titulares',
  },
  {
    date: '2027-01-02',
    title: 'Medidas correctoras del Plan Sanitario del Agua',
    text: 'Los edificios prioritarios deben tener aplicadas las medidas correctoras que salieron de su Plan Sanitario del Agua.',
    source: 'RD 3/2023, disposición adicional 9.ª',
    sourceUrl: BOE.rd3,
    who: 'Edificios prioritarios',
  },
  {
    date: '2028-01-02',
    title: 'Laboratorios de agua de consumo acreditados',
    text: 'Los laboratorios que analizan entre 300 y 5.000 muestras de agua de consumo al año deben estar acreditados para los parámetros del RD 3/2023.',
    source: 'RD 3/2023, disposición adicional 8.ª',
    sourceUrl: BOE.rd3,
    who: 'Laboratorios',
  },
  {
    date: '2030-01-01',
    title: 'Toma de muestras de Legionella por entidad acreditada',
    text: 'Termina el periodo transitorio: la toma de muestras para cultivo de Legionella solo podrá hacerla una entidad acreditada para la toma. Hasta entonces puede hacerla personal de la propia empresa siguiendo el anexo VI.',
    source: 'RD 487/2022, art. 11.5 y disposición transitoria 6.ª; FAQ de Sanidad',
    sourceUrl: BOE.faqSanidad,
    who: 'Mantenedores',
  },
  {
    date: '2030-01-02',
    title: 'Toma de muestras de agua de consumo acreditada',
    text: 'Antes de esta fecha, la toma de muestras de agua de consumo (salvo el control operacional y de rutina) debe hacerla una entidad acreditada.',
    source: 'RD 3/2023, disposición adicional 8.ª',
    sourceUrl: BOE.rd3,
    who: 'Mantenedores',
  },
];
