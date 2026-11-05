/**
 * Revisión SEO automática de la web ya compilada (carpeta dist/).
 * Se ejecuta con `npm run check:seo` y en cada push (GitHub Actions).
 * Falla si alguna página indexable incumple lo básico o si hay enlaces internos rotos.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const get = (html, re) => html.match(re)?.[1]?.trim();

/** ¿Existe en dist/ el destino de un enlace interno (archivo o carpeta con index.html)? */
const cache = new Map();
async function exists(path) {
  if (cache.has(path)) return cache.get(path);
  const target = join(DIST, decodeURIComponent(path));
  let ok = false;
  try {
    const s = await stat(target);
    ok =
      s.isFile() ||
      (await stat(join(target, 'index.html')).then(
        () => true,
        () => false,
      ));
  } catch {
    ok = false;
  }
  cache.set(path, ok);
  return ok;
}
const errors = [];
const warnings = [];
let pages = 0;

for await (const file of htmlFiles(DIST)) {
  const html = await readFile(file, 'utf8');
  const page = file.replace(DIST, '/');
  pages++;
  const err = (m) => errors.push(`${page}: ${m}`);
  const warn = (m) => warnings.push(`${page}: ${m}`);

  const title = get(html, /<title>([^<]*)<\/title>/);
  const desc = get(html, /<meta name="description" content="([^"]*)"/);
  const robots = get(html, /<meta name="robots" content="([^"]*)"/) ?? '';
  const isLegalOr404 = /\/(aviso-legal|privacidad|cookies|404)/.test(page);

  // Enlaces internos: cada href="/..." debe existir en dist/, y cada ancla de la misma página también.
  for (const m of html.matchAll(/href="(\/[^"#?]*)(?:\?[^"#]*)?(#[^"]*)?"/g)) {
    const [, path, hash] = m;
    if (!(await exists(path))) err(`enlace roto a ${path}`);
    const self = page.replace(/index\.html$/, '');
    if (hash && hash.length > 1 && path === self && !html.includes(`id="${hash.slice(1)}"`))
      err(`ancla ${hash} no existe en la página`);
  }

  if (!title) err('falta <title>');
  else if (title.length > 70) warn(`<title> largo (${title.length} > 70): «${title}»`);
  if (!desc) err('falta meta description');
  else if (!isLegalOr404 && (desc.length < 70 || desc.length > 160))
    err(`meta description de ${desc.length} caracteres (70–160)`);
  if (!/<link rel="canonical" href="https?:\/\//.test(html)) err('falta canonical absoluto');
  if (!/<html lang="/.test(html)) err('falta lang en <html>');
  if (!robots) err('falta meta robots');

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) err(`tiene ${h1} <h1> (debe haber 1)`);

  for (const img of html.match(/<img\b[^>]*>/g) ?? [])
    // alt vacío (alt o alt="") es válido para imágenes decorativas.
    if (!/\salt(=|[\s>])/.test(img)) err(`imagen sin alt: ${img.slice(0, 80)}`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch {
      err('JSON-LD no válido');
    }
  }
}

for (const w of warnings) console.warn('⚠️ ', w);
for (const e of errors) console.error('❌', e);
console.log(`\n${pages} páginas revisadas · ${errors.length} errores · ${warnings.length} avisos`);
process.exit(errors.length ? 1 : 0);
