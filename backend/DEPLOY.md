# 🚀 Guia de Deploy — Backend NOVAIX FITNESS

Este guia detalha o passo a passo para colocar a API do backend em produção de forma persistente utilizando serviços de nuvem modernos como **Render** ou **Railway**.

---

## 📋 Pré-requisitos e Configuração das Variáveis de Ambiente

Antes de iniciar o deploy, você precisará configurar as seguintes variáveis de ambiente no painel da plataforma de hospedagem selecionada:

| Variável | Descrição | Exemplo / Onde Obter |
|---|---|---|
| `SUPABASE_URL` | URL do seu projeto Supabase | Supabase Dashboard > Settings > API |
| `SUPABASE_ANON_KEY` | Chave anônima (anon/public) do Supabase | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço secreta (service_role) do Supabase | Supabase Dashboard > Settings > API (Manter segura) |
| `ASAAS_ENV` | Define o ambiente do Asaas (`production` ou `sandbox`) | `production` (em produção) |
| `ASAAS_API_KEY` | Chave de API gerada no Asaas | Painel do Asaas > Configurações > Integrações |
| `ASAAS_WEBHOOK_TOKEN` | Token do webhook gerado e validado no Asaas | Painel do Asaas > Configurações > Webhooks |

> [!IMPORTANT]
> A variável `PORT` **NÃO** deve ser definida manualmente. Plataformas como Render e Railway injetam automaticamente o valor da porta correta para a sua aplicação escutar em produção.

---

## 🛠️ Opção 1: Deploy no Render (Recomendado & Gratuito)

O [Render](https://render.com) é extremamente simples de integrar com repositórios GitHub e oferece um plano gratuito vitalício para testes.

### Passo a Passo:
1. Acesse o [Render Dashboard](https://dashboard.render.com) e crie uma conta (ou faça login com seu GitHub).
2. Clique em **New +** no canto superior direito e selecione **Web Service**.
3. Conecte o repositório do seu projeto do GitHub.
4. Preencha as configurações do serviço:
   - **Name**: `novaix-backend`
   - **Environment**: `Node`
   - **Region**: Selecione a mais próxima (ex: `Oregon (US West)` ou `Ohio (US East)`)
   - **Branch**: `master` (ou a branch principal que você deseja implantar)
   - **Root Directory**: `backend` (importante, pois o projeto está em um monorepo)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Expanda a seção **Advanced** e clique em **Add Environment Variable** para inserir cada uma das variáveis de ambiente listadas na tabela acima.
6. Clique em **Create Web Service**. O Render iniciará o build e fornecerá uma URL pública (ex: `https://novaix-backend.onrender.com`).

---

## 🛠️ Opção 2: Deploy no Railway (Rápido e Escalável)

O [Railway](https://railway.app) é uma alternativa robusta e rápida que permite fazer o deploy em minutos.

### Passo a Passo:
1. Acesse o [Railway](https://railway.app) e faça login com seu GitHub.
2. Clique em **New Project** > **Deploy from GitHub repo**.
3. Selecione o repositório do projeto.
4. Nas configurações do serviço do Railway, adicione as variáveis na aba **Variables**.
5. Na aba **Settings**, configure:
   - **Root Directory**: `/backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. O Railway irá buildar automaticamente e expor um domínio sob a aba **Settings** (clique em **Generate Domain**).

---

## 🔗 Atualização no Aplicativo Mobile & Admin

Assim que o deploy for concluído e você obtiver a URL pública (ex: `https://novaix-backend.onrender.com`), você deve:

1. **No Aplicativo Mobile**:
   - Atualizar a variável no arquivo `.env` do Expo:
     ```env
     EXPO_PUBLIC_API_URL=https://novaix-backend.onrender.com
     ```
2. **No Painel Administrativo**:
   - Atualizar a variável no arquivo `.env` do painel admin:
     ```env
     VITE_API_URL=https://novaix-backend.onrender.com
     ```
3. **No Webhook do Asaas**:
   - Ir no painel do Asaas > Configurações > Webhooks e alterar a URL de webhook para:
     ```
     https://novaix-backend.onrender.com/webhooks/asaas
     ```
