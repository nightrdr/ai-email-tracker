# Story 2.3: Outlook API Send Integration

**Story ID:** STORY-2.3  
**Epic:** Epic 2 - Chrome Extension & Email Integration  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to send tracked emails via Microsoft Graph API from the extension  
**So that** I can use tracking with my Outlook/Microsoft 365 account

---

## Acceptance Criteria

- [ ] Backend endpoint POST /api/emails/send-outlook accepts recipient, subject, body, tracking_enabled
- [ ] Uses Microsoft Graph API `/me/sendMail` endpoint
- [ ] Tracking pixel injected when tracking_enabled=true
- [ ] TrackedEmail record created
- [ ] Sent email appears in Outlook Sent Items
- [ ] Error handling for invalid token, quota, network issues
- [ ] Response includes message_id and tracking_pixel_id

---

## Requirements Traceability

**PRD Coverage:**
- **FR40:** Outlook integration via Chrome extension
- **FR53:** Microsoft Graph API for sending emails
- **FR1:** Email tracking with pixel injection

**Architecture References:**
- Microsoft Graph API Integration: @microsoft/microsoft-graph-client
- OAuth Token Management: Azure AD tokens
- Email Service: Similar pattern to Gmail API integration

**Epic Context:**
This story provides Outlook users the same tracking capabilities as Gmail users, ensuring platform-agnostic functionality and broader market reach.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Outlook service methods, Graph API message format
- **Integration Tests:** Full send flow with Microsoft Graph API
- **Error Tests:** Token expiry, throttling, network failures

**Test Environment:**
- Real Outlook/Microsoft 365 account
- Azure AD OAuth tokens
- Graph API rate limit testing

**Success Metrics:**
- Email send: <3 seconds
- Outlook Sent Items sync: <5 seconds
- Error handling: 100% coverage

**Testing Tools:**
- Microsoft Graph Explorer for API testing
- Postman for endpoint testing
- Jest for unit tests

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Email preparation service
- [Story 2.1 - Chrome Extension OAuth](./story-2.1-chrome-extension-scaffold.md) - Microsoft OAuth tokens available

**Blocks (Stories Waiting on This):**
- [Story 2.7 - Outlook Web Integration](./story-2.7-outlook-web-integration.md) - Extension uses this endpoint

**Related Stories:**
- [Story 2.2 - Gmail API Send](./story-2.2-gmail-api-send-integration.md) - Similar pattern for Gmail

---

## Developer Implementation Checklist

### Backend Implementation

- [ ] Install Microsoft Graph client: `pnpm add @microsoft/microsoft-graph-client`
- [ ] Create `packages/api/src/services/outlook.service.ts`
- [ ] Implement `sendEmail()` using Graph API `POST /v1.0/me/sendMail`
- [ ] Create HTML body with tracking pixel
- [ ] Handle token refresh (if using refresh tokens)
- [ ] Create endpoint POST `/api/emails/send-outlook`
- [ ] Integrate with email preparation service
- [ ] Add rate limiting (Graph API throttling limits)
- [ ] Implement retry with exponential backoff
- [ ] Test with real Outlook account

### QA Verification Checklist

- [ ] Send email via Outlook API successfully
- [ ] Email received by recipient with tracking pixel
- [ ] Email appears in Outlook Sent Items
- [ ] Test with invalid/expired token → 401 error
- [ ] Test rate limiting → proper error handling
- [ ] Test malformed email → validation error
- [ ] Verify TrackedEmail database record created
- [ ] Verify tracking pixel URL correct
- [ ] Test with attachments (if supported)

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Outlook API integration working
- [ ] Error handling robust
- [ ] Tests passing
- [ ] Manual testing complete with real Outlook account


