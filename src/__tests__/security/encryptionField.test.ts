// src/__tests__/security/encryptionField.test.ts
// Testes de criptografia real — roundtrip encrypt → decrypt

import { encryptField, decryptField, encryptSensitiveData, decryptSensitiveData, getSensitiveFields } from '../../security/encryptionField';

// Mock crypto.subtle para testes Node.js
const mockCrypto = {
  subtle: {
    importKey: jest.fn().mockResolvedValue({ type: 'secret' }),
    deriveBits: jest.fn().mockResolvedValue(new ArrayBuffer(32)),
    encrypt: jest.fn().mockImplementation(async (_algo, _key, data) => {
      const input = new Uint8Array(data);
      const output = new Uint8Array(input.length + 16);
      output.set(input);
      for (let i = input.length; i < output.length; i++) output[i] = 0x42;
      return output.buffer;
    }),
    decrypt: jest.fn().mockImplementation(async (_algo, _key, data) => {
      const input = new Uint8Array(data);
      return input.slice(0, input.length - 16).buffer;
    }),
  },
  getRandomValues: jest.fn((arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) arr[i] = i + 1;
    return arr;
  }),
};

(global as any).crypto = mockCrypto;
(global as any).atob = (b64: string) => Buffer.from(b64, 'base64').toString('binary');
(global as any).btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');

describe('encryptionField — Criptografia real AES-GCM-256', () => {
  const userKey = 'test-password-123';

  describe('encryptField / decryptField roundtrip', () => {
    it('deve criptografar e descriptografar texto simples', async () => {
      const original = 'Texto sensivel do usuario';
      const encrypted = await encryptField(original, userKey);
      const decrypted = await decryptField(encrypted, userKey);
      expect(decrypted).toBe(original);
    });

    it('deve retornar vazio para input vazio', async () => {
      expect(await encryptField('', userKey)).toBe('');
    });

    it('deve retornar formato iv:ciphertext:tag:salt', async () => {
      const encrypted = await encryptField('dados', userKey);
      const parts = encrypted.split(':');
      expect(parts.length).toBe(4);
    });

    it('deve chamar crypto.subtle.encrypt com AES-GCM', async () => {
      await encryptField('teste', userKey);
      expect(mockCrypto.subtle.encrypt).toHaveBeenCalled();
      const algo = mockCrypto.subtle.encrypt.mock.calls[0][0];
      expect(algo.name).toBe('AES-GCM');
    });

    it('deve chamar crypto.subtle.deriveBits para derivar chave', async () => {
      await encryptField('teste', userKey);
      expect(mockCrypto.subtle.deriveBits).toHaveBeenCalled();
    });
  });

  describe('encryptSensitiveData / decryptSensitiveData', () => {
    it('deve criptografar campos sensiveis de profiles', async () => {
      const data = { name: 'Joao', email: 'joao@test.com', phone: '1199999' };
      const encrypted = await encryptSensitiveData('profiles', data, userKey);

      expect(encrypted.name).toBe('Joao'); // Nao sensivel
      expect(encrypted.email).not.toBe('joao@test.com'); // Criptografado
      expect(encrypted.phone).not.toBe('1199999'); // Criptografado
    });

    it('deve descriptografar de volta ao original', async () => {
      const data = { name: 'Joao', email: 'joao@test.com', cpf: '12345678901' };
      const encrypted = await encryptSensitiveData('profiles', data, userKey);
      const decrypted = await decryptSensitiveData('profiles', encrypted, userKey);

      expect(decrypted.name).toBe('Joao');
      expect(decrypted.email).toBe('joao@test.com');
      expect(decrypted.cpf).toBe('12345678901');
    });
  });

  describe('getSensitiveFields', () => {
    it('deve retornar campos sensiveis conhecidos', () => {
      expect(getSensitiveFields('profiles')).toContain('email');
      expect(getSensitiveFields('profiles')).toContain('cpf');
      expect(getSensitiveFields('payments')).toContain('card_number');
      expect(getSensitiveFields('unknown')).toEqual([]);
    });
  });
});
