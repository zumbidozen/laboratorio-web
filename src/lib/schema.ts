/**
 * Datos estructurados (JSON-LD, schema.org).
 * Google los usa para resultados enriquecidos y los asistentes de IA para
 * entender quién somos, qué ofrecemos y dónde. Todo sale de src/config/site.ts.
 */
import { site, absoluteUrl } from '@/config/site';

type Json = Record<string, unknown>;

export const orgId = absoluteUrl('/#organizacion');
export const websiteId = absoluteUrl('/#web');

export function organization(): Json {
  const { contact } = site;
  const hasAddress = Boolean(contact.address.street);
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    '@type': 'ProfessionalService',
    '@id': orgId,
    name: site.name,
    legalName: site.legalName || undefined,
    url: absoluteUrl('/'),
    logo: absoluteUrl('/brand/ensayum-logo.png'),
    image: absoluteUrl(site.ogImage),
    description: site.description,
    email: contact.email || undefined,
    telephone: contact.phone || undefined,
    taxID: site.taxId || undefined,
    areaServed: site.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    knowsAbout: [
      'Análisis de Legionella',
      'Análisis de agua de consumo humano',
      'Análisis de agua de piscinas',
      'Control de torres de refrigeración',
      'RD 487/2022',
      'RD 3/2023',
    ],
    address: hasAddress
      ? {
          '@type': 'PostalAddress',
          streetAddress: contact.address.street,
          postalCode: contact.address.postalCode || undefined,
          addressLocality: contact.address.city || undefined,
          addressRegion: contact.address.region,
          addressCountry: contact.address.country,
        }
      : {
          '@type': 'PostalAddress',
          addressLocality: contact.address.city || undefined,
          addressRegion: contact.address.region,
          addressCountry: contact.address.country,
        },
    sameAs: sameAs.length ? sameAs : undefined,
  };
}

export function website(): Json {
  return {
    '@type': 'WebSite',
    '@id': websiteId,
    url: absoluteUrl('/'),
    name: site.name,
    inLanguage: site.locale,
    publisher: { '@id': orgId },
  };
}

export function breadcrumbs(items: { name: string; href: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.href),
    })),
  };
}

export function faqPage(faq: { q: string; a: string }[]): Json | null {
  if (!faq.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faq.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function service(opts: {
  name: string;
  description: string;
  href: string;
  regulations?: string[];
  audience?: string;
}): Json {
  return {
    '@type': 'Service',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.href),
    serviceType: opts.name,
    provider: { '@id': orgId },
    areaServed: site.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
    audience: opts.audience ? { '@type': 'BusinessAudience', name: opts.audience } : undefined,
    termsOfService: opts.regulations?.length ? opts.regulations.join(', ') : undefined,
  };
}

export function article(opts: {
  title: string;
  description: string;
  href: string;
  published: Date;
  updated: Date;
  author: string;
  keywords?: string[];
  wordCount?: number;
  citations?: { title: string; url: string }[];
  abstract?: string;
  /** Imagen propia para redes (ruta); si no, la general. */
  image?: string;
}): Json {
  return {
    '@type': 'Article',
    keywords: opts.keywords?.length ? opts.keywords.join(', ') : undefined,
    wordCount: opts.wordCount,
    abstract: opts.abstract,
    citation: opts.citations?.map((c) => ({ '@type': 'CreativeWork', name: c.title, url: c.url })),
    isAccessibleForFree: true,
    headline: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.href),
    mainEntityOfPage: absoluteUrl(opts.href),
    datePublished: opts.published.toISOString(),
    dateModified: opts.updated.toISOString(),
    inLanguage: site.locale,
    author:
      opts.author === 'Equipo técnico'
        ? { '@id': orgId }
        : { '@type': 'Person', name: opts.author, worksFor: { '@id': orgId } },
    publisher: { '@id': orgId },
    image: absoluteUrl(opts.image ?? site.ogImage),
  };
}

/** Página que reúne el contenido de una norma (páginas /normativa/…). */
export function collectionPage(opts: {
  title: string;
  description: string;
  href: string;
  updated: Date;
  legislation: { name: string; url: string };
  parts: { title: string; href: string }[];
}): Json {
  return {
    '@type': 'CollectionPage',
    name: opts.title,
    description: opts.description,
    url: absoluteUrl(opts.href),
    dateModified: opts.updated.toISOString(),
    inLanguage: site.locale,
    isPartOf: { '@id': websiteId },
    publisher: { '@id': orgId },
    about: { '@type': 'Legislation', name: opts.legislation.name, url: opts.legislation.url },
    hasPart: opts.parts.map((p) => ({
      '@type': 'Article',
      headline: p.title,
      url: absoluteUrl(p.href),
    })),
  };
}

/** Une varios nodos en un único bloque @graph. */
export function graph(...nodes: (Json | null | undefined)[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}

export function definedTermSet(opts: {
  name: string;
  href: string;
  terms: { id: string; term: string; def: string }[];
}): Json {
  const url = absoluteUrl(opts.href);
  return {
    '@type': 'DefinedTermSet',
    '@id': `${url}#glosario`,
    name: opts.name,
    url,
    inLanguage: site.locale,
    hasDefinedTerm: opts.terms.map((t) => ({
      '@type': 'DefinedTerm',
      '@id': `${url}#${t.id}`,
      name: t.term,
      description: t.def,
      inDefinedTermSet: `${url}#glosario`,
    })),
  };
}
