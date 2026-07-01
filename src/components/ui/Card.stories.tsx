// src/components/ui/Card.stories.js
// Stories do Card - NOVAIX FITNESS

import React from 'react';
import { View, Text } from 'react-native';
import Card from './Card';
import { COLORS } from '../../constants/colors';

export default {
  title: 'UI/Card',
  component: Card,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'outlined'],
    },
  },
};

const Template = (args) => (
  <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1, justifyContent: 'center' }}>
    <Card {...args}>
      <Text style={{ color: COLORS.textTitle, fontSize: 16, fontWeight: '600' }}>Card Title</Text>
      <Text style={{ color: COLORS.textDescription, marginTop: 8 }}>This is a card component with some content inside.</Text>
    </Card>
  </View>
);

export const Default = Template.bind({});
Default.args = {
  variant: 'default',
};

export const Elevated = Template.bind({});
Elevated.args = {
  variant: 'elevated',
};

export const Outlined = Template.bind({});
Outlined.args = {
  variant: 'outlined',
};

export const WithPadding = Template.bind({});
WithPadding.args = {
  variant: 'default',
  padding: 24,
};

export const WithMargin = Template.bind({});
WithMargin.args = {
  variant: 'default',
  margin: 16,
};
