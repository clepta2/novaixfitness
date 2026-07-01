// src/components/nutrition/NutritionTracker.stories.js
// Stories do NutritionTracker - NOVAIX FITNESS

import React from 'react';
import { View } from 'react-native';
import NutritionTracker from './NutritionTracker';
import { COLORS } from '../../constants/colors';

export default {
  title: 'Nutrition/NutritionTracker',
  component: NutritionTracker,
};

const Template = (args) => (
  <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1 }}>
    <NutritionTracker {...args} />
  </View>
);

export const Default = Template.bind({});
Default.args = {
  calories: { current: 1800, goal: 2200 },
  protein: { current: 120, goal: 150 },
  carbs: { current: 200, goal: 250 },
  fat: { current: 60, goal: 70 },
  water: { current: 2000, goal: 3000 },
};

export const OnTrack = Template.bind({});
OnTrack.args = {
  calories: { current: 1800, goal: 2200 },
  protein: { current: 140, goal: 150 },
  carbs: { current: 230, goal: 250 },
  fat: { current: 65, goal: 70 },
  water: { current: 2800, goal: 3000 },
};

export const OverGoal = Template.bind({});
OverGoal.args = {
  calories: { current: 2500, goal: 2200 },
  protein: { current: 180, goal: 150 },
  carbs: { current: 300, goal: 250 },
  fat: { current: 90, goal: 70 },
  water: { current: 1500, goal: 3000 },
};

export const Empty = Template.bind({});
Empty.args = {
  calories: { current: 0, goal: 2200 },
  protein: { current: 0, goal: 150 },
  carbs: { current: 0, goal: 250 },
  fat: { current: 0, goal: 70 },
  water: { current: 0, goal: 3000 },
};
