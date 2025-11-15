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


