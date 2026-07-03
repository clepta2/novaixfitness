// __mocks__/expo-audio.js

module.exports = {
  createAudioPlayer: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    release: jest.fn(),
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    playing: false,
    addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  })),
  useAudioPlayer: jest.fn().mockImplementation(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    release: jest.fn(),
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    playing: false,
    addListener: jest.fn().mockReturnValue({ remove: jest.fn() }),
  })),
  useAudioPlayerStatus: jest.fn().mockReturnValue({
    playing: false,
    currentTime: 0,
    duration: 0,
  }),
  setAudioModeAsync: jest.fn().mockResolvedValue(true),
  setIsAudioActiveAsync: jest.fn().mockResolvedValue(true),
  requestRecordingPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted', granted: true }),
  getRecordingPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted', granted: true }),
};
