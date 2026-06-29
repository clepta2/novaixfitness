export function formatDateBR(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export function formatRelativeDate(dateStr) {
  if (!dateStr) return 'Sem data';
  const diff = Math.floor((new Date() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export function formatTimeBR(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('pt-BR');
}

export function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes}min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}min` : `${h}h`;
}

export function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function isToday(dateStr) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export function isSameDay(a, b) {
  if (!a || !b) return false;
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function getDaysBetween(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}
