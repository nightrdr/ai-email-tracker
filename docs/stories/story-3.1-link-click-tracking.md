# Story 3.1: Link Click Tracking with Redirect Service

**Story ID:** STORY-3.1  
**Epic:** Epic 3 - Advanced Tracking & Analytics Dashboard  
**Priority:** P1 - Should Have  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to track when recipients click links in my emails  
**So that** I can measure engagement beyond just opens

---

## Acceptance Criteria

- [ ] Link processing service scans email HTML and replaces `<a href>` links with tracking redirect URLs
- [ ] Tracking URL format: `https://track.domain.com/link/:link_tracking_id`
- [ ] TrackedLinks table created with: id, tracked_email_id, original_url, link_tracking_id, position
- [ ] GET /api/track/link/:link_tracking_id records TrackingEvent with type='click' and 302 redirects
- [ ] Click tracking records timestamp, IP address, user_agent, location
- [ ] Dashboard displays clicked links with click count per link
- [ ] Multiple clicks counted separately with timestamps
- [ ] Redirect happens in < 100ms

---

## Requirements Traceability

**PRD Coverage:**
- **FR2:** Link click tracking with redirect service

**Architecture References:**
- Link Processing: HTML parsing with Cheerio
- Redirect Service: 302 redirect with <100ms latency
- Data Models: TrackedLinks, TrackingEvents (type='click')

**Epic Context:**
Link click tracking provides deeper engagement insights beyond opens, helping users understand what content resonates with recipients and drives action.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Link extraction, URL replacement logic
- **Integration Tests:** Full flow from email prep to redirect
- **Performance Tests:** Redirect latency, HTML processing speed
- **Edge Cases:** Query params, fragments, malformed URLs

**Test Environment:**
- HTML emails with various link types
- Real email clients for click testing
- Performance monitoring tools

**Success Metrics:**
- Redirect latency: <100ms
- URL preservation: 100% (params, fragments intact)
- Click tracking accuracy: 100%
- HTML processing: <500ms for typical email

**Testing Tools:**
- Cheerio for HTML parsing tests
- Apache Bench for redirect performance
- Real email client testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - Similar tracking pattern
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Email preparation service

**Blocks (Stories Waiting on This):**
- [Story 3.3 - Analytics Dashboard](./story-3.3-dashboard-ui-charts.md) - Dashboard displays click data

**Related Stories:**
- [Story 3.2 - Attachment Tracking](./story-3.2-attachment-download-tracking.md) - Similar tracking proxy pattern

---

## Developer Implementation Checklist

- [ ] Create TrackedLinks table migration
- [ ] Install HTML parser: `pnpm add cheerio`
- [ ] Create link processing service in `packages/api/src/services/link-tracking.service.ts`
- [ ] Implement `processLinksInHTML()` to find and replace all `<a>` tags
- [ ] Generate UUID for each link
- [ ] Store TrackedLink records in database
- [ ] Create endpoint GET `/api/track/link/:link_tracking_id`
- [ ] Record TrackingEvent with type='click'
- [ ] Perform 302 redirect to original URL
- [ ] Add click tracking to dashboard UI
- [ ] Show links per email with click counts
- [ ] Integrate into email preparation flow

### Unit and Integration Tests (90 min)

- [ ] Write unit tests for link detection and replacement
  - Test finding all `<a>` tags in HTML
  - Test generating tracking URLs with unique IDs
  - Test replacing original URLs with tracking URLs
  - Test preserving link text and attributes
  - Test handling malformed HTML

- [ ] Write unit tests for URL redirect logic
  - Test redirect to original URL after tracking
  - Test redirect performance (<100ms)
  - Test handling invalid tracking IDs
  - Test handling deleted/expired links

- [ ] Write integration tests for link tracking endpoint
  - Test GET /api/track/link/{id} creates click event in database
  - Test endpoint redirects to original URL (302)
  - Test endpoint handles X-Forwarded-For for IP extraction
  - Test endpoint captures user agent and timestamp

- [ ] Write integration tests for link click recording
  - Test click event created with correct tracked_email_id
  - Test click event includes IP, user agent, timestamp
  - Test multiple clicks on same link recorded separately
  - Test click events trigger WebSocket notifications

- [ ] Write integration tests for dashboard display
  - Test dashboard shows links for each tracked email
  - Test links display with click counts
  - Test links sorted by most clicked
  - Test clicking link details shows who clicked and when

- [ ] Write end-to-end test for link tracking flow
  - Test email prepared with links → URLs replaced → email sent → recipient clicks → tracking event → notification → dashboard updates

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify link detection, replacement, and tracking fully tested

### QA Verification Checklist

- [ ] Send email with 3 different links
- [ ] Recipient clicks Link 1
- [ ] Redirect happens instantly (< 100ms perceived)
- [ ] Lands on correct destination URL
- [ ] Check database: TrackingEvent type='click' recorded
- [ ] Dashboard shows "Link 1: 1 click"
- [ ] Click Link 1 again
- [ ] Dashboard updates to "Link 1: 2 clicks"
- [ ] Click Link 2
- [ ] Dashboard shows separate count for Link 2
- [ ] Test with query parameters in URL (preserved)
- [ ] Test with anchor fragments (preserved)
- [ ] Test with malformed URLs (handled gracefully)

---

## Definition of Done

- [ ] Link tracking working end-to-end
- [ ] Redirects fast and accurate
- [ ] Dashboard shows click analytics
- [ ] All QA tests passing


