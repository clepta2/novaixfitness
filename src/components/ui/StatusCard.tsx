// src/components/ui/StatusCard.tsx// Card de status reutilizavel (pending/active/suspended) - NOVAIX FITNESS
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors'
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
type StatusType = 'pending' | 'active' | 'suspended' | 'warning';
interface StatusCardProps {
 status: StatusType; title: string;
 message: string;
}
const STATUS_CONFIG: Record<StatusType, {
icon: string;
color: string }> = {pending: {
icon: 'time-outline', color: COLORS.attention },  active: {
icon: 'checkmark-circle-outline', color: COLORS.success },  suspended: {
icon: 'ban-outline', color: COLORS.error },  warning: {
icon: 'warning-outline', color: COLORS.attention },
};
export function StatusCard({
status, title, message }: StatusCardProps) {
const colors = useColors();
const config = STATUS_CONFIG[status]; return (    <View style={[styles.card, {
borderColor: config.color, backgroundColor: config.color + '12' }]
}>      <Ionicons name={config.icon as any
} size={24
} color={config.color
} />      <Text style={styles.title
}>{title
}</Text>      <Text style={styles.message
}>{message
}</Text>    </View>  );
}
const styles = StyleSheet.create({
 card: { padding: SPACING.xl,    borderRadius: BORDER_RADIUS.lg,    borderLeftWidth: 4,    marginBottom: SPACING.lg,    gap: SPACING.xs,  
},  title: {
fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },  message: {
fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textDescription, lineHeight: 18 },
});