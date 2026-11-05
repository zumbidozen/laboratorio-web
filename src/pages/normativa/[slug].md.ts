/** Versión Markdown de cada página por norma: /normativa/<id>.md */
import type { APIRoute, GetStaticPaths } from 'astro';
import { getEntries, type CollectionEntry } from 'astro:content';
import { getGuias, getNormativa, guiasDeNorma } from '@/lib/content';
import { markdownResponse } from '@/lib/markdown';
import { normaMd } from '@/lib/referencia';

export const getStaticPaths = (async () => {
  const [normas, guias] = await Promise.all([getNormativa(), getGuias()]);
  return normas.map((entry) => ({
    params: { slug: entry.id },
    props: { entry, guias: guiasDeNorma(entry, guias) },
  }));
}) satisfies GetStaticPaths;

interface Props {
  entry: CollectionEntry<'normativa'>;
  guias: CollectionEntry<'guias'>[];
}

export const GET: APIRoute<Props> = async ({ props }) => {
  const servicios = await getEntries(props.entry.data.services);
  return markdownResponse(normaMd(props.entry, props.guias, servicios));
};
