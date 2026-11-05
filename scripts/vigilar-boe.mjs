/**
 * VIGILANTE DEL BOE
 * ------------------------------------------------------------------
 * Comprueba en la API de datos abiertos del BOE si han cambiado las normas que citan
 * nuestras guías: disposiciones nuevas que las modifican o bloques de texto actualizados.
 * Compara con la referencia guardada en scripts/boe-vigilancia.json.
 *
 *   npm run vigilar-boe               → informa de los cambios (sale con código 2 si hay)
 *   npm run vigilar-boe -- --guardar  → además guarda la situación actual como referencia
 *
 * En GitHub se ejecuta cada lunes (.github/workflows/vigilar-boe.yml): si hay cambios,
 * abre un aviso (issue) con las guías afectadas y actualiza la referencia.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const REF = new URL('scripts/boe-vigilancia.json', root);
const API = 'https://www.boe.es/datosabiertos/api/legislacion-consolidada/id';

/** Normas vigiladas. El id es el del BOE (aparece en la URL del texto consolidado). */
const NORMAS = {
  'BOE-A-2022-10297': 'Real Decreto 487/2022 (Legionella)',
  'BOE-A-2023-628': 'Real Decreto 3/2023 (agua de consumo)',
  'BOE-A-2013-10580': 'Real Decreto 742/2013 (piscinas)',
};

async function api(id, path) {
  const res = await fetch(`${API}/${id}/${path}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${id}/${path}: HTTP ${res.status}`);
  const json = await res.json();
  return json.data;
}

/** Situación actual de una norma: disposiciones posteriores y fecha del bloque más reciente. */
async function estado(id) {
  const [analisis, indice] = await Promise.all([api(id, 'analisis'), api(id, 'texto/indice')]);
  const posteriores = (analisis?.[0]?.referencias?.posteriores ?? [])
    .flatMap((p) => p.posterior ?? [])
    .map((p) => `${p.id_norma} · ${p.relacion?.texto ?? ''} ${p.texto ?? ''}`.trim())
    .sort();
  const bloques = indice?.[0]?.bloque ?? [];
  const textoActualizado = bloques.reduce(
    (max, b) => (b.fecha_actualizacion > max ? b.fecha_actualizacion : max),
    '',
  );
  return { posteriores, textoActualizado };
}

/** Guías y servicios que citan una norma (por su id del BOE). */
async function afectadas(id) {
  const out = [];
  for (const col of ['guias', 'servicios']) {
    const dir = new URL(`src/content/${col}/`, root);
    for (const f of (await readdir(dir)).filter((x) => x.endsWith('.md'))) {
      const md = await readFile(new URL(f, dir), 'utf8');
      if (md.includes(id)) out.push(`src/content/${col}/${f}`);
    }
  }
  const datos = await readFile(new URL('src/data/frecuencias.ts', root), 'utf8');
  if (datos.includes(id)) out.push('src/data/frecuencias.ts (calculadora y checklist)');
  return out;
}

const guardar = process.argv.includes('--guardar');
const referencia = JSON.parse(await readFile(REF, 'utf8').catch(() => '{}'));
const actual = {};
const cambios = [];

for (const [id, nombre] of Object.entries(NORMAS)) {
  const now = await estado(id);
  actual[id] = { nombre, ...now };
  const prev = referencia[id];
  if (!prev) continue; // primera vez: solo se guarda la referencia
  const nuevas = now.posteriores.filter((p) => !prev.posteriores.includes(p));
  const textoCambiado = now.textoActualizado !== prev.textoActualizado;
  if (nuevas.length || textoCambiado) {
    cambios.push({
      id,
      nombre,
      nuevas,
      textoCambiado,
      antes: prev.textoActualizado,
      ahora: now.textoActualizado,
      afectadas: await afectadas(id),
    });
  }
}

if (!cambios.length) {
  console.log('Sin cambios en las normas vigiladas.');
} else {
  const md = [
    'El BOE ha publicado cambios en normas que citan nuestras guías. Revisa los textos afectados y actualiza la fecha `updated` de cada guía que cambies.',
    '',
    ...cambios.flatMap((c) => [
      `### ${c.nombre}`,
      `Texto consolidado: https://www.boe.es/buscar/act.php?id=${c.id}`,
      ...(c.textoCambiado ? [`- Texto actualizado: ${c.antes || '—'} → ${c.ahora}`] : []),
      ...c.nuevas.map((n) => `- Nueva disposición: ${n}`),
      '',
      '**Archivos que citan esta norma:**',
      ...(c.afectadas.length ? c.afectadas.map((a) => `- [ ] \`${a}\``) : ['- (ninguno)']),
      '',
    ]),
  ].join('\n');
  await writeFile(new URL('boe-cambios.md', root), md);
  console.log(md);
}

if (guardar || !Object.keys(referencia).length) {
  await writeFile(REF, JSON.stringify(actual, null, 2) + '\n');
  console.log('Referencia guardada en scripts/boe-vigilancia.json');
}
process.exit(cambios.length ? 2 : 0);
