// src/services/monetization.tsx
// Sistema de monetizacao - re-exportacao

export { PLANS, getPlans, getPlan, type Plan, type Subscription, type Coupon } from './monetizationPlans';
export { getUserPlan, checkFeatureAccess, getUsageStats, createSubscription, cancelSubscription, getSubscriptionHistory } from './monetizationSubscription';
export { applyCoupon, recordCouponUsage, createReferral, applyReferral, getReferralStats } from './monetizationCoupons';
