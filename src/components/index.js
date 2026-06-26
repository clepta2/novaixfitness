// src/components/index.js
// Exportação centralizada de componentes NOVAIX FITNESS

export { Button } from './ui/Button';
export { Input } from './ui/Input';
export { Card } from './ui/Card';
export { Header } from './ui/Header';
export { Avatar } from './ui/Avatar';
export { Badge } from './ui/Badge';
export { ProgressBar } from './ui/ProgressBar';
export { Timer } from './ui/Timer';

// Workout components
export { default as ExerciseAccordion } from './workout/ExerciseAccordion';
export { default as ExerciseStepCarousel } from './workout/ExerciseStepCarousel';
export { default as WorkoutListItem } from './workout/WorkoutListItem';
export { default as ProgressSection } from './workout/ProgressSection';
export { default as CategoryCard } from './workout/CategoryCard';
export { default as WorkoutCard } from './workout/WorkoutCard';
export { default as FavoriteWorkoutCard } from './workout/FavoriteWorkoutCard';
export { default as WorkoutInfo } from './workout/WorkoutInfo';
export { default as VideoPreview } from './workout/VideoPreview';
export { default as MoreOptionsModal } from './workout/MoreOptionsModal';
export { default as RatingModal } from './workout/RatingModal';
export { default as SetsTracker } from './workout/SetsTracker';
export { default as WorkoutListView } from './workout/WorkoutListView';

// Social components
export { default as PostCard } from './social/PostCard';
export { default as CreatePostModal } from './social/CreatePostModal';
export { default as NotificationModal } from './social/NotificationModal';

// Profile components
export { default as ProfileHeader } from './profile/ProfileHeader';
export { default as StatsGrid } from './profile/StatsGrid';
export { default as PhysicalData } from './profile/PhysicalData';
export { default as BadgesRow } from './profile/BadgesRow';
export { default as GamificationBar } from './profile/GamificationBar';
export { default as AchievementsList } from './profile/AchievementsList';
export { default as RankingCard } from './profile/RankingCard';
export { default as WeeklyChallenges } from './profile/WeeklyChallenges';
export { default as WeightLogger } from './profile/WeightLogger';
export { default as EditNameModal } from './profile/EditNameModal';

// Home components
export { default as DailyWorkoutCard } from './home/DailyWorkoutCard';
export { default as WaterLogger } from './home/WaterLogger';
export { default as WeeklyProgress } from './home/WeeklyProgress';

// Paywall components
export { default as PlanCard } from './paywall/PlanCard';
export { default as CouponInput } from './paywall/CouponInput';

// FAQ components
export { default as FaqItem } from './faq/FaqItem';
export { default as ContactCard } from './faq/ContactCard';

// Auth components
export { default as AuthInput } from './auth/AuthInput';
export { default as SocialButton } from './auth/SocialButton';

// Admin components
export { default as StudentCard } from './admin/StudentCard';
export { default as FinanceStats } from './admin/FinanceStats';

// Referral components
export { default as ReferralCard } from './referral/ReferralCard';

// Common components
export { default as AchievementPopup } from './common/AchievementPopup';
