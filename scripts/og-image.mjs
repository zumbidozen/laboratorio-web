/**
 * Genera public/og-default.png (1200×630), la imagen que se ve al compartir
 * la web en redes y mensajería. Ejecuta `npm run og` tras cambiar el nombre
 * o el lema en src/config/site.ts. Requiere Playwright con Chromium.
 */
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const src = await readFile(new URL('../src/config/site.ts', import.meta.url), 'utf8');
const pick = (key) => src.match(new RegExp(`${key}:\\s*'([^']*)'`))?.[1] ?? '';
const name = pick('name');
const tagline = pick('tagline');
const logo = await readFile(new URL('../public/favicon.svg', import.meta.url), 'utf8');

const html = `<!doctype html><html><body style="margin:0">
<div style="width:1200px;height:630px;box-sizing:border-box;padding:80px;display:flex;flex-direction:column;justify-content:space-between;
  background:radial-gradient(900px 500px at 100% 0%,rgba(20,184,166,.45),transparent 60%),#0a1d26;color:#fff;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif">
  <div style="display:flex;align-items:center;gap:24px;font-size:40px;font-weight:700">
    <div style="width:88px;height:88px">${logo}</div>${name}
  </div>
  <div style="font-size:64px;font-weight:700;line-height:1.15;max-width:960px">${tagline}</div>
  <div style="font-size:30px;opacity:.85">Legionella · Agua de consumo · Piscinas · Torres</div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: new URL('../public/og-default.png', import.meta.url).pathname });
await browser.close();
console.log('public/og-default.png generado');
