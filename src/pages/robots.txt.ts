/**
 * robots.txt generado. Mientras site.indexable sea false, bloquea todo.
 * Al lanzar, permite a buscadores y a los rastreadores de asistentes de IA
 * (para que nos citen) y apunta al sitemap.
 */
import type { APIRoute } from 'astro';
import { site, absoluteUrl } from '@/config/site';

/** Rastreadores de IA permitidos explícitamente. Quita los que no quieras. */
const aiBots = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
  'CCBot',
];

export const GET: APIRoute = () => {
  const body = site.indexable
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        ...aiBots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
        `Sitemap: ${absoluteUrl('/sitemap-index.xml')}`,
        '',
      ].join('\n')
    : ['# Sitio en preparación: no indexar todavía.', 'User-agent: *', 'Disallow: /', ''].join(
        '\n',
      );
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
