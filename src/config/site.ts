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
  /** TODO: razón social exacta cuando se constituya la SL. Vacío = se muestra el nombre comercial. */
  legalName: '',
  /** TODO: CIF cuando esté la sociedad constituida. */
  taxId: '',

  /** TODO: cambiar por el dominio definitivo (con https y sin barra final). */
  url: 'https://ensayum.netlify.app',

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
    /** TODO: dirección cuando se firme el local. Vacío = no se muestra. */
    address: {
      street: '',
      postalCode: '',
      city: 'Madrid',
      region: 'Comunidad de Madrid',
      country: 'ES',
    },
    /** TODO: horario de atención. Vacío = no se muestra. */
    hours: '',
    /**
     * Cómo se envía el formulario de contacto:
     * - 'netlify': Netlify Forms (funciona solo si la web está alojada en Netlify;
     *   los mensajes llegan al panel de Netlify y por email si se configura el aviso).
     * - una URL (Formspree, Getform, un Worker propio…): el formulario se envía ahí.
     * - '': no hay formulario; se muestra el email.
     */
    form: 'netlify' as 'netlify' | (string & {}),
  },

  /** Zona de servicio (se usa en los datos estructurados). */
  areaServed: ['Comunidad de Madrid'],

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
  { label: 'Planes', href: '/planes/' },
  { label: 'Para quién', href: '/sectores/' },
  { label: 'Cómo trabajamos', href: '/como-trabajamos/' },
  { label: 'Guías', href: '/guias/' },
] as const;

/** Llamada a la acción principal (botón de la cabecera). */
export const primaryCta = { label: 'Pedir tarifa', href: '/contacto/' } as const;

/** Enlaces legales del pie. */
export const legalNav = [
  { label: 'Aviso legal', href: '/aviso-legal/' },
  { label: 'Privacidad', href: '/privacidad/' },
  { label: 'Cookies', href: '/cookies/' },
] as const;

/** Construye una URL absoluta a partir de una ruta del sitio. */
export function absoluteUrl(path = '/'): string {
  return new URL(path, site.url).toString();
}
