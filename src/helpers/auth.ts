// src/helpers/auth.ts
// Helpers de autenticação - NOVAIX FITNESS

export const getClientIp = async (): Promise<string> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeout);
    const ipJson = await res.json();
    return ipJson.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};
