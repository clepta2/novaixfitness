// src/components/ui/Input.stories.js
// Stories do Input - NOVAIX FITNESS

import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from './Input';
import { COLORS } from '../../constants/colors';

export default {
  title: 'UI/Input',
  component: Input,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number'],
    },
    error: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

const Template = (args) => {
  const [value, setValue] = useState(args.value || '');
  return (
    <View style={{ padding: 20, backgroundColor: COLORS.background, flex: 1, justifyContent: 'center' }}>
      <Input {...args} value={value} onChangeText={setValue} />
    </View>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Digite seu nome',
  type: 'text',
};

export const Email = Template.bind({});
Email.args = {
  placeholder: 'seu@email.com',
  type: 'email',
  icon: 'mail-outline',
};

export const Password = Template.bind({});
Password.args = {
  placeholder: 'Sua senha',
  type: 'password',
  icon: 'lock-closed-outline',
};

export const Number = Template.bind({});
Number.args = {
  placeholder: '0',
  type: 'number',
  icon: 'Calculator',
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: 'Nome completo',
  placeholder: 'Digite seu nome',
  type: 'text',
};

export const WithError = Template.bind({});
WithError.args = {
  placeholder: 'Email invalido',
  type: 'email',
  error: 'Email invalido',
  value: 'invalido',
};

export const Disabled = Template.bind({});
Disabled.args = {
  placeholder: 'Campo desabilitado',
  type: 'text',
  disabled: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  placeholder: 'Buscar',
  type: 'text',
  icon: 'search-outline',
};
