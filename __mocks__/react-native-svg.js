// __mocks__/react-native-svg.js
const React = require('react');

function createSvgComponent(name) {
  const Component = (props) => React.createElement('View', { testID: name, ...props });
  Component.displayName = name;
  return Component;
}

module.exports = {
  __esModule: true,
  default: createSvgComponent('Svg'),
  Svg: createSvgComponent('Svg'),
  Circle: createSvgComponent('Circle'),
  Rect: createSvgComponent('Rect'),
  Path: createSvgComponent('Path'),
  Line: createSvgComponent('Line'),
  G: createSvgComponent('G'),
  Defs: createSvgComponent('Defs'),
  LinearGradient: createSvgComponent('LinearGradient'),
  Stop: createSvgComponent('Stop'),
  Polygon: createSvgComponent('Polygon'),
  Ellipse: createSvgComponent('Ellipse'),
  Text: createSvgComponent('Text'),
  TSpan: createSvgComponent('TSpan'),
  Use: createSvgComponent('Use'),
  ClipPath: createSvgComponent('ClipPath'),
  Pattern: createSvgComponent('Pattern'),
  Mask: createSvgComponent('Mask'),
  Image: createSvgComponent('Image'),
};
