# Story 6.2: User Profile & Settings Management

**Story ID:** STORY-6.2  
**Epic:** Epic 6 - User Management & Subscription System  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to manage my profile and account settings  
**So that** I can customize my experience and keep my information up to date

---

## Acceptance Criteria

- [ ] Profile page shows user info (name, email, joined date)
- [ ] Edit profile: update name, timezone, notification preferences
- [ ] Change password functionality
- [ ] Email preferences: open notifications, weekly digest, marketing emails
- [ ] Connected accounts section (Gmail, Outlook) with disconnect option
- [ ] API token generation for API access
- [ ] Account deletion option with confirmation

---

## Requirements Traceability

**PRD Coverage:**
- User profile management (no direct FR, foundational)
- Account settings and preferences

**Architecture References:**
- Data Models: UserProfiles, NotificationPreferences
- File Storage: S3/Cloudinary for avatars
- API Tokens: UUID-based for API access

**Epic Context:**
Profile management provides users control over their experience and account, essential for user satisfaction and retention.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Profile validation, password change
- **Integration Tests:** Full profile update flow
- **UI Tests:** Settings page interactions
- **Security Tests:** Password change validation, token security

**Test Environment:**
- Various profile update scenarios
- File upload testing
- Password complexity validation

**Success Metrics:**
- Profile update: <1 second
- Avatar upload: <3 seconds
- Password change: Secure validation
- Settings persistence: 100%

**Testing Tools:**
- Jest for unit tests
- File upload testing
- Manual UI testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.3 - User Authentication](./story-1.3-user-authentication-registration.md) - User accounts required

**Blocks (Stories Waiting on This):**
- None (enhancement feature)

**Related Stories:**
- [Story 6.1 - Subscription & Billing](./story-6.1-subscription-tiers-billing.md) - Profile shows subscription info

---

## Developer Implementation Checklist

- [ ] Create UserProfiles table (name, timezone, avatar_url, notification_prefs)
- [ ] Create GET/PUT `/api/user/profile` endpoints
- [ ] Implement profile update validation
- [ ] Create PUT `/api/user/change-password` endpoint
- [ ] Validate old password before updating
- [ ] Create notification preferences system
- [ ] Build profile settings page UI
- [ ] Add profile picture upload (S3/Cloudinary)
- [ ] Implement API token generation (UUID-based)
- [ ] Create token management UI
- [ ] Add account deletion with confirmation flow

### QA Verification Checklist

- [ ] Open Profile Settings
- [ ] Update name → saved successfully
- [ ] Change timezone → affects time displays
- [ ] Change password → old password required
- [ ] Login with new password → works
- [ ] Update email preferences → uncheck "Marketing emails"
- [ ] Upload profile picture → displayed in navbar
- [ ] Generate API token → token shown once
- [ ] View connected accounts (Gmail, Outlook)
- [ ] Disconnect Gmail → removed from list
- [ ] Reconnect Gmail → works
- [ ] Test account deletion → requires confirmation

---

## Definition of Done

- [ ] Profile management working
- [ ] Password change functional
- [ ] Notification preferences saved
- [ ] API token generation working
- [ ] Account deletion with safeguards


