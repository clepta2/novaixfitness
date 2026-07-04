// src/services/podcast.ts
// Servico de Podcast - NOVAIX FITNESS

import { Audio, AVPlaybackStatus } from 'expo-av';

interface Episode {
  id: string;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  category: string;
  url: string | null;
}

const EPISODES: Episode[] = [
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

let currentSound: Audio.Sound | null = null;

export function getEpisodes(): Episode[] {
  return EPISODES;
}

export function getEpisodeById(id: string): Episode | null {
  return EPISODES.find(ep => ep.id === id) || null;
}

export function getEpisodesByCategory(category: string): Episode[] {
  return EPISODES.filter(ep => ep.category === category);
}

export async function playEpisode(episode: Episode): Promise<boolean> {
  if (!episode.url) {
    if (__DEV__) console.warn('Episode URL not available');
    return false;
  }

  try {
    if (currentSound) {
      await currentSound.unloadAsync();
    }

    const { sound } = await Audio.Sound.createAsync(
      { uri: episode.url },
      { shouldPlay: true }
    );
    currentSound = sound;
    return true;
  } catch (error) {
    if (__DEV__) console.error('Erro ao reproduzir episodio:', error);
    return false;
  }
}

export async function pausePlayback(): Promise<void> {
  if (currentSound) {
    await currentSound.pauseAsync();
  }
}

export async function resumePlayback(): Promise<void> {
  if (currentSound) {
    await currentSound.playAsync();
  }
}

export async function stopPlayback(): Promise<void> {
  if (currentSound) {
    await currentSound.stopAsync();
    await currentSound.unloadAsync();
    currentSound = null;
  }
}

export async function getPlaybackStatus(): Promise<AVPlaybackStatus | null> {
  if (!currentSound) return null;
  return await currentSound.getStatusAsync();
}
