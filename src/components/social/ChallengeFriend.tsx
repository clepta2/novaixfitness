// src/components/social/ChallengeFriend.tsx
// Modal de desafio entre amigos - NOVAIX FITNESS
// Refatorado: Componentes separados para cada step

import { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Modal, Animated } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { useColors } from '../../context/ThemeContext';
import { FriendSelector, ChallengeConfig, ChallengeConfirm } from './challenge';

interface Friend {
  id: string;
  name: string;
  avatar: string;
  xp: number;
}

interface ChallengeData {
  friendId: string;
  friendName: string;
  type: 'reps' | 'duration' | 'distance';
  duration: '1day' | '3days' | '1week';
  stake: number;
  workoutName?: string;
}

interface ChallengeFriendProps {
  visible: boolean;
  onClose: () => void;
  onSendChallenge: (challenge: ChallengeData) => void;
  currentUserId: string;
  friends: Friend[];
}

export default function ChallengeFriend({
  visible,
  onClose,
  onSendChallenge,
  currentUserId,
  friends,
}: ChallengeFriendProps) {
  const colors = useColors();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [step, setStep] = useState(1);
  const [challengeConfig, setChallengeConfig] = useState({
    type: 'reps' as const,
    duration: '3days' as const,
    stake: 0,
  });

  const slideAnim = useState(new Animated.Value(300))[0];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 30,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible]);

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setStep(2);
  };

  const handleConfigChange = (config: Partial<typeof challengeConfig>) => {
    setChallengeConfig(prev => ({ ...prev, ...config }));
  };

  const handleSendChallenge = () => {
    if (!selectedFriend) return;
    onSendChallenge({
      friendId: selectedFriend.id,
      friendName: selectedFriend.name,
      ...challengeConfig,
    });
    handleClose();
  };

  const handleClose = () => {
    setSelectedFriend(null);
    setSearchQuery('');
    setChallengeConfig({ type: 'reps', duration: '3days', stake: 0 });
    setStep(1);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableOpacity
        style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View
          style={[
            styles.content,
            { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] },
          ]}
          onStartShouldSetResponder={() => true}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.progressSteps}>
            {[1, 2, 3].map(s => (
              <View
                key={s}
                style={[styles.stepDot, { backgroundColor: colors.border }, step >= s && { backgroundColor: colors.primary }]}
              />
            ))}
          </View>

          {step === 1 && (
            <FriendSelector
              friends={friends}
              selectedFriend={selectedFriend}
              onSelect={handleSelectFriend}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              colors={colors}
            />
          )}

          {step === 2 && selectedFriend && (
            <ChallengeConfig
              config={challengeConfig}
              onChange={handleConfigChange}
              onBack={() => setStep(1)}
              onContinue={() => setStep(3)}
              friendName={selectedFriend.name}
              colors={colors}
            />
          )}

          {step === 3 && selectedFriend && (
            <ChallengeConfirm
              friend={selectedFriend}
              config={challengeConfig}
              onBack={() => setStep(2)}
              onConfirm={handleSendChallenge}
              colors={colors}
            />
          )}
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  content: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  stepDot: { width: 8, height: 8, borderRadius: 4 },
});
