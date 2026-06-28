// src/helpers/auth.js
// Helpers de autenticação - NOVAIX FITNESS

export const getClientIp = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const ipJson = await res.json();
    return ipJson.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};
