# Story 2.5: Gmail Compose Window Integration

**Story ID:** STORY-2.5  
**Epic:** Epic 2 - Chrome Extension & Email Integration  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user composing an email in Gmail  
**I want** a tracking toggle button in the compose toolbar  
**So that** I can easily enable/disable tracking for each email I send

---

## Acceptance Criteria

- [ ] Content script detects Gmail compose window (new email, reply, forward)
- [ ] Extension injects tracking toggle button into compose toolbar
- [ ] Button shows "Enable Tracking" icon, clicking toggles to "Tracking Enabled" (green checkmark)
- [ ] When enabled, small panel appears with options: "AI Score", "Use Template", "Schedule" (placeholder for future features)
- [ ] Tracking state persists if user switches between compose windows
- [ ] No duplicate UI injection on compose window refresh
- [ ] UI styling matches Gmail's Material Design
- [ ] Tracking state stored in chrome.storage per draft

---

## Requirements Traceability

**PRD Coverage:**
- **FR39:** Gmail integration with compose window features
- **FR41:** Compose window AI assistant panel

**Architecture References:**
- Content Script: Gmail compose DOM injection
- State Management: chrome.storage for draft tracking state
- UI Components: Material Design-compliant toggle button

**Epic Context:**
The compose window toggle is the primary user touchpoint for enabling tracking, making it effortless to track emails within the familiar Gmail interface.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Toggle state management, UI rendering
- **Integration Tests:** State persistence, multiple compose windows
- **UI Tests:** Visual appearance, button interactions
- **Edge Cases:** Compose window refresh, Gmail updates

**Test Environment:**
- Gmail new compose, reply, forward scenarios
- Multiple simultaneous compose windows
- Draft saving and reopening

**Success Metrics:**
- Toggle injection: <50ms
- State persistence: 100% reliable
- UI compatibility: Matches Gmail design
- Zero conflicts with Gmail native features

**Testing Tools:**
- Chrome DevTools
- Gmail test scenarios
- Manual UI testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 2.1 - Chrome Extension OAuth](./story-2.1-chrome-extension-scaffold.md) - Extension foundation

**Blocks (Stories Waiting on This):**
- [Story 2.6 - Send from Gmail](./story-2.6-send-tracked-email-from-gmail.md) - Needs tracking toggle state
- [Story 4.1 - AI Email Scoring](./story-4.1-openai-email-scoring.md) - Uses compose panel

**Related Stories:**
- [Story 2.4 - Gmail Inbox Indicators](./story-2.4-gmail-inbox-tracking-indicators.md) - Complementary features

---

## Developer Implementation Checklist

### Extension Implementation

- [ ] Create `packages/extension/src/content/gmail/compose.ts`
- [ ] Detect compose window using selector `.nH .aoI` (compose container)
- [ ] Find compose toolbar (`.btC` or `.aDh`)
- [ ] Create tracking toggle button (SVG icon + text)
- [ ] Insert button into toolbar DOM
- [ ] Handle click event to toggle tracking state
- [ ] Update button appearance (gray → green, icon change)
- [ ] Create options panel (initially just placeholder)
- [ ] Store tracking state: `chrome.storage.local.set({ 'draft-{id}': { tracking_enabled: true } })`
- [ ] Restore state when compose window reopens
- [ ] Use MutationObserver to detect compose window creation/destruction
- [ ] Add CSS matching Gmail's design system
- [ ] Prevent multiple injections with data attributes
- [ ] Test with reply, forward, and new compose scenarios

### QA Verification Checklist

- [ ] Open Gmail, click "Compose"
- [ ] Verify tracking toggle button appears in toolbar
- [ ] Click toggle, changes from "Enable Tracking" to "Tracking Enabled"
- [ ] Button color changes (gray to green)
- [ ] Icon changes (circle to checkmark)
- [ ] Close and reopen compose window
- [ ] Tracking state persists
- [ ] Test with Reply: toggle appears and works
- [ ] Test with Forward: toggle appears and works
- [ ] Open multiple compose windows, each has independent state
- [ ] Styling matches Gmail's native buttons
- [ ] No console errors
- [ ] Button doesn't break Gmail's native functionality

---

## Definition of Done

- [ ] Tracking toggle button injected into Gmail compose
- [ ] Toggle state persists across compose sessions
- [ ] UI matches Gmail design
- [ ] Works for compose, reply, forward
- [ ] No performance issues or errors


