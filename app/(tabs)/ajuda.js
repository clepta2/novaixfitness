// app/(tabs)/ajuda.js
// Tela de Ajuda / FAQ - NOVAIX FITNESS

import { useState, useCallback } from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import { COLORS } from '../../src/constants/colors';
import { APP_CONFIG } from '../../src/config/app';
import { FaqItem, ContactCard } from '../../src/components';
import { layout, typography } from '../../src/styles';

const faqItems = [
  { id: '1', question: 'Como funciona o plano de treino?', answer: 'Após completar o onboarding, o app gera um plano personalizado baseado no seu nível, objetivo e disponibilidade. O plano se adapta automaticamente conforme você evolui.' },
  { id: '2', question: 'Posso trocar de plano?', answer: 'Sim! Acesse Configurações > Assinatura para alterar seu plano a qualquer momento.' },
  { id: '3', question: 'Como funciona o cronômetro?', answer: 'O timer regressive: 45 segundos de exercício seguidos de 15 segundos de descanso.' },
  { id: '4', question: 'Os vídeos funcionam offline?', answer: 'Não no momento. Os vídeos são carregados do YouTube e precisam de conexão.' },
  { id: '5', question: 'Como cancelo minha assinatura?', answer: 'Acesse Configurações > Assinatura > Cancelar. Acesso mantido até o fim do período.' },
  { id: '6', question: 'Posso usar em mais de um dispositivo?', answer: 'Sim! Basta fazer login com mesmo e-mail e senha.' },
];

export default function AjudaScreen() {
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = useCallback((id) => setExpandedId((prev) => (prev === id ? null : id)), []);

  return (
    <ScrollView style={layout.screen} contentContainerStyle={layout.scroll}>
      <View style={layout.header}>
        <Text style={typography.h2}>AJUDA</Text>
        <Text style={typography.bodyMuted}>Como podemos ajudar?</Text>
      </View>

      <View style={layout.section}>
        <Text style={typography.label}>PERGUNTAS FREQUENTES</Text>
        {faqItems.map((item) => <FaqItem key={item.id} item={item} isExpanded={expandedId === item.id} onToggle={toggleExpand} />)}
      </View>

      <View style={layout.section}>
        <Text style={typography.label}>FALE CONOSCO</Text>
        <ContactCard icon="logo-whatsapp" iconColor={COLORS.whatsapp} label="WhatsApp" description="Resposta rápida em até 24h" onPress={() => Linking.openURL(`https://wa.me/${APP_CONFIG.whatsappNumber}`)} />
        <ContactCard icon="mail-outline" iconColor={COLORS.primary} label="E-mail" description={APP_CONFIG.supportEmail} onPress={() => Linking.openURL(`mailto:${APP_CONFIG.supportEmail}`)} />
      </View>
    </ScrollView>
  );
}
