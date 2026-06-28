# Configurar Refresh Token Rotation

Execute no Supabase Dashboard:
1. Settings → Authentication → Advanced
2. Ativar "Refresh Token Rotation"
3. Definir "Refresh Token Reuse Interval" como 10 segundos

Ou via SQL:
```sql
-- Verificar configuracao atual
SELECT * FROM auth.config;

-- Nao existe UPDATE direto, precisa ser feito no Dashboard
```
