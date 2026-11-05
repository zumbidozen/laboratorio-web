/**
 * Textos de bloques repetitivos (portada y "Cómo trabajamos").
 * Cambia aquí las frases; las páginas solo las pintan.
 */
import type { IconName } from '@/components/Icon.astro';

/** Cifras clave de la portada. Solo compromisos reales del plan. */
export const stats = [
  { value: '10 días', label: 'máximo para un negativo de Legionella' },
  { value: '< 2 h', label: 'para avisar por teléfono de un positivo en hospitales y residencias' },
  { value: '95 %', label: 'objetivo mensual de muestras dentro de plazo' },
  { value: '1', label: 'factura al mes, con detalle por instalación' },
] as const;

export const promises: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'receipt',
    title: 'Tarifa profesional',
    text: 'Precio por muestra pensado para quien revende el análisis, con descuento por volumen.',
  },
  {
    icon: 'qr',
    title: 'Pedidos sin papel',
    text: 'Pedido online o por API y etiqueta QR en cada envase. Se acabaron las hojas de custodia a mano.',
  },
  {
    icon: 'activity',
    title: 'Estado en tiempo real',
    text: 'Sabes en qué punto está cada muestra y te avisamos en cuanto algo sale fuera de límite.',
  },
  {
    icon: 'file',
    title: 'Informes con tu marca',
    text: 'Tu logotipo en la portada y los datos listos para entregar al titular de la instalación.',
  },
  {
    icon: 'timer',
    title: 'Plazos por contrato',
    text: 'Plazos máximos firmados para cada análisis, con un objetivo de cumplimiento del 95 % mensual.',
  },
  {
    icon: 'code',
    title: 'Integración por API',
    text: 'Los resultados entran solos en tu software de mantenimiento. Sin copiar ni pegar.',
  },
];

/** Comparativa "lo de siempre" frente a "con nosotros". */
export const comparison = [
  {
    before: 'El precio por muestra se come tu margen',
    after: 'Tarifa profesional con descuento por volumen',
  },
  {
    before: 'Pedidos por email y custodia en papel',
    after: 'Pedido online o por API y etiqueta QR',
  },
  { before: 'Informes en PDF que reenvías a mano', after: 'Informe automático con tu logotipo' },
  {
    before: 'No sabes cuándo llega el resultado',
    after: 'Estado en tiempo real y aviso inmediato',
  },
  { before: 'Una factura por cada envío', after: 'Una factura mensual por instalación' },
] as const;

export const steps: { icon: IconName; title: string; text: string }[] = [
  { icon: 'qr', title: 'Pides', text: 'Creas el pedido en el portal o desde tu software por API.' },
  {
    icon: 'truck',
    title: 'Envías',
    text: 'Tomas la muestra, pegas la etiqueta QR y nos la envías refrigerada.',
  },
  {
    icon: 'activity',
    title: 'Sigues',
    text: 'Ves el estado de cada muestra y recibes avisos si algo se sale de límite.',
  },
  {
    icon: 'file',
    title: 'Entregas',
    text: 'Descargas el informe con tu logotipo o lo recibes en tu sistema.',
  },
];

/** Plazos máximos en días naturales desde la recepción válida de la muestra. */
export const turnaround = [
  { analysis: 'Legionella negativa', time: '10 días o menos' },
  { analysis: 'Legionella: aviso de posible positivo', time: '5 días o menos' },
  { analysis: 'Legionella positiva confirmada', time: '14 días o menos' },
  { analysis: 'Aerobios, hierro y físico-químico', time: '4 días o menos' },
  { analysis: 'Piscinas y control en grifo', time: '5 días o menos' },
] as const;
