#!/bin/bash
# ============================================
# NOVAIX FITNESS - Script de Deploy
# ============================================

set -e

echo "🚀 Iniciando deploy do NOVAIX Backend..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale: https://docs.docker.com/get-docker/"
    exit 1
fi

# Verificar se docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não encontrado. Instale: https://docs.docker.com/compose/install/"
    exit 1
fi

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "   Copie .env.example para .env e configure as variáveis."
    exit 1
fi

echo "📦 Construindo imagens Docker..."
docker-compose build

echo "🔄 Parando containers antigos..."
docker-compose down

echo "🚀 Iniciando serviços..."
docker-compose up -d

echo "⏳ Aguardando health check..."
sleep 10

# Verificar se o container está rodando
if docker-compose ps | grep -q "novaix-api.*Up"; then
    echo "✅ Deploy concluído com sucesso!"
    echo "   API: http://localhost:${PORT:-3000}"
    echo "   Health: http://localhost:${PORT:-3000}/health"
else
    echo "❌ Erro ao iniciar container. Verifique logs:"
    docker-compose logs api
    exit 1
fi
