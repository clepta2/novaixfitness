// src/services/spotify.js
// Integracao Spotify - NOVAIX FITNESS

import { Linking, Platform } from 'react-native';

const PLAYLISTS = {
  strength: { id: 'novaix_strength', name: 'NOVAIX Forca', uri: 'playlist:37i9dQZF1DX76Wlfdnj7AP' },
  cardio: { id: 'novaix_cardio', name: 'NOVAIX Cardio', uri: 'playlist:37i9dQZF1DX0XUsuxWHRQd' },
  warmup: { id: 'novaix_warmup', name: 'NOVAIX Aquecimento', uri: 'playlist:37i9dQZF1DWWEJlAGA9j0Q' },
  recovery: { id: 'novaix_recovery', name: 'NOVAIX Recuperacao', uri: 'playlist:37i9dQZF1DWZqd5JBERJBg' },
  hiit: { id: 'novaix_hiit', name: 'NOVAIX HIIT', uri: 'playlist:37i9dQZF1DX4dyzvuaRJ0n' },
};

export async function isSpotifyInstalled() {
  try {
    const canOpen = await Linking.canOpenURL('spotify://');
    return canOpen;
  } catch {
    return false;
  }
}

export async function openSpotifyPlaylist(workoutType) {
  const playlist = PLAYLISTS[workoutType] || PLAYLISTS.strength;

  try {
    const spotifyInstalled = await isSpotifyInstalled();
    if (spotifyInstalled) {
      await Linking.openURL(`spotify:playlist:${playlist.id}`);
      return { opened: true, playlist: playlist.name };
    }

    await Linking.openURL(`https://open.spotify.com/playlist/${playlist.id}`);
    return { opened: true, playlist: playlist.name, via: 'web' };
  } catch {
    return { opened: false, error: 'Could not open Spotify' };
  }
}

export async function openSpotifySearch(query) {
  try {
    const spotifyInstalled = await isSpotifyInstalled();
    if (spotifyInstalled) {
      await Linking.openURL(`spotify:search:${encodeURIComponent(query)}`);
      return { opened: true };
    }
    await Linking.openURL(`https://open.spotify.com/search/${encodeURIComponent(query)}`);
    return { opened: true, via: 'web' };
  } catch {
    return { opened: false };
  }
}

export function getPlaylistForWorkout(category, duration) {
  if (category === 'Cardio' || category === 'HIIT') return PLAYLISTS.cardio;
  if (category === 'Yoga' || category === 'Flexibilidade') return PLAYLISTS.recovery;
  return PLAYLISTS.strength;
}

export { PLAYLISTS };
