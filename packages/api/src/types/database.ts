export enum SubscriptionTier {
  FREE = 'free',
  INDIVIDUAL = 'individual',
  PRO = 'pro',
  BUSINESS = 'business',
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  subscription_tier: SubscriptionTier;
  created_at: Date;
  updated_at: Date;
}

