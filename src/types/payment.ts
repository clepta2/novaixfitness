// src/types/payment.ts - Tipos de assinatura, planos e pagamentos

export type SubscriptionStatus = 'free' | 'active' | 'premium' | 'cancelled' | 'expired';
export type BillingType = 'monthly' | 'annual';
export type PlanFeature = { text: string; included: boolean };
export type PlanLimits = {
  workouts_per_week: number; ai_chats_per_day: number;
  custom_workouts: number; export_data: boolean; priority_support: boolean;
};

export type Plan = {
  id: string; name: string; price: number; priceText?: string;
  annualPrice?: number; annualPriceText?: string; annualSavings?: string;
  period?: string; annualPeriod?: string; popular?: boolean;
  features: PlanFeature[]; limits?: PlanLimits;
};

export type PaymentStatus = 'pending' | 'processing' | 'received' | 'failed' | 'refunded';

export type Payment = {
  id: string; user_id: string; amount: number; status: PaymentStatus;
  payment_method: string; plan_type: string; created_at: string;
};

export type PixPayment = {
  pixQrCode: string; pixCopyPaste: string; expiresAt: string;
};

export type MarketplaceProduct = {
  id: string; name: string; description: string; price: number;
  category: string; image_url: string; seller_id: string;
  rating?: number; review_count?: number; created_at: string;
};

export type MarketplaceReview = {
  id: string; product_id: string; user_id: string; rating: number;
  comment: string; created_at: string;
  profiles?: { name: string; avatar_url: string | null };
};
