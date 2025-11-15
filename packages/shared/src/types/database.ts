export enum SubscriptionTier {
  FREE = 'free',
  INDIVIDUAL = 'individual',
  PRO = 'pro',
  BUSINESS = 'business',
}

export enum EmailProvider {
  GMAIL = 'gmail',
  OUTLOOK = 'outlook',
}

export enum EventType {
  OPEN = 'open',
  CLICK = 'click',
  DOWNLOAD = 'download',
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  subscription_tier: SubscriptionTier;
  created_at: Date;
  updated_at: Date;
}

export interface EmailAccount {
  id: string;
  user_id: string;
  provider: EmailProvider;
  oauth_tokens: string;
  email_address: string;
  created_at: Date;
}

export interface TrackedEmail {
  id: string;
  user_id: string;
  email_account_id: string;
  recipient_email: string;
  subject: string;
  message_id: string | null;
  tracking_pixel_id: string;
  sent_at: Date;
}

export interface TrackingEvent {
  id: string;
  tracked_email_id: string;
  event_type: EventType;
  timestamp: Date;
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
}

