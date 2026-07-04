// __mocks__/expo-av.js

module.exports = {
  Audio: {
    Sound: jest.fn().mockImplementation(() => ({
      loadAsync: jest.fn().mockResolvedValue(true),
      playAsync: jest.fn().mockResolvedValue(true),
      pauseAsync: jest.fn().mockResolvedValue(true),
      stopAsync: jest.fn().mockResolvedValue(true),
      unloadAsync: jest.fn().mockResolvedValue(true),
      setPositionAsync: jest.fn().mockResolvedValue(true),
      setVolumeAsync: jest.fn().mockResolvedValue(true),
      getStatusAsync: jest.fn().mockResolvedValue({ isLoaded: true, isPlaying: false }),
      setOnPlaybackStatusUpdate: jest.fn(),
      status: { isLoaded: false },
    })),
    Recording: jest.fn().mockImplementation(() => ({
      prepareToRecordAsync: jest.fn().mockResolvedValue(true),
      startAsync: jest.fn().mockResolvedValue(true),
      stopAndUnloadAsync: jest.fn().mockResolvedValue(true),
      getURI: jest.fn().mockReturnValue('file:///test.m4a'),
    })),
    setIsEnabledAsync: jest.fn().mockResolvedValue(true),
    setAudioModeAsync: jest.fn().mockResolvedValue(true),
  },
  Video: jest.fn().mockImplementation(() => null),
};