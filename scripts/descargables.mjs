/**
 * Genera los PDF descargables a partir de las páginas de la web (versión de impresión):
 *   public/descargas/informe-ejemplo-ensayum.pdf   ← /informe-de-ejemplo/
 *   public/descargas/cadena-de-custodia-ensayum.pdf ← /cadena-de-custodia/
 *   y un PDF con sus vistas previas por cada recurso de src/data/recursos.ts
 *   (documento en /recursos/<id>/documento/).
 * Uso: `npm run descargables` (compila, genera los PDF y vuelve a compilar).
 * Necesita Playwright con Chromium (`npx playwright install chromium`).
 */
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';
import { recursos, hojasLibres } from '../src/data/recursos.ts';

const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const types = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  let p = join(dist, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try {
    if ((await stat(p)).isDirectory()) p = join(p, 'index.html');
    res.writeHead(200, { 'Content-Type': types[extname(p)] ?? 'application/octet-stream' });
    res.end(await readFile(p));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const base = `http://localhost:${server.address().port}`;

const jobs = [
  ['/informe-de-ejemplo/', 'informe-ejemplo-ensayum.pdf'],
  ['/cadena-de-custodia/', 'cadena-de-custodia-ensayum.pdf'],
  ...recursos.map((r) => [r.printPath, r.pdf.split('/').pop(), r]),
  ...hojasLibres.map((h) => [h.printPath, h.pdf.split('/').pop()]),
];
await mkdir(join(root, 'public/descargas'), { recursive: true });
const browser = await chromium.launch();
let fallos = 0;
for (const [path, file, recurso] of jobs) {
  const page = await browser.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  const pdf = await page.pdf({
    path: join(root, 'public/descargas', file),
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
  });
  const paginas = (pdf.toString('latin1').match(/\/Type\s*\/Page\b/g) ?? []).length;
  console.log(`generado public/descargas/${file} (${paginas} páginas)`);
  if (recurso && recurso.pages !== paginas) {
    fallos++;
    console.error(
      `  ✗ «${recurso.id}» dice pages: ${recurso.pages} en src/data/recursos.ts y el PDF tiene ${paginas}`,
    );
  }
  await page.close();
}

// Vistas previas de cada recurso para el bloque de descarga (se optimizan con astro:assets):
// la portada y el comienzo de otras dos páginas.
const previews = join(root, 'src/assets/recursos');
await mkdir(previews, { recursive: true });
const pageH = 1123;
for (const r of recursos) {
  const page = await browser.newPage({
    viewport: { width: 794, height: pageH },
    deviceScaleFactor: 1.5,
  });
  await page.goto(base + r.printPath, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.addStyleTag({ content: 'body{background:#fff}.doc{padding:46px 44px!important}' });
  const shot = (n, y, height = pageH) =>
    page.screenshot({
      path: join(previews, `${r.id}-${n}.png`),
      fullPage: true,
      clip: { x: 0, y, width: 794, height },
    });
  const saltos = await page.locator('.page-break').count();
  let n = 1;
  await shot(n++, 0);
  // Con un solo salto de página, la segunda vista es la continuación de la portada.
  if (saltos < 2) await shot(n++, pageH);
  await page.addStyleTag({ content: '.page-break{padding-top:46px}.page-break h2{margin-top:0}' });
  for (let i = 0; i < saltos && n <= 3; i++) {
    const box = await page.locator('.page-break').nth(i).boundingBox();
    await shot(n++, box.y, Math.min(pageH, box.height + 120));
  }
  console.log(`generado src/assets/recursos/${r.id}-{1…${n - 1}}.png`);
  await page.close();
}

await browser.close();
server.close();
if (fallos) process.exit(1);
