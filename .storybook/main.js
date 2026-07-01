// .storybook/main.js
// Configuracao Storybook - NOVAIX FITNESS

module.exports = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-react-native-web',
  ],
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules\/(?!react-native-)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['module:metro-react-native-babel-preset'],
        },
      },
    });
    return config;
  },
};
