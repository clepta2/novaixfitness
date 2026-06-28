# ============================================
# NOVAIX FITNESS - Backend API
# ============================================

# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar dependências primeiro (melhor cache)
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# ============================================
# Production stage
# ============================================

FROM node:22-alpine AS production

WORKDIR /app

# Criar usuário não-root
RUN addgroup -g 1001 -S novaix && \
    adduser -S novaix -u 1001

# Copiar dependências do builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Copiar código fonte
COPY --from=builder /app/src ./src

# Configurar permissões
RUN chown -R novaix:novaix /app

USER novaix

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1) })"

EXPOSE 3000

CMD ["node", "src/server.js"]
