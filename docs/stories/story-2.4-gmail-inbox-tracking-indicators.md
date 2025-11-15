# Story 2.4: Gmail Inbox Tracking Indicators

**Story ID:** STORY-2.4  
**Epic:** Epic 2 - Chrome Extension & Email Integration  
**Priority:** P1 - Should Have  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user viewing my Gmail inbox  
**I want** to see tracking indicators next to tracked emails  
**So that** I can quickly identify which emails have tracking enabled and their open status

---

## Acceptance Criteria

- [ ] Content script detects Gmail inbox/list view
- [ ] Calls GET /api/emails/tracked to fetch user's tracked emails
- [ ] Injects tracking icon next to subject line for each tracked email
- [ ] Icon color: gray (not opened), blue (opened), green (clicked)
- [ ] Hover tooltip shows: "Opened 3 times, last at 2:30 PM" or "Not opened yet"
- [ ] Updates dynamically when Gmail view changes (SPA navigation)
- [ ] Only shows for sent emails, not received
- [ ] Performance optimized (< 100ms to inject indicators)

---

## Requirements Traceability

**PRD Coverage:**
- **FR39:** Gmail integration with inline tracking indicators

**Architecture References:**
- Content Script: DOM manipulation in Gmail
- Real-time Updates: Polling/WebSocket for status changes
- Performance: Optimized rendering with debouncing

**Epic Context:**
Visual indicators in Gmail inbox provide instant visibility into email engagement without leaving the inbox, improving user workflow efficiency.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Icon injection logic, tooltip rendering
- **Integration Tests:** API calls, data matching
- **Performance Tests:** Rendering time, memory usage with many emails
- **UI Tests:** Visual appearance, Gmail compatibility

**Test Environment:**
- Gmail account with sent tracked emails
- Multiple Gmail UI versions (classic, new)
- Various inbox sizes (10, 50, 100+ emails)

**Success Metrics:**
- Injection time: <100ms per indicator
- API response: <500ms
- Memory usage: <10MB additional
- Visual compatibility: 100% with Gmail design

**Testing Tools:**
- Chrome DevTools Performance profiler
- Gmail test accounts
- Visual regression testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 2.1 - Chrome Extension OAuth](./story-2.1-chrome-extension-scaffold.md) - Extension foundation
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - Tracking data available

**Blocks (Stories Waiting on This):**
- None (enhancement feature)

**Related Stories:**
- [Story 2.5 - Gmail Compose Integration](./story-2.5-gmail-compose-window-integration.md) - Complementary Gmail features

---

## Developer Implementation Checklist

### Extension Content Script

- [ ] Create `packages/extension/src/content/gmail/index.ts`
- [ ] Detect Gmail email list using DOM selectors (`.zA` class for email rows)
- [ ] Use MutationObserver to watch for Gmail SPA navigation
- [ ] Fetch tracked emails from API: GET `/api/emails/tracked`
- [ ] Match Gmail message IDs with tracked emails
- [ ] Inject SVG icon elements next to email subjects
- [ ] Create tooltip component with tracking stats
- [ ] Add CSS for icons and tooltips
- [ ] Implement debouncing for API calls
- [ ] Cache tracked emails in memory (refresh every 30s)
- [ ] Test with Gmail's new and classic UI

### Backend API

- [ ] Create GET `/api/emails/tracked` endpoint
- [ ] Returns array of tracked emails with: message_id, open_count, last_opened_at, click_count
- [ ] Filter by user_id from JWT
- [ ] Optimize query with proper indexes
- [ ] Add pagination (limit 1000 recent emails)

### Unit and Integration Tests (60 min)

- [ ] Write unit tests for DOM manipulation functions
  - Test finding Gmail email rows by message_id
  - Test inserting tracking indicator icon
  - Test icon positioning and styling
  - Test handling missing or malformed email rows

- [ ] Write integration tests for backend API endpoint
  - Test GET /api/emails/tracked returns user's tracked emails
  - Test response includes message_id, open_count, click_count, last_opened
  - Test endpoint filters by authenticated user
  - Test pagination works correctly
  - Test requires authentication

- [ ] Write integration tests for content script
  - Test content script loads on Gmail inbox page
  - Test content script fetches tracked emails from API
  - Test tracking indicators inserted for tracked emails
  - Test indicators show correct open/click counts
  - Test indicators update on page navigation

- [ ] Write tests for real-time indicator updates
  - Test indicator updates when WebSocket notification received
  - Test open count increments in real-time
  - Test click count increments in real-time

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify DOM manipulation and API integration tested

### QA Verification Checklist

- [ ] Open Gmail inbox after sending tracked email
- [ ] Verify tracking icon appears next to tracked email
- [ ] Icon color is gray (not yet opened)
- [ ] Hover shows tooltip: "Not opened yet"
- [ ] Open email from another account
- [ ] Refresh Gmail, icon changes to blue
- [ ] Tooltip shows: "Opened 1 time, last at [time]"
- [ ] Navigate between Gmail folders, indicators persist
- [ ] Test with 50+ tracked emails, no performance issues
- [ ] Icons only on sent emails, not received ones
- [ ] Test in both Gmail classic and new UI

---

## Definition of Done

- [ ] Tracking indicators visible in Gmail inbox
- [ ] Icons update based on open status
- [ ] Tooltips show accurate tracking info
- [ ] Performance acceptable (no lag)
- [ ] Works with Gmail SPA navigation


