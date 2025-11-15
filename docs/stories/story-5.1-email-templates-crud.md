# Story 5.1: Email Templates - CRUD Operations

**Story ID:** STORY-5.1  
**Epic:** Epic 5 - Templates & Campaign Management  
**Priority:** P1 - Should Have  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to create and manage reusable email templates  
**So that** I can quickly compose emails without retyping common content

---

## Acceptance Criteria

- [ ] EmailTemplates table created with: id, user_id, name, subject, body, created_at
- [ ] API endpoints: POST /api/templates (create), GET /api/templates (list), GET /api/templates/:id (get), PUT /api/templates/:id (update), DELETE /api/templates/:id (delete)
- [ ] Templates support variables: {{first_name}}, {{company}}, etc.
- [ ] Dashboard page to manage templates
- [ ] Template editor with rich text formatting
- [ ] Extension shows template selector in compose window

---

## Requirements Traceability

**PRD Coverage:**
- **FR7:** Email template library with variables
- **FR9:** Template management UI

**Architecture References:**
- Data Models: EmailTemplates table
- Variable System: Template variable parsing and replacement
- Rich Text Editor: WYSIWYG email composition

**Epic Context:**
Templates enable users to scale their email outreach by reusing proven messaging, increasing efficiency and consistency across campaigns.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** CRUD operations, variable replacement logic
- **Integration Tests:** Full template flow from creation to usage
- **UI Tests:** Template editor, variable insertion
- **Performance Tests:** Loading large template lists

**Test Environment:**
- Multiple templates with various variables
- Rich text formatting scenarios
- Extension compose window integration

**Success Metrics:**
- Template creation: <1 second
- Template list load: <500ms for 100+ templates
- Variable replacement: 100% accuracy
- Editor usability: Intuitive UI

**Testing Tools:**
- Jest for unit tests
- Cypress for UI testing
- Manual template usage testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.2 - Database Schema](./story-1.2-database-schema-migrations.md) - Database foundation
- [Story 1.3 - User Authentication](./story-1.3-user-authentication-registration.md) - User context
- [Story 2.5 - Gmail Compose Integration](./story-2.5-gmail-compose-window-integration.md) - Extension UI for template selector

**Blocks (Stories Waiting on This):**
- [Story 5.2 - Email Campaigns](./story-5.2-email-campaigns-sequences.md) - Campaigns use templates

**Related Stories:**
- Templates are foundation for campaign automation

---

## Developer Implementation Checklist

- [ ] Create EmailTemplates table migration
- [ ] Create template service and controller
- [ ] Implement CRUD endpoints with auth middleware
- [ ] Create dashboard page: `/templates`
- [ ] Build template editor UI with variable insertion
- [ ] Implement variable replacement logic
- [ ] Extension: Add "Use Template" button
- [ ] Show template selector dropdown
- [ ] Load template content into compose window
- [ ] Replace variables with recipient-specific data

### QA Verification Checklist

- [ ] Create template "Follow Up" with subject and body
- [ ] Template saved successfully
- [ ] View templates list
- [ ] Edit template → changes saved
- [ ] Delete template → removed from list
- [ ] In Gmail compose, click "Use Template"
- [ ] Select template from dropdown
- [ ] Template content loads into compose fields
- [ ] Variables like {{first_name}} replaced correctly
- [ ] Test with 50+ templates → performance good

---

## Definition of Done

- [ ] Template CRUD working
- [ ] Dashboard UI complete
- [ ] Extension integration functional
- [ ] Variable replacement working


