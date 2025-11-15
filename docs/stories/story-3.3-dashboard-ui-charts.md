# Story 3.3: Analytics Dashboard with Charts

**Story ID:** STORY-3.3  
**Epic:** Epic 3 - Advanced Tracking & Analytics Dashboard  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** a comprehensive dashboard with visual charts  
**So that** I can understand my email engagement metrics at a glance

---

## Acceptance Criteria

- [ ] Dashboard shows total emails sent, open rate, click rate
- [ ] Line chart: Opens/clicks over time (last 7/30 days)
- [ ] Bar chart: Top 5 most engaged recipients
- [ ] Pie chart: Email open status breakdown (opened/not opened)
- [ ] Table: Recent tracking events with recipient, type, timestamp, location
- [ ] Real-time updates via WebSocket (no page refresh needed)
- [ ] Responsive design (works on mobile)
- [ ] Date range filter (Today, 7 days, 30 days, Custom)

---

## Requirements Traceability

**PRD Coverage:**
- **FR42:** Dashboard with visual charts and reports

**Architecture References:**
- Frontend Framework: React with Next.js
- Chart Library: Recharts for data visualization
- Real-time Updates: WebSocket integration from Story 1.5
- API Aggregation: Analytics endpoints for dashboard data

**Epic Context:**
The analytics dashboard is the primary interface where users see their tracking data visualized, making complex engagement metrics understandable at a glance and driving user engagement with the platform.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Chart components, data transformations
- **Integration Tests:** API data fetching, WebSocket updates
- **UI Tests:** Responsive design, visual appearance
- **Performance Tests:** Rendering with large datasets (1000+ emails)

**Test Environment:**
- Various data volumes (0, 10, 100, 1000+ emails)
- Multiple screen sizes (mobile, tablet, desktop)
- Real-time event simulation

**Success Metrics:**
- Initial load: <2 seconds
- Real-time update latency: <1 second
- Chart rendering: Smooth, no jank
- Responsive breakpoints: All working

**Testing Tools:**
- React Testing Library for component tests
- Cypress for E2E dashboard testing
- Chrome DevTools for performance profiling
- Responsive design testing tools

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.5 - Real-time Notifications](./story-1.5-realtime-notification-system.md) - WebSocket for live updates
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Tracking data to display
- [Story 3.1 - Link Click Tracking](./story-3.1-link-click-tracking.md) - Click data for charts
- [Story 3.2 - Attachment Tracking](./story-3.2-attachment-download-tracking.md) - Attachment data (optional)

**Blocks (Stories Waiting on This):**
- [Story 8.2 - Custom Reports Builder](./story-8.2-custom-reports-builder.md) - Extends dashboard functionality

**Related Stories:**
- All tracking stories provide data displayed in dashboard

---

## Developer Implementation Checklist

- [ ] Install chart library: `pnpm add recharts` (for React)
- [ ] Create dashboard page: `packages/web/src/pages/dashboard.tsx`
- [ ] Create analytics API endpoint: GET `/api/analytics/summary`
- [ ] Return aggregated stats (total emails, open rate, click rate)
- [ ] Create GET `/api/analytics/timeline?days=7`
- [ ] Return time-series data for charts
- [ ] Create GET `/api/analytics/top-recipients?limit=5`
- [ ] Implement dashboard components:
  - StatsCards (total emails, open rate, click rate)
  - OpenRateChart (line chart with Recharts)
  - TopRecipientsChart (bar chart)
  - StatusPieChart (pie chart)
  - RecentEventsTable (table with pagination)
- [ ] Add WebSocket listener to refresh data on new tracking events
- [ ] Implement date range filter UI
- [ ] Add loading states and error handling
- [ ] Style with Tailwind CSS or Material-UI
- [ ] Make responsive (mobile breakpoints)

### Unit and Integration Tests (90 min)

- [ ] Write unit tests for stats calculation
  - Test calculating total sent, opened, clicked counts
  - Test calculating open rate percentage
  - Test calculating click rate percentage
  - Test handling division by zero (no emails sent)

- [ ] Write unit tests for chart data formatting
  - Test formatting data for Recharts library
  - Test time series aggregation (daily, weekly, monthly)
  - Test handling empty data sets
  - Test date range filtering logic

- [ ] Write integration tests for dashboard API endpoints
  - Test GET /api/dashboard/stats returns correct aggregate data
  - Test GET /api/dashboard/timeline returns time series data
  - Test endpoints filter by date range
  - Test endpoints require authentication
  - Test endpoints return only user's data

- [ ] Write integration tests for React components
  - Test StatCard component displays correct data
  - Test TimelineChart renders with data
  - Test EmailList component shows emails with status
  - Test components handle loading states
  - Test components handle error states

- [ ] Write integration tests for real-time updates
  - Test WebSocket notification triggers data refresh
  - Test dashboard stats update when new tracking event occurs
  - Test timeline chart updates with new data points

- [ ] Write integration tests for date range filtering
  - Test selecting "Last 7 days" updates all charts
  - Test selecting "Last 30 days" updates all charts
  - Test custom date range filtering works

- [ ] Write tests for responsive design
  - Test dashboard renders correctly on mobile (375px width)
  - Test dashboard renders correctly on tablet (768px width)
  - Test dashboard renders correctly on desktop (1920px width)

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite for web package
  - Verify dashboard components and API fully tested
  - Test across major browsers (Chrome, Firefox, Safari)

### QA Verification Checklist

- [ ] Open dashboard
- [ ] Verify stats cards show correct numbers
- [ ] Line chart displays opens/clicks over last 7 days
- [ ] Bar chart shows top recipients
- [ ] Pie chart shows open vs not opened ratio
- [ ] Recent events table shows latest tracking events
- [ ] Change date filter to "30 days" → charts update
- [ ] Send new tracked email and open it
- [ ] Dashboard updates in real-time (via WebSocket)
- [ ] Open on mobile device → layout adjusts
- [ ] Test with no data → shows empty state message
- [ ] Test with 1000+ emails → performance acceptable

---

## Definition of Done

- [ ] Dashboard displays all required charts
- [ ] Real-time updates working
- [ ] Responsive design implemented
- [ ] Performance optimized
- [ ] All QA tests passing


