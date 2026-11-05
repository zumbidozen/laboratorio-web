/** /llms-full.txt — todo el contenido del sitio en un solo Markdown, para IA. */
import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { getServicios, getSectores, getGuias, getFaq } from '@/lib/content';
import { entryToMarkdown } from '@/lib/markdown';

export const GET: APIRoute = async () => {
  const [servicios, sectores, guias, faq] = await Promise.all([
    getServicios(),
    getSectores(),
    getGuias(),
    getFaq(),
  ]);
  const parts = [
    `# ${site.name}\n\n> ${site.description}\n`,
    ...servicios.map(entryToMarkdown),
    ...sectores.map(entryToMarkdown),
    ...guias.map(entryToMarkdown),
    '# Preguntas frecuentes\n\n' + faq.map((f) => `## ${f.data.q}\n\n${f.data.a}\n`).join('\n'),
  ];
  return new Response(parts.join('\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
