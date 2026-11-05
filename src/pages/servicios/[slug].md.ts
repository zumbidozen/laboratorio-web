/** Versión Markdown de cada ficha: /servicios/<slug>.md */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getServicios } from '@/lib/content';
import { entryToMarkdown, markdownResponse } from '@/lib/markdown';

export const getStaticPaths = (async () => {
  const entries = await getServicios();
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => markdownResponse(entryToMarkdown(props.entry));
