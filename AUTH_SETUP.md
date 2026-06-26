# Configuração Google/Apple Auth - NOVAIX FITNESS

## 1. Google OAuth

### Passo 1: Criar projeto no Google Cloud

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto: "novaix-fitness"
3. Vá em **APIs & Services** > **Library**
4. Ative **Google People API**

### Passo 2: Criar credenciais OAuth

1. Vá em **APIs & Services** > **Credentials**
2. Clique em **Create Credentials** > **OAuth client ID**
3. Tipo: **Web application**
4. Nome: "NOVAIX Fitness"
5. **Authorized redirect URIs**:
   ```
   https://jkoteibpvwlmsilntpof.supabase.co/auth/v1/callback
   ```
6. Copie **Client ID** e **Client Secret**

### Passo 3: Configurar no Supabase

1. Vá em **Authentication** > **Providers**
2. Ative **Google**
3. Cole:
   - **Client ID**: (do Google Cloud)
   - **Client Secret**: (do Google Cloud)
4. Salve

### Passo 4: Configurar Deep Link (App)

No `app.json`, adicione o scheme:

```json
{
  "expo": {
    "scheme": "novaix",
    "ios": {
      "bundleIdentifier": "com.novaix.fitness"
    },
    "android": {
      "package": "com.novaix.fitness"
    }
  }
}
```

---

## 2. Apple Sign In

### Passo 1: Configurar no Apple Developer

1. Acesse [developer.apple.com](https://developer.apple.com)
2. Vá em **Certificates, Identifiers & Profiles**
3. Selecione seu App ID
4. Ative **Sign In with Apple**
5. Salve

### Passo 2: Criar Service ID

1. Vá em **Certificates, Identifiers & Profiles** > **Identifiers**
2. Clique em **+** > **Services IDs**
3. Descrição: "NOVAIX Fitness Auth"
4. Identifier: "com.novaix.fitness.auth"
5. Ative **Sign In with Apple**
6. Configure:
   - **Primary App ID**: com.novaix.fitness
   - **Return URLs**: `https://jkoteibpvwlmsilntpof.supabase.co/auth/v1/callback`
7. Salve

### Passo 3: Criar Chave de Segurança

1. Vá em **Certificates, Identifiers & Profiles** > **Keys**
2. Clique em **+**
3. Nome: "NOVAIX Fitness Auth Key"
4. Ative **Sign In with Apple**
5. Configure:
   - **Primary App ID**: com.novaix.fitness
6. Crie e baixe a chave (.p8)
7. Anote o **Key ID**

### Passo 4: Configurar no Supabase

1. Vá em **Authentication** > **Providers**
2. Ative **Apple**
3. Cole:
   - **Client ID**: com.novaix.fitness.auth (Service ID)
   - **Team ID**: (seu Team ID do Apple)
   - **Key ID**: (da chave criada)
   - **Private Key**: (conteúdo do arquivo .p8)
4. Salve

### Passo 5: Configurar no App

Instale o pacote de autenticação Apple:

```bash
npx expo install expo-apple-authentication
```

---

## 3. Configuração Final

### Redirect URLs no Supabase

Vá em **Authentication** > **URL Configuration**:

- **Site URL**: `novaix://`
- **Redirect URLs**:
  ```
  novaix://
  novaix://login-callback
  exp://127.0.0.1:8081/--/  (para Expo Go)
  ```

### Teste

1. `npx expo start`
2. Clique em "Continuar com Google"
3. Deve abrir o navegador para autenticação
4. Após autenticação, volta para o app

---

## Troubleshooting

### Google não funciona
- Verifique se o Redirect URI está correto
- Confirme que a People API está ativa
- Verifique se o Client ID/Secret estão corretos

### Apple não funciona
- Certifique-se de que o App ID tem "Sign In with Apple" ativo
- Verifique o Service ID e Key ID
- Confirme que o Team ID está correto

### App não volta após login
- Verifique se o scheme está configurado no app.json
- Confirme as redirect URLs no Supabase
- Teste com Expo Go primeiro
