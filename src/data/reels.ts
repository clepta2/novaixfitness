// src/data/reels.ts
// Dados de mock para Reels - NOVAIX FITNESS

export interface Reel {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  views: string;
  likes: number;
  userName: string;
  userAvatar: string;
}

export const MOCK_REELS: Reel[] = [
  {
    id: 'r1',
    title: 'Dica de Agachamento 🏋️',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-performing-dumbbells-squats-in-gym-40546-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=200',
    views: '12.4K',
    likes: 852,
    userName: 'Treinador Alex',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'
  },
  {
    id: 'r2',
    title: 'Foco no Tríceps! 💪',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-training-triceps-muscles-with-cables-in-gym-40552-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=200',
    views: '8.1K',
    likes: 620,
    userName: 'Coach Bruno',
    userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100'
  },
  {
    id: 'r3',
    title: 'Flexão Explosiva 💥',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-athletic-man-doing-pushups-in-the-gym-40550-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=200',
    views: '15.9K',
    likes: 1245,
    userName: 'Jeferson Henrique',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'
  }
];
