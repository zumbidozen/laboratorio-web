# Instrucciones para agentes de IA

Web estática en Astro de un laboratorio de análisis de aguas en Madrid que vende sobre todo a empresas de servicios (B2B). Todo en español de España.

## Comandos

- `npm run dev`: servidor local en http://localhost:4321
- `npm run verify`: tipos + compilación + revisión SEO + formato. Ejecútalo antes de dar un cambio por terminado; debe acabar sin errores.
- `npm run format`: aplica Prettier.

## Dónde va cada cambio

- Datos globales (nombre, dominio, contacto, menú, indexación, acreditación): solo `src/config/site.ts`. Nunca escribas el nombre, el email o el dominio a mano en una página o componente: léelos de `site`.
- Contenido: `src/content/{servicios,sectores,guias}/*.md` y `src/content/faq.yaml`. Los esquemas están en `src/content.config.ts`; si añades un campo, añádelo allí.
- Textos de bloques de la portada y de "Cómo trabajamos": `src/data/home.ts`.
- Estilos: variables en `:root` de `src/styles/global.css`. Los componentes usan esas variables; no metas colores sueltos.
- Una página nueva va en `src/pages/` usando `BaseLayout` con `title`, `description` (70–160 caracteres) y `breadcrumbs`. Si es contenido repetible, mejor crea una colección.

## Reglas que no se pueden saltar

1. **Acreditación ENAC.** Con `site.accreditation.ownEnac === false`, no escribas que somos laboratorio acreditado, que estamos "en proceso de acreditación" ni uses la marca ENAC como propia. Fórmula permitida: "los ensayos que requieren acreditación los realiza y firma un laboratorio acreditado por ENAC, identificado en cada informe".
2. **Sin precios** en la web: la tarifa es por volumen y bajo petición.
3. **No inventes datos**: plazos, normas, parámetros y compromisos salen del plan de negocio o del equipo. Si falta un dato, pregunta o deja un TODO, no lo rellenes.
4. **Una sola `<h1>` por página** (la pone `PageHeader`). En Markdown, los títulos empiezan en `##`.
5. **`summary`** responde en 1–2 frases a la pregunta de la página. Va primero en pantalla, en `llms.txt` y en las versiones `.md`.
6. Servicios aún no disponibles: `status: proximamente` + `availableFrom`, nunca texto que diga que ya se hacen.
7. Nada de dependencias, scripts de terceros, analítica ni cookies sin pedirlo: la página de cookies dice que no hay.

## SEO e IA (ya resuelto; no lo dupliques)

- `src/components/Seo.astro`: title, description, canonical, robots, Open Graph, Twitter y JSON-LD.
- `src/lib/schema.ts`: nodos schema.org (ProfessionalService, WebSite, Service, Article, FAQPage, BreadcrumbList). Las páginas pasan los suyos en la prop `schema`.
- `src/pages/robots.txt.ts`, `llms.txt.ts`, `llms-full.txt.ts`, `rss.xml.ts` y `*/[slug].md.ts` se generan solos a partir del contenido.
- `site.indexable` es el interruptor de lanzamiento: en `false` todo lleva noindex y robots.txt bloquea.
