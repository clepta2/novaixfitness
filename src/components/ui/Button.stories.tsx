// src/components/ui/Button.stories.js
// Stories do Button - NOVAIX FITNESS

import React from 'react';
import { View } from 'react-native';
import Button from './Button';
import { COLORS } from '../../constants/colors';

export default {
  title: 'UI/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
};

const Template = (args) => (
  <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1, justifyContent: 'center' }}>
    <Button {...args} />
  </View>
);

export const Primary = Template.bind({});
Primary.args = {
  title: 'Primary Button',
  variant: 'primary',
  size: 'md',
};

export const Secondary = Template.bind({});
Secondary.args = {
  title: 'Secondary Button',
  variant: 'secondary',
  size: 'md',
};

export const Outline = Template.bind({});
Outline.args = {
  title: 'Outline Button',
  variant: 'outline',
  size: 'md',
};

export const Ghost = Template.bind({});
Ghost.args = {
  title: 'Ghost Button',
  variant: 'ghost',
  size: 'md',
};

export const Danger = Template.bind({});
Danger.args = {
  title: 'Danger Button',
  variant: 'danger',
  size: 'md',
};

export const Small = Template.bind({});
Small.args = {
  title: 'Small',
  variant: 'primary',
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  title: 'Large Button',
  variant: 'primary',
  size: 'lg',
};

export const Disabled = Template.bind({});
Disabled.args = {
  title: 'Disabled',
  variant: 'primary',
  size: 'md',
  disabled: true,
};

export const Loading = Template.bind({});
Loading.args = {
  title: 'Loading',
  variant: 'primary',
  size: 'md',
  loading: true,
};
