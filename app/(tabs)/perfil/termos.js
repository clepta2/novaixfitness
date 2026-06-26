// app/(tabs)/perfil/termos.js
// Tela de Termos de Uso e Política de Privacidade - NOVAIX FITNESS

import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../../../src/constants/spacing';
import { Header } from '../../../src/components';

const tabs = ['Termos de Uso', 'Privacidade', 'Aviso Médico'];

const termsContent = `TERMOS DE USO - NOVAIX FITNESS

Última atualização: 24/06/2026

1. ACEITAÇÃO DOS TERMOS
Ao baixar ou usar o aplicativo NOVAIX Fitness ("App"), você concorda com estes Termos de Uso. Se não concordar, não use o App.

2. DESCRIÇÃO DO SERVIÇO
O NOVAIX Fitness é um aplicativo de treinos personalizados que oferece:
• Planos de treino baseados em perfil do usuário
• Cronômetro inteligente para exercícios
• Acesso a vídeos de demonstração
• Comunidade de usuários

3. CONTA DO USUÁRIO
• Você é responsável por manter a confidencialidade da sua senha
• Você deve ter pelo menos 14 anos para usar o App
• Uma pessoa por conta

4. ASSINATURA E PAGAMENTO
• Planos podem ser alterados a qualquer momento
• Cancelamento mantém acesso até o fim do período pago
• Reembolso em até 7 dias (CDC)

5. CONTEÚDO
• Vídeos são para uso pessoal e não-comercial
• Proibido reproduzir, distribuir ou criar obras derivadas
• Conteúdo da comunidade é público

6. LIMITAÇÃO DE RESPONSABILIDADE
• O App não substitui orientação profissional
• Use por sua conta e risco
• Não garantimos disponibilidade 100%

7. ALTERAÇÕES
Reservamos o direito de alterar estes termos a qualquer momento.

8. CONTATO
Dúvidas: suporte@novaixfitness.com`;

const privacyContent = `POLÍTICA DE PRIVACIDADE - NOVAIX FITNESS

Última atualização: 24/06/2026

1. DADOS COLETADOS
• Nome e e-mail (cadastro)
• Dados físicos (peso, altura, idade)
• Preferências de treino
• Dados de uso do App

2. USO DOS DADOS
• Personalizar sua experiência
• Enviar notificações relevantes
• Melhorar o App
• Comunicação de suporte

3. COMPARTILHAMENTO
• Não vendemos seus dados
• Dados podem ser compartilhados com:
  - Provedores de pagamento (Asaas/Mercado Pago)
  - Serviços de análise (anônimo)

4. SEGURANÇA
• Dados criptografados em trânsito
• Armazenamento seguro no Supabase
• Acesso restrito

5. SEUS DIREITOS (LGPD)
• Acessar seus dados
• Corrigir dados incorretos
• Deletar sua conta
• Exportar seus dados
• Revogar consentimento

6. COOKIES
Usamos cookies essenciais para o funcionamento do App.

7. MENORES DE IDADE
Menores de 14 anos precisam de consentimento dos responsáveis.

8. CONTATO
DPO: dpo@novaixfitness.com`;

const medicalContent = `AVISO MÉDICO - NOVAIX FITNESS

⚠️ LEIA ANTES DE USAR ⚠️

Este aplicativo é uma ferramenta de auxílio ao treino físico e NÃO substitui:

• Orientação de médicos
• Acompanhamento de profissionais de educação física
• Exames médicos periódicos
• Tratamentos prescritos

ANTES DE COMEÇAR:
• Consulte um médico antes de iniciar qualquer programa de exercícios
• Pare imediatamente se sentir dor, tonteira ou mal-estar
• Pessoas com condições pré-existentes devem ter liberação médica

O NOVAIX Fitness não se responsabiliza por:
• Lesões decorrentes do uso do App
• Erros de execução de exercícios
• Condições médicas não diagnosticadas

EM CASO DE EMERGÊNCIA:
Ligue 192 (SAMU) ou vá ao hospital mais próximo.`;

const contents = [termsContent, privacyContent, medicalContent];

export default function TermosScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View style={styles.container}>
      <Header showBack title="TERMOS E POLÍTICAS" />

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.textContent}>{contents[activeTab]}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.xl, gap: SPACING.sm, marginBottom: SPACING.lg },
  tab: { flex: 1, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surface, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textTitle },
  tabTextActive: { fontFamily: 'Montserrat_600SemiBold', color: COLORS.background },
  content: { padding: SPACING.xl, paddingBottom: 40 },
  textContent: { fontFamily: 'Inter_400Regular', fontSize: 14, color: COLORS.textTitle, lineHeight: 22 },
});
