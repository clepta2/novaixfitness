// src/services/podcast.js
// Servico de Podcast - NOVAIX FITNESS

import { Audio } from 'expo-av';

const EPISODES = [
  {
    id: 'ep1',
    title: 'Como Comecar a Treinar',
    description: 'Dicas para iniciantes comearem sua jornada fitness.',
    duration: '12:30',
    durationSeconds: 750,
    category: 'treino',
    url: null,
  },
  {
    id: 'ep2',
    title: 'Nutricao Basica para Musculacao',
    description: 'O que comer para ganhar massa muscular.',
    duration: '15:45',
    durationSeconds: 945,
    category: 'nutricao',
    url: null,
  },
  {
    id: 'ep3',
    title: 'Mentalidade de Atleta',
    description: 'Como manter a motivacao e consistencia.',
    duration: '10:20',
    durationSeconds: 620,
    category: 'mindset',
    url: null,
  },
  {
    id: 'ep4',
    title: 'Erros Comuns no Treino',
    description: 'Os 5 erros que todo iniciante comete.',
    duration: '14:10',
    durationSeconds: 850,
    category: 'treino',
    url: null,
  },
  {
    id: 'ep5',
    title: 'Sono e Recuperacao',
    description: 'Por que dormir bem e fundamental para evoluir.',
    duration: '11:55',
    durationSeconds: 715,
    category: 'saude',
    url: null,
  },
];

let currentSound = null;
let isPlaying = false;

export function getEpisodes(category) {
  if (!category || category === 'all') return EPISODES;
  return EPISODES.filter(ep => ep.category === category);
}

export function getEpisodeById(id) {
  return EPISODES.find(ep => ep.id === id) || null;
}

export async function playEpisode(episode) {
  if (!episode?.url) return { played: false, reason: 'no_audio_url' };

  try {
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
    const { sound } = await Audio.Sound.createAsync({ uri: episode.url });
    currentSound = sound;
    await sound.playAsync();
    isPlaying = true;
    return { played: true };
  } catch {
    return { played: false, reason: 'playback_error' };
  }
}

export async function pauseEpisode() {
  if (currentSound) {
    await currentSound.pauseAsync();
    isPlaying = false;
    return { paused: true };
  }
  return { paused: false };
}

export async function resumeEpisode() {
  if (currentSound) {
    await currentSound.playAsync();
    isPlaying = true;
    return { resumed: true };
  }
  return { resumed: false };
}

export async function stopEpisode() {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
    isPlaying = false;
    return { stopped: true };
  }
  return { stopped: false };
}

export function getPlaybackStatus() {
  return { isPlaying, hasSound: !!currentSound };
}
