// src/components/home/GamificationSummary.stories.js
// Stories do GamificationSummary - NOVAIX FITNESS

import React from 'react';
import { View } from 'react-native';
import GamificationSummary from './GamificationSummary';
import { COLORS } from '../../constants/colors';

export default {
  title: 'Home/GamificationSummary',
  component: GamificationSummary,
};

const Template = (args) => (
  <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1, justifyContent: 'center' }}>
    <GamificationSummary {...args} />
  </View>
);

export const Default = Template.bind({});
Default.args = {
  level: 5,
  xp: 1250,
  xpForNext: 2000,
  streak: 7,
  achievements: 12,
};

export const HighLevel = Template.bind({});
HighLevel.args = {
  level: 25,
  xp: 18500,
  xpForNext: 20000,
  streak: 30,
  achievements: 45,
};

export const NewUser = Template.bind({});
NewUser.args = {
  level: 1,
  xp: 50,
  xpForNext: 100,
  streak: 1,
  achievements: 1,
};
