/** Versión Markdown de /frecuencias-de-analisis/ */
import type { APIRoute } from 'astro';
import { markdownResponse } from '@/lib/markdown';
import { frecuenciasMd } from '@/lib/referencia';

export const GET: APIRoute = () => markdownResponse(frecuenciasMd());
