/** Versión Markdown de /glosario/ */
import type { APIRoute } from 'astro';
import { getGlosario } from '@/lib/content';
import { markdownResponse } from '@/lib/markdown';
import { glosarioMd } from '@/lib/referencia';

export const GET: APIRoute = async () => markdownResponse(glosarioMd(await getGlosario()));
