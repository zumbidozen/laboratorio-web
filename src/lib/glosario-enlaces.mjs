/**
 * Complemento de Markdown (procesador Sätteri de Astro): enlaza la primera aparición de cada
 * término del glosario en guías y fichas de servicio con su definición en /glosario/#id.
 * Los términos y sus formas salen de src/content/glosario.yaml (campo `match`).
 * - Siglas en mayúsculas (PPCL, UFC…): distinguen mayúsculas. El resto, no.
 * - No enlaza dentro de títulos, enlaces, código ni tablas; como mucho MAX enlaces por texto.
 */
import { readFileSync } from 'node:fs';

const MAX = 8;
const LETTER = '[\\p{L}\\p{N}]';
const SKIP_INSIDE = new Set(['heading', 'link', 'linkReference', 'table', 'tableRow', 'tableCell']);

function loadTerms() {
  const yaml = readFileSync(new URL('../content/glosario.yaml', import.meta.url), 'utf8');
  const terms = [];
  for (const block of yaml.split(/^(?=- id: )/m)) {
    const id = block.match(/^- id: (\S+)/)?.[1];
    const list = block.match(/^\s+match: \[(.*)\]\s*$/m)?.[1];
    if (!id || !list) continue;
    for (const [, raw] of list.matchAll(/'((?:[^']|'')*)'/g)) {
      const form = raw.replace(/''/g, "'");
      const escaped = form.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
      const caseSensitive = form === form.toUpperCase();
      terms.push({
        id,
        re: new RegExp(`(?<!${LETTER})${escaped}(?!${LETTER})`, caseSensitive ? 'u' : 'iu'),
      });
    }
  }
  return terms;
}

const TERMS = loadTerms();

/** Fábrica: un complemento nuevo (con su propio recuento) por cada documento de guías o servicios. */
export default function glosarioEnlaces({ fileURL }) {
  const path = fileURL?.pathname ?? '';
  if (!/\/src\/content\/(guias|servicios)\//.test(path)) return null;
  const used = new Set();
  let count = 0;

  return {
    name: 'ensayum-glosario-enlaces',
    text(node, ctx) {
      if (count >= MAX) return;
      for (let p = ctx.parent(node); p; p = ctx.parent(p)) if (SKIP_INSIDE.has(p.type)) return;

      // Términos sin usar que aparecen en este texto, en orden de aparición.
      const found = [];
      for (const t of TERMS) {
        if (used.has(t.id)) continue;
        const m = t.re.exec(node.value);
        if (m) found.push({ t, start: m.index, end: m.index + m[0].length, text: m[0] });
      }
      if (!found.length) return;
      found.sort((a, b) => a.start - b.start);

      const parts = [];
      let cursor = 0;
      for (const f of found) {
        if (count >= MAX || f.start < cursor || used.has(f.t.id)) continue;
        used.add(f.t.id);
        count++;
        if (f.start > cursor)
          parts.push({ type: 'text', value: node.value.slice(cursor, f.start) });
        parts.push({
          type: 'link',
          url: `/glosario/#${f.t.id}`,
          title: 'Ver la definición en el glosario',
          data: { hProperties: { className: ['glossary-link'] } },
          children: [{ type: 'text', value: f.text }],
        });
        cursor = f.end;
      }
      if (!parts.length) return;
      if (cursor < node.value.length) parts.push({ type: 'text', value: node.value.slice(cursor) });
      ctx.replaceNode(node, parts);
    },
  };
}
