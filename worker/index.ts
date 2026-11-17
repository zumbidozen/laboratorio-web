/**
 * Worker de Cloudflare de la web.
 * - La web es estática (carpeta dist/) y la sirve Cloudflare (binding ASSETS).
 * - Redirige con un 301 los otros dominios (www.ensayum.es, ensayum.com…) y http al dominio
 *   principal, que es site.url.
 * - POST /api/formulario: guarda cada envío en la base de datos D1 (binding DB) y avisa por
 *   email (binding EMAIL) a la dirección AVISOS_PARA.
 * Configuración en wrangler.jsonc; pasos en docs/cloudflare.md.
 */
import { site } from '../src/config/site';

interface D1Like {
  exec(sql: string): Promise<unknown>;
  prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
}

interface EmailLike {
  send(message: {
    to: string;
    from: string | { email: string; name?: string };
    subject: string;
    text: string;
    replyTo?: string;
  }): Promise<{ messageId: string }>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Base de datos D1 con los envíos (opcional hasta que se cree). */
  DB?: D1Like;
  /** Envío de email de Cloudflare (gratis hacia direcciones verificadas de la cuenta). */
  EMAIL?: EmailLike;
  /** Buzón que recibe los avisos (debe estar verificado en Email Routing). */
  AVISOS_PARA?: string;
  /** Remitente de los avisos, de un dominio dado de alta en Email Sending. */
  AVISOS_DESDE?: string;
}

/** Campos técnicos que no se copian como datos del formulario. */
const META = new Set(['form-name', 'empresa-web', 'exito', 'privacidad', 'pagina', 'llegada']);
const MAX_BYTES = 64 * 1024;
const MAX_CAMPOS = 40;
const MAX_VALOR = 5000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esquema = `CREATE TABLE IF NOT EXISTS envios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fecha TEXT NOT NULL,
  formulario TEXT NOT NULL,
  pagina TEXT,
  llegada TEXT,
  email TEXT,
  datos TEXT NOT NULL
)`;

/** Solo rutas internas de la web como destino tras enviar (evita redirecciones abiertas). */
function destino(valor: string, base: URL): URL {
  const ok = /^\/(?!\/)[\w\-/.]*$/.test(valor);
  return new URL(ok ? valor : '/contacto/gracias/', base);
}

function pagina(titulo: string, texto: string, estado: number): Response {
  const html = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>${titulo}</title><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1rem;color:#0b3c5d"><h1 style="font-weight:400">${titulo}</h1><p>${texto}</p><p><a href="javascript:history.back()">Volver al formulario</a></p></body></html>`;
  return new Response(html, {
    status: estado,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

async function recibirFormulario(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);

  // Solo formularios enviados desde la propia web.
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== url.host) {
    return pagina('No se ha podido enviar', 'El formulario no viene de esta web.', 403);
  }
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BYTES) {
    return pagina('No se ha podido enviar', 'El mensaje es demasiado largo.', 413);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return pagina('No se ha podido enviar', 'El formulario ha llegado incompleto.', 400);
  }
  const texto = (k: string) => String(form.get(k) ?? '').trim();
  const exito = destino(texto('exito'), url);

  // Campo trampa relleno: es un robot. Se le responde como si todo fuera bien.
  if (texto('empresa-web')) return Response.redirect(exito.toString(), 303);

  const formulario = texto('form-name');
  if (!/^[a-z0-9-]{1,40}$/.test(formulario)) {
    return pagina('No se ha podido enviar', 'Falta el nombre del formulario.', 400);
  }
  if (!form.get('privacidad')) {
    return pagina(
      'Falta un paso',
      'Para enviar el formulario hay que aceptar la política de privacidad.',
      400,
    );
  }

  const datos: [string, string][] = [];
  for (const [clave, valor] of form.entries()) {
    if (META.has(clave) || typeof valor !== 'string') continue;
    if (datos.length >= MAX_CAMPOS) break;
    const v = valor.trim().slice(0, MAX_VALOR);
    if (v) datos.push([clave.slice(0, 60), v]);
  }
  const email = datos.find(([k, v]) => k === 'email' && EMAIL_RE.test(v))?.[1] ?? '';
  const fecha = new Date().toISOString();

  let guardado = false;
  let avisado = false;

  if (env.DB) {
    try {
      await env.DB.exec(esquema.replace(/\s+/g, ' '));
      await env.DB.prepare(
        'INSERT INTO envios (fecha, formulario, pagina, llegada, email, datos) VALUES (?, ?, ?, ?, ?, ?)',
      )
        .bind(
          fecha,
          formulario,
          texto('pagina'),
          texto('llegada'),
          email,
          JSON.stringify(Object.fromEntries(datos)),
        )
        .run();
      guardado = true;
    } catch (e) {
      console.error('D1', e);
    }
  }

  if (env.EMAIL && env.AVISOS_PARA && env.AVISOS_DESDE) {
    const quien = datos.find(([k]) => ['empresa', 'nombre', 'email'].includes(k))?.[1] ?? '';
    const cuerpo = [
      `Formulario: ${formulario}`,
      `Fecha: ${fecha}`,
      `Página: ${texto('pagina') || '—'}`,
      `Llegó desde: ${texto('llegada') || '—'}`,
      '',
      ...datos.map(([k, v]) => `${k}: ${v}`),
    ].join('\n');
    try {
      await env.EMAIL.send({
        to: env.AVISOS_PARA,
        from: { email: env.AVISOS_DESDE, name: `Web ${site.name}` },
        subject: `Web · ${formulario}${quien ? ` · ${quien}` : ''}`.slice(0, 200),
        text: cuerpo,
        replyTo: email || undefined,
      });
      avisado = true;
    } catch (e) {
      console.error('EMAIL', e);
    }
  }

  if (!guardado && !avisado) {
    return pagina(
      'No se ha podido enviar',
      'Ha fallado algo por nuestra parte. Inténtalo de nuevo en unos minutos.',
      500,
    );
  }
  return Response.redirect(exito.toString(), 303);
}

const principal = new URL(site.url);

/** Dominios de prueba (vista previa de Cloudflare y desarrollo local): no se redirigen. */
const esPrueba = (host: string) =>
  host.endsWith('.workers.dev') || host === 'localhost' || host === '127.0.0.1';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const otroDominio = url.hostname !== principal.hostname && !esPrueba(url.hostname);
    const sinHttps = url.hostname === principal.hostname && url.protocol === 'http:';
    if (otroDominio || sinHttps) {
      return Response.redirect(`${principal.origin}${url.pathname}${url.search}`, 301);
    }
    if (url.pathname === '/api/formulario') {
      if (request.method !== 'POST') {
        return new Response('Método no permitido', { status: 405, headers: { Allow: 'POST' } });
      }
      return recibirFormulario(request, env);
    }
    // Cualquier otra ruta: la web estática (incluida la página 404).
    return env.ASSETS.fetch(request);
  },
};
