// src/index.js
// Exportação centralizada do projeto NOVAIX FITNESS

// Constants
export * from './constants/colors';
export * from './constants/typography';
export * from './constants/spacing';
export * from './constants/shadows';

// Components
export * from './components';

// Context
export { AuthProvider, useAuth } from './context/AuthContext';

// Hooks
export * from './hooks';

// Helpers
export { ROUTES, ANIMATIONS } from './helpers/navigation';
