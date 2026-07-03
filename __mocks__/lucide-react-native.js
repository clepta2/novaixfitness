// __mocks__/lucide-react-native.js
// Mock para lucide-react-native

import React from 'react';

const createMockIcon = (name) => {
  const MockIcon = (props) => React.createElement('Icon', { ...props, name });
  MockIcon.displayName = name;
  return MockIcon;
};

module.exports = new Proxy({}, {
  get: (target, prop) => {
    if (typeof prop === 'string') {
      return createMockIcon(prop);
    }
    return undefined;
  },
});
