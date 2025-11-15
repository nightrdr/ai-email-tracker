# Story 2.2: Gmail API Send Integration

**Story ID:** STORY-2.2  
**Epic:** Epic 2 - Chrome Extension & Email Integration  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to send tracked emails via Gmail API from the extension  
**So that** my emails are sent with tracking without leaving Gmail

---

## Acceptance Criteria

- [ ] Backend API endpoint POST /api/emails/send-gmail accepts recipient, subject, body, tracking_enabled
- [ ] Endpoint uses stored Gmail OAuth token to send via Gmail API
- [ ] Tracking pixel injected if tracking_enabled=true
- [ ] TrackedEmail record created in database
- [ ] Sent email appears in Gmail Sent folder
- [ ] Error handling for quota exceeded, invalid token, network errors
- [ ] Response includes sent message_id and tracking_pixel_id

---

## Requirements Traceability

**PRD Coverage:**
- **FR39:** Gmail integration via Chrome extension
- **FR52:** Gmail API for sending emails
- **FR1:** Email tracking with pixel injection

**Architecture References:**
- Gmail API Integration: googleapis library
- OAuth Token Management: Secure storage and refresh
- Email Service: Extends Story 1.6 email preparation

**Epic Context:**
This story enables users to send tracked emails directly through Gmail API, providing seamless integration between the extension and Gmail's send infrastructure.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Gmail service methods, MIME message creation
- **Integration Tests:** Full send flow with Gmail API
- **Error Tests:** Token expiry, quota limits, network failures

**Test Environment:**
- Real Gmail account with OAuth tokens
- Test API credentials from Google Cloud Console
- Rate limiting simulation

**Success Metrics:**
- Email send: <3 seconds
- Gmail Sent folder sync: <5 seconds
- Error handling: 100% coverage

**Testing Tools:**
- Gmail API test credentials
- Postman/curl for API testing
- Jest for unit tests

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Email preparation service
- [Story 2.1 - Chrome Extension OAuth](./story-2.1-chrome-extension-scaffold.md) - OAuth tokens available

**Blocks (Stories Waiting on This):**
- [Story 2.6 - Send from Gmail Extension](./story-2.6-send-tracked-email-from-gmail.md) - Extension uses this endpoint

**Related Stories:**
- [Story 2.3 - Outlook API Send](./story-2.3-outlook-api-send-integration.md) - Similar pattern

---

## Developer Implementation Checklist

### Backend Implementation

- [ ] Install Google APIs client library: `pnpm add googleapis`
- [ ] Create Gmail service in `packages/api/src/services/gmail.service.ts`
- [ ] Implement `sendEmail()` method using Gmail API `users.messages.send`
- [ ] Create MIME message with HTML body and tracking pixel
- [ ] Handle OAuth token refresh if expired
- [ ] Create endpoint POST `/api/emails/send-gmail` in controller
- [ ] Integrate with tracking pixel service from Story 1.4
- [ ] Add rate limiting (Gmail API: 250 quota units per user per second)
- [ ] Implement retry logic for transient failures
- [ ] Create unit tests for Gmail service
- [ ] Test with real Gmail account

### Unit and Integration Tests (90 min)

- [ ] Write unit tests for Gmail service MIME message creation
  - Test MIME format with HTML body
  - Test tracking pixel injection into MIME message
  - Test headers (To, From, Subject) correctly formatted
  - Test multipart message structure

- [ ] Write unit tests for OAuth token handling
  - Test token refresh when expired
  - Test handles invalid token error
  - Test handles revoked access error

- [ ] Write unit tests for error handling
  - Test network timeout handling
  - Test Gmail API quota exceeded error
  - Test invalid recipient email address
  - Test retry logic for transient failures

- [ ] Write integration tests for Gmail send endpoint
  - Test POST /api/emails/send-gmail with valid data sends email successfully
  - Test endpoint creates TrackedEmail record in database
  - Test endpoint returns message_id and tracking_pixel_id
  - Test endpoint requires authentication
  - Test endpoint validates required fields

- [ ] Write integration tests for Gmail API interaction
  - Test email sent via Gmail API appears in Sent folder
  - Test tracking pixel correctly injected in sent email
  - Test sent email contains correct recipient, subject, body
  - Test message_id matches Gmail API response

- [ ] Write integration tests for error scenarios
  - Test expired OAuth token triggers refresh
  - Test revoked OAuth access returns appropriate error
  - Test rate limit exceeded returns 429 error
  - Test network failure triggers retry logic

- [ ] Write end-to-end test for complete send flow
  - Test extension OAuth → backend send → Gmail delivery → pixel tracking
  - Test sent email appears in Gmail Sent folder
  - Test tracking events recorded when recipient opens email

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify Gmail integration logic fully tested
  - Document Gmail API rate limits and quotas

### QA Verification Checklist

- [ ] Send email with tracking enabled via API
- [ ] Verify email received by recipient
- [ ] Verify tracking pixel present in HTML
- [ ] Verify email in Gmail Sent folder
- [ ] Test with invalid OAuth token → returns 401
- [ ] Test with revoked access → returns appropriate error
- [ ] Test with network failure → returns 500 with retry
- [ ] Test rate limiting → returns 429
- [ ] Verify TrackedEmail record created
- [ ] Verify message_id stored correctly

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Gmail API integration working
- [ ] Error handling comprehensive
- [ ] Tests passing
- [ ] Manual testing complete


