/**
 * Versión en Markdown de cada página de contenido.
 * La usan /llms.txt, /llms-full.txt y las URLs *.md (p. ej. /servicios/legionella.md),
 * pensadas para asistentes de IA y agentes que leen texto plano.
 */
import type { CollectionEntry } from 'astro:content';
import { site, absoluteUrl } from '@/config/site';
import { servicioUrl, sectorUrl, guiaUrl, isoDate } from '@/lib/content';

type Entry = CollectionEntry<'servicios'> | CollectionEntry<'sectores'> | CollectionEntry<'guias'>;

function urlOf(e: Entry) {
  if (e.collection === 'servicios') return servicioUrl(e);
  if (e.collection === 'sectores') return sectorUrl(e);
  return guiaUrl(e);
}

export function entryToMarkdown(e: Entry): string {
  const d = e.data;
  const lines: string[] = [`# ${d.title}`, '', `> ${d.summary}`, ''];
  lines.push(`- URL: ${absoluteUrl(urlOf(e))}`);
  lines.push(`- Actualizado: ${isoDate(d.updated)}`);
  if (e.collection === 'servicios') {
    const s = e.data;
    if (s.status === 'proximamente')
      lines.push(`- Disponibilidad: próximamente${s.availableFrom ? ` (${s.availableFrom})` : ''}`);
    if (s.regulations.length) lines.push(`- Normativa: ${s.regulations.join(', ')}`);
    if (s.audience) lines.push(`- Para quién: ${s.audience}`);
    if (s.includes.length) {
      lines.push('', '## Qué incluye', '', ...s.includes.map((i) => `- ${i}`));
    }
  }
  if (e.collection === 'guias') {
    lines.push('', '## En resumen', '', ...e.data.keyPoints.map((k) => `- ${k}`));
  }
  lines.push('', (e.body ?? '').trim());
  if (e.collection === 'guias') {
    lines.push('', '## Fuentes', '', ...e.data.sources.map((s) => `- [${s.title}](${s.url})`));
  }
  if (d.faq.length) {
    lines.push('', '## Preguntas frecuentes', '');
    for (const { q, a } of d.faq) lines.push(`### ${q}`, '', a, '');
  }
  return lines.join('\n').trim() + '\n';
}

export function markdownResponse(body: string) {
  return new Response(body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Robots-Tag': site.indexable ? 'all' : 'noindex',
    },
  });
}
