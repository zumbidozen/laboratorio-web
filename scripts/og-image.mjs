/**
 * Genera los recursos de marca en PNG a partir de los SVG oficiales de public/brand:
 *   public/og-default.png         1200×630  imagen al compartir en redes
 *   public/brand/ensayum-logo.png  logotipo para Google (datos estructurados)
 *   public/apple-touch-icon.png    180×180  icono al guardar la web en el móvil
 *   public/og/guias/<guía>.png     1200×630  imagen de cada guía al compartirla (con su título)
 * Uso: `npm run og` (necesita Playwright con Chromium: `npx playwright install chromium`).
 */
import { readFile, readdir, mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = new URL('../', import.meta.url);
const read = (p) => readFile(new URL(p, root), 'utf8');
const src = await read('src/config/site.ts');
const tagline = src.match(/tagline:\s*'([^']*)'/)?.[1] ?? '';
const logo = await read('public/brand/ensayum-logo.svg');
const symbol = await read('public/brand/ensayum-simbolo.svg');
const fontData = await readFile(
  new URL('node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2', root),
);
const font = `data:font/woff2;base64,${fontData.toString('base64')}`;
const white = logo.replaceAll('#0B3C5D', '#FFFFFF');

const base = `<style>@font-face{font-family:Jost;src:url(${font}) format('woff2');font-weight:100 900}
*{margin:0}body{font-family:Jost,sans-serif}</style>`;

/** Escapa texto para meterlo en el HTML de la imagen. */
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** Una imagen por guía, leyendo título y etiquetas del Markdown. */
const guideDir = new URL('src/content/guias/', root);
const guides = [];
for (const file of (await readdir(guideDir)).filter((f) => f.endsWith('.md'))) {
  const md = await readFile(new URL(file, guideDir), 'utf8');
  const title = md.match(/^title:\s*'?(.*?)'?\s*$/m)?.[1]?.replace(/''/g, "'") ?? '';
  guides.push({ slug: file.replace(/\.md$/, ''), title });
}
await mkdir(new URL('public/og/guias/', root), { recursive: true });

const pages = [
  {
    path: 'public/og-default.png',
    size: { width: 1200, height: 630 },
    html: `${base}<div style="width:1200px;height:630px;box-sizing:border-box;padding:84px 96px;display:flex;flex-direction:column;justify-content:space-between;background:#0B3C5D;color:#fff">
      <div style="width:330px">${white}</div>
      <div style="font-size:66px;font-weight:300;line-height:1.12;letter-spacing:-.01em;max-width:960px">${tagline}</div>
      <div style="font-size:22px;font-weight:400;letter-spacing:.24em;text-transform:uppercase;color:#1FB5A8">Legionella · Agua de consumo · Piscinas · Torres</div>
    </div>`,
  },
  {
    path: 'public/brand/ensayum-logo.png',
    size: { width: 1200, height: 300 },
    html: `${base}<div style="width:1200px;height:300px;display:grid;place-items:center;background:#fff"><div style="width:1000px">${logo}</div></div>`,
  },
  {
    path: 'public/apple-touch-icon.png',
    size: { width: 180, height: 180 },
    html: `${base}<div style="width:180px;height:180px;display:grid;place-items:center;background:#fff"><div style="width:84px">${symbol}</div></div>`,
  },
];

for (const g of guides) {
  pages.push({
    path: `public/og/guias/${g.slug}.png`,
    size: { width: 1200, height: 630 },
    html: `${base}<div style="width:1200px;height:630px;box-sizing:border-box;padding:80px 96px;display:flex;flex-direction:column;justify-content:space-between;background:radial-gradient(900px 500px at 100% 0%,rgba(31,181,168,.28),transparent 60%),#0B3C5D;color:#fff">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div style="width:250px">${white}</div>
        <div style="font-size:22px;letter-spacing:.26em;text-transform:uppercase;color:#1FB5A8">Guía</div>
      </div>
      <div style="font-size:${g.title.length > 48 ? 60 : 70}px;font-weight:300;line-height:1.1;letter-spacing:-.015em;max-width:1000px">${esc(g.title)}</div>
      <div style="font-size:22px;letter-spacing:.2em;text-transform:uppercase;color:#b9cddb">Laboratorio de aguas · Comunidad de Madrid</div>
    </div>`,
  });
}

const browser = await chromium.launch();
for (const p of pages) {
  const page = await browser.newPage({ viewport: p.size });
  await page.setContent(p.html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL(p.path, root).pathname });
  console.log('generado', p.path);
}
await browser.close();
