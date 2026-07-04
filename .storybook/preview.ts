// .storybook/preview.js
// Preview do Storybook - NOVAIX FITNESS

import { withBackgrounds } from '@storybook/addon-onbackgrounds';
import { COLORS } from '../src/constants/colors';

export const decorators = [
  withBackgrounds([
    { name: 'dark', value: COLORS.background, default: true },
    { name: 'light', value: '#FFFFFF' },
    { name: 'surface', value: COLORS.surface },
  ]),
];

export const parameters = {
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'dark',
    values: [
      { name: 'dark', value: COLORS.background },
      { name: 'light', value: '#FFFFFF' },
      { name: 'surface', value: COLORS.surface },
    ],
  },
};
