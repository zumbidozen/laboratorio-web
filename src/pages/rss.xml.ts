import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { site } from '@/config/site';
import { getGuias, guiaUrl } from '@/lib/content';

export const GET: APIRoute = async (context) => {
  const guias = await getGuias();
  return rss({
    title: `Guías · ${site.name}`,
    description:
      'Guías prácticas sobre normativa de aguas: Legionella, agua de consumo y piscinas.',
    site: context.site ?? site.url,
    items: guias.map((g) => ({
      title: g.data.title,
      description: g.data.description,
      pubDate: g.data.published,
      link: guiaUrl(g),
    })),
    customData: `<language>${site.lang}</language>`,
  });
};
