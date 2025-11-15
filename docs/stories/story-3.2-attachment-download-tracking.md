# Story 3.2: Attachment Download Tracking

**Story ID:** STORY-3.2  
**Epic:** Epic 3 - Advanced Tracking & Analytics Dashboard  
**Priority:** P2 - Nice to Have  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to know when recipients download email attachments  
**So that** I can gauge their interest in detailed materials

---

## Acceptance Criteria

- [ ] POST /api/attachments endpoint accepts file upload (max 25MB)
- [ ] File stored in S3/equivalent with unique ID
- [ ] Attachment link in email replaced with tracking URL: `https://track.domain.com/attachment/:attachment_id`
- [ ] GET /api/track/attachment/:attachment_id records TrackingEvent type='download'
- [ ] Returns file with correct Content-Type and Content-Disposition headers
- [ ] Dashboard shows attachment downloads with timestamps
- [ ] File proxy adds < 500ms latency

---

## Requirements Traceability

**PRD Coverage:**
- **FR3:** Attachment download tracking

**Architecture References:**
- File Storage: AWS S3 or equivalent
- File Proxy: Streaming with tracking
- Data Models: TrackedAttachments, TrackingEvents (type='download')

**Epic Context:**
Attachment tracking enables users to gauge recipient interest in detailed materials like proposals, presentations, and documents - critical for sales and business development use cases.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** File upload, S3 integration, download proxy
- **Integration Tests:** Full upload → email → download flow
- **Performance Tests:** Large file handling, streaming latency
- **Security Tests:** File type restrictions, virus scanning

**Test Environment:**
- AWS S3 or local storage emulation
- Various file types (PDF, images, docs)
- Large file testing (up to 25MB)

**Success Metrics:**
- Upload speed: Reasonable for file size
- Download latency: <500ms overhead
- Storage security: Private bucket, signed URLs
- File integrity: 100% preserved

**Testing Tools:**
- Multer for file upload testing
- AWS SDK testing
- File integrity checksums

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - Similar tracking pattern
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Email integration

**Blocks (Stories Waiting on This):**
- [Story 3.3 - Analytics Dashboard](./story-3.3-dashboard-ui-charts.md) - Dashboard displays attachment data

**Related Stories:**
- [Story 3.1 - Link Click Tracking](./story-3.1-link-click-tracking.md) - Similar proxy tracking pattern

---

## Developer Implementation Checklist

- [ ] Setup AWS S3 bucket or alternative storage
- [ ] Install packages: `pnpm add multer aws-sdk`
- [ ] Create TrackedAttachments table
- [ ] Create POST `/api/attachments/upload` endpoint with multer middleware
- [ ] Upload file to S3, store metadata in database
- [ ] Generate tracking URL
- [ ] Create GET `/api/track/attachment/:id` endpoint
- [ ] Fetch file from S3
- [ ] Record TrackingEvent type='download'
- [ ] Stream file to response with correct headers
- [ ] Add attachment section to dashboard
- [ ] Show attachment name, size, download count
- [ ] Implement file type restrictions (block executables)
- [ ] Add virus scanning (optional, use ClamAV or similar)

### QA Verification Checklist

- [ ] Upload PDF file (5MB)
- [ ] Attachment URL generated
- [ ] Include URL in email
- [ ] Recipient clicks attachment link
- [ ] File downloads correctly
- [ ] Check database: TrackingEvent recorded
- [ ] Dashboard shows "proposal.pdf: 1 download"
- [ ] Test with large file (20MB) → works
- [ ] Test with file > 25MB → rejected with error
- [ ] Test with multiple attachments in one email
- [ ] Verify file integrity (download matches upload)

---

## Definition of Done

- [ ] Attachment upload and tracking working
- [ ] Files stored securely
- [ ] Download tracking accurate
- [ ] Dashboard displays attachment analytics


