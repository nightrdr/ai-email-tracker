# Story 8.2: Custom Reports Builder

**Story ID:** STORY-8.2  
**Epic:** Epic 8 - Reporting & Data Export  
**Priority:** P2 - Nice to Have  
**Story Points:** 13  
**Estimated Time:** 10-12 hours  
**Status:** Not Started

---

## User Story

**As a** Business user  
**I want** to create custom reports with specific metrics and filters  
**So that** I can analyze data relevant to my business needs

---

## Acceptance Criteria

- [ ] Report builder UI with drag-and-drop interface
- [ ] Available metrics: emails sent, open rate, click rate, reply rate, by date/recipient/campaign
- [ ] Filters: date range, recipient domain, campaign, template
- [ ] Grouping: by day/week/month, by recipient, by campaign
- [ ] Charts: line, bar, pie, table
- [ ] Save custom reports for reuse
- [ ] Schedule automated report emails (daily/weekly/monthly)
- [ ] Export reports as PDF/Excel

---

## Requirements Traceability

**PRD Coverage:**
- **FR42:** Custom reporting with metrics and filters

**Architecture References:**
- Report Builder: Dynamic query generation
- Visualizations: Chart library integration
- Scheduling: Cron-based automated reports
- Export Formats: PDF with charts, Excel with data

**Epic Context:**
Custom reports enable business users to analyze data specific to their needs, transforming raw tracking data into actionable business intelligence.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Query generation, aggregations
- **Integration Tests:** Full report creation flow
- **Performance Tests:** Large dataset reporting
- **Export Tests:** PDF/Excel format quality

**Test Environment:**
- Various report configurations
- Large datasets (10K+ emails)
- Scheduled report execution
- Multiple visualization types

**Success Metrics:**
- Report generation: <5 seconds for typical queries
- Large dataset handling: 10K+ records
- Scheduled delivery: 99%+ reliability
- Export quality: Professional formatting

**Testing Tools:**
- Report validation
- PDF/Excel quality checks
- Performance profiling

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 3.3 - Analytics Dashboard](./story-3.3-dashboard-ui-charts.md) - Dashboard and chart foundation
- [Story 6.1 - Subscription & Billing](./story-6.1-subscription-tiers-billing.md) - Business tier feature

**Blocks (Stories Waiting on This):**
- None (advanced reporting feature)

**Related Stories:**
- [Story 8.1 - Data Export API](./story-8.1-data-export-api.md) - Similar export patterns

---

## Developer Implementation Checklist

- [ ] Create Reports and ReportSchedules tables
- [ ] Build report query builder service
- [ ] Support dynamic SQL generation based on filters
- [ ] Create POST `/api/reports/generate` endpoint
- [ ] Implement report caching for performance
- [ ] Build report builder UI with drag-and-drop
- [ ] Integrate chart library for visualizations
- [ ] Implement report saving and loading
- [ ] Create report scheduling system (cron jobs)
- [ ] Implement PDF export with charts
- [ ] Implement Excel export with formatted data
- [ ] Add email delivery for scheduled reports

### QA Verification Checklist

- [ ] Open Report Builder
- [ ] Select metric: "Open Rate"
- [ ] Filter: Last 30 days, Campaign = "Sales Outreach"
- [ ] Group by: Week
- [ ] Chart type: Line chart
- [ ] Generate report → chart displays
- [ ] Save report as "Sales Performance"
- [ ] Schedule report: every Monday at 9 AM
- [ ] Receive email on Monday with PDF report
- [ ] Export as Excel → formatted spreadsheet downloaded
- [ ] Test with large dataset (10K+ emails) → reasonable performance

---

## Definition of Done

- [ ] Report builder UI functional
- [ ] Custom reports generating correctly
- [ ] Scheduled reports sending
- [ ] Export formats working (PDF, Excel)


