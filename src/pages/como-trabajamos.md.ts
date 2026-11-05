/** Versión Markdown de /como-trabajamos/ */
import type { APIRoute } from 'astro';
import { markdownResponse } from '@/lib/markdown';
import { comoTrabajamosMd } from '@/lib/referencia';

export const GET: APIRoute = () => markdownResponse(comoTrabajamosMd());
