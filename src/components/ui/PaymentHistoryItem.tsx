// src/components/ui/PaymentHistoryItem.tsx// Item de historico de pagamento - NOVAIX FITNESS
import { View, Text, StyleSheet } from 'react-native'
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing'
import { useColors } from '../../context/ThemeContext';
interface PaymentHistoryItemProps {
 date: string; amount: number;
 status: 'paid' | 'pending' | string;
 opacity?: number;
}
export function PaymentHistoryItem({
date, amount, status, opacity = 1 }: PaymentHistoryItemProps) {

 
const isPaid = status === 'paid'; const statusColor = isPaid ? colors.success : colors.attention;
 
return (    <View style={[styles.item, {
opacity }]
}>      <View style={styles.info
}>        <Text style={styles.date
}>{
new Date(date).toLocaleDateString('pt-BR')
}</Text>        <Text style={styles.amount
}>R$ {amount?.toFixed(2)
}</Text>      </View>      <View style={[styles.badge, {
backgroundColor: statusColor + '15' }]
}>        <Text style={[styles.badgeText, {
color: statusColor }]
}>          {isPaid ? 'Pago' : 'Pendente'
}        </Text>      </View>    </View>  );
}
const colors = useColors();
const styles = StyleSheet.create({
 item: {
flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },  info: {
flex: 1 },  date: {
fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textMuted },  amount: {
fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, marginTop: 2 },  badge: {
paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm },  badgeText: {
fontFamily: 'Montserrat_600SemiBold', fontSize: 11 },
});