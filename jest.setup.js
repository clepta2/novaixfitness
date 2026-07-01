jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Alert.alert = jest.fn();
  return RN;
});

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: {
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
    useNetInfo: jest.fn(() => ({ isConnected: true, isInternetReachable: true })),
  },
  addEventListener: jest.fn(() => jest.fn()),
  fetch: jest.fn(() => Promise.resolve({ isConnected: true, isInternetReachable: true })),
  useNetInfo: jest.fn(() => ({ isConnected: true, isInternetReachable: true })),
}));

jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
}));

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-camera', () => ({
  Camera: 'Camera',
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ cancelled: false, assets: [] }),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('react-native-webview', () => ({
  WebView: 'WebView',
}));

jest.mock('react-native-svg', () => {
  const R = require('react');
  const createSvgComponent = (name) => {
    const C = (props) => R.createElement('Svg', props);
    C.displayName = name;
    return C;
  };
  return {
    __esModule: true,
    default: createSvgComponent('Svg'),
    Svg: createSvgComponent('Svg'),
    Circle: createSvgComponent('Circle'),
    Path: createSvgComponent('Path'),
    G: createSvgComponent('G'),
    Rect: createSvgComponent('Rect'),
    Line: createSvgComponent('Line'),
    Polygon: createSvgComponent('Polygon'),
    Text: createSvgComponent('SvgText'),
  };
});

jest.mock('lucide-react-native', () => {
  const R = require('react');
  return new Proxy({}, { get: (_, k) => (p) => R.createElement('Icon', p) });
});

global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({}),
});
