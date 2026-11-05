import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Las páginas legales y la 404 no aportan nada en el sitemap.
      filter: (page) => !/\/(aviso-legal|privacidad|cookies|404|contacto\/gracias)\/?$/.test(page),
    }),
  ],
  prefetch: { prefetchAll: true },
});
