# Story 6.1: Subscription Tiers & Billing Integration

**Story ID:** STORY-6.1  
**Epic:** Epic 6 - User Management & Subscription System  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 13  
**Estimated Time:** 10-12 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to upgrade to paid plans and manage my subscription  
**So that** I can access premium features and higher limits

---

## Acceptance Criteria

- [ ] Subscriptions table created with: id, user_id, tier, status, current_period_end
- [ ] Razorpay integration for Indian payments
- [ ] PayPal integration for international payments
- [ ] Tiers: Free (100 emails/month), Individual ($12/mo, 5K emails), Pro ($39/mo, 50K emails), Business ($99/mo, 200K emails)
- [ ] Billing page shows current plan and usage
- [ ] Upgrade/downgrade flow working
- [ ] Webhook handling for payment events
- [ ] Usage quota enforcement

---

## Requirements Traceability

**PRD Coverage:**
- **FR43-FR51:** Complete subscription and billing system
- **FR49:** Tiered pricing with usage limits

**Architecture References:**
- Payment Gateways: Razorpay (India), PayPal (International)
- Subscription Management: Database-driven tier enforcement
- Webhooks: Async payment event handling
- Usage Tracking: Middleware for quota enforcement

**Epic Context:**
Billing is essential for monetization and enables the business model. Proper implementation ensures reliable revenue collection and fair usage enforcement.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Billing logic, quota calculations
- **Integration Tests:** Payment gateway flows, webhooks
- **E2E Tests:** Full upgrade/downgrade scenarios
- **Security Tests:** Payment data handling, webhook validation

**Test Environment:**
- Razorpay test mode
- PayPal sandbox
- Webhook testing with ngrok
- Multiple subscription tier scenarios

**Success Metrics:**
- Payment success rate: 99%+
- Webhook reliability: 100%
- Quota enforcement accuracy: 100%
- Payment processing time: <5 seconds

**Testing Tools:**
- Razorpay/PayPal test credentials
- Webhook testing tools
- Jest for unit tests

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.3 - User Authentication](./story-1.3-user-authentication-registration.md) - User accounts required
- [Story 1.2 - Database Schema](./story-1.2-database-schema-migrations.md) - Database foundation

**Blocks (Stories Waiting on This):**
- [Story 2.6 - Send from Gmail](./story-2.6-send-tracked-email-from-gmail.md) - Uses quota enforcement
- [Story 9.1 - Custom Domain Tracking](./story-9.1-custom-domain-tracking.md) - Business tier feature

**Related Stories:**
- [Story 6.2 - User Profile](./story-6.2-user-profile-settings.md) - Profile shows subscription info

---

## Developer Implementation Checklist

- [ ] Install payment SDKs: `pnpm add razorpay paypal-rest-sdk`
- [ ] Create Subscriptions and PaymentTransactions tables
- [ ] Setup Razorpay account and API keys
- [ ] Setup PayPal account and credentials
- [ ] Create billing service: `/packages/api/src/services/billing.service.ts`
- [ ] Implement subscription creation flow
- [ ] Create endpoint POST `/api/subscriptions/create`
- [ ] Handle Razorpay webhooks: POST `/webhooks/razorpay`
- [ ] Handle PayPal webhooks: POST `/webhooks/paypal`
- [ ] Implement usage tracking middleware
- [ ] Enforce tier limits (emails per month)
- [ ] Build billing dashboard page
- [ ] Show current plan, usage, and billing history
- [ ] Add upgrade/downgrade UI
- [ ] Implement pro-rated refunds for downgrades

### Unit and Integration Tests (120 min)

- [ ] Write unit tests for subscription tier logic
  - Test feature limits for each tier (Free, Individual, Pro, Business)
  - Test checking if user has access to feature
  - Test upgrade/downgrade tier transitions
  - Test pro-rated calculation logic

- [ ] Write integration tests for Razorpay integration
  - Test creating Razorpay order
  - Test handling payment success webhook
  - Test handling payment failure webhook
  - Test subscription created/updated on success
  - Test idempotency (duplicate webhook handling)

- [ ] Write integration tests for PayPal integration
  - Test creating PayPal subscription
  - Test handling PayPal webhook events
  - Test subscription activation
  - Test subscription cancellation

- [ ] Write integration tests for billing endpoints
  - Test POST /api/billing/subscribe/:tier creates subscription
  - Test POST /api/billing/cancel cancels subscription
  - Test GET /api/billing/invoices returns invoice history
  - Test endpoints require authentication
  - Test endpoints update user subscription_tier

- [ ] Write integration tests for feature gating
  - Test Free tier blocked from Pro features
  - Test Individual tier access to appropriate features
  - Test Pro tier full access
  - Test quota enforcement (emails per month)

- [ ] Write integration tests for UI
  - Test pricing page shows all tiers
  - Test clicking Subscribe button initiates payment flow
  - Test payment success updates UI to show current plan
  - Test invoice history displayed in settings

- [ ] Write tests for webhook security
  - Test webhook signature validation (Razorpay)
  - Test webhook signature validation (PayPal)
  - Test invalid signatures rejected

- [ ] Write tests for edge cases
  - Test duplicate webhook delivery handled
  - Test failed payment doesn't upgrade user
  - Test subscription expiration downgrades to Free
  - Test pro-rated refund calculation correct

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify payment gateway integration and subscription logic fully tested
  - Test with sandbox/test payment credentials

### QA Verification Checklist

- [ ] User on Free plan (100 emails/month)
- [ ] Send 100 emails → works
- [ ] Try to send 101st → error: "Upgrade to send more"
- [ ] Click "Upgrade to Pro" → payment page
- [ ] Complete Razorpay payment (India)
- [ ] Subscription updated to Pro tier
- [ ] Can now send up to 50K emails/month
- [ ] Billing page shows Pro plan active
- [ ] Test PayPal payment (international)
- [ ] Test downgrade: Pro → Individual → prorated refund
- [ ] Test subscription cancellation
- [ ] Test failed payment → subscription suspended
- [ ] Webhook creates payment record in database

---

## Definition of Done

- [ ] Payment integration working (Razorpay + PayPal)
- [ ] Subscription tiers enforced
- [ ] Billing dashboard functional
- [ ] Webhooks handling payment events
- [ ] All payment flows tested


