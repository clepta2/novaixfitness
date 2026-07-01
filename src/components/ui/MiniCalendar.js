import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const WEEKDAYS = ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'];
const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function MiniCalendar({ visible, selectedDate, onSelect, onClose }) {
  const initDate = useRef(() => {
    if (selectedDate && selectedDate.length === 10) {
      const [d, m, y] = selectedDate.split('/').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date(new Date().getFullYear() - 25, 5, 1);
  });
  const [viewDate, setViewDate] = useState(initDate.current());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handleSelect = (day) => {
    const dd = String(day).padStart(2, '0');
    const mm = String(month + 1).padStart(2, '0');
    onSelect(`${dd}/${mm}/${year}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.nav}>
                <TouchableOpacity onPress={() => setViewDate(new Date(year, month - 1, 1))} style={styles.navBtn} accessibilityLabel="Mês anterior" accessibilityRole="button">
                  <Ionicons name="chevron-back" size={22} color={COLORS.textTitle} />
                </TouchableOpacity>
                <Text style={styles.monthTitle}>{MONTH_NAMES[month]} {year}</Text>
                <TouchableOpacity onPress={() => setViewDate(new Date(year, month + 1, 1))} style={styles.navBtn} accessibilityLabel="Próximo mês" accessibilityRole="button">
                  <Ionicons name="chevron-forward" size={22} color={COLORS.textTitle} />
                </TouchableOpacity>
              </View>
              <View style={styles.weekdayRow}>
                {WEEKDAYS.map((d, i) => (
                  <Text key={i} style={styles.weekday}>{d}</Text>
                ))}
              </View>
              <View style={styles.grid}>
                {days.map((day, i) => {
                  if (!day) return <View key={`empty-${i}`} style={styles.dayCell} />;
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  const isFuture = new Date(year, month, day) > today;
                  const isTooOld = year < 1920 || (year === today.getFullYear() - 10 && month > today.getMonth());
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.dayCell, isToday && styles.dayToday]}
                      disabled={isFuture || isTooOld}
                      onPress={() => handleSelect(day)}
                      accessibilityLabel={`${day} de ${MONTH_NAMES[month]}`}
                      accessibilityRole="button"
                      accessibilityState={{ disabled: isFuture || isTooOld, selected: false }}
                    >
                      <Text style={[styles.dayText, isToday && styles.dayTextToday]}>{day}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} accessibilityLabel="Fechar calendário" accessibilityRole="button">
                <Text style={styles.closeBtnText}>FECHAR</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: COLORS.surface, borderRadius: 20, padding: SPACING.xl, width: '88%' },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  navBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  monthTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: COLORS.textTitle },
  weekdayRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  weekday: { flex: 1, textAlign: 'center', fontFamily: 'Inter_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
  dayToday: { borderRadius: 999, borderWidth: 1, borderColor: COLORS.primary },
  dayText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: COLORS.textTitle },
  dayTextToday: { color: COLORS.primary },
  closeBtn: { marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, alignItems: 'center' },
  closeBtnText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.textMuted, letterSpacing: 1 },
});