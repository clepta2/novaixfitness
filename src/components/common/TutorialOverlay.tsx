import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { typography } from '../../styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Spotlight {
  left: number;
  top: number;
  width: number;
  height: number;
  cardPosition: 'top' | 'bottom';
}

interface TutorialStep {
  target?: string;
  icon: string;
  title: string;
  description: string;
}

interface TutorialOverlayProps {
  visible: boolean;
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
  onRestart?: () => void;
}

const SPOTLIGHTS: Record<string, Spotlight> = {
  contextualCard: { left: 16, top: 130, width: SCREEN_WIDTH - 32, height: 180, cardPosition: 'bottom' },
  categories: { left: 16, top: 380, width: SCREEN_WIDTH - 32, height: 120, cardPosition: 'top' },
  header: { left: SCREEN_WIDTH - 120, top: 50, width: 110, height: 44, cardPosition: 'bottom' },
  searchBar: { left: 16, top: 100, width: SCREEN_WIDTH - 100, height: 44, cardPosition: 'bottom' },
  filterBtn: { left: SCREEN_WIDTH - 90, top: 100, width: 80, height: 44, cardPosition: 'bottom' },
  favorites: { left: 16, top: 200, width: SCREEN_WIDTH - 32, height: 100, cardPosition: 'bottom' },
  stats: { left: 16, top: 300, width: SCREEN_WIDTH - 32, height: 80, cardPosition: 'bottom' },
  gamification: { left: 16, top: 180, width: SCREEN_WIDTH - 32, height: 60, cardPosition: 'bottom' },
  achievements: { left: 16, top: 400, width: SCREEN_WIDTH - 32, height: 100, cardPosition: 'bottom' },
  fab: { left: SCREEN_WIDTH - 72, top: SCREEN_HEIGHT - 160, width: 56, height: 56, cardPosition: 'top' },
  posts: { left: 16, top: 200, width: SCREEN_WIDTH - 32, height: 300, cardPosition: 'top' },
  progressBar: { left: 16, top: 100, width: SCREEN_WIDTH - 32, height: 20, cardPosition: 'bottom' },
  timer: { left: 16, top: 250, width: SCREEN_WIDTH - 32, height: 200, cardPosition: 'top' },
  badge: { left: SCREEN_WIDTH / 2 - 30, top: 50, width: 60, height: 30, cardPosition: 'bottom' },
  markAllBtn: { left: SCREEN_WIDTH - 80, top: 50, width: 40, height: 40, cardPosition: 'bottom' },
  list: { left: 16, top: 120, width: SCREEN_WIDTH - 32, height: 400, cardPosition: 'top' },
};

export default function TutorialOverlay({ visible, steps, onComplete, onSkip, onRestart }: TutorialOverlayProps): React.JSX.Element | null {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [fadeAnim] = useState<Animated.Value>(() => new Animated.Value(0));
  const [scaleAnim] = useState<Animated.Value>(() => new Animated.Value(0.95));
  const [progressAnim] = useState<Animated.Value>(() => new Animated.Value(0));
  const [bounceAnim] = useState<Animated.Value>(() => new Animated.Value(0));

  useEffect((): void => {
    if (visible) { setCurrentStep(0); progressAnim.setValue(0); }
  }, [visible, progressAnim]);

  useEffect((): void => {
    if (visible && steps?.length > 0) {
      fadeAnim.setValue(0); scaleAnim.setValue(0.95);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start();
      Animated.timing(progressAnim, { toValue: (currentStep + 1) / steps.length, duration: 350, useNativeDriver: false }).start();
      try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    }
  }, [currentStep, visible, steps?.length, fadeAnim, progressAnim, scaleAnim]);

  useEffect((): void => {
    bounceAnim.setValue(0);
    Animated.loop(Animated.sequence([
      Animated.timing(bounceAnim, { toValue: 8, duration: 600, useNativeDriver: true }),
      Animated.timing(bounceAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ])).start();
  }, [currentStep, visible, bounceAnim]);

  if (!visible || !steps || steps.length === 0) return null;

  const step = steps[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const spotlight = step.target ? SPOTLIGHTS[step.target] : null;
  const handleNext = (): void => isLast ? onComplete() : setCurrentStep(prev => prev + 1);
  const handlePrev = (): void => setCurrentStep(prev => Math.max(0, prev - 1));
  const handleRestart = (): void => {
    setCurrentStep(0);
    if (onRestart) onRestart();
  };

  const renderMask = (): React.JSX.Element => {
    if (!spotlight) return <View style={styles.darkBackdrop} />;
    const { left, top, width, height } = spotlight;
    return (<>
      <View style={[styles.maskPanel, { left: 0, top: 0, width: SCREEN_WIDTH, height: top }]} />
      <View style={[styles.maskPanel, { left: 0, top, width: left, height }]} />
      <View style={[styles.maskPanel, { left: left + width, top, width: SCREEN_WIDTH - (left + width), height }]} />
      <View style={[styles.maskPanel, { left: 0, top: top + height, width: SCREEN_WIDTH, height: SCREEN_HEIGHT - (top + height) }]} />
      <View style={[styles.glowBorder, { left, top, width, height }]} />
    </>);
  };

  const renderPointer = (): React.JSX.Element | null => {
    if (!spotlight) return null;
    const { left, top, width, height, cardPosition } = spotlight;
    const isTop = cardPosition === 'top';
    return (
      <Animated.View style={[styles.pointer, { top: isTop ? top - 32 : top + height + 8, left: left + width / 2 - 12, transform: [{ translateY: bounceAnim }] }]}>
        <Ionicons name={isTop ? 'chevron-down' : 'chevron-up'} size={24} color={COLORS.primary} />
      </Animated.View>
    );
  };

  const mainContent = (
    <View style={StyleSheet.absoluteFill}>
      {renderMask()}
      {renderPointer()}
      <Animated.View style={[styles.card, spotlight ? (spotlight.cardPosition === 'top' ? styles.cardTop : styles.cardBottom) : styles.cardCenter, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.progressBar}>
          <Animated.View style={[styles.progressFill, { width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
        </View>
        <View style={styles.stepCounter}><Text style={styles.stepText}>{currentStep + 1}/{steps.length}</Text></View>
        <View style={styles.iconContainer}><Ionicons name={step.icon as any} size={36} color={COLORS.primary} /></View>
        <Text style={typography.h3}>{step.title}</Text>
        <Text style={[typography.body, styles.description]}>{step.description}</Text>
        <View style={styles.navRow}>
          {!isFirst && (
            <TouchableOpacity style={styles.backBtn} onPress={handlePrev} accessibilityLabel="Passo anterior" accessibilityRole="button">
              <Ionicons name="chevron-back" size={18} color={COLORS.textMuted} />
              <Text style={styles.backText}>VOLTAR</Text>
            </TouchableOpacity>
          )}
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext} accessibilityLabel={isLast ? 'Começar' : 'Próximo passo'} accessibilityRole="button">
            <Text style={styles.nextText}>{isLast ? 'COMEÇAR!' : 'PRÓXIMO'}</Text>
            <Ionicons name={isLast ? 'checkmark' : 'arrow-forward'} size={18} color={COLORS.background} />
          </TouchableOpacity>
        </View>
        <View style={styles.bottomRow}>
          {!isLast ? (
            <TouchableOpacity style={styles.skipBtn} onPress={onSkip} accessibilityLabel="Pular tutorial" accessibilityRole="button"><Text style={styles.skipText}>Pular tutorial</Text></TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.restartBtn} onPress={handleRestart} accessibilityLabel="Reiniciar tutorial" accessibilityRole="button">
              <Ionicons name="refresh" size={16} color={COLORS.textMuted} />
              <Text style={styles.restartText}>Reiniciar</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </View>
  );

  return (
    <Modal transparent visible={visible} animationType="fade">
      {!spotlight ? (
        <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill}>
          {mainContent}
        </BlurView>
      ) : (
        mainContent
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  darkBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18, 22, 26, 0.65)' },
  maskPanel: { position: 'absolute', backgroundColor: 'rgba(18, 22, 26, 0.65)' },
  glowBorder: { position: 'absolute', borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8, elevation: 4 },
  pointer: { position: 'absolute', zIndex: 10, alignItems: 'center', width: 24 },
  card: { position: 'absolute', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, width: SCREEN_WIDTH - SPACING.lg * 2, left: SPACING.lg, alignItems: 'center', borderWidth: 1.5, borderColor: COLORS.primary + '20', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 6 },
  cardCenter: { top: (SCREEN_HEIGHT - 300) / 2 },
  cardTop: { top: 80 },
  cardBottom: { bottom: 120 },
  progressBar: { width: '100%', height: 4, backgroundColor: COLORS.border, borderRadius: 2, marginBottom: SPACING.md },
  progressFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  stepCounter: { position: 'absolute', top: SPACING.md, right: SPACING.md },
  stepText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: COLORS.textMuted },
  iconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary + '15', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  description: { color: COLORS.textDescription, textAlign: 'center', marginBottom: SPACING.md, marginTop: SPACING.xs },
  navRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: SPACING.sm },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, backgroundColor: COLORS.surfaceOverlay, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  backText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 12, color: COLORS.textMuted },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.xs, backgroundColor: COLORS.primary, borderRadius: 8, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
  nextText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: COLORS.background, letterSpacing: 0.5 },
  bottomRow: { width: '100%', alignItems: 'center', marginTop: SPACING.xs },
  skipBtn: { paddingVertical: SPACING.sm, alignItems: 'center' },
  skipText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: COLORS.textMuted },
  restartBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, backgroundColor: COLORS.surfaceOverlay, borderRadius: 8 },
  restartText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: COLORS.textMuted },
});
