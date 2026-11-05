/**
 * Genera los PDF descargables a partir de las páginas de la web (versión de impresión):
 *   public/descargas/informe-ejemplo-ensayum.pdf   ← /informe-de-ejemplo/
 *   public/descargas/cadena-de-custodia-ensayum.pdf ← /cadena-de-custodia/
 * Uso: `npm run descargables` (compila, genera los PDF y vuelve a compilar).
 * Necesita Playwright con Chromium (`npx playwright install chromium`).
 */
import { createServer } from 'node:http';
import { readFile, mkdir, stat } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

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
  ['/recursos/checklist-legionella/documento/', 'checklist-legionella-2027-ensayum.pdf'],
];
await mkdir(join(root, 'public/descargas'), { recursive: true });
const browser = await chromium.launch();
for (const [path, file] of jobs) {
  const page = await browser.newPage();
  await page.goto(base + path, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print', colorScheme: 'light' });
  await page.pdf({
    path: join(root, 'public/descargas', file),
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '14mm', left: '12mm', right: '12mm' },
  });
  console.log('generado public/descargas/' + file);
}
await browser.close();
server.close();
