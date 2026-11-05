/**
 * Textos de bloques repetitivos (portada y "Cómo trabajamos").
 * Cambia aquí las frases; las páginas solo las pintan.
 */

export const promises = [
  {
    title: 'Tarifa profesional',
    text: 'Precio por muestra pensado para quien revende el análisis, con descuento por volumen.',
  },
  {
    title: 'Pedidos sin papel',
    text: 'Pedido online o por API y etiqueta QR en cada envase. Se acabaron las hojas de custodia a mano.',
  },
  {
    title: 'Estado en tiempo real',
    text: 'Sabes en qué punto está cada muestra y te avisamos en cuanto algo sale fuera de límite.',
  },
  {
    title: 'Informes con tu marca',
    text: 'Tu logotipo en la portada y los datos listos para entregar al titular de la instalación.',
  },
  {
    title: 'Plazos por contrato',
    text: 'Plazos máximos firmados para cada análisis, con un objetivo de cumplimiento del 95 % mensual.',
  },
  {
    title: 'Una factura al mes',
    text: 'Una sola factura mensual con el detalle por instalación.',
  },
] as const;

export const steps = [
  { title: 'Pides', text: 'Creas el pedido en el portal o desde tu software por API.' },
  { title: 'Envías', text: 'Tomas la muestra, pegas la etiqueta QR y nos la envías refrigerada.' },
  {
    title: 'Sigues',
    text: 'Ves el estado de cada muestra y recibes avisos si algo se sale de límite.',
  },
  { title: 'Entregas', text: 'Descargas el informe con tu logotipo o lo recibes en tu sistema.' },
] as const;

/** Plazos máximos en días naturales desde la recepción válida de la muestra. */
export const turnaround = [
  { analysis: 'Legionella negativa', time: '10 días o menos' },
  { analysis: 'Legionella: aviso de posible positivo', time: '5 días o menos' },
  { analysis: 'Legionella positiva confirmada', time: '14 días o menos' },
  { analysis: 'Aerobios, hierro y físico-químico', time: '4 días o menos' },
  { analysis: 'Piscinas y control en grifo', time: '5 días o menos' },
] as const;
