# Regras de Seguranca — NOVAIX FITNESS

Arquivo obrigatorio de referencia para IA e desenvolvedores.
Qualquer codigo que violar estas regras deve ser reescrito antes do merge.

---

## REGRA 0: Nunca criar codigo que facilite ataques

- Nunca simplificar seguranca "por enquanto". Codigo de protecao vai direto ao commit final.
- Nunca usar `Math.random()` para tokens, senhas ou chaves criptograficas.
- Nunca armazenar senhas, CPFs, cartoes ou dados de saude em plaintext.
- Nunca logar dados sensiveis em console (nem em __DEV__).
- Nunca hardcodar secrets no codigo fonte. Sempre via variavel de ambiente.

## REGRA 1: Criptografia real, nunca falsa

**PROIBIDO:**
- Usar SHA256/MD5 como "criptografia" — hashes sao one-way, nao reversiveis.
- Prefixar strings com "encrypted_" como se fosse criptografia.
- Usar btoa/atob como criptografia.

**OBRIGATORIO:**
- Dados criptografados devem ser DECRYPTAVEIS. Se voce nao consegue recuperar o original, e hash, nao criptografia.
- Usar AES-GCM-256 ou equivalente para criptografia simetrica.
- Chaves derivadas de senha: PBKDF2 com no minimo 100.000 iteracoes.
- IV (Initialization Vector) unico por operacao, armazenado junto ao ciphertext.
- Formato: `iv:ciphertext:tag` (base64).

```typescript
// CORRETO
const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
// REVERSO — decrypt recupera o dado original

// ERRADO
const hash = crypto.createHash('sha256').update(data).digest('hex');
// NAO REVERSO — o dado original e perdido
```

## REGRA 2: Idempotencia em operacoes financeiras

**PROIBIDO:**
- Enviar pagamentos, reembolsos ou descontos sem Idempotency-Key.
- Processar webhooks sem verificar se ja foram processados.

**OBRIGATORIO:**
- Toda chamada POST/PUT/PATCH financeira deve incluir header `Idempotency-Key`.
- Formato da chave: `{acao}_{userId}_{timestamp ou ciclo}` — unica e imutavel.
- Webhooks devem usar dedup por `event_id` antes de processar.
- Falha de rede deve reenviar com a MESMA chave, nao gerar nova.

```typescript
// CORRETO
await fetch(url, {
  headers: { 'Idempotency-Key': `desafio_${userId}_${ciclo}` }
});

// ERRADO — pode causar cobranca duplicada
await fetch(url, { /* sem idempotency key */ });
```

## REGRA 3: JWT com TTL curto + Refresh Token + Blocklist

**PROIBIDO:**
- JWT com duracao superior a 15 minutos.
- Aceitar token revogado porque nao existe mecanismo de revogacao.
- Armazenar Refresh Token em localStorage (usar SecureStore/cookie httpOnly).

**OBRIGATORIO:**
- Access Token: max 15 minutos de vida.
- Refresh Token: armazenado de forma segura, rotacionado a cada uso.
- Blocklist: ao deslogar/bloquear usuario, adicionar jti do token a blocklist.
- Middleware deve verificar blocklist antes de aceitar token.

```typescript
// CORRETO — verifica blocklist
const isBlocked = await redis.get(`jwt:blocklist:${tokenId}`);
if (isBlocked) return res.status(401);
```

## REGRA 4: Validacao de Webhook com HMAC

**PROIBIDO:**
- Validar webhook com comparacao de string simples (`token === expected`).
- Aceitar webhooks sem verificacao de assinatura.

**OBRIGATORIO:**
- Verificar assinatura HMAC-SHA256 do payload.
- Usar `crypto.timingSafeEqual()` para comparacao (previne timing attacks).
- Rejeitar webhooks com assinatura invalida, mesmo em __DEV__.

```typescript
// CORRETO
const expectedSig = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
const isValid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));

// ERRADO — vulneravel a timing attack
if (token === process.env.WEBHOOK_SECRET) { ... }
```

## REGRA 5: Rate Limiting server-side obrigatorio

**PROIBIDO:**
- Confiar apenas em rate limiting client-side (bypassavel por reset do app).
- Nao ter limitacao de chamadas no backend.

**OBRIGATORIO:**
- Middleware server-side que limita chamadas por IP e por usuario.
- Diferentes limites por acao: login (5/min), registro (3/hora), API geral (100/min).
- Bloqueio progressivo: 1 min -> 5 min -> 30 min -> ban.
- Resposta 429 com header `Retry-After`.

## REGRA 6: Sanitizacao em todo boundary de entrada

**PROIBIDO:**
- Receber input do usuario e enviar direto ao banco ou para tela.
- Montar queries SQL com concatenacao de strings.

**OBRIGATORIO:**
- Sanitizar TODO input: API, forms, URLs, headers customizados.
- Usar queries parametrizadas ou ORM.
- Detectar padroes de injection: `<script`, `UNION SELECT`, `DROP TABLE`, `../`.
- Truncar inputs longos antes de processar.

## REGRA 7: Secret Rotation e gestao de chaves

**PROIBIDO:**
- Chaves de API fixas no codigo por mais de 90 dias.
- Mesma chave de criptografia para todos os usuarios.

**OBRIGATORIO:**
- Secrets via variavel de ambiente, nunca hardcoded.
- Rotacao de chaves a cada 90 dias no minimo.
- Cada usuario deve ter sua propria chave de criptografia derivada da senha.
- Em producao, usar Secret Manager (Vault, AWS Secrets Manager, Doppler).

## REGRA 8: Deteccao de dispositivo comprometido

**PROIBIDO:**
- Root detection como stub vazio (so retorna `{ rooted: false }`).
- Ignorar root/jailbreak em fluxos de pagamento.

**OBRIGATORIO:**
- Verificar indicadores reais de root/jailbreak.
- Em dispositivo comprometido: bloquear pagamentos, exigir reautenticacao, alertar usuario.
- Log de tentativas suspeitas no audit log.

## REGRA 9: Zero-Knowledge para dados sensiveis

**PROIBIDO:**
- Enviar CPF, cartao, dados de saude em plaintext para o Supabase.
- Confiar que o Supabase so tem acesso controlado por RLS (RLS pode ser desconfigurado).

**OBRIGATORIO:**
- Dados sensiveis criptografados NO CLIENTE antes de enviar ao servidor.
- Servidor recebe apenas ciphertext — nao tem a chave para descriptografar.
- Descryptacao local, so no dispositivo do usuario.
- Chave derivada da senha do usuario (PBKDF2/scrypt).

## REGRA 10: Logging e auditoria

**PROIBIDO:**
- Logar dados sensiveis (CPF, senhas, tokens) em qualquer destino.
- Ignorar falhas de seguranca silenciosamente.

**OBRIGATORIO:**
- Audit log para toda acao critica: login, pagamento, exclusao, alteracao de dados.
- Logs incluem: timestamp, userId, acao, IP, resultado (sucesso/falha).
- Alertas automaticos para: 5+ falhas de login, tentativas de injection, root detectado.
- Logs retidos por minimo 90 dias.

---

## Checklist de Seguranca por PR

```
[ ] Criptografia e reversivel (nao e hash)?
[ ] Idempotency-Key em chamadas financeiras?
[ ] JWT com TTL <= 15min?
[ ] Webhook valida assinatura HMAC?
[ ] Rate limiting server-side ativo?
[ ] Input sanitizado em todo boundary?
[ ] Secrets via env, hardcoded?
[ ] Root detection funcional?
[ ] Dados sensiveis criptografados client-side?
[ ] Audit log para acoes criticas?
```
