/** Versión Markdown de /planes/ */
import type { APIRoute } from 'astro';
import { getPlanes } from '@/lib/content';
import { markdownResponse } from '@/lib/markdown';
import { planesMd } from '@/lib/referencia';

export const GET: APIRoute = async () => markdownResponse(planesMd(await getPlanes()));
