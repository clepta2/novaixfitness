// src/data/bannedWordsData.ts
// Listas de palavras bloqueadas e padroes

export const BANNED_WORDS: Record<string, string[]> = {
  severe: [
    'filho da puta', 'filhos da puta', 'fdp', 'caralho', 'cu', 'buceta', 'piranha', 'puta',
    'arrombado', 'arrombada', 'cuzao', 'desgracado', 'desgracada', 'desgraca',
    'viado', 'bicha', 'bichona', 'retardado', 'retardada', 'deficiente mental',
    'mongol', 'mongoloide', 'nazi', 'nazista', 'hitler',
  ],
  moderate: [
    'idiota', 'imbecil', 'burro', 'burra', 'burrice', 'otario', 'otaria',
    'animal', 'jumento', 'cavalo', 'lixo', 'porcaria', 'merda', 'bosta',
    'corno', 'corna', 'chifrudo', 'fedido', 'fedida', 'cheiroso',
    'gordo', 'gorda', 'baleia', 'porco', 'magro', 'magra', 'ossudo',
    'feio', 'feia', 'horripilante', 'nojento', 'nojenta', 'asqueroso',
  ],
  spam: [
    'clique aqui', 'clique agora', 'ganhe dinheiro', 'trabalhe de casa',
    'renda extra', 'oportunidade unica', 'compre agora', 'promocao relampago',
    'free money', 'click here', 'make money fast', 'whatsapp', 'telegram',
    'pix', 'transferencia', 'conta bancaria', 'investimento garantido',
  ],
  drugs: [
    'maconha', 'cocaina', 'crack', 'lsd', 'mdma', 'ecstasy',
    'anabolizante', 'esteroid', 'hgh', 'testosterona',
    'droga', 'narcotico', 'entorpecente',
  ],
  violence: [
    'arma', 'arma de fogo', 'revolver', 'pistola', 'fuzil',
    'matar', 'assassinar', 'morte', 'suicidio',
    'bater', 'agredir', 'violencia',
  ],
};

export const ALLOWED_WORDS = ['cu', 'bicha', 'merda', 'porco', 'lixo', 'gordo', 'magro', 'feio'];

export const SPAM_PATTERNS = [
  { pattern: /(.)\1{5,}/, type: 'repetition', severity: 'moderate' },
  { pattern: /https?:\/\/[^\s]+\.(ru|cn|tk|ml|ga|cf)/i, type: 'suspicious_url', severity: 'severe' },
  { pattern: /\(\d{2}\)\s*\d{4,5}-?\d{4}/, type: 'phone_number', severity: 'spam' },
  { pattern: /\d{11}/, type: 'phone_number', severity: 'spam' },
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, type: 'email', severity: 'spam' },
  { pattern: /^[^a-záàãâéêíóôõúç]*$/, type: 'caps_lock', severity: 'moderate' },
  { pattern: /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]{10,}/u, type: 'emoji_flood', severity: 'moderate' },
];

export const TOXICITY_PATTERNS = [
  { pattern: /vou te matar|matar voce|te destruir|acabar com voce/i, type: 'threat', severity: 'severe' },
  { pattern: /vou te encontrar|sei onde voce mora|seu endereco/i, type: 'harassment', severity: 'severe' },
  { pattern: /macaco|crioulo|preto doinferno|judeu lixo/i, type: 'discrimination', severity: 'severe' },
  { pattern: /nude|nua|pelada|safada|delicia/i, type: 'sexual', severity: 'moderate' },
];

export const IMAGE_RULES = {
  maxSizeKB: 5120, minWidth: 200, minHeight: 200,
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
  suspiciousPatterns: [/hack/i, /exploit/i, /cheat/i, /spam/i],
};

export const USERNAME_BLACKLIST = [
  'admin', 'administrator', 'moderador', 'moderator',
  'suporte', 'support', 'novaix', 'oficial', 'sistema', 'system', 'bot',
];
