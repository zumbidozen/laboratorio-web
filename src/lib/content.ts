/** Ayudas para leer el contenido publicado (sin borradores) y ordenado. */
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

export const servicioUrl = (e: CollectionEntry<'servicios'>) => `/servicios/${e.id}/`;
export const sectorUrl = (e: CollectionEntry<'sectores'>) => `/sectores/${e.id}/`;
export const guiaUrl = (e: CollectionEntry<'guias'>) => `/guias/${e.id}/`;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
