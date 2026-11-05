/** Versión Markdown de /calendario-normativo/ */
import type { APIRoute } from 'astro';
import { markdownResponse } from '@/lib/markdown';
import { calendarioMd } from '@/lib/referencia';

export const GET: APIRoute = () => markdownResponse(calendarioMd());
