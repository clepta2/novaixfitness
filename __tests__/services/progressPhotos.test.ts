jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  requestCameraPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  launchImageLibraryAsync: jest.fn().mockResolvedValue({ canceled: false, assets: [{ uri: 'file://photo.jpg' }] }),
  launchCameraAsync: jest.fn().mockResolvedValue({ canceled: false, assets: [{ uri: 'file://camera.jpg' }] }),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('expo-file-system', () => ({}));

jest.mock('../../src/config/supabase', () => {
  const chain = {
    select: jest.fn(() => chain),
    eq: jest.fn(() => chain),
    order: jest.fn(() => chain),
    limit: jest.fn(() => chain),
    single: jest.fn().mockResolvedValue({ data: { id: 'p1' }, error: null }),
    insert: jest.fn(() => chain),
    delete: jest.fn(() => chain),
  };
  const storage = {
    from: jest.fn(() => ({
      upload: jest.fn().mockResolvedValue({ error: null }),
      getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://url/photo.jpg' } }),
      remove: jest.fn().mockResolvedValue({}),
    })),
  };
  return { supabase: { from: jest.fn(() => chain), storage, __chain: chain, __storage: storage } };
});

import {
  pickImage,
  takePhoto,
  uploadProgressPhoto,
  getProgressPhotos,
  getProgressPhotosByLabel,
  deleteProgressPhoto,
  getProgressLabels,
  PHOTO_LABELS,
} from '../../src/services/progress-photos';

const ImagePicker = require('expo-image-picker');
const { supabase } = require('../../src/config/supabase');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Progress Photos Service', () => {
  describe('pickImage', () => {
    it('returns image asset on success', async () => {
      const result = await pickImage();
      expect(result).toEqual({ uri: 'file://photo.jpg' });
    });

    it('returns null when canceled', async () => {
      ImagePicker.launchImageLibraryAsync.mockResolvedValueOnce({ canceled: true, assets: [] });
      const result = await pickImage();
      expect(result).toBeNull();
    });

    it('throws when permission denied', async () => {
      ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
      await expect(pickImage()).rejects.toThrow('Permissao');
    });
  });

  describe('takePhoto', () => {
    it('returns photo asset on success', async () => {
      const result = await takePhoto();
      expect(result).toEqual({ uri: 'file://camera.jpg' });
    });

    it('returns null when canceled', async () => {
      ImagePicker.launchCameraAsync.mockResolvedValueOnce({ canceled: true, assets: [] });
      const result = await takePhoto();
      expect(result).toBeNull();
    });

    it('throws when permission denied', async () => {
      ImagePicker.requestCameraPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
      await expect(takePhoto()).rejects.toThrow('Permissao');
    });
  });

  describe('uploadProgressPhoto', () => {
    it('uploads and returns data', async () => {
      const result = await uploadProgressPhoto('u1', 'file://photo.jpg', 'Frente');
      expect(result).toEqual({ id: 'p1' });
    });
  });

  describe('getProgressPhotos', () => {
    it('returns empty for no userId', async () => {
      expect(await getProgressPhotos(null)).toEqual([]);
    });

    it('returns photos', async () => {
      const chain = supabase.__chain;
      chain.limit.mockResolvedValue({ data: [{ id: 'p1' }], error: null });
      const result = await getProgressPhotos('u1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getProgressPhotosByLabel', () => {
    it('returns empty for no userId', async () => {
      expect(await getProgressPhotosByLabel(null, 'Frente')).toEqual([]);
    });

    it('returns filtered photos', async () => {
      const chain = supabase.__chain;
      chain.order.mockResolvedValue({ data: [{ id: 'p1', label: 'Frente' }], error: null });
      const result = await getProgressPhotosByLabel('u1', 'Frente');
      expect(result).toHaveLength(1);
    });
  });

  describe('deleteProgressPhoto', () => {
    it('calls from with progress_photos', async () => {
      await deleteProgressPhoto('p1', 'u1');
      expect(supabase.from).toHaveBeenCalledWith('progress_photos');
    });

    it('removes from storage when path provided', async () => {
      const storage = supabase.__storage;
      await deleteProgressPhoto('p1', 'u1', 'u1/photo.jpg');
      expect(storage.from).toHaveBeenCalledWith('progress-photos');
    });
  });

  describe('getProgressLabels', () => {
    it('returns default labels for no userId', async () => {
      expect(await getProgressLabels(null)).toEqual([]);
    });

    it('returns unique labels', async () => {
      const chain = supabase.__chain;
      chain.eq.mockResolvedValue({ data: [{ label: 'Frente' }, { label: 'Lado' }, { label: 'Frente' }], error: null });
      const result = await getProgressLabels('u1');
      expect(result).toContain('Frente');
      expect(result).toContain('Lado');
    });

    it('returns default labels when none exist', async () => {
      const chain = supabase.__chain;
      chain.eq.mockResolvedValue({ data: [], error: null });
      const result = await getProgressLabels('u1');
      expect(result).toEqual(['Frente', 'Lado', 'Costas']);
    });
  });

  describe('PHOTO_LABELS', () => {
    it('has all labels', () => {
      expect(PHOTO_LABELS).toContain('Frente');
      expect(PHOTO_LABELS).toContain('Costas');
    });
  });
});
