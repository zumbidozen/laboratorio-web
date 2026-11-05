/**
 * Textos y versiones en Markdown de las páginas de referencia que no son colecciones:
 * frecuencias de análisis, glosario, calendario normativo, planes, «Cómo trabajamos»
 * y las páginas por norma. Los usan las propias páginas, las URLs *.md y /llms-full.txt.
 */
import type { CollectionEntry } from 'astro:content';
import { site, absoluteUrl } from '@/config/site';
import {
  BOE,
  tabla2,
  tabla3,
  tabla13,
  edificiosPrioritarios,
  piscinas,
  piscinasParametros,
} from '@/data/frecuencias';
import { hitos } from '@/data/calendario';
import { steps, turnaround, highlights } from '@/data/home';
import { formatDate, guiaUrl, isoDate, normaUrl } from '@/lib/content';

const cap = (f: string | null) => (f ? f.charAt(0).toUpperCase() + f.slice(1) : '—');
const table = (head: string[], rows: (string | number)[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n');

/* ---------- Frecuencias de análisis ---------- */

export const frecuencias = {
  href: '/frecuencias-de-analisis/',
  title: 'Frecuencias de análisis de agua: tabla resumen',
  description:
    'Cada cuánto analizar Legionella, el control en grifo y las piscinas según el RD 487/2022, el RD 3/2023 y el RD 742/2013, con cada dato enlazado al BOE.',
  summary:
    'Legionella cada mes en torres y spas y cada trimestre en agua sanitaria; control en grifo de 2 a 6 veces al año o más en edificios prioritarios; y en piscinas, control inicial antes de abrir y control mensual en laboratorio.',
  updated: new Date('2026-11-05'),
  keyFacts: [
    {
      id: 'dato-torres',
      text: 'Torres de refrigeración: Legionella y hierro cada mes, aerobios cada trimestre.',
      see: 'legionella-torre',
    },
    {
      id: 'dato-agua-sanitaria',
      text: 'Agua sanitaria caliente y fría: Legionella y aerobios cada trimestre.',
      see: 'legionella-sanitaria',
    },
    {
      id: 'dato-spa',
      text: 'Spa e hidromasaje: Legionella y aerobios cada mes.',
      see: 'legionella-spa',
    },
    {
      id: 'dato-tras-desinfeccion',
      text: 'Tras una limpieza y desinfección: nueva Legionella entre 15 y 30 días después.',
      see: 'tras-desinfeccion',
    },
    {
      id: 'dato-control-en-grifo',
      text: 'Edificios prioritarios: de 2 a 6 controles en grifo al año, o más con más de 200 puntos de acceso.',
      see: 'control-en-grifo',
    },
    {
      id: 'dato-piscinas',
      text: 'Piscinas: control inicial en la quincena antes de abrir y control periódico al menos una vez al mes.',
      see: 'piscinas',
    },
  ],
  faq: [
    {
      q: '¿Estas frecuencias son obligatorias en todos los casos?',
      a: 'Son los mínimos cuando la instalación sigue un plan de prevención y control (PPCL). Con un plan sanitario frente a Legionella (PSL) o por criterio de la autoridad sanitaria pueden cambiar.',
    },
    {
      q: '¿Cuántos puntos se muestrean en agua caliente sanitaria?',
      a: 'El depósito, el acumulador y el retorno, si existen, más los puntos terminales que marca la tabla 2 del anexo V del RD 487/2022. Por ejemplo, con 21 a 50 puntos terminales de agua caliente se muestrean 4.',
    },
    {
      q: '¿Cada cuánto se analiza el agua de una piscina de uso público?',
      a: 'Control inicial en la quincena anterior a la apertura, control de rutina cada día de uso (in situ) y control periódico en laboratorio al menos una vez al mes, según el anexo III del RD 742/2013.',
    },
    {
      q: '¿Qué edificios hacen control en grifo con Legionella?',
      a: 'Los edificios prioritarios del anexo VIII del RD 3/2023: hospitales y residencias de 200 camas, hoteles de 500 plazas, centros de enseñanza de 1.000 plazas, instalaciones deportivas cubiertas de 3.000 m² y centros penitenciarios de 1.000 plazas, entre otros casos.',
    },
  ],
  sources: [
    { title: 'Real Decreto 487/2022, anexo V (texto consolidado). BOE', url: BOE.rd487AnexoV },
    { title: 'Real Decreto 3/2023, anexos II y VIII (texto consolidado). BOE', url: BOE.rd3 },
    { title: 'Real Decreto 742/2013, anexos I y III (texto consolidado). BOE', url: BOE.rd742 },
    {
      title: 'Preguntas y respuestas sobre el RD 487/2022. Ministerio de Sanidad (agosto de 2024)',
      url: BOE.faqSanidad,
    },
  ],
};

/** Tablas de frecuencias en Markdown (con el ancla de cada bloque en la web). */
export function frecuenciasTablasMd(): string {
  const url = absoluteUrl(frecuencias.href);
  const tramo = (i: number) =>
    i === 0 ? `Hasta ${tabla2[0].max}` : `${tabla2[i - 1].max + 1} a ${tabla2[i].max}`;
  return [
    `## Legionella, aerobios y hierro (RD 487/2022, anexo V, tabla 3)`,
    '',
    `Enlace: ${url}#legionella. Mínimos con un plan de prevención y control (PPCL). Fuente: ${BOE.rd487AnexoV}`,
    '',
    table(
      ['Instalación', 'Legionella', 'Aerobios', 'Hierro', 'Nota'],
      tabla3.map((r) => [
        r.instalacion,
        cap(r.legionella),
        cap(r.aerobios),
        cap(r.hierro),
        r.nota || '—',
      ]),
    ),
    '',
    `## Puntos de muestreo en agua sanitaria (RD 487/2022, anexo V, tabla 2)`,
    '',
    `Enlace: ${url}#puntos-de-muestreo. En cada muestreo: depósito, acumulador y retorno, si existen, más estos puntos terminales. En hoteles y residencias, todos los puntos de una habitación cuentan como uno.`,
    '',
    table(
      ['Puntos terminales', 'Agua caliente', 'Agua fría'],
      [
        ...tabla2.map((r, i) => [tramo(i), r.caliente, r.fria]),
        ['Más de 350', 'Proporcional', 'Proporcional'],
      ],
    ),
    '',
    `## Después de una limpieza y desinfección (RD 487/2022)`,
    '',
    `Enlace: ${url}#tras-desinfeccion. Nueva determinación de Legionella en puntos representativos entre 15 y 30 días después. En torres, limpieza y desinfección preventiva al menos dos veces al año.`,
    '',
    `## Control en grifo en edificios prioritarios (RD 3/2023, anexo II, tabla 13)`,
    '',
    `Enlace: ${url}#control-en-grifo. Incluye E. coli, recuento de colonias a 22 °C, color, turbidez, pH, conductividad, cloro libre residual, plomo y, en edificios prioritarios, Legionella. Fuente: ${BOE.rd3}`,
    '',
    table(
      ['Puntos de acceso al agua', 'Análisis al año'],
      [
        ['Menos de 50', tabla13[0].analisis],
        ['De 50 a 100', tabla13[1].analisis],
        ['De 100 a 200', tabla13[2].analisis],
        ['Más de 200', '6 por los primeros 200 y 1 más por cada 100 o fracción'],
      ],
    ),
    '',
    'Edificios prioritarios (anexo VIII):',
    '',
    ...edificiosPrioritarios.map((e) => `- ${e}`),
    '',
    `## Piscinas de uso público (RD 742/2013, anexo III)`,
    '',
    `Enlace: ${url}#piscinas. En laboratorio: ${piscinasParametros}. En vasos climatizados con aerosolización, además Legionella (menos de 100 UFC/L). En Madrid, el Decreto 99/2024 ya no exige Staphylococcus aureus. Fuente: ${BOE.rd742AnexoIII}`,
    '',
    table(
      ['Control', 'Cuándo', 'Dónde'],
      piscinas.map((r) => [r.control, r.cuando, r.donde]),
    ),
  ].join('\n');
}

export function frecuenciasMd(): string {
  const f = frecuencias;
  const url = absoluteUrl(f.href);
  return page(f.title, f.summary, f.href, f.updated, [
    '## En resumen',
    '',
    ...f.keyFacts.map((k) => `- ${k.text} ([enlace](${url}#${k.id}))`),
    '',
    frecuenciasTablasMd(),
    '',
    '## Fuentes',
    '',
    ...f.sources.map((s) => `- [${s.title}](${s.url})`),
    '',
    faqMd(f.faq),
  ]);
}

/* ---------- Calendario normativo ---------- */

export const calendarioPage = {
  href: '/calendario-normativo/',
  title: 'Calendario normativo de Legionella y agua de consumo',
  summary:
    'La gran fecha es el 1 de enero de 2030: desde entonces la toma de muestras de Legionella solo podrá hacerla una entidad acreditada. Antes, en 2028, se exige la acreditación a más laboratorios de agua de consumo.',
};

export function hitosMd(list = hitos): string {
  return list
    .map(
      (h) =>
        `- **${formatDate(new Date(h.date))}. ${h.title}.** ${h.text} Afecta a: ${h.who.toLowerCase()}. Fuente: [${h.source}](${h.sourceUrl})`,
    )
    .join('\n');
}

export function calendarioMd(): string {
  const c = calendarioPage;
  return page(c.title, c.summary, c.href, frecuencias.updated, [hitosMd()]);
}

/* ---------- Glosario ---------- */

export function glosarioMd(terms: CollectionEntry<'glosario'>[]): string {
  const url = absoluteUrl('/glosario/');
  return page(
    'Glosario de análisis de agua',
    'Los términos que aparecen en las normas, en los planes de control y en los informes, explicados en una o dos frases.',
    '/glosario/',
    undefined,
    terms.map(
      (t) =>
        `- **${t.data.term}** ([enlace](${url}#${t.id})): ${t.data.def}${t.data.link ? ` Más: ${absoluteUrl(t.data.link)}` : ''}`,
    ),
  );
}

/* ---------- Planes ---------- */

export function planesMd(planes: CollectionEntry<'planes'>[]): string {
  return page(
    'Planes por cuota para Legionella, torres y piscinas',
    'Agrupamos los análisis que exige la norma para cada tipo de instalación en una cuota fija, con registro digital y alertas. La cuota exacta depende del número de instalaciones y de puntos.',
    '/planes/',
    undefined,
    [
      'No publicamos precios: la tarifa es por volumen y se da en la propuesta.',
      '',
      ...planes.flatMap((p) => [
        `## ${p.data.name}`,
        '',
        `- Para quién: ${p.data.audience}`,
        `- Cuota: ${p.data.billing}`,
        ...p.data.includes.map((i) => `- Incluye: ${i}`),
        ...p.data.soon.map((s) => `- Próximamente (${s.from}): ${s.item}`),
        '',
      ]),
    ],
  );
}

/* ---------- Cómo trabajamos ---------- */

export function comoTrabajamosMd(): string {
  return page(
    'Cómo trabajamos: portal, API, plazos e informes',
    'Hacemos los análisis que marca la norma; lo que cambia es todo lo que los rodea: pedido, seguimiento, informe y factura.',
    '/como-trabajamos/',
    undefined,
    [
      '## Del pedido al informe',
      '',
      ...steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`),
      '',
      '## Plazos máximos, firmados por contrato',
      '',
      'En días naturales desde la recepción válida de la muestra.',
      '',
      table(
        ['Análisis', 'Plazo máximo'],
        turnaround.map((t) => [t.analysis, t.time]),
      ),
      '',
      '## Ventajas',
      '',
      ...highlights.map((h) => `- **${h.title}.** ${h.text}`),
      '',
      '## Acreditación',
      '',
      site.accreditation.ownEnac
        ? `Laboratorio acreditado por ENAC (n.º ${site.accreditation.enacNumber}).`
        : 'Los ensayos que requieren acreditación los realiza y firma un laboratorio acreditado por ENAC, identificado en cada informe.',
    ],
  );
}

/* ---------- Páginas por norma ---------- */

export function normaMd(
  n: CollectionEntry<'normativa'>,
  guias: CollectionEntry<'guias'>[],
  servicios: Pick<CollectionEntry<'servicios'>, 'id' | 'data'>[],
): string {
  const d = n.data;
  const fechas = hitos.filter((h) => d.calendar.some((c) => h.source.includes(c)));
  return page(d.title, d.summary, normaUrl(n), d.updated, [
    `- Norma: ${d.norma}`,
    `- Texto consolidado en el BOE: ${d.boe}`,
    '',
    '## Lo esencial',
    '',
    ...d.keyPoints.map((k) => `- ${k}`),
    '',
    d.frequencies.length
      ? `## Frecuencias\n\nTabla completa con fuentes: ${absoluteUrl(frecuencias.href)}`
      : '',
    '',
    fechas.length ? `## Fechas clave\n\n${hitosMd(fechas)}\n` : '',
    '## Guías',
    '',
    ...guias.map((g) => `- [${g.data.title}](${absoluteUrl(guiaUrl(g))}): ${g.data.summary}`),
    '',
    '## Análisis relacionados',
    '',
    ...servicios.map(
      (s) =>
        `- [${s.data.name}](${absoluteUrl(`/servicios/${s.id}/`)}): ${s.data.summary}${s.data.status === 'proximamente' ? ` (próximamente${s.data.availableFrom ? `, ${s.data.availableFrom}` : ''})` : ''}`,
    ),
    '',
    faqMd(d.faq),
  ]);
}

/* ---------- Comunes ---------- */

function faqMd(faq: { q: string; a: string }[]): string {
  if (!faq.length) return '';
  return [
    '## Preguntas frecuentes',
    '',
    ...faq.flatMap(({ q, a }) => [`### ${q}`, '', a, '']),
  ].join('\n');
}

function page(
  title: string,
  summary: string,
  href: string,
  updated: Date | undefined,
  body: string[],
): string {
  const head = [`# ${title}`, '', `> ${summary}`, '', `- URL: ${absoluteUrl(href)}`];
  if (updated) head.push(`- Actualizado: ${isoDate(updated)}`);
  return (
    [...head, '', ...body]
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  );
}
