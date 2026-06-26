// src/components/workout/ExerciseStepCarousel.js
// Carrossel passo a passo - NOVAIX FITNESS

import { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';

const { width } = Dimensions.get('window');

export default function ExerciseStepCarousel({ steps }) {
  const [activeStep, setActiveStep] = useState(0);
  const flatListRef = useRef(null);

  const goToStep = (index) => {
    setActiveStep(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PASSO A PASSO</Text>
        <Text style={styles.progress}>
          {activeStep + 1} de {steps.length}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={steps}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / (width - 80));
          setActiveStep(index);
        }}
        keyExtractor={(item) => item.step.toString()}
        renderItem={({ item }) => (
          <View style={styles.stepCard}>
            <Image source={{ uri: item.image }} style={styles.stepImage} />
            <View style={styles.stepContent}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>PASSO {item.step}</Text>
              </View>
              <Text style={styles.stepText}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.dots}>
        {steps.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dot, activeStep === index && styles.dotActive]}
            onPress={() => goToStep(index)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  progress: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: COLORS.primary,
  },
  stepCard: {
    width: width - 80,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginRight: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepImage: {
    width: '100%',
    height: 140,
    backgroundColor: COLORS.surface,
  },
  stepContent: {
    padding: SPACING.lg,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  stepBadgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: COLORS.background,
    letterSpacing: 1,
  },
  stepText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: COLORS.textTitle,
    lineHeight: 18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
  },
});
