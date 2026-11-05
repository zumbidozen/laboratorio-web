# Ensayum · web

Web de Ensayum, laboratorio de ensayos microbiológicos y ambientales en Madrid. Está hecha con [Astro](https://astro.build): genera HTML estático, rapidísimo y fácil de indexar, sin base de datos ni servidor.

- **SEO**: título, descripción, canonical, Open Graph, datos estructurados (schema.org), sitemap, RSS, migas de pan y revisión automática en cada cambio.
- **IA**: `/llms.txt`, `/llms-full.txt`, versión Markdown de cada ficha (`/servicios/legionella.md`), robots.txt que permite a los asistentes de IA citar la web y textos con la respuesta directa al principio.
- **Cambios rápidos**: el contenido son archivos Markdown y YAML; los datos globales están en un solo archivo.

## Puesta en marcha

Requisitos: Node 22 o superior.

```bash
npm install
```

```bash
npm run dev
```

Abre http://localhost:4321. Los cambios se ven al guardar.

## Dónde se cambia cada cosa

| Quiero cambiar…                                            | Archivo                                                   |
| ---------------------------------------------------------- | --------------------------------------------------------- |
| Nombre, dominio, email, teléfono, dirección, menú, botón   | `src/config/site.ts`                                      |
| Activar la indexación en Google al lanzar                  | `src/config/site.ts` → `indexable: true`                  |
| Colores, tipografía, espaciados                            | `src/styles/global.css` (bloque `:root`)                  |
| Un análisis o servicio                                     | `src/content/servicios/<nombre>.md`                       |
| Un sector (para quién)                                     | `src/content/sectores/<nombre>.md`                        |
| Una guía o artículo                                        | `src/content/guias/<nombre>.md`                           |
| Páginas por norma (RD 487/2022, RD 3/2023, piscinas)       | `src/content/normativa.yaml`                              |
| Frecuencias de análisis (calculadora y tabla resumen)      | `src/data/frecuencias.ts`                                 |
| Preguntas frecuentes generales                             | `src/content/faq.yaml`                                    |
| Ventajas, pasos y plazos de la portada y "Cómo trabajamos" | `src/data/home.ts`                                        |
| Textos legales                                             | `src/pages/aviso-legal.md`, `privacidad.md`, `cookies.md` |
| Imagen al compartir en redes (una por ficha y norma)       | `npm run og` (ejecútalo al crear o renombrar una ficha)   |
| Rastreadores de IA permitidos                              | `src/pages/robots.txt.ts`                                 |
| PDF de informe de ejemplo y cadena de custodia             | `npm run descargables` (los genera desde sus páginas)     |
| Teléfono, WhatsApp y analítica sin cookies                 | `src/config/site.ts` → `contact` y `analytics`            |

### Añadir un servicio nuevo

1. Copia un archivo de `src/content/servicios/` y cámbiale el nombre (será la URL: `analisis-de-pozo.md` → `/servicios/analisis-de-pozo/`).
2. Edita el bloque entre `---` (título, descripción de 70–160 caracteres, resumen…) y el texto de debajo.
3. Guarda. Aparece solo en el listado, en la portada, en el sitemap, en `llms.txt` y en los datos estructurados.

Para que algo salga como "Próximamente", pon `status: proximamente` y `availableFrom: '2028'`. Para ocultarlo sin borrarlo, `draft: true`.

Si falta un campo obligatorio o una descripción es demasiado larga, `npm run build` falla y dice qué archivo y qué campo arreglar.

## Vigilancia del BOE

Cada lunes, GitHub comprueba en la API del BOE si han cambiado el RD 487/2022, el RD 3/2023 o el RD 742/2013. Si hay cambios, abre un aviso (issue) con las guías afectadas. También se puede lanzar a mano en la pestaña Actions → «Vigilar BOE», o en local con `npm run vigilar-boe`.

## Buscador

El buscador (`/buscar/`) usa Pagefind y se genera al compilar. En `npm run dev` no hay resultados: pruébalo con `npm run build && npm run preview`.

## Comprobar antes de publicar

```bash
npm run verify
```

Hace cuatro cosas: comprueba tipos y contenido, compila, revisa el SEO de cada página (un solo H1, título, descripción, canonical, imágenes con `alt`, JSON-LD válido) y comprueba el formato. GitHub Actions lo ejecuta en cada push y en cada pull request.

## Lista de lanzamiento

- [ ] Razón social y CIF en `src/config/site.ts` (el nombre comercial Ensayum ya está).
- [ ] Dominio definitivo en `url`.
- [ ] Email, teléfono, WhatsApp, código postal y municipio (la calle ya está).
- [ ] Formulario: con `contact.form: 'netlify'` funciona solo en Netlify (activa el aviso por email en Netlify → Forms). En otro hosting, pon la URL de Formspree o similar.
- [ ] Horario de atención en `contact.hours`.
- [ ] Textos legales revisados por asesoría.
- [x] Identidad Ensayum aplicada (logotipo, favicon, colores, Jost). Si cambias el lema, ejecuta `npm run og`.
- [ ] Revisión técnica de las guías por el responsable técnico.
- [ ] `indexable: true` y alta en Google Search Console y Bing Webmaster Tools con el sitemap `https://<dominio>/sitemap-index.xml`.

## Publicación

Es una web estática: el comando `npm run build` deja todo en `dist/`. Sirve cualquier hosting estático. Recomendado: **Cloudflare Pages** o **Netlify**, conectados a este repositorio, con:

- Comando de compilación: `npm run build`
- Carpeta de salida: `dist`
- Versión de Node: 22

Cada push a `main` se publica solo, y cada pull request tiene su vista previa.

## Marca

Hoja de marca en `docs/ensayum-hoja-de-marca.pdf`. Azul petróleo `#0B3C5D`, turquesa `#1FB5A8` y coral `#FF6B5B` solo para la colonia del logotipo. Tipografía Jost. Logotipo y símbolo en `public/brand/`.

## Reglas de contenido

- **Acreditación.** Mientras `accreditation.ownEnac` sea `false`, la web no puede decir que somos laboratorio acreditado ni que estamos en proceso, ni usar la marca ENAC. La fórmula correcta: "los ensayos que requieren acreditación los realiza y firma un laboratorio acreditado por ENAC, identificado en cada informe".
- **Precios.** No se publican tarifas: son por volumen y bajo petición.
- **Respuesta primero.** El campo `summary` responde a la pregunta de la página en una o dos frases. Es lo primero que leen Google y los asistentes de IA.
- **Datos, no adjetivos.** Normas con su número, plazos en días, parámetros concretos.

## Estructura

```
src/
  config/site.ts          Datos globales (único sitio para nombre, dominio, contacto, menú)
  content.config.ts       Esquemas que validan el contenido
  content/                Contenido editable (Markdown y YAML)
  data/home.ts            Textos de bloques repetitivos
  layouts/                Plantillas de página
  components/             Piezas reutilizables (SEO, cabecera, pie, tarjetas, FAQ…)
  lib/                    Lectura del contenido, JSON-LD y versión Markdown
  pages/                  Rutas de la web, robots.txt, llms.txt, rss.xml
  styles/global.css       Colores y estilos base
scripts/                  Revisión SEO e imagen para redes
```
