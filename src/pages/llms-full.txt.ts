/** /llms-full.txt — todo el contenido del sitio en un solo Markdown, para IA. */
import type { APIRoute } from 'astro';
import { getEntries } from 'astro:content';
import { site } from '@/config/site';
import {
  getServicios,
  getSectores,
  getGuias,
  getFaq,
  getPlanes,
  getGlosario,
  getNormativa,
  guiasDeNorma,
} from '@/lib/content';
import { entryToMarkdown } from '@/lib/markdown';
import {
  frecuenciasMd,
  calendarioMd,
  comoTrabajamosMd,
  planesMd,
  glosarioMd,
  normaMd,
} from '@/lib/referencia';

export const GET: APIRoute = async () => {
  const [servicios, sectores, guias, faq, planes, glosario, normas] = await Promise.all([
    getServicios(),
    getSectores(),
    getGuias(),
    getFaq(),
    getPlanes(),
    getGlosario(),
    getNormativa(),
  ]);
  const normasMd = await Promise.all(
    normas.map(async (n) => normaMd(n, guiasDeNorma(n, guias), await getEntries(n.data.services))),
  );
  const parts = [
    `# ${site.name}\n\n> ${site.description}\n`,
    comoTrabajamosMd(),
    ...servicios.map(entryToMarkdown),
    planesMd(planes),
    ...sectores.map(entryToMarkdown),
    frecuenciasMd(),
    ...normasMd,
    calendarioMd(),
    ...guias.map(entryToMarkdown),
    glosarioMd(glosario),
    '# Preguntas frecuentes\n\n' + faq.map((f) => `## ${f.data.q}\n\n${f.data.a}\n`).join('\n'),
  ];
  return new Response(parts.join('\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
