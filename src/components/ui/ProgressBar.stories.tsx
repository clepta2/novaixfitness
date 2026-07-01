// src/components/ui/ProgressBar.stories.js
// Stories do ProgressBar - NOVAIX FITNESS

import React from 'react';
import { View } from 'react-native';
import ProgressBar from './ProgressBar';
import { COLORS } from '../../constants/colors';

export default {
  title: 'UI/ProgressBar',
  component: ProgressBar,
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 5 },
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'error'],
    },
    animated: { control: 'boolean' },
    showLabel: { control: 'boolean' },
  },
};

const Template = (args) => (
  <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1, justifyContent: 'center' }}>
    <ProgressBar {...args} />
  </View>
);

export const Default = Template.bind({});
Default.args = {
  progress: 50,
  variant: 'default',
  animated: true,
  showLabel: true,
};

export const Success = Template.bind({});
Success.args = {
  progress: 100,
  variant: 'success',
  animated: true,
  showLabel: true,
};

export const Warning = Template.bind({});
Warning.args = {
  progress: 75,
  variant: 'warning',
  animated: true,
  showLabel: true,
};

export const Error = Template.bind({});
Error.args = {
  progress: 25,
  variant: 'error',
  animated: true,
  showLabel: true,
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
  progress: 60,
  variant: 'default',
  animated: true,
  showLabel: false,
};

export const NotAnimated = Template.bind({});
NotAnimated.args = {
  progress: 40,
  variant: 'default',
  animated: false,
  showLabel: true,
};
