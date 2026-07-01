// src/components/ui/SwipeableList.tsx
// Lista com acoes por gesto swipe - NOVAIX FITNESS

import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

interface SwipeAction {
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
}

interface SwipeableItemProps {
  children: React.ReactNode;
  rightActions?: SwipeAction[];
  leftActions?: SwipeAction[];
  onSwipeableOpen?: (_direction: 'left' | 'right') => void;
}

function SwipeableItem({
  children,
  rightActions = [],
  leftActions = [],
  onSwipeableOpen,
}: SwipeableItemProps) {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (progress: Animated.Value) => {
    return (
      <View style={styles.actionsContainer}>
        {rightActions.map((action, index) => {
          const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [80, 0],
          });
          return (
            <Animated.View key={index} style={{ transform: [{ translateX }] }}>
              <RectButton
                style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={() => {
                  swipeableRef.current?.close();
                  action.onPress();
                }}
              >
                <Ionicons name={action.icon as any} size={20} color="#fff" />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </RectButton>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  const renderLeftActions = (progress: Animated.Value) => {
    return (
      <View style={styles.actionsContainer}>
        {leftActions.map((action, index) => {
          const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [-80, 0],
          });
          return (
            <Animated.View key={index} style={{ transform: [{ translateX }] }}>
              <RectButton
                style={[styles.actionButton, { backgroundColor: action.color }]}
                onPress={() => {
                  swipeableRef.current?.close();
                  action.onPress();
                }}
              >
                <Ionicons name={action.icon as any} size={20} color="#fff" />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </RectButton>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={rightActions.length > 0 ? renderRightActions : undefined}
      renderLeftActions={leftActions.length > 0 ? renderLeftActions : undefined}
      onSwipeableOpen={onSwipeableOpen}
      overshootRight={false}
      overshootLeft={false}
    >
      {children}
    </Swipeable>
  );
}

// Item de lista com swipe para deletar
interface DeletableItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteLabel?: string;
}

export function DeletableItem({ children, onDelete, deleteLabel = 'Excluir' }: DeletableItemProps) {
  return (
    <SwipeableItem
      rightActions={[{
        label: deleteLabel,
        icon: 'trash-outline',
        color: COLORS.error,
        onPress: onDelete,
      }]}
    >
      {children}
    </SwipeableItem>
  );
}

// Item com acoes arquivar e deletar
interface ArchivableItemProps {
  children: React.ReactNode;
  onArchive?: () => void;
  onDelete?: () => void;
  _onFavorite?: () => void;
  _isFavorite?: boolean;
}

export function ArchivableItem({
  children,
  onArchive,
  onDelete,
}: ArchivableItemProps) {
  const actions: SwipeAction[] = [];
  if (onArchive) {
    actions.push({
      label: 'Arquivar',
      icon: 'archive-outline',
      color: COLORS.info,
      onPress: onArchive,
    });
  }
  if (onDelete) {
    actions.push({
      label: 'Excluir',
      icon: 'trash-outline',
      color: COLORS.error,
      onPress: onDelete,
    });
  }

  return (
    <SwipeableItem rightActions={actions}>
      {children}
    </SwipeableItem>
  );
}

export { SwipeableItem };

const styles = StyleSheet.create({
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    gap: 4,
  },
  actionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: '#fff',
  },
});
