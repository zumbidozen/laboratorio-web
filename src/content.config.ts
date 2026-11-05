/**
 * ESQUEMAS DEL CONTENIDO
 * ------------------------------------------------------------------
 * Cada colección es una carpeta en src/content. Si a un archivo le falta
 * un campo obligatorio o tiene un valor no permitido, `npm run build`
 * falla y dice qué archivo y qué campo: así no se publica nada roto.
 */
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

/** Campos SEO comunes a cualquier página de contenido. */
const seo = {
  /** Título de la página (se usa en <title> y en el H1 si no hay `heading`). Máx. ~60 caracteres. */
  title: z.string().max(70),
  /** Descripción para Google y redes. Entre 70 y 160 caracteres. */
  description: z.string().min(70).max(160),
  /** Respuesta directa en 1–2 frases. Se muestra arriba y la leen primero buscadores e IA. */
  summary: z.string(),
  /** Fecha de la última revisión del contenido (AAAA-MM-DD). */
  updated: z.coerce.date(),
  /** true = no se publica (útil para borradores). */
  draft: z.boolean().default(false),
};

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    ...seo,
    /** Nombre corto para tarjetas y menús. */
    name: z.string(),
    /** Icono (ver la lista en src/components/Icon.astro). */
    icon: z.string().default('droplet'),
    /** Plazo máximo de entrega del resultado, si aplica (p. ej. "10 días o menos"). */
    turnaround: z.string().optional(),
    /** Orden en los listados (menor = antes). */
    order: z.number().default(100),
    /** Agrupa los servicios en la página /servicios/. */
    category: z.enum(['analisis', 'servicio']),
    /** disponible | proximamente (muestra la etiqueta "Próximamente"). */
    status: z.enum(['disponible', 'proximamente']).default('disponible'),
    /** Cuándo estará disponible, si es "proximamente" (texto libre, p. ej. "2028"). */
    availableFrom: z.string().optional(),
    /** Normas que lo exigen (se muestran como chips y van a los datos estructurados). */
    regulations: z.array(z.string()).default([]),
    /** Qué incluye: lista corta de parámetros o entregables. */
    includes: z.array(z.string()).default([]),
    /** Para quién es (texto corto). */
    audience: z.string().optional(),
    /** Preguntas frecuentes de este servicio (generan FAQPage en Google). */
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

const sectores = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sectores' }),
  schema: z.object({
    ...seo,
    name: z.string(),
    icon: z.string().default('building'),
    order: z.number().default(100),
    /** Servicios que se destacan en la página del sector (nombre del archivo sin .md). */
    services: z.array(reference('servicios')).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

const guias = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guias' }),
  schema: z.object({
    ...seo,
    /** Fecha de publicación (AAAA-MM-DD). */
    published: z.coerce.date(),
    /** Nombre de quien firma o revisa técnicamente la guía. */
    author: z.string().default('Equipo técnico'),
    /** Servicios relacionados que se enlazan al final. */
    services: z.array(reference('servicios')).default([]),
    tags: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

/** Preguntas frecuentes generales: un único archivo YAML fácil de editar. */
const faq = defineCollection({
  loader: file('./src/content/faq.yaml'),
  schema: z.object({
    q: z.string(),
    a: z.string(),
    order: z.number().default(100),
  }),
});

/** Glosario: un único archivo YAML. */
const glosario = defineCollection({
  loader: file('./src/content/glosario.yaml'),
  schema: z.object({
    term: z.string(),
    def: z.string().max(320),
    link: z.string().startsWith('/').optional(),
  }),
});

/** Planes por cuota: un único archivo YAML. */
const planes = defineCollection({
  loader: file('./src/content/planes.yaml'),
  schema: z.object({
    name: z.string(),
    icon: z.string().default('layers'),
    order: z.number().default(100),
    /** Para quién es, en una línea. */
    audience: z.string(),
    /** Unidad de la cuota (sin precio): "Cuota mensual por instalación". */
    billing: z.string(),
    includes: z.array(z.string()),
    /** Elementos que aún no están disponibles, con su año. */
    soon: z.array(z.object({ item: z.string(), from: z.string() })).default([]),
    featured: z.boolean().default(false),
  }),
});

export const collections = { servicios, sectores, guias, faq, planes, glosario };
