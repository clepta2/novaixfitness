// src/services/analyticsHelpers.js
// Funcoes auxiliares para analytics

export function getPeriodStart(period: string) {
  const days = { week: 7, month: 30, quarter: 90, year: 365 };
  return new Date(Date.now() - (days[period] || 30) * 86400000).toISOString();
}

export function calculateStreak(dates: string[]) {
  if (dates.length === 0) return 0;
  const sorted = [...new Set(dates)].sort().reverse();
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i - 1]).getTime() - new Date(sorted[i]).getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export function groupByDay(items: Record<string, unknown>[], dateField: string) {
  const byDay: Record<string, number> = {};
  for (const item of items) {
    const day = new Date(item[dateField] as string).toISOString().split('T')[0];
    byDay[day] = (byDay[day] || 0) + 1;
  }
  return byDay;
}

export function sumField(items: Record<string, unknown>[], field: string) {
  return items.reduce((sum, item) => sum + ((item[field] as number) || 0), 0);
}
