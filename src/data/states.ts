// src/data/states.ts
// Lista de estados brasileiros - NOVAIX FITNESS

interface Estado {
  sigla: string;
  nome: string;
}

export const ESTADOS: Estado[] = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
];

export const WEEKDAYS: string[] = ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'];
export const MONTH_NAMES: string[] = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export function formatCEP(v: string): string {
  const clean = v.replace(/\D/g, '').slice(0, 8);
  return clean.length <= 5 ? clean : `${clean.slice(0, 5)}-${clean.slice(5)}`;
}

export function formatDate(v: string): string {
  const clean = v.replace(/\D/g, '').slice(0, 8);
  if (clean.length <= 2) return clean;
  if (clean.length <= 4) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4)}`;
}

export function isDateValid(dateString: string): boolean {
  if (dateString.length !== 10) return false;
  const [day, month, year] = dateString.split('/').map(Number);
  if (!day || !month || !year) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) monthLengths[1] = 29;
  if (day > monthLengths[month - 1]) return false;
  const currentYear = new Date().getFullYear();
  if (year < 1920 || year > currentYear - 10) return false;
  return true;
}
