// __mocks__/@expo/vector-icons.js
const React = require('react');

function createIconSet(glyphMap, fontFamily, glyphFontModule) {
  const IconComponent = ({ name, size = 24, color = '#000', style, ...props }) => {
    return React.createElement('Icon', { name, size, color, style, ...props });
  };
  IconComponent.displayName = 'Icon';
  return IconComponent;
}

const Ionicons = createIconSet({}, 'Ionicons', {});
const MaterialIcons = createIconSet({}, 'MaterialIcons', {});
const Feather = createIconSet({}, 'Feather', {});
const FontAwesome = createIconSet({}, 'FontAwesome', {});
const Entypo = createIconSet({}, 'Entypo', {});
const AntDesign = createIconSet({}, 'AntDesign', {});
const EvilIcons = createIconSet({}, 'EvilIcons', {});
const Foundation = createIconSet({}, 'Foundation', {});
const Fontisto = createIconSet({}, 'Fontisto', {});

module.exports = {
  __esModule: true,
  default: Ionicons,
  Ionicons,
  MaterialIcons,
  Feather,
  FontAwesome,
  Entypo,
  AntDesign,
  EvilIcons,
  Foundation,
  Fontisto,
  createIconSet,
};
