import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import { site } from './src/config/site';

/**
 * Fecha de última actualización de cada ficha y guía para el sitemap (<lastmod>),
 * leída del campo `updated` de su Markdown. Google prioriza lo que ha cambiado.
 */
function lastmodByPath(): Map<string, string> {
  const map = new Map<string, string>();
  for (const collection of ['servicios', 'sectores', 'guias']) {
    const dir = `./src/content/${collection}`;
    for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
      const updated = readFileSync(`${dir}/${file}`, 'utf8').match(
        /^updated:\s*'?(\d{4}-\d{2}-\d{2})/m,
      )?.[1];
      if (updated) map.set(`/${collection}/${file.replace(/\.md$/, '')}/`, updated);
    }
  }
  return map;
}
const lastmod = lastmodByPath();

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Las páginas legales y la 404 no aportan nada en el sitemap.
      filter: (page) =>
        !/\/(aviso-legal|privacidad|cookies|404|contacto\/gracias|gracias|documento)\/?$/.test(
          page,
        ),
      serialize: (item) => {
        const date = lastmod.get(new URL(item.url).pathname);
        return date ? { ...item, lastmod: date } : item;
      },
    }),
  ],
  prefetch: { prefetchAll: true },
});
