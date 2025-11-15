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

### Unit and Integration Tests (90 min)

- [ ] Write unit tests for Outlook service email composition
  - Test Microsoft Graph API message format
  - Test HTML body with tracking pixel injection
  - Test headers and metadata correctly set

- [ ] Write unit tests for OAuth token handling
  - Test token refresh when expired
  - Test invalid token error handling
  - Test revoked access handling

- [ ] Write unit tests for error handling
  - Test network failures with retry logic
  - Test rate limit exceeded handling
  - Test invalid recipient handling
  - Test malformed email data validation

- [ ] Write integration tests for Outlook send endpoint
  - Test POST /api/emails/send-outlook sends email successfully
  - Test endpoint creates TrackedEmail record
  - Test endpoint returns message_id and tracking_pixel_id
  - Test endpoint requires authentication
  - Test endpoint validates input fields

- [ ] Write integration tests for Microsoft Graph API
  - Test email sent via Graph API appears in Sent Items
  - Test tracking pixel correctly injected
  - Test email content matches input data

- [ ] Write integration tests for error scenarios
  - Test expired token triggers refresh
  - Test revoked access returns error
  - Test rate limit handling
  - Test network failure retry logic

- [ ] Write end-to-end test for Outlook send flow
  - Test extension OAuth → send via Outlook → delivery → tracking
  - Test sent email in Outlook Sent Items
  - Test tracking when recipient opens

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify Outlook integration fully tested
  - Document Graph API throttling limits

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


