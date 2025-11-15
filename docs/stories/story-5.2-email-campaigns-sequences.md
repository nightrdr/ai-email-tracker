# Story 5.2: Email Campaigns & Sequences

**Story ID:** STORY-5.2  
**Epic:** Epic 5 - Templates & Campaign Management  
**Priority:** P1 - Should Have  
**Story Points:** 13  
**Estimated Time:** 10-12 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to create multi-step email campaigns with automated follow-ups  
**So that** I can nurture leads without manual intervention

---

## Acceptance Criteria

- [ ] Campaigns table created with: id, user_id, name, status, created_at
- [ ] CampaignSteps table with: id, campaign_id, step_number, template_id, delay_days
- [ ] CampaignRecipients table tracks which recipients are in which campaigns
- [ ] API to create campaign with multiple steps
- [ ] Background job system to send scheduled follow-ups
- [ ] Dashboard shows campaign performance (open rates per step)
- [ ] Stops campaign if recipient replies or unsubscribes

---

## Requirements Traceability

**PRD Coverage:**
- **FR16:** Multi-step email campaigns
- **FR17:** Automated follow-up sequences
- **FR18:** Delay scheduling between steps
- **FR19:** Reply detection to stop campaigns
- **FR20:** Campaign performance analytics

**Architecture References:**
- Job Queue: Bull with Redis for scheduled sends
- Background Workers: Campaign execution engine
- Data Models: Campaigns, CampaignSteps, CampaignRecipients
- Reply Detection: Integration with tracking events

**Epic Context:**
Campaigns enable automated nurturing sequences that scale outreach efforts, transforming manual follow-up work into automated workflows - critical for sales and marketing use cases.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Campaign logic, scheduling, reply detection
- **Integration Tests:** Full campaign flow with multiple steps
- **E2E Tests:** Real emails sent through campaign sequences
- **Background Jobs:** Worker reliability, retry logic

**Test Environment:**
- Bull queue with test Redis
- Multiple test recipients
- Time-accelerated testing (mock delays)
- Reply detection simulation

**Success Metrics:**
- Campaign scheduling accuracy: 100%
- Email send reliability: 99%+
- Reply detection latency: <1 minute
- Performance: Handle 1000+ recipient campaigns

**Testing Tools:**
- Bull dashboard for job monitoring
- Jest for unit/integration tests
- Time mocking for delay testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 5.1 - Email Templates](./story-5.1-email-templates-crud.md) - Templates required for campaign steps
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Email sending infrastructure
- [Story 2.2 - Gmail API Send](./story-2.2-gmail-api-send-integration.md) - Send mechanism

**Blocks (Stories Waiting on This):**
- None (completes campaign automation)

**Related Stories:**
- [Story 3.3 - Analytics Dashboard](./story-3.3-dashboard-ui-charts.md) - Campaign analytics display

---

## Developer Implementation Checklist

- [ ] Create database tables for campaigns
- [ ] Setup job queue (Bull + Redis)
- [ ] Create campaign service with create/update/delete methods
- [ ] Implement campaign execution engine
- [ ] Create background worker to process scheduled sends
- [ ] Track campaign progress per recipient
- [ ] Build campaign builder UI (drag-and-drop steps)
- [ ] Show campaign analytics dashboard
- [ ] Implement unsubscribe handling
- [ ] Add reply detection to stop campaigns

### Unit and Integration Tests (120 min)

- [ ] Write unit tests for campaign scheduling logic
  - Test calculating send times for sequence emails
  - Test handling delays between emails (1 day, 3 days, 7 days)
  - Test pause/resume campaign logic
  - Test stop campaign logic

- [ ] Write unit tests for recipient list management
  - Test parsing CSV with email addresses
  - Test validating email addresses
  - Test removing duplicates
  - Test handling invalid emails

- [ ] Write integration tests for campaign CRUD endpoints
  - Test POST /api/campaigns creates campaign
  - Test GET /api/campaigns returns user's campaigns
  - Test PUT /api/campaigns/:id updates campaign
  - Test DELETE /api/campaigns/:id deletes campaign
  - Test POST /api/campaigns/:id/start starts campaign
  - Test POST /api/campaigns/:id/pause pauses campaign

- [ ] Write integration tests for campaign execution
  - Test campaign sends first email to all recipients
  - Test campaign sends second email after delay
  - Test campaign tracks which recipients received which emails
  - Test campaign stops if recipient replies
  - Test campaign pauses correctly

- [ ] Write integration tests for reply detection
  - Test reply detected via webhook or polling
  - Test reply stops further emails to that recipient
  - Test reply marked in campaign dashboard

- [ ] Write integration tests for campaign analytics
  - Test dashboard shows open rates per email in sequence
  - Test dashboard shows click rates per email
  - Test dashboard shows reply rates
  - Test dashboard shows recipients still in sequence

- [ ] Write tests for edge cases
  - Test campaign with zero recipients
  - Test campaign with paused status doesn't send
  - Test deleted campaign stops execution
  - Test recipient unsubscribes mid-campaign

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify campaign scheduling and execution fully tested
  - Test cron jobs or scheduler integration

### QA Verification Checklist

- [ ] Create campaign "Onboarding" with 3 steps (Day 0, Day 3, Day 7)
- [ ] Add 10 recipients
- [ ] Launch campaign
- [ ] Day 0 emails sent immediately
- [ ] Day 3: Follow-up #1 sent automatically
- [ ] One recipient replies → campaign stopped for them
- [ ] Day 7: Follow-up #2 sent only to non-repliers
- [ ] Dashboard shows open rates for each step
- [ ] Test unsubscribe link → recipient removed from future sends

---

## Definition of Done

- [ ] Campaign creation working
- [ ] Automated follow-ups sending
- [ ] Analytics tracking campaign performance
- [ ] Reply detection functional


