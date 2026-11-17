# Puesta en marcha en Cloudflare

La web se publica en Cloudflare como un **Worker con recursos estáticos**: Cloudflare sirve la carpeta `dist/` tal cual y el código de `worker/index.ts` solo recibe los formularios. Todo cabe en el **plan gratuito**.

| Pieza                           | Dónde                                                                   | Coste                   |
| ------------------------------- | ----------------------------------------------------------------------- | ----------------------- |
| `ensayum.es`                    | Registrador español (Hostalia, Dinahosting…): Cloudflare no vende `.es` | Anual, del registrador  |
| `ensayum.com`                   | Cloudflare Registrar (precio de coste)                                  | Anual                   |
| Web, DNS, HTTPS y formularios   | Cloudflare, plan gratuito                                               | 0 €                     |
| Avisos de formularios por email | Cloudflare Email Service, hacia una dirección verificada                | 0 €                     |
| Envíos guardados                | Cloudflare D1 (base de datos)                                           | 0 € en el plan gratuito |
| Correo `@ensayum.es`            | Zoho Mail o Microsoft 365, un usuario con alias                         | Mensual por usuario     |

Los pasos marcados con **(tú)** necesitan tu cuenta o un pago. El resto lo hago yo con una clave de acceso a Cloudflare, o te digo exactamente dónde pulsar.

## 1. Cuenta y `ensayum.com` (tú)

1. Crea la cuenta en [dash.cloudflare.com](https://dash.cloudflare.com) con el email de la empresa y activa la verificación en dos pasos.
2. Añade un medio de pago.
3. **Registro de dominios → Registrar dominios** → busca `ensayum.com` → cómpralo. Los datos del titular, a nombre de la empresa. La protección de datos del titular (WHOIS) viene activada.

## 2. `ensayum.es` (tú)

1. Cómpralo en el registrador español, **solo el dominio**: sin hosting, sin SSL y sin correo. Titular: la empresa, con su CIF.
2. En Cloudflare: **Añadir un dominio** → `ensayum.es` → plan **Free**.
3. Cloudflare te da dos servidores DNS (del tipo `xxx.ns.cloudflare.com`). Ponlos en el panel del registrador, en «Servidores DNS» o «Nameservers», en lugar de los que trae.
4. En unas horas Cloudflare marca el dominio como **Activo**.

## 3. Correo `@ensayum.es` (tú contratas, yo configuro)

1. Contrata un usuario en Zoho Mail o Microsoft 365 con el dominio `ensayum.es`.
2. El proveedor te pedirá verificar el dominio con un registro TXT y después añadir los registros MX, SPF y DKIM. Pásamelos y los pongo en el DNS de Cloudflare, más un registro DMARC para que los correos no acaben en spam.
3. Crea los alias que quieras (`hola@`, `informes@`, `facturas@`) dentro del mismo usuario.
4. Cuando funcione, pon el email en `src/config/site.ts` → `contact.email`.

## 4. Publicar la web

1. **Workers y Pages → Crear → Importar un repositorio** → GitHub → `zumbidozen/laboratorio-web`, rama `main`. (tú: autorizar a Cloudflare en GitHub)
2. Comando de compilación: `npm run build`. Comando de despliegue: `npx wrangler deploy`. Lo demás lo lee de `wrangler.jsonc`.
3. Variable de compilación: `NODE_VERSION` = `22`.
4. Desde entonces, cada push a `main` se publica solo, y cada rama tiene su vista previa.

## 5. Dominios de la web

1. En el Worker `ensayum` → **Configuración → Dominios y rutas → Añadir dominio personalizado** → `ensayum.es`. Cloudflare crea el registro DNS y el certificado HTTPS.
2. Redirecciones permanentes (301), en **Reglas → Reglas de redirección** (o «Redirecciones masivas»):
   - `www.ensayum.es/*` → `https://ensayum.es/$1`
   - `ensayum.com/*` y `www.ensayum.com/*` → `https://ensayum.es/$1`
   - Los nombres `www` necesitan un registro DNS con proxy (nube naranja) para que la regla actúe.

## 6. Avisos de formularios por email

Los avisos llegan a `info@ensayum.es` y salen de `web@ensayum.com`. Se usa `ensayum.com`, que no tiene buzones, para no tocar los registros de correo de Zoho en `ensayum.es`. Ya está configurado en `wrangler.jsonc`; falta activarlo en Cloudflare (tú):

1. Abre `ensayum.com` → **Correo electrónico → Email Routing → Activar**. Cloudflare añade sus registros a `ensayum.com` (no toca `ensayum.es`).
2. **Direcciones de destino → Añadir** → `info@ensayum.es`. Llega un email de verificación a ese buzón: ábrelo y confirma.

Enviar a una dirección verificada de la propia cuenta es gratis. No hace falta el plan de pago ni dar de alta Email Sending. Si el aviso falla, el envío se guarda igualmente en la base de datos.

## 7. Base de datos de envíos (hecho)

Creada el 16 de noviembre de 2026: `ensayum-formularios`, con **jurisdicción UE** (los datos no salen de la Unión Europea), y ya enlazada en `wrangler.jsonc`. Cada envío se guarda aunque falle el email.

- Consulta: **Almacenamiento y bases de datos → D1 → ensayum-formularios → Consola**, con `SELECT * FROM envios ORDER BY id DESC`.

## 8. Lanzamiento

1. Prueba los cuatro formularios en `https://ensayum.es`: contacto, demo, envases y checklist.
2. Cuando esté todo revisado (textos legales, datos de contacto, guías), pon `indexable: true` en `src/config/site.ts` y da de alta el sitemap en Google Search Console y Bing Webmaster Tools.
3. Borra o pausa la web de Netlify (`ensayum.netlify.app`) para que no haya dos copias.

## Si me das acceso

Para hacer yo los pasos 4–7 necesito una **clave de API de Cloudflare** con permisos de edición de Workers, D1, DNS y Email de la cuenta. Te la pediré con un formulario seguro: nunca la pegues en el chat.

## Probar en local

```bash
npm run build
```

```bash
npx wrangler dev
```

Antes, crea un archivo `.dev.vars` con `AVISOS_PARA=prueba@example.com` y `AVISOS_DESDE=web@example.com` (una línea cada uno; no se sube a GitHub). Abre http://localhost:8787. Los formularios funcionan igual que en Cloudflare: los emails no se envían, se escriben en `.wrangler/tmp/` para revisarlos, y la base de datos es local.
