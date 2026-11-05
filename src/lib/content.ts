/** Ayudas para leer el contenido publicado (sin borradores) y ordenado. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

const published = <T extends { data: { draft: boolean } }>(e: T) =>
  import.meta.env.DEV || !e.data.draft;

export async function getServicios() {
  const all = await getCollection('servicios', published);
  return all.sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name));
}

export async function getSectores() {
  const all = await getCollection('sectores', published);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getGuias() {
  const all = await getCollection('guias', published);
  return all.sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf());
}

export async function getFaq() {
  const all = await getCollection('faq');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getPlanes() {
  const all = await getCollection('planes');
  return all.sort((a, b) => a.data.order - b.data.order);
}

export async function getGlosario() {
  const all = await getCollection('glosario');
  return all.sort((a, b) => a.data.term.localeCompare(b.data.term, 'es'));
}

export async function getNormativa() {
  const all = await getCollection('normativa', published);
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Guías de una norma (por etiqueta), de la más reciente a la más antigua. */
export function guiasDeNorma(
  norma: CollectionEntry<'normativa'>,
  guias: CollectionEntry<'guias'>[],
) {
  return guias.filter((g) => g.data.tags.some((t) => norma.data.guideTags.includes(t)));
}

export const servicioUrl = (e: CollectionEntry<'servicios'>) => `/servicios/${e.id}/`;
export const sectorUrl = (e: CollectionEntry<'sectores'>) => `/sectores/${e.id}/`;
export const guiaUrl = (e: CollectionEntry<'guias'>) => `/guias/${e.id}/`;
export const normaUrl = (e: CollectionEntry<'normativa'>) => `/normativa/${e.id}/`;

/** Imagen para redes propia de una página (la genera `npm run og`), si existe. */
export function ogImageFor(folder: string, id: string): string | undefined {
  const path = `/og/${folder}/${id}.png`;
  return existsSync(join(process.cwd(), 'public', path)) ? path : undefined;
}

export const formatDate = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Qué casilla de «¿Qué analizas?» del formulario de contacto corresponde a cada servicio.
 * Se usa para llegar a «Pedir tarifa» con el análisis ya marcado.
 */
export const analisisDeServicio: Record<string, string> = {
  legionella: 'Legionella',
  'legionella-qpcr': 'Legionella',
  'planes-legionella': 'Legionella',
  'agua-de-consumo': 'Agua de consumo',
  piscinas: 'Piscinas',
  'torres-y-calderas': 'Torres y calderas',
  'otros-analisis': 'Otros',
};

/** Texto en minúsculas, sin tildes ni signos, unido con guiones (para anclas estables). */
export const slugify = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export interface KeyPoint {
  /** Ancla estable: #dato-<primeras palabras>. */
  id: string;
  text: string;
  source?: { title: string; url: string };
}

/** Ideas clave de una guía con su ancla y, si acaban en [n], su fuente. */
export function keyPoints(e: CollectionEntry<'guias'>): KeyPoint[] {
  const used = new Set<string>();
  return e.data.keyPoints.map((raw) => {
    const n = Number(raw.match(/\[(\d+)\]\s*$/)?.[1] ?? 0);
    const text = raw.replace(/\s*\[\d+\]\s*$/, '');
    let id = 'dato-' + slugify(text.split(/\s+/).slice(0, 6).join(' ')).slice(0, 48);
    while (used.has(id)) id += '-2';
    used.add(id);
    return { id, text, source: n ? e.data.sources[n - 1] : undefined };
  });
}
