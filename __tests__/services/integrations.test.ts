jest.mock('react-native', () => ({
  Platform: { OS: 'ios', Version: '17.0' },
  Linking: {
    canOpenURL: jest.fn().mockResolvedValue(true),
    openURL: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock('expo-av', () => ({
  Audio: {
    setAudioModeAsync: jest.fn().mockResolvedValue({}),
    Sound: { createAsync: jest.fn().mockResolvedValue({ sound: { playAsync: jest.fn(), pauseAsync: jest.fn(), stopAsync: jest.fn(), unloadAsync: jest.fn() } }) },
  },
}));

describe('Health Connect', () => {
  const hc = require('../../src/services/healthConnect');

  it('checks availability', async () => {
    const result = await hc.checkHealthAvailability();
    expect(result.available).toBe(true);
  });

  it('requests permissions', async () => {
    const result = await hc.requestHealthPermissions();
    expect(result.granted).toBe(true);
  });

  it('syncs workout', async () => {
    await hc.requestHealthPermissions();
    const result = await hc.syncWorkoutToHealth({ category: 'Musculação', duration: 45 });
    expect(result.synced).toBe(true);
  });
});

describe('Spotify', () => {
  const spotify = require('../../src/services/spotify');

  it('checks if installed', async () => {
    const result = await spotify.isSpotifyInstalled();
    expect(result).toBe(true);
  });

  it('opens playlist', async () => {
    const result = await spotify.openSpotifyPlaylist('strength');
    expect(result.opened).toBe(true);
  });

  it('gets playlist for workout type', () => {
    const playlist = spotify.getPlaylistForWorkout('Cardio', 30);
    expect(playlist.id).toBe('novaix_cardio');
  });
});

describe('Apple Watch', () => {
  const watch = require('../../src/services/appleWatch');

  it('checks availability on iOS', async () => {
    const result = await watch.checkWatchAvailability();
    expect(result.available).toBe(true);
  });

  it('connects watch', async () => {
    const result = await watch.connectWatch();
    expect(result.connected).toBe(true);
  });

  it('sends workout to watch', async () => {
    await watch.connectWatch();
    const result = await watch.sendWorkoutToWatch({ name: 'Treino A', duration: 45 });
    expect(result.sent).toBe(true);
  });
});

describe('Podcast', () => {
  const podcast = require('../../src/services/podcast');

  it('gets all episodes', () => {
    const episodes = podcast.getEpisodes('all');
    expect(episodes.length).toBe(5);
  });

  it('filters by category', () => {
    const episodes = podcast.getEpisodesByCategory('treino');
    expect(episodes.every(ep => ep.category === 'treino')).toBe(true);
  });

  it('gets episode by id', () => {
    const ep = podcast.getEpisodeById('ep1');
    expect(ep.title).toBe('Como Comecar a Treinar');
  });

  it('returns null for unknown id', () => {
    expect(podcast.getEpisodeById('unknown')).toBeNull();
  });

  it('returns null when no sound playing', async () => {
    const status = await podcast.getPlaybackStatus();
    expect(status).toBeNull();
  });
});
