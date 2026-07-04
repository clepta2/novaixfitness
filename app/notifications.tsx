
// app/notificacoes.tsx
// Notificacoes com animacoes de entrada - NOVAIX FITNESS


import { useMemo, useState, useEffect , useRef} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../src/constants/colors';
import { SPACING, BORDER_RADIUS } from '../src/constants/spacing';
import { SHADOWS } from '../src/constants/shadows';
import { layout, typography } from '../src/styles';
import { NotificationItem, TutorialOverlay, ErrorBoundary, NotificationConfig, EmptyState, Loading } from '../src/components';
import { useTutorial } from '../src/hooks/useTutorial';
import { useNotificationPrefs } from '../src/hooks/useNotificationPrefs';
import { useResponsive } from '../src/hooks/useResponsive';
import { APP_CONFIG } from '../src/config/app';

const TABS = [
  { key: 'list', label: 'Lista', icon: 'list' },
  { key: 'config', label: 'Config', icon: 'settings' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const { isSmall } = useResponsive();
  const [activeTab, setActiveTab] = useState('list');
  const { visible: tutorialVisible, steps: tutorialSteps, handleComplete, handleSkip } = useTutorial('notifications', true);

  const {
    notifications, loading, refreshing, prefs, reminderTime, setReminderTime,
    pushEnabled, quietHours, unreadCount, notifGroups,
    onRefresh, markAsRead, markAllAsRead, clearAll,
    handleNotifToggle, handlePushToggle,
  } = useNotificationPrefs();

  // Animacoes
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const tabIndicator = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, tension: 55, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(tabIndicator, {
      toValue: activeTab === 'list' ? 0 : 1,
      friction: 8,
      tension: 55,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const renderNotification = ({ item, index }: { item: any; index: number }) => (
    <Animated.View style={[styles.notifItem, { opacity: Math.min(1, 0.5 + index * 0.1) }]}>
      <NotificationItem
        item={item}
        onPress={() => markAsRead(item.id)}
      />
    </Animated.View>
  );

  return (
    <ErrorBoundary screenName="Notifications">
      <View style={layout.screen}>
        <TutorialOverlay visible={tutorialVisible} steps={tutorialSteps} onComplete={handleComplete} onSkip={handleSkip} onRestart={() => {}} />

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textTitle} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[typography.h2, { fontSize: isSmall ? 22 : 28 }]}>Notificacoes</Text>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <View style={styles.headerActions}>
            {activeTab === 'list' && unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead} style={styles.headerBtn}>
                <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            )}
            {activeTab === 'list' && notifications.length > 0 && (
              <TouchableOpacity onPress={clearAll} style={styles.headerBtn}>
                <Ionicons name="trash-outline" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            {TABS.map(tab => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons name={tab.icon as any} size={16} color={activeTab === tab.key ? COLORS.primary : COLORS.textMuted} />
                <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Conteudo */}
        {activeTab === 'list' ? (
          notifications.length === 0 && !loading ? (
            <EmptyState
              icon="notifications-off-outline"
              title="Sem notificacoes"
              description="Quando algo acontecer, voce sera notificado aqui."
            />
          ) : (
            <FlatList
              data={notifications}
              keyExtractor={(item) => item.id}
              renderItem={renderNotification}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
              }
              ListEmptyComponent={loading ? <Loading variant="dots" /> : null}
            />
          )
        ) : (
          <NotificationConfig
            prefs={prefs}
            reminderTime={reminderTime}
            onReminderTimeChange={setReminderTime}
            pushEnabled={pushEnabled}
            quietHours={quietHours}
            notifGroups={notifGroups}
            onNotifToggle={handleNotifToggle}
            onPushToggle={handlePushToggle}
          />
        )}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, justifyContent: 'center' },
  badge: { backgroundColor: COLORS.error, minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  badgeText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, color: COLORS.background },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  headerBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' },

  // Tabs
  tabsContainer: { paddingHorizontal: SPACING.lg },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.md, padding: SPACING.xs, marginBottom: SPACING.md },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.sm },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: COLORS.textMuted },
  tabTextActive: { color: COLORS.background },

  // List
  listContent: { padding: SPACING.lg },
  notifItem: { marginBottom: SPACING.sm },
});
