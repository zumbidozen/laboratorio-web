/**
 * CONFIGURACIÓN GLOBAL DEL SITIO
 * ------------------------------------------------------------------
 * Este es el ÚNICO archivo que hay que tocar para cambiar el nombre,
 * el dominio, los datos de contacto, el menú o activar la indexación.
 * Todo lo demás (cabecera, pie, SEO, datos estructurados, llms.txt,
 * robots.txt, sitemap) lee de aquí.
 *
 * Los valores marcados con TODO están pendientes de decidir.
 */

export const site = {
  /** Nombre comercial (hoja de marca Ensayum v3). */
  name: 'Ensayum',
  /** Nombre corto para el título de las pestañas. */
  shortName: 'Ensayum',
  /** Descriptor de marca (hoja de marca). Se usa en el pie y en llms.txt. */
  descriptor:
    'Laboratorio de ensayos microbiológicos y ambientales. Aguas, alimentación, ambientes interiores y superficies.',
  /** Razón social (Registro Mercantil de Madrid; BORME de 21/02/2024 y 13/03/2026). */
  legalName: 'Foncad Group, S.L.',
  /** CIF de la sociedad. */
  taxId: 'B70713532',
  /** Inscripción en el Registro Mercantil (tomo, folio, hoja). Vacío = no se muestra. */
  registry: '',

  /** Dominio definitivo (con https y sin barra final). Se compra aparte: ver docs/cloudflare.md. */
  url: 'https://ensayum.es',

  /**
   * Interruptor de lanzamiento.
   * false → robots.txt bloquea todo y cada página lleva noindex.
   * Ponlo a true SOLO cuando el dominio, el nombre y los textos legales sean los definitivos.
   */
  indexable: false,

  locale: 'es-ES',
  lang: 'es',

  /** Entre 70 y 160 caracteres: es la descripción por defecto en Google y en redes. */
  description:
    'Ensayum, laboratorio de aguas en Madrid para empresas de servicios: Legionella, agua de consumo, piscinas y torres, con pedido online e informes en tu marca.',

  /** Título SEO de la portada (máx. ~55 caracteres; se le añade " · shortName"). */
  homeTitle: 'Laboratorio de análisis de aguas en Madrid',

  /** Frase corta que acompaña al nombre en la portada. */
  tagline: 'Análisis de agua para profesionales, sin papeles ni esperas',

  contact: {
    /** TODO */
    email: 'hola@example.com',
    /** TODO: formato internacional, sin espacios (se usa en enlaces tel:). */
    phone: '',
    /** Texto del teléfono tal y como se muestra. */
    phoneDisplay: '',
    /** TODO: WhatsApp en formato internacional sin "+" ni espacios (p. ej. 34600000000). Vacío = no se muestra. */
    whatsapp: '',
    address: {
      /** Domicilio social (confirmado por el titular). */
      street: 'Calle de la Iglesia, 12',
      postalCode: '28019',
      city: 'Madrid',
      region: 'Comunidad de Madrid',
      country: 'ES',
    },
    /** TODO: horario de atención. Vacío = no se muestra. */
    hours: '',
    /**
     * Cómo se envía el formulario de contacto:
     * - 'cloudflare': lo recibe el Worker de la web (worker/index.ts), que lo guarda en la
     *   base de datos D1 y avisa por email. Ver docs/cloudflare.md.
     * - 'netlify': Netlify Forms (funciona solo si la web está alojada en Netlify;
     *   los mensajes llegan al panel de Netlify y por email si se configura el aviso).
     * - una URL (Formspree, Getform, un Worker propio…): el formulario se envía ahí.
     * - '': no hay formulario; se muestra el email.
     */
    form: 'cloudflare' as 'cloudflare' | 'netlify' | (string & {}),
  },

  /** Zona de servicio (se usa en los datos estructurados). */
  areaServed: ['Comunidad de Madrid'],

  /**
   * Analítica sin cookies (no necesita banner). Pon el dominio tal como esté dado de alta
   * en Plausible (https://plausible.io) para activarla. Vacío = sin analítica.
   */
  analytics: {
    plausibleDomain: '',
  },

  /**
   * Verificación de propiedad en buscadores (solo el código del atributo content de la etiqueta
   * meta que dan). Google Search Console → «Etiqueta HTML»; Bing Webmaster Tools → «Meta tag».
   */
  verification: {
    google: '',
    bing: '',
  },

  /** Perfiles sociales. Vacío = no se muestran. */
  social: {
    linkedin: '',
  },

  /** Imagen por defecto al compartir en redes (1200×630, en /public). */
  ogImage: '/og-default.png',

  /**
   * Situación de la acreditación ENAC propia.
   * Mientras sea false, la web NO puede decir que somos laboratorio acreditado ni
   * que estamos en proceso, ni usar la marca ENAC: los ensayos los realiza y firma
   * un laboratorio acreditado, identificado en cada informe.
   */
  accreditation: {
    ownEnac: false,
    enacNumber: '',
  },
} as const;

/** Menú principal. El orden aquí es el orden en pantalla. */
export const mainNav = [
  { label: 'Servicios', href: '/servicios/' },
  { label: 'Partners', href: '/partners/' },
  { label: 'Planes', href: '/planes/' },
  { label: 'Calculadora', href: '/calculadora/' },
  { label: 'Cómo trabajamos', href: '/como-trabajamos/' },
  { label: 'Guías', href: '/guias/' },
] as const;

/** Enlaces de recursos del pie de página. */
export const resourcesNav = [
  { label: 'Para quién', href: '/sectores/' },
  { label: 'Enviar muestras', href: '/enviar-muestras/' },
  { label: 'Cadena de custodia', href: '/cadena-de-custodia/' },
  { label: 'Pedir envases', href: '/pedir-envases/' },
  { label: 'Informe de ejemplo', href: '/informe-de-ejemplo/' },
  { label: 'Cambiar de laboratorio', href: '/cambiar-de-laboratorio/' },
  { label: 'Reservar una demo', href: '/demo/' },
  { label: 'Normativa por norma', href: '/normativa/' },
  { label: 'Frecuencias de análisis', href: '/frecuencias-de-analisis/' },
  { label: 'Calendario normativo', href: '/calendario-normativo/' },
  { label: 'Glosario', href: '/glosario/' },
  { label: 'Checklist de Legionella (PDF)', href: '/recursos/checklist-legionella/' },
  { label: 'Preguntas frecuentes', href: '/preguntas-frecuentes/' },
] as const;

/** Llamada a la acción principal (botón de la cabecera). */
export const primaryCta = { label: 'Pedir tarifa', href: '/contacto/' } as const;

/** Enlaces legales del pie. */
export const legalNav = [
  { label: 'Aviso legal', href: '/aviso-legal/' },
  { label: 'Privacidad', href: '/privacidad/' },
  { label: 'Cookies', href: '/cookies/' },
] as const;

/** Dirección en una línea, con las partes que estén rellenas. */
export function addressLine(): string {
  const a = site.contact.address;
  const place = [a.postalCode, a.city].filter(Boolean).join(' ');
  return [a.street, place || a.region].filter(Boolean).join(', ');
}

/** Construye una URL absoluta a partir de una ruta del sitio. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, site.url).toString();
}

/**
 * Datos que deben estar completos antes de abrir la web a Google (`indexable: true`).
 * Si falta alguno, la compilación se para y dice cuál (astro.config.ts).
 */
export function pendientesDeLanzamiento(): string[] {
  const faltan: string[] = [];
  if (!site.legalName) faltan.push('legalName (titular o razón social)');
  if (!site.taxId) faltan.push('taxId (NIF o CIF)');
  if (!site.contact.email || site.contact.email.endsWith('@example.com'))
    faltan.push('contact.email (email real)');
  if (!site.contact.address.postalCode) faltan.push('contact.address.postalCode');
  if (!site.contact.address.city) faltan.push('contact.address.city');
  return faltan;
}
