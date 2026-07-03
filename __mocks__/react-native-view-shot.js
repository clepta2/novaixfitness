// __mocks__/react-native-view-shot.js
module.exports = {
  __esModule: true,
  default: require('react').forwardRef(() => null),
  captureRef: jest.fn().mockResolvedValue('mock-image-uri'),
  captureScreen: jest.fn().mockResolvedValue('mock-screen-uri'),
};
