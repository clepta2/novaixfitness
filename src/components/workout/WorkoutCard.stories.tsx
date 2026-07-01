// src/components/workout/WorkoutCard.stories.js
// Stories do WorkoutCard - NOVAIX FITNESS

import React from 'react';
import { View } from 'react-native';
import WorkoutCard from './WorkoutCard';
import { COLORS } from '../../constants/colors';

export default {
  title: 'Workout/WorkoutCard',
  component: WorkoutCard,
  argTypes: {
    level: {
      control: { type: 'select' },
      options: ['beginner', 'intermediate', 'advanced'],
    },
  },
};

const Template = (args) => (
  <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1 }}>
    <WorkoutCard {...args} />
  </View>
);

export const Default = Template.bind({});
Default.args = {
  workout: {
    id: '1',
    name: 'Treino A - Peito e Triceps',
    category: 'Musculacao',
    duration_minutes: 45,
    level: 'intermediate',
    exercises_count: 8,
    calories_burned: 350,
  },
  onPress: () => {},
  onFavorite: () => {},
  isFavorite: false,
};

export const Beginner = Template.bind({});
Beginner.args = {
  workout: {
    id: '2',
    name: 'Treino Iniciante',
    category: 'Musculacao',
    duration_minutes: 30,
    level: 'beginner',
    exercises_count: 6,
    calories_burned: 200,
  },
  onPress: () => {},
  onFavorite: () => {},
  isFavorite: false,
};

export const Advanced = Template.bind({});
Advanced.args = {
  workout: {
    id: '3',
    name: 'Treino Avancado - Full Body',
    category: 'HIIT',
    duration_minutes: 60,
    level: 'advanced',
    exercises_count: 12,
    calories_burned: 500,
  },
  onPress: () => {},
  onFavorite: () => {},
  isFavorite: true,
};

export const Favorited = Template.bind({});
Favorited.args = {
  workout: {
    id: '4',
    name: 'Meu Treino Favorito',
    category: 'Cardio',
    duration_minutes: 40,
    level: 'intermediate',
    exercises_count: 10,
    calories_burned: 400,
  },
  onPress: () => {},
  onFavorite: () => {},
  isFavorite: true,
};
