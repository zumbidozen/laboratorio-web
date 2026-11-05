/**
 * /llms.txt — índice del sitio para asistentes de IA (formato llmstxt.org).
 * Se genera solo a partir del contenido; no hay que editarlo a mano.
 */
import type { APIRoute } from 'astro';
import { site, absoluteUrl } from '@/config/site';
import { getServicios, getSectores, getGuias, getFaq, getPlanes, getGlosario } from '@/lib/content';

export const GET: APIRoute = async () => {
  const [servicios, sectores, guias, faq, planes] = await Promise.all([
    getServicios(),
    getSectores(),
    getGuias(),
    getFaq(),
    getPlanes(),
  ]);
  const glosario = await getGlosario();
  const link = (title: string, path: string, note: string) =>
    `- [${title}](${absoluteUrl(path)}): ${note}`;

  const out = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    `Laboratorio de análisis de aguas que trabaja en ${site.areaServed.join(', ')}, sobre todo para empresas de servicios (mantenimiento, control de Legionella y de plagas, tratamiento de agua, gestión de piscinas) que toman las muestras y revenden el análisis. Contacto: ${site.contact.email}.`,
    site.accreditation.ownEnac
      ? `Laboratorio acreditado por ENAC (n.º ${site.accreditation.enacNumber}).`
      : 'Los ensayos que requieren acreditación los realiza y firma un laboratorio acreditado por ENAC, identificado en cada informe.',
    '',
    'Cada página tiene una versión en Markdown añadiendo `.md` a su ruta sin la barra final. Todo el contenido junto: ' +
      absoluteUrl('/llms-full.txt'),
    '',
    '## Análisis y servicios',
    '',
    ...servicios.map((s) =>
      link(
        s.data.name,
        `/servicios/${s.id}.md`,
        s.data.summary +
          (s.data.status === 'proximamente'
            ? ` (próximamente${s.data.availableFrom ? `, ${s.data.availableFrom}` : ''})`
            : ''),
      ),
    ),
    '',
    '## Planes por cuota',
    '',
    ...planes.map((p) =>
      link(
        p.data.name,
        `/planes/#${p.id}`,
        `${p.data.audience}. ${p.data.billing}. Incluye: ${p.data.includes.join('; ')}.`,
      ),
    ),
    '',
    '## Para quién',
    '',
    ...sectores.map((s) => link(s.data.name, `/sectores/${s.id}.md`, s.data.summary)),
    '',
    '## Guías de normativa',
    '',
    ...guias.map((g) => link(g.data.title, `/guias/${g.id}.md`, g.data.summary)),
    '',
    '## Preguntas frecuentes',
    '',
    ...faq.map((f) => `- ${f.data.q} ${f.data.a}`),
    '',
    '## Glosario',
    '',
    ...glosario.map((g) => `- **${g.data.term}**: ${g.data.def}`),
    '',
    '## Optional',
    '',
    link(
      'Cómo trabajamos',
      '/como-trabajamos/',
      'portal, API, plazos máximos e informes en co-marca',
    ),
    link('Programa Partner', '/partners/', 'condiciones para empresas que revenden el análisis'),
    link(
      'Informe de ejemplo',
      '/informe-de-ejemplo/',
      'informe en co-marca con cada campo explicado',
    ),
    link(
      'Enviar muestras',
      '/enviar-muestras/',
      'envases, datos de la toma, transporte y causas de rechazo',
    ),
    link(
      'Cambiar de laboratorio',
      '/cambiar-de-laboratorio/',
      'cambio sin cortes con prueba de muestras duplicadas',
    ),
    link(
      'Pedir envases',
      '/pedir-envases/',
      'formulario de pedido de envases y etiquetas para clientes',
    ),
    link('Contacto', '/contacto/', 'pedir tarifa profesional'),
    '',
  ];
  return new Response(out.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
