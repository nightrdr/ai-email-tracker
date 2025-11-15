# Story 2.7: Outlook Web Integration

**Story ID:** STORY-2.7  
**Epic:** Epic 2 - Chrome Extension & Email Integration  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** the same tracking functionality in Outlook web  
**So that** I can use the product regardless of my email provider

---

## Acceptance Criteria

- [ ] Content script detects outlook.live.com and outlook.office365.com
- [ ] Tracking toggle injected into Outlook compose toolbar
- [ ] Tracking indicators appear in Outlook inbox email list
- [ ] Send interception works for Outlook compose window
- [ ] Email sent via Microsoft Graph API sendMail endpoint
- [ ] Tracking pixel injection identical to Gmail
- [ ] UI styling matches Outlook's design language (Fluent Design)
- [ ] All Gmail story functionality (2.4-2.6) works equivalently

---

## Requirements Traceability

**PRD Coverage:**
- **FR40:** Outlook web integration via Chrome extension
- **FR53:** Microsoft Graph API for sending emails
- **FR1:** Email tracking with pixel injection

**Architecture References:**
- Outlook DOM Integration: Fluent Design System compatibility
- Microsoft Graph API: sendMail endpoint
- Content Script: Similar pattern to Gmail but different selectors

**Epic Context:**
This story achieves platform parity by providing Outlook users the same seamless tracking experience as Gmail users, broadening market appeal and ensuring cross-platform consistency.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Outlook DOM detection, email data extraction
- **Integration Tests:** Full send flow with Microsoft Graph API
- **UI Tests:** Fluent Design compatibility, light/dark themes
- **Cross-Platform Tests:** outlook.live.com vs outlook.office365.com

**Test Environment:**
- Multiple Outlook accounts (personal, work/school)
- Both Outlook.live.com and Office 365
- Light and dark themes
- Various email scenarios (compose, reply, forward)

**Success Metrics:**
- Feature parity: 100% with Gmail implementation
- Send success rate: 99%+
- UI consistency: Matches Fluent Design
- Performance: No inbox lag

**Testing Tools:**
- Chrome DevTools
- Outlook test accounts
- Visual regression testing
- Microsoft Graph Explorer

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 2.1 - Chrome Extension OAuth](./story-2.1-chrome-extension-scaffold.md) - Microsoft OAuth required
- [Story 2.3 - Outlook API Send](./story-2.3-outlook-api-send-integration.md) - Backend send endpoint
- [Story 2.4 - Gmail Inbox Indicators](./story-2.4-gmail-inbox-tracking-indicators.md) - Pattern to replicate
- [Story 2.5 - Gmail Compose Integration](./story-2.5-gmail-compose-window-integration.md) - Pattern to replicate
- [Story 2.6 - Send from Gmail](./story-2.6-send-tracked-email-from-gmail.md) - Pattern to replicate

**Blocks (Stories Waiting on This):**
- None (completes Epic 2 - Gmail/Outlook parity)

**Related Stories:**
- Stories 2.4-2.6 provide the Gmail implementation pattern to follow

---

## Developer Implementation Checklist

### Extension Content Script - Outlook

- [ ] Create `packages/extension/src/content/outlook/index.ts`
- [ ] Detect Outlook web app (check hostname and DOM structure)
- [ ] Create `packages/extension/src/content/outlook/compose.ts`
- [ ] Detect compose window (different selectors than Gmail)
- [ ] Find compose toolbar: `[role="toolbar"]` or `.ms-CommandBar`
- [ ] Inject tracking toggle button styled for Fluent Design
- [ ] Detect send button: `[aria-label*="Send"]`
- [ ] Intercept send click
- [ ] Extract email data (Outlook DOM structure):
  - Recipients: `[aria-label*="To"]` input
  - Subject: `[aria-label*="Add a subject"]` input
  - Body: `[role="textbox"][contenteditable]` innerHTML
- [ ] Call POST `/api/emails/send-outlook`
- [ ] Handle success/error responses
- [ ] Create `packages/extension/src/content/outlook/inbox.ts`
- [ ] Detect email list view
- [ ] Fetch tracked emails
- [ ] Inject tracking indicators next to email subjects
- [ ] Match by message_id or subject+recipient
- [ ] Add hover tooltips with tracking info
- [ ] Handle Outlook's virtual scrolling (reuse indicators)

### Outlook-Specific Styling

- [ ] Create `packages/extension/src/content/outlook.css`
- [ ] Match Fluent Design System colors and spacing
- [ ] Use Microsoft's icon style (rounded, simpler)
- [ ] Ensure contrast for light and dark themes
- [ ] Test in Outlook light mode
- [ ] Test in Outlook dark mode

### QA Verification Checklist

- [ ] Open outlook.live.com or outlook.office365.com
- [ ] Sign in with Microsoft account
- [ ] Compose new email
- [ ] Verify tracking toggle appears in toolbar
- [ ] Enable tracking, toggle changes appearance
- [ ] Fill email and click Send
- [ ] Email sent successfully via API
- [ ] Check recipient inbox: email received with tracking pixel
- [ ] Check Outlook Sent Items: email appears
- [ ] Open Outlook inbox
- [ ] Verify tracking indicators appear on sent tracked emails
- [ ] Hover tooltip shows tracking stats
- [ ] Icon color changes based on open status
- [ ] Test with Reply and Forward
- [ ] Test dark mode: styling still works
- [ ] Test with Outlook Office 365 (work/school account)
- [ ] Test error scenarios (network failure, token expired)
- [ ] Verify no conflicts with Outlook native features
- [ ] Performance: no lag when loading inbox

---

## Definition of Done

- [ ] Outlook integration fully working
- [ ] Compose tracking toggle functional
- [ ] Send interception working
- [ ] Inbox indicators displaying
- [ ] UI matches Outlook design
- [ ] All QA scenarios passing
- [ ] Works on both outlook.live.com and outlook.office365.com


