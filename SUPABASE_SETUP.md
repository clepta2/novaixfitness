# Configuração do Supabase - NOVAIX FITNESS

## Passo 1: Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Preencha:
   - **Organization**: Sua organização
   - **Project name**: novaix-fitness
   - **Database Password**: Uma senha forte
   - **Region**: Brasil (ou mais próxima)

## Passo 2: Obter Chaves de API

1. Vá em **Settings** > **API**
2. Copie:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIs...`

3. Atualize o arquivo `.env`:
```bash
SUPABASE_URL=https://jkoteibpvwlmsilntpof.supabase.co
SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

## Passo 3: Criar Tabelas

No painel do Supabase, vá em **SQL Editor** e execute:

1. Primeiro: `create-tables.sql`
2. Depois: `seed-data.sql` (dados iniciais)

## Passo 4: Habilitar Auth Providers

1. Vá em **Authentication** > **Providers**
2. Ative:
   - **Email** (já vem ativo)
   - **Google**:
     - Crie um projeto no Google Cloud Console
     - Ative a API OAuth2
     - Crie credenciais OAuth
     - Copie Client ID e Client Secret para o Supabase
   - **Apple**:
     - Configure no Apple Developer Console
     - Copie os dados para o Supabase

## Passo 5: Configurar Redirect URLs

No Supabase > **Authentication** > **URL Configuration**:

1. **Site URL**: `novaix://`
2. **Redirect URLs**:
   - `novaix://login-callback`
   - `https://jkoteibpvwlmsilntpof.supabase.co/auth/v1/callback`

## Passo 6: Testar

1. Inicie o app: `npx expo start`
2. Teste cadastro com e-mail
3. Teste login
4. Teste login com Google (se configurado)

## Tabelas Criadas

| Tabela | Descrição |
|--------|-----------|
| `profiles` | Dados do usuário |
| `workouts` | Treinos disponíveis |
| `user_workouts` | Treinos do usuário |
| `favorites` | Favoritos do usuário |
| `posts` | Posts da comunidade |
| `post_likes` | Likes nos posts |
| `post_comments` | Comentários nos posts |

## Estrutura do Banco

```
auth.users (Supabase Auth)
  └── profiles (criado automaticamente via trigger)
        ├── user_workouts
        ├── favorites
        ├── posts
        │     ├── post_likes
        │     └── post_comments
        └── ...
```

## Comandos Úteis

```bash
# Iniciar app
npx expo start

# Limpar cache
npx expo start --clear

# Exportar para teste
npx expo export --platform android
```
