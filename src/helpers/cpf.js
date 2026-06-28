// src/helpers/cpf.js
// Validação e formatação de CPF - NOVAIX FITNESS

export const validateCPF = (c) => {
  const clean = c.replace(/\D/g, '');
  if (clean.length !== 11 || /^(\d)\1{10}$/.test(clean)) return false;
  let s = 0, r;
  for (let i = 1; i <= 9; i++) s += parseInt(clean[i - 1]) * (11 - i);
  r = (s * 10) % 11; if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(clean[9])) return false;
  s = 0;
  for (let i = 1; i <= 10; i++) s += parseInt(clean[i - 1]) * (12 - i);
  r = (s * 10) % 11;
  return (r === 10 || r === 11 ? 0 : r) === parseInt(clean[10]);
};

export const formatCPF = (v) => {
  const n = v.replace(/\D/g, '').slice(0, 11);
  if (n.length <= 3) return n;
  if (n.length <= 6) return `${n.slice(0, 3)}.${n.slice(3)}`;
  if (n.length <= 9) return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6)}`;
  return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9, 11)}`;
};
