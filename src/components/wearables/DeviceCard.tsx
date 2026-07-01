import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import SyncButton from './SyncButton';

interface Device {
  name: string;
  type: string;
  connected: boolean;
  battery?: number | null;
  lastSync?: string | null;
  subtitle?: string;
}

interface DeviceCardProps {
  device: Device;
  onToggle: (type: string) => void;
  onSync: (type: string) => void;
  syncing?: string | null;
}

const ICONS: Record<string, string> = { watch: 'watch-outline', health: 'heart-outline', strava: 'logo-strava' };

export default function DeviceCard({ device, onToggle, onSync, syncing }: DeviceCardProps): React.JSX.Element {
  const { name, type, connected, battery, lastSync, subtitle } = device;

  return (
    <View style={styles.card} accessibilityLabel={`${name}: ${connected ? 'conectado' : 'desconectado'}`}>
      <View style={styles.row}>
        <View style={[styles.iconWrap, connected && styles.iconConnected]}>
          <Ionicons name={(ICONS[type] || 'hardware-chip-outline') as any} size={24} color={connected ? COLORS.primary : COLORS.textMuted} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>{connected ? (subtitle || 'Conectado') : 'Não disponível'}</Text>
          {connected && battery != null && <Text style={styles.meta}>Bateria: {battery}%</Text>}
        </View>
        <TouchableOpacity style={[styles.btn, connected ? styles.discBtn : styles.connBtn]} onPress={() => onToggle(type)} accessibilityLabel={connected ? `Desconectar ${name}` : `Conectar ${name}`} accessibilityRole="button">
          <Text style={[styles.btnText, connected ? styles.discText : styles.connText]}>{connected ? 'Desconectar' : 'Conectar'}</Text>
        </TouchableOpacity>
      </View>
      {connected && (
        <View style={styles.footer}>
          <SyncButton onSync={() => onSync(type)} syncing={syncing === type} lastSync={lastSync} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, borderWidth: 1, borderColor: COLORS.border, padding: SPACING.lg, marginBottom: SPACING.md },
  row: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: { width: 44, height: 44, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  iconConnected: { backgroundColor: COLORS.primary + '20' },
  info: { flex: 1 },
  name: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle },
  status: { fontFamily: 'Inter_400Regular', fontSize: 12, color: COLORS.textDescription, marginTop: 2 },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  btn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: BORDER_RADIUS.sm },
  connBtn: { backgroundColor: COLORS.primary + '20' },
  discBtn: { backgroundColor: COLORS.errorBg },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  connText: { color: COLORS.primary },
  discText: { color: COLORS.error },
  footer: { marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
});
