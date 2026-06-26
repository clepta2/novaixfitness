// src/hooks/useNavigation.js
// Hook de Navegação Customizado - NOVAIX FITNESS

import { useRouter } from 'expo-router';
import { ROUTES } from '../helpers/navigation';

export function useAppNavigation() {
  const router = useRouter();

  const navigate = {
    // Auth
    toLogin: () => router.replace(ROUTES.LOGIN),
    toRegister: () => router.push(ROUTES.REGISTER),
    toForgotPassword: () => router.push(ROUTES.FORGOT_PASSWORD),

    // Onboarding
    toOnboardingGoal: () => router.push(ROUTES.ONBOARDING_GOAL),
    toOnboardingGender: () => router.push(ROUTES.ONBOARDING_GENDER),
    toOnboardingPhysical: () => router.push(ROUTES.ONBOARDING_PHYSICAL),
    toOnboardingModel: () => router.push(ROUTES.ONBOARDING_MODEL),
    toOnboardingAvailability: () => router.push(ROUTES.ONBOARDING_AVAILABILITY),
    toOnboardingGymType: () => router.push(ROUTES.ONBOARDING_GYM_TYPE),
    toOnboardingExperience: () => router.push(ROUTES.ONBOARDING_EXPERIENCE),
    toOnboardingProcessing: () => router.push(ROUTES.ONBOARDING_PROCESSING),

    // Main
    toHome: () => router.replace(ROUTES.HOME),
    toFeed: () => router.push(ROUTES.FEED),
    toProfile: () => router.push(ROUTES.PROFILE),
    toPlayer: (workoutId) => router.push({ pathname: ROUTES.PLAYER, params: { id: workoutId } }),
    toPaywall: () => router.push(ROUTES.PAYWALL),

    // Profile
    toLgpd: () => router.push(ROUTES.LGPD),

    // Utils
    back: () => router.back(),
    replace: (route) => router.replace(route),
    push: (route) => router.push(route),
  };

  return navigate;
}
