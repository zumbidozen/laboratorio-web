# Web del laboratorio de aguas

Web del laboratorio de análisis de aguas en Madrid (nombre comercial pendiente). Está hecha con [Astro](https://astro.build): genera HTML estático, rapidísimo y fácil de indexar, sin base de datos ni servidor.

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
| Preguntas frecuentes generales                             | `src/content/faq.yaml`                                    |
| Ventajas, pasos y plazos de la portada y "Cómo trabajamos" | `src/data/home.ts`                                        |
| Textos legales                                             | `src/pages/aviso-legal.md`, `privacidad.md`, `cookies.md` |
| Imagen al compartir en redes                               | `npm run og` (la regenera con el nombre y el lema)        |
| Rastreadores de IA permitidos                              | `src/pages/robots.txt.ts`                                 |

### Añadir un servicio nuevo

1. Copia un archivo de `src/content/servicios/` y cámbiale el nombre (será la URL: `analisis-de-pozo.md` → `/servicios/analisis-de-pozo/`).
2. Edita el bloque entre `---` (título, descripción de 70–160 caracteres, resumen…) y el texto de debajo.
3. Guarda. Aparece solo en el listado, en la portada, en el sitemap, en `llms.txt` y en los datos estructurados.

Para que algo salga como "Próximamente", pon `status: proximamente` y `availableFrom: '2028'`. Para ocultarlo sin borrarlo, `draft: true`.

Si falta un campo obligatorio o una descripción es demasiado larga, `npm run build` falla y dice qué archivo y qué campo arreglar.

## Comprobar antes de publicar

```bash
npm run verify
```

Hace cuatro cosas: comprueba tipos y contenido, compila, revisa el SEO de cada página (un solo H1, título, descripción, canonical, imágenes con `alt`, JSON-LD válido) y comprueba el formato. GitHub Actions lo ejecuta en cada push y en cada pull request.

## Lista de lanzamiento

- [ ] Nombre comercial, razón social y CIF en `src/config/site.ts`.
- [ ] Dominio definitivo en `url`.
- [ ] Email, teléfono y, cuando se firme el local, dirección.
- [ ] Endpoint del formulario en `contact.formEndpoint` (Formspree, Netlify Forms o similar); sin él, la página de contacto muestra el email.
- [ ] Textos legales revisados por asesoría.
- [ ] Logotipo definitivo en `public/favicon.svg` y `npm run og`.
- [ ] Revisión técnica de las guías por el responsable técnico.
- [ ] `indexable: true` y alta en Google Search Console y Bing Webmaster Tools con el sitemap `https://<dominio>/sitemap-index.xml`.

## Publicación

Es una web estática: el comando `npm run build` deja todo en `dist/`. Sirve cualquier hosting estático. Recomendado: **Cloudflare Pages** o **Netlify**, conectados a este repositorio, con:

- Comando de compilación: `npm run build`
- Carpeta de salida: `dist`
- Versión de Node: 22

Cada push a `main` se publica solo, y cada pull request tiene su vista previa.

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
