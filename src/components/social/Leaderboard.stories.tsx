// src/components/social/Leaderboard.stories.js
// Stories do Leaderboard - NOVAIX FITNESS

import React from 'react';
import { View } from 'react-native';
import Leaderboard from './Leaderboard';
import { COLORS } from '../../constants/colors';

export default {
  title: 'Social/Leaderboard',
  component: Leaderboard,
};

const Template = (args) => (
  <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1 }}>
    <Leaderboard {...args} />
  </View>
);

const mockRankings = [
  { id: '1', name: 'Joao Silva', level: 25, xp: 18500, avatar_url: null },
  { id: '2', name: 'Maria Santos', level: 22, xp: 15200, avatar_url: null },
  { id: '3', name: 'Pedro Costa', level: 20, xp: 12800, avatar_url: null },
  { id: '4', name: 'Ana Oliveira', level: 18, xp: 10500, avatar_url: null },
  { id: '5', name: 'Lucas Pereira', level: 15, xp: 8200, avatar_url: null },
];

export const Default = Template.bind({});
Default.args = {
  rankings: mockRankings,
  currentUserId: '1',
};

export const Empty = Template.bind({});
Empty.args = {
  rankings: [],
  currentUserId: null,
};

export const SingleUser = Template.bind({});
SingleUser.args = {
  rankings: [mockRankings[0]],
  currentUserId: '1',
};
