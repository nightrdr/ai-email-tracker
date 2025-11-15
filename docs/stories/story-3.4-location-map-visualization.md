# Story 3.4: Location Map Visualization

**Story ID:** STORY-3.4  
**Epic:** Epic 3 - Advanced Tracking & Analytics Dashboard  
**Priority:** P2 - Nice to Have  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to see a map showing where my emails are being opened  
**So that** I can understand the geographic distribution of my audience

---

## Acceptance Criteria

- [ ] Dashboard displays interactive world map
- [ ] Map shows markers for email open locations
- [ ] Marker size indicates number of opens from that location
- [ ] Clicking marker shows tooltip with city, country, open count
- [ ] Color-coded by engagement (green = high, yellow = medium, gray = low)
- [ ] Works with GeoIP data from tracking pixel service

---

## Requirements Traceability

**PRD Coverage:**
- **FR4:** City-level location tracking visualization

**Architecture References:**
- Map Library: Leaflet with React bindings
- GeoIP Data: MaxMind GeoLite2 from Story 1.4
- Data Aggregation: Location-based event grouping

**Epic Context:**
Geographic visualization helps users understand audience distribution and can inform timing strategies for email campaigns, especially valuable for global or regional sales teams.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Location aggregation, coordinate calculations
- **Integration Tests:** API data fetching, map rendering
- **UI Tests:** Map interactivity, tooltip display
- **Data Tests:** Various location scenarios (multiple cities, unknown IPs)

**Test Environment:**
- Tracking data with diverse locations
- Various screen sizes for responsive testing
- Map performance with 100+ locations

**Success Metrics:**
- Map load time: <2 seconds
- Rendering performance: Smooth with 100+ markers
- Location accuracy: Matches GeoIP data
- Interactive responsiveness: <100ms

**Testing Tools:**
- React Testing Library
- Leaflet testing utilities
- Manual interaction testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - GeoIP location data
- [Story 3.3 - Analytics Dashboard](./story-3.3-dashboard-ui-charts.md) - Dashboard foundation

**Blocks (Stories Waiting on This):**
- None (enhancement feature)

**Related Stories:**
- Complements other dashboard visualizations

---

## Developer Implementation Checklist

- [ ] Install map library: `pnpm add react-leaflet leaflet`
- [ ] Create GET `/api/analytics/locations` endpoint
- [ ] Aggregate tracking events by location
- [ ] Return array of {location, lat, lng, open_count}
- [ ] Create MapComponent: `packages/web/src/components/LocationMap.tsx`
- [ ] Render Leaflet map centered on user's region
- [ ] Add CircleMarkers for each location
- [ ] Size circle by open_count
- [ ] Color by engagement level
- [ ] Add tooltips with location details
- [ ] Handle locations without coordinates (skip or use country-level)

### Unit and Integration Tests (60 min)

- [ ] Write unit tests for location data aggregation
  - Test grouping tracking events by city
  - Test calculating open count per location
  - Test handling null/missing location data
  - Test converting city names to coordinates (geocoding)

- [ ] Write unit tests for map marker sizing
  - Test calculating marker size based on open count
  - Test minimum and maximum marker sizes
  - Test color coding by engagement level

- [ ] Write integration tests for location API endpoint
  - Test GET /api/dashboard/locations returns aggregated location data
  - Test endpoint includes coordinates for mapping
  - Test endpoint filters by user
  - Test endpoint requires authentication

- [ ] Write integration tests for map component
  - Test MapView renders world map
  - Test markers display at correct coordinates
  - Test marker tooltips show location details
  - Test clicking marker shows email list for that location

- [ ] Write integration tests for real-time updates
  - Test new tracking event with location adds/updates marker
  - Test WebSocket notification triggers map refresh

- [ ] Write tests for edge cases
  - Test handling locations without coordinates
  - Test handling unknown/invalid city names
  - Test map with zero data points

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify map rendering and location aggregation fully tested
  - Test map interactions (zoom, pan, markers)

### QA Verification Checklist

- [ ] Dashboard shows world map
- [ ] Map displays markers for tracked email opens
- [ ] Click marker → tooltip shows location and count
- [ ] Larger circles for higher engagement locations
- [ ] Test with opens from multiple countries
- [ ] Map is interactive (pan, zoom)

---

## Definition of Done

- [ ] Map visualization working
- [ ] Location data accurate
- [ ] Interactive and performant


