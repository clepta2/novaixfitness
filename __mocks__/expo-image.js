// __mocks__/expo-image.js

const React = require('react');

const Image = React.forwardRef((props, ref) => {
  return React.createElement('Image', { ...props, ref });
});
Image.displayName = 'Image';

module.exports = { Image };
