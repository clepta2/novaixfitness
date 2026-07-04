// __mocks__/expo-crypto.js
export default {
  digestStringAsync: jest.fn().mockResolvedValue('mocked-hash'),
  randomUUID: jest.fn().mockReturnValue('00000000-0000-0000-0000-000000000000'),
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
};
