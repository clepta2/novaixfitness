// __mocks__/react-native-webview.js
// Mock para react-native-webview

import React from 'react';

const WebView = React.forwardRef((props, ref) => {
  return React.createElement('WebView', { ...props, ref });
});

WebView.displayName = 'WebView';

module.exports = {
  __esModule: true,
  default: WebView,
  WebView,
};
