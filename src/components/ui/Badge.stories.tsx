// src/components/ui/Badge.stories.js
// Stories do Badge - NOVAIX FITNESS

import React from 'react';
import { View } from 'react-native';
import Badge from './Badge';
import { COLORS } from '../../constants/colors';

export default {
  title: 'UI/Badge',
  component: Badge,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

const Template = (args) => (
  <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1, justifyContent: 'center', flexDirection: 'row', gap: 10 }}>
    <Badge {...args} />
  </View>
);

export const Primary = Template.bind({});
Primary.args = {
  label: 'Novo',
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: 'Secundario',
  variant: 'secondary',
};

export const Success = Template.bind({});
Success.args = {
  label: 'Concluido',
  variant: 'success',
};

export const Warning = Template.bind({});
Warning.args = {
  label: 'Atencao',
  variant: 'warning',
};

export const Error = Template.bind({});
Error.args = {
  label: 'Erro',
  variant: 'error',
};

export const Info = Template.bind({});
Info.args = {
  label: 'Info',
  variant: 'info',
};

export const Small = Template.bind({});
Small.args = {
  label: 'Pequeno',
  variant: 'primary',
  size: 'sm',
};

export const Large = Template.bind({});
Large.args = {
  label: 'Grande',
  variant: 'primary',
  size: 'lg',
};
