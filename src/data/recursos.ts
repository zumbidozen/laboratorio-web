/**
 * LEAD MAGNETS (recursos descargables a cambio del email)
 * El PDF se genera con `npm run descargables` desde la página `printPath`.
 */
export const checklist = {
  id: 'checklist-legionella',
  title: 'Checklist de cumplimiento de Legionella 2027',
  short: 'Checklist de Legionella 2027',
  pitch:
    'Las obligaciones del RD 487/2022 y del RD 3/2023 en dos páginas: frecuencias, puntos, quién toma y analiza, niveles de actuación y fechas hasta 2030. Con plantilla de calendario anual.',
  bullets: [
    'Frecuencias mínimas por tipo de instalación (anexo V)',
    'Qué medir in situ en cada toma y qué analizar en laboratorio',
    'Niveles de actuación y qué hacer ante un positivo',
    'Fechas clave hasta 2030, con su artículo del BOE',
    'Plantilla de calendario de muestreo para todo el año',
  ],
  landing: '/recursos/checklist-legionella/',
  thanks: '/recursos/checklist-legionella/gracias/',
  printPath: '/recursos/checklist-legionella/documento/',
  pdf: '/descargas/checklist-legionella-2027-ensayum.pdf',
  formName: 'checklist-legionella',
} as const;
