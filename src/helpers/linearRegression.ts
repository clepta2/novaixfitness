// src/helpers/linearRegression.ts
// Regressão linear simples para previsões

export function linearRegression(data: number[]): {
  slope: number;
  intercept: number;
  r2: number;
} {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 0, r2: 0 };

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i;
    sumY += data[i];
    sumXY += i * data[i];
    sumX2 += i * i;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const ssRes = data.reduce((s, y, i) => s + Math.pow(y - (slope * i + intercept), 2), 0);
  const ssTot = data.reduce((s, y) => s + Math.pow(y - sumY / n, 2), 0);
  const r2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot;

  return { slope, intercept, r2 };
}
