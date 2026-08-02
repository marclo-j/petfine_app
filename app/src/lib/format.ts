/** Formateadores de UI en español (Perú), según el diseño: "hace 3 min", "21 patitas". */

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

/** "hace 3 min", "hace 2 h", "hace 3 días". */
export function timeAgo(date: Date | string | number, now: Date = new Date()): string {
  const t = date instanceof Date ? date.getTime() : new Date(date).getTime();
  const diff = Math.max(0, now.getTime() - t);
  if (diff < MIN) return 'hace un momento';
  if (diff < HOUR) return `hace ${Math.floor(diff / MIN)} min`;
  if (diff < DAY) return `hace ${Math.floor(diff / HOUR)} h`;
  if (diff < 7 * DAY) return `hace ${Math.floor(diff / DAY)} días`;
  return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(t);
}

/** Formato de marca de tiempo para el chat, ej. "30 jul, 9:41 a. m.". */
export function formatChatTimestamp(date: Date | string | number): string {
  const t = new Date(date);
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(t);
}

/**
 * Conteos compactos al estilo del diseño: 21 -> "21", 1200 -> "1.2k".
 * El parámetro `unit` permite el vocabulario de la app ("patitas").
 */
export function formatCount(count: number, unit: string): string {
  const n = count >= 1000 ? `${(count / 1000).toFixed(1).replace('.0', '')}k` : String(count);
  return `${n} ${unit}`;
}
