interface SocialLink {
  icon: string;
  label: string;
  color: string;
  url: string;
}

interface OtherLink {
  icon: string;
  label: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  { icon: 'logo-youtube', label: 'YouTube', color: '#FF0000', url: 'https://youtube.com/@novaixfitness' },
  { icon: 'logo-instagram', label: 'Instagram', color: '#E4405F', url: 'https://instagram.com/novaixfitness' },
  { icon: 'logo-tiktok', label: 'TikTok', color: '#000000', url: 'https://tiktok.com/@novaixfitness' },
];

export const otherLinks: OtherLink[] = [
  { icon: 'globe-outline', label: 'Site Oficial', url: 'https://novaixfitness.com' },
  { icon: 'document-text-outline', label: 'Termos de Uso', url: 'https://novaixfitness.com/termos' },
  { icon: 'shield-checkmark-outline', label: 'Política de Privacidade', url: 'https://novaixfitness.com/privacidade' },
];
