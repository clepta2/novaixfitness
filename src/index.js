// src/index.js
// Exportação centralizada do projeto NOVAIX FITNESS

// Constants
export * from './constants/colors';
export * from './constants/fonts';
export * from './constants/spacing';
export * from './constants/shadows';

// Components
export * from './components';

// Context
export { AuthProvider, useAuth } from './context/AuthContext';

// Hooks
export { useAppNavigation } from './hooks/useNavigation';

// Helpers
export { ROUTES, ANIMATIONS } from './helpers/navigation';
