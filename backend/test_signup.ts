require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function runSignUp() {
  console.log("Testando cadastro com Resend SMTP...");
  const email = "atleta_teste_nov_" + Date.now() + "@example.com";
  const password = "Password123!";

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: "Atleta Teste" }
      }
    });

    if (error) {
      console.error("❌ Erro no cadastro:");
      console.error(JSON.stringify(error, null, 2));
    } else {
      console.log("✅ Cadastro realizado com sucesso!");
      console.log("ID do Usuário:", data.user?.id);
      console.log("E-mail:", data.user?.email);
      console.log("Status da Confirmação:", data.user?.identities?.[0]?.identity_data?.email_verified ? "Confirmado" : "Pendente de e-mail");
    }
  } catch (err) {
    console.error("❌ Exceção:", err);
  }
}

runSignUp();
