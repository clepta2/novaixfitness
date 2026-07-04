// __mocks__/expo-video.js

const React = require('react');

module.exports = {
  VideoView: React.forwardRef((props, ref) => null),
  useVideoPlayer: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    release: jest.fn(),
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    playing: false,
    loop: false,
    playbackRate: 1,
    muted: false,
    addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  })),
  createVideoPlayer: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    release: jest.fn(),
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    playing: false,
    loop: false,
    playbackRate: 1,
    muted: false,
    addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  })),
};
