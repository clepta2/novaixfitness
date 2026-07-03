// src/constants/typography.ts
// Tipografia compartilhada - NOVAIX FITNESS

import { TextStyle } from 'react-native';
import { COLORS } from './colors';

// Títulos (Montserrat Bold)
export const TITLE_XS: TextStyle = { fontFamily: 'Montserrat_700Bold', fontSize: 12 };
export const TITLE_SM: TextStyle = { fontFamily: 'Montserrat_700Bold', fontSize: 14 };
export const TITLE_MD: TextStyle = { fontFamily: 'Montserrat_700Bold', fontSize: 16 };
export const TITLE_LG: TextStyle = { fontFamily: 'Montserrat_700Bold', fontSize: 18 };

// Corpo (Inter Regular)
export const BODY_XS: TextStyle = { fontFamily: 'Inter_400Regular', fontSize: 11 };
export const BODY_SM: TextStyle = { fontFamily: 'Inter_400Regular', fontSize: 12 };
export const BODY_MD: TextStyle = { fontFamily: 'Inter_400Regular', fontSize: 14 };

// Labels (Inter Medium)
export const LABEL_XS: TextStyle = { fontFamily: 'Inter_500Medium', fontSize: 11 };
export const LABEL_SM: TextStyle = { fontFamily: 'Inter_500Medium', fontSize: 12 };
export const LABEL_MD: TextStyle = { fontFamily: 'Inter_500Medium', fontSize: 14 };

// Semibold
export const SEMI_XS: TextStyle = { fontFamily: 'Montserrat_600SemiBold', fontSize: 11 };
export const SEMI_SM: TextStyle = { fontFamily: 'Montserrat_600SemiBold', fontSize: 12 };
export const SEMI_MD: TextStyle = { fontFamily: 'Montserrat_600SemiBold', fontSize: 14 };

// Cores pré-definidas
export const TITLE_PRIMARY: TextStyle = { ...TITLE_SM, color: COLORS.primary };
export const TITLE_SURFACE: TextStyle = { ...TITLE_SM, color: COLORS.textTitle };
export const BODY_MUTED: TextStyle = { ...BODY_SM, color: COLORS.textMuted };
export const LABEL_PRIMARY: TextStyle = { ...LABEL_SM, color: COLORS.primary };

// Seção com letter spacing (usado em section headers)
export const SECTION_TITLE: TextStyle = { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: COLORS.textTitle, letterSpacing: 1 };

// Empty state / Loading text
export const EMPTY_TEXT: TextStyle = { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted, textAlign: 'center' };
export const LOADING_TEXT: TextStyle = { fontFamily: 'Inter_400Regular', fontSize: 13, color: COLORS.textMuted };
