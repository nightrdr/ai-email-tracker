# Story 2.6: Send Tracked Email from Gmail

**Story ID:** STORY-2.6  
**Epic:** Epic 2 - Chrome Extension & Email Integration  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to send a tracked email directly from Gmail using the extension  
**So that** the tracking pixel is automatically injected and I can use my normal workflow

---

## Acceptance Criteria

- [ ] Extension intercepts Gmail send button click
- [ ] If tracking enabled, extracts email content (recipient, subject, body HTML)
- [ ] Calls POST /api/emails/send-gmail with tracking_enabled=true
- [ ] API injects tracking pixel and sends via Gmail API
- [ ] TrackedEmail record created in database
- [ ] User sees confirmation toast: "Email sent with tracking enabled"
- [ ] If send fails, error message shown, email remains as draft
- [ ] Sent email appears in Gmail Sent folder
- [ ] Free tier users blocked if 100 email limit reached

---

## Requirements Traceability

**PRD Coverage:**
- **FR39:** Gmail integration for sending tracked emails
- **FR52:** Gmail API for email sending
- **FR49:** Free tier limit enforcement (100 emails/month)

**Architecture References:**
- Send Interception: Event capture on Gmail send button
- Gmail API Integration: Uses backend Gmail service
- Quota Management: Subscription tier enforcement

**Epic Context:**
This story completes the Gmail tracking workflow, enabling users to send tracked emails seamlessly from Gmail without leaving their normal workflow - the core user experience.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Email data extraction, send interception logic
- **Integration Tests:** Full send flow, quota checking
- **E2E Tests:** Complete user journey from compose to sent
- **Error Scenarios:** Network failures, quota limits, token expiry

**Test Environment:**
- Gmail with various email formats
- Free tier test account (quota limits)
- Network interruption simulation
- Multiple recipient scenarios

**Success Metrics:**
- Send success rate: 99%+
- Error handling: 100% graceful
- Quota enforcement: 100% accurate
- User experience: Seamless integration

**Testing Tools:**
- Manual Gmail testing
- Network throttling tools
- Backend API testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 2.2 - Gmail API Send](./story-2.2-gmail-api-send-integration.md) - Backend send endpoint
- [Story 2.5 - Gmail Compose Integration](./story-2.5-gmail-compose-window-integration.md) - Tracking toggle
- [Story 6.1 - Subscription & Billing](./story-6.1-subscription-tiers-billing.md) - Quota enforcement

**Blocks (Stories Waiting on This):**
- None (completes Gmail integration)

**Related Stories:**
- [Story 2.7 - Outlook Web Integration](./story-2.7-outlook-web-integration.md) - Similar pattern for Outlook

---

## Developer Implementation Checklist

### Extension Implementation

- [ ] Detect Gmail send button (`.dC .T-I-atl`)
- [ ] Add click event listener (use capture phase to intercept)
- [ ] Check if tracking enabled for this draft
- [ ] If tracking enabled, prevent default send
- [ ] Extract email data:
  - Recipients: `.vR` (to), `.vM` (cc), `.vP` (bcc)
  - Subject: `.aoT` input value
  - Body: `.editable` innerHTML
- [ ] Call backend API POST `/api/emails/send-gmail`:
  ```typescript
  {
    to: string[],
    cc?: string[],
    bcc?: string[],
    subject: string,
    html_body: string,
    tracking_enabled: true
  }
  ```
- [ ] Show loading spinner on send button
- [ ] On success:
  - Show toast notification: "✓ Sent with tracking"
  - Close compose window
  - Clear draft state from storage
- [ ] On error:
  - Show error toast with message
  - Re-enable send button
  - Keep compose window open
- [ ] Handle quota exceeded error (free tier limit)
- [ ] Add retry mechanism for network failures

### Backend API Updates

- [ ] Update POST `/api/emails/send-gmail` to accept arrays for to/cc/bcc
- [ ] Implement subscription tier checking (free tier: 100 emails/month)
- [ ] Return quota status in response
- [ ] Increment email send count for user
- [ ] Add endpoint GET `/api/user/quota` to check remaining sends

### Unit and Integration Tests (90 min)

- [ ] Write unit tests for email extraction logic
  - Test extracting recipient from compose form
  - Test extracting subject from compose form
  - Test extracting HTML body from compose form
  - Test handling CC/BCC fields

- [ ] Write unit tests for send interception
  - Test capturing Gmail send event
  - Test preventing default send when tracking enabled
  - Test allowing default send when tracking disabled

- [ ] Write integration tests for complete send flow
  - Test user composes email with tracking enabled
  - Test extension calls backend API to prepare email
  - Test backend injects tracking pixel
  - Test extension sends via Gmail API
  - Test email appears in Sent folder
  - Test TrackedEmail record created

- [ ] Write integration tests for error handling
  - Test network failure during API call
  - Test Gmail API send failure
  - Test invalid OAuth token handling
  - Test user shown appropriate error messages

- [ ] Write integration tests for tracking toggle
  - Test tracking disabled sends via normal Gmail (no API call)
  - Test tracking enabled uses API + Gmail API flow
  - Test toggle state persists

- [ ] Write end-to-end test for user flow
  - Test compose → enable tracking → send → pixel injected → delivery → tracking
  - Test recipient opens email → tracking event → WebSocket notification → Gmail indicator updates

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify send integration fully tested
  - Test across different Gmail UI versions

### QA Verification Checklist

- [ ] Enable tracking toggle in Gmail compose
- [ ] Fill in recipient, subject, body
- [ ] Click Gmail Send button
- [ ] Verify email sent successfully
- [ ] Check recipient inbox: email received with tracking pixel
- [ ] Check Gmail Sent folder: email appears
- [ ] Check dashboard: TrackedEmail record created
- [ ] Test with tracking disabled: email sends normally without API call
- [ ] Test send failure:
  - Network error → error toast, compose stays open
  - Invalid token → prompt to re-authenticate
  - API error → error message shown
- [ ] Test free tier limit:
  - Send 100 emails
  - 101st email → error: "Monthly limit reached. Upgrade to Pro."
- [ ] Test with CC and BCC recipients
- [ ] Test with HTML formatting in body
- [ ] Test with attachments (should work via Gmail's native send)
- [ ] Verify no duplicate sends

---

## Definition of Done

- [ ] Send interception working
- [ ] Tracking pixel injected automatically
- [ ] Success and error handling complete
- [ ] Quota enforcement working
- [ ] Email appears in Sent folder
- [ ] All QA tests passing


