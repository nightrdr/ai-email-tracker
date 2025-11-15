# Story 1.4: Tracking Pixel Service

**Story ID:** STORY-1.4  
**Epic:** Epic 1 - Foundation & Core Tracking Infrastructure  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** developer  
**I want** a pixel tracking service that records email opens  
**So that** users can see when recipients open their emails

---

## Business Value

Email open tracking is the core value proposition of the product. This service:
- Enables visibility into email engagement
- Provides real-time open notifications
- Collects location data for analytics
- Forms the foundation for all tracking features

---

## Acceptance Criteria

### ✅ AC1: Pixel Endpoint
- [ ] GET /api/track/pixel/:tracking_pixel_id endpoint created
- [ ] Endpoint returns 1x1 transparent PNG image
- [ ] Response has correct Content-Type: image/png
- [ ] Response includes cache-control headers to prevent caching

### ✅ AC2: Tracking Event Recording
- [ ] TrackingEvent record created with type='open'
- [ ] Timestamp captured automatically
- [ ] IP address extracted from request
- [ ] User agent extracted from request headers

### ✅ AC3: Tracking Pixel ID
- [ ] Tracking pixel ID is UUID format
- [ ] UUID generated when email prepared for sending
- [ ] UUID uniquely identifies each tracked email

### ✅ AC4: GeoIP Location Tracking
- [ ] MaxMind GeoLite2 library integrated
- [ ] City-level location extracted from IP address
- [ ] Location stored as string (e.g., "San Francisco, CA, US")
- [ ] Gracefully handles unknown/private IPs

### ✅ AC5: Deduplication
- [ ] Duplicate opens within 5 minutes are deduplicated
- [ ] Deduplication based on tracked_email_id + IP + user_agent
- [ ] First open always recorded
- [ ] Subsequent opens within window ignored

### ✅ AC6: Performance
- [ ] Endpoint responds in < 200ms (p95)
- [ ] Response time measured and logged
- [ ] No blocking operations in request handler

### ✅ AC7: CORS Configuration
- [ ] CORS headers allow requests from any origin
- [ ] Required for email clients to load pixel
- [ ] Access-Control-Allow-Origin: * header

### ✅ AC8: URL Format
- [ ] Tracking URL format: https://track.domain.com/pixel/:tracking_pixel_id.png
- [ ] .png extension in URL (helps with email client compatibility)
- [ ] URL works when embedded in HTML img tag

---

## Requirements Traceability

**PRD Coverage:**
- **FR1:** Email open tracking with pixel-based tracking
- **FR4:** City-level location tracking for email opens
- **NFR2:** Real-time notifications with <5 second latency
- **NFR5:** Rate limiting and optimization for tracking

**Architecture References:**
- Tracking Service: Pixel-based open detection
- GeoIP Integration: MaxMind GeoLite2 for location data
- Performance: <200ms response time requirement
- Data Models: TrackingEvents, TrackedEmails

**Epic Context:**
This story delivers the core value proposition - email open tracking. It's the foundation that validates the entire product concept and enables real-time engagement visibility.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** GeoIP service, deduplication logic, pixel generation
- **Integration Tests:** Full pixel load to database recording flow
- **Performance Tests:** Response time under load, concurrent requests
- **E2E Tests:** Pixel in real email → tracking event → notification

**Test Environment:**
- Local: Docker PostgreSQL + GeoIP database + API server
- Test pixels with various IPs (localhost, private, public)
- Load testing tools for performance validation

**Success Metrics:**
- Pixel response: <200ms (p95)
- GeoIP lookup: <50ms
- Deduplication accuracy: 100%
- Zero false negatives on opens

**Testing Tools:**
- Apache Bench or k6 for load testing
- GeoIP test data for location accuracy
- Email client simulators for real-world testing

---

## Developer Implementation Checklist

### Phase 1: Install Dependencies (15 min)

- [ ] **Step 1.1:** Install GeoIP library
  ```bash
  cd packages/api
  pnpm add maxmind
  ```

- [ ] **Step 1.2:** Download GeoLite2 database
  ```bash
  # Create directory for GeoIP data
  mkdir -p data/geoip
  
  # Download GeoLite2-City database
  # Option 1: Sign up for free MaxMind account and download manually
  # Option 2: Use mmdb-downloader package
  pnpm add -D mmdb-downloader
  ```

- [ ] **Step 1.3:** Add download script to package.json
  ```json
  {
    "scripts": {
      "geoip:download": "mmdb-downloader -l GeoLite2-City -o ./data/geoip"
    }
  }
  ```

- [ ] **Step 1.4:** Run download script
  ```bash
  pnpm geoip:download
  ```

- [ ] **Step 1.5:** Create 1x1 transparent PNG
  ```typescript
  // packages/api/src/assets/pixel.ts
  // Base64 encoded 1x1 transparent PNG
  export const TRANSPARENT_PIXEL = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
  ```

### Phase 2: Create GeoIP Service (30 min)

- [ ] **Step 2.1:** Create GeoIP service
  ```typescript
  // packages/api/src/services/geoip.service.ts
  import maxmind, { CityResponse, Reader } from 'maxmind';
  import path from 'path';
  import fs from 'fs';
  
  export class GeoIPService {
    private reader: Reader<CityResponse> | null = null;
    private dbPath: string;
    
    constructor() {
      this.dbPath = path.join(__dirname, '../../data/geoip/GeoLite2-City.mmdb');
    }
    
    async init() {
      try {
        if (!fs.existsSync(this.dbPath)) {
          console.warn('GeoIP database not found. Location tracking disabled.');
          return;
        }
        
        this.reader = await maxmind.open<CityResponse>(this.dbPath);
        console.log('GeoIP database loaded successfully');
      } catch (error) {
        console.error('Failed to load GeoIP database:', error);
      }
    }
    
    getLocation(ip: string): string | null {
      if (!this.reader) {
        return null;
      }
      
      try {
        // Handle localhost and private IPs
        if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
          return 'Local/Private Network';
        }
        
        const result = this.reader.get(ip);
        
        if (!result) {
          return null;
        }
        
        const city = result.city?.names?.en;
        const subdivision = result.subdivisions?.[0]?.iso_code;
        const country = result.country?.iso_code;
        
        const parts = [city, subdivision, country].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
      } catch (error) {
        console.error('GeoIP lookup error:', error);
        return null;
      }
    }
  }
  
  // Singleton instance
  export const geoIPService = new GeoIPService();
  ```

- [ ] **Step 2.2:** Initialize GeoIP on app startup
  ```typescript
  // packages/api/src/app.ts (add to existing file)
  import { geoIPService } from './services/geoip.service';
  
  // Add initialization
  export async function initializeApp() {
    await geoIPService.init();
  }
  ```

- [ ] **Step 2.3:** Update server startup
  ```typescript
  // packages/api/src/index.ts (update)
  import app, { initializeApp } from './app';
  
  const PORT = process.env.API_PORT || 3001;
  
  async function start() {
    await initializeApp();
    
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}`);
    });
  }
  
  start();
  ```

### Phase 3: Create Tracking Service (45 min)

- [ ] **Step 3.1:** Create tracking service
  ```typescript
  // packages/api/src/services/tracking.service.ts
  import { query } from '../db';
  import { geoIPService } from './geoip.service';
  import { TrackingEvent, EventType } from '@ai-tracker/shared/types/database';
  
  export interface RecordOpenDto {
    tracking_pixel_id: string;
    ip_address: string;
    user_agent: string;
  }
  
  export class TrackingService {
    async recordOpen(dto: RecordOpenDto): Promise<TrackingEvent | null> {
      const { tracking_pixel_id, ip_address, user_agent } = dto;
      
      // Find the tracked email
      const emailResult = await query(
        'SELECT id FROM tracked_emails WHERE tracking_pixel_id = $1',
        [tracking_pixel_id]
      );
      
      if (emailResult.rows.length === 0) {
        console.warn('Tracked email not found for pixel ID:', tracking_pixel_id);
        return null;
      }
      
      const tracked_email_id = emailResult.rows[0].id;
      
      // Check for duplicate within last 5 minutes
      const isDuplicate = await this.checkDuplicate(
        tracked_email_id,
        ip_address,
        user_agent
      );
      
      if (isDuplicate) {
        console.log('Duplicate open detected, skipping:', tracking_pixel_id);
        return null;
      }
      
      // Get location from IP
      const location = geoIPService.getLocation(ip_address);
      
      // Record tracking event
      const result = await query(
        `INSERT INTO tracking_events (tracked_email_id, event_type, ip_address, user_agent, location)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [tracked_email_id, EventType.OPEN, ip_address, user_agent, location]
      );
      
      console.log('Open event recorded:', {
        tracking_pixel_id,
        tracked_email_id,
        location,
      });
      
      return result.rows[0];
    }
    
    private async checkDuplicate(
      tracked_email_id: string,
      ip_address: string,
      user_agent: string
    ): Promise<boolean> {
      const result = await query(
        `SELECT id FROM tracking_events
         WHERE tracked_email_id = $1
           AND ip_address = $2
           AND user_agent = $3
           AND event_type = $4
           AND timestamp > NOW() - INTERVAL '5 minutes'
         LIMIT 1`,
        [tracked_email_id, ip_address, user_agent, EventType.OPEN]
      );
      
      return result.rows.length > 0;
    }
  }
  ```

### Phase 4: Create Pixel Controller (30 min)

- [ ] **Step 4.1:** Create tracking controller
  ```typescript
  // packages/api/src/controllers/tracking.controller.ts
  import { Request, Response } from 'express';
  import { TrackingService } from '../services/tracking.service';
  import { TRANSPARENT_PIXEL } from '../assets/pixel';
  
  const trackingService = new TrackingService();
  
  export async function trackPixel(req: Request, res: Response) {
    const startTime = Date.now();
    
    try {
      const { tracking_pixel_id } = req.params;
      
      // Extract IP address (handle proxies)
      const ip_address = (
        req.headers['x-forwarded-for'] as string ||
        req.headers['x-real-ip'] as string ||
        req.socket.remoteAddress ||
        ''
      ).split(',')[0].trim();
      
      // Extract user agent
      const user_agent = req.headers['user-agent'] || '';
      
      // Record tracking event asynchronously (don't wait)
      trackingService.recordOpen({
        tracking_pixel_id,
        ip_address,
        user_agent,
      }).catch(error => {
        console.error('Error recording tracking event:', error);
      });
      
      // Return pixel immediately (don't wait for database)
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      const responseTime = Date.now() - startTime;
      console.log(`Pixel served in ${responseTime}ms:`, tracking_pixel_id);
      
      res.send(TRANSPARENT_PIXEL);
    } catch (error) {
      console.error('Pixel tracking error:', error);
      
      // Always return pixel even on error (don't break email display)
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(TRANSPARENT_PIXEL);
    }
  }
  ```

### Phase 5: Create Routes (15 min)

- [ ] **Step 5.1:** Create tracking routes
  ```typescript
  // packages/api/src/routes/tracking.routes.ts
  import { Router } from 'express';
  import { trackPixel } from '../controllers/tracking.controller';
  
  const router = Router();
  
  // Pixel tracking endpoint
  router.get('/pixel/:tracking_pixel_id.png', trackPixel);
  router.get('/pixel/:tracking_pixel_id', trackPixel); // Without .png extension
  
  export default router;
  ```

- [ ] **Step 5.2:** Add routes to app
  ```typescript
  // packages/api/src/app.ts (update)
  import trackingRoutes from './routes/tracking.routes';
  
  // Add routes
  app.use('/api/track', trackingRoutes);
  ```

### Phase 6: Testing Setup (30 min)

- [ ] **Step 6.1:** Create test HTML file
  ```html
  <!-- packages/api/test/pixel-test.html -->
  <!DOCTYPE html>
  <html>
  <head>
    <title>Pixel Tracking Test</title>
  </head>
  <body>
    <h1>Pixel Tracking Test</h1>
    
    <p>If you see this page, the pixel below should trigger a tracking event.</p>
    
    <!-- Replace with actual tracking_pixel_id from database -->
    <img src="http://localhost:3001/api/track/pixel/TEST-UUID-HERE.png" 
         alt="" 
         width="1" 
         height="1" 
         style="display:none;" />
    
    <p>Check server logs and database for tracking event.</p>
    
    <script>
      // Log when image loads
      document.querySelector('img').addEventListener('load', () => {
        console.log('Tracking pixel loaded successfully');
      });
      
      document.querySelector('img').addEventListener('error', () => {
        console.error('Tracking pixel failed to load');
      });
    </script>
  </body>
  </html>
  ```

- [ ] **Step 6.2:** Create test data script
  ```typescript
  // packages/api/src/scripts/create-test-email.ts
  import { query } from '../db';
  import { v4 as uuidv4 } from 'uuid';
  
  async function createTestEmail() {
    // Create a test user first
    const userResult = await query(
      `INSERT INTO users (email, password_hash)
       VALUES ('pixeltest@example.com', 'test')
       ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
       RETURNING id`,
      []
    );
    
    const user_id = userResult.rows[0].id;
    
    // Create test email account
    const accountResult = await query(
      `INSERT INTO email_accounts (user_id, provider, oauth_tokens, email_address)
       VALUES ($1, 'gmail', 'test_tokens', 'pixeltest@example.com')
       RETURNING id`,
      [user_id]
    );
    
    const email_account_id = accountResult.rows[0].id;
    
    // Create tracked email
    const tracking_pixel_id = uuidv4();
    const emailResult = await query(
      `INSERT INTO tracked_emails (user_id, email_account_id, recipient_email, subject, tracking_pixel_id)
       VALUES ($1, $2, 'recipient@example.com', 'Test Email', $3)
       RETURNING *`,
      [user_id, email_account_id, tracking_pixel_id]
    );
    
    console.log('Test email created:');
    console.log('Tracking Pixel ID:', tracking_pixel_id);
    console.log('Test URL:', `http://localhost:3001/api/track/pixel/${tracking_pixel_id}.png`);
    console.log('\nUpdate pixel-test.html with this URL');
    
    process.exit(0);
  }
  
  createTestEmail().catch(console.error);
  ```

- [ ] **Step 6.3:** Add script to package.json
  ```json
  {
    "scripts": {
      "test:create-pixel": "ts-node src/scripts/create-test-email.ts"
    }
  }
  ```

### Phase 7: Manual Testing (30 min)

- [ ] **Step 7.1:** Start API server
  ```bash
  cd packages/api
  pnpm dev
  ```

- [ ] **Step 7.2:** Create test email
  ```bash
  pnpm test:create-pixel
  ```
  Note the tracking_pixel_id

- [ ] **Step 7.3:** Test pixel endpoint directly
  ```bash
  curl -v "http://localhost:3001/api/track/pixel/YOUR-UUID-HERE.png"
  ```
  - Verify 200 response
  - Verify Content-Type: image/png
  - Verify CORS headers present

- [ ] **Step 7.4:** Check database for tracking event
  ```sql
  SELECT * FROM tracking_events 
  ORDER BY timestamp DESC 
  LIMIT 1;
  ```

- [ ] **Step 7.5:** Test deduplication
  ```bash
  # Make same request multiple times quickly
  curl "http://localhost:3001/api/track/pixel/YOUR-UUID-HERE.png"
  curl "http://localhost:3001/api/track/pixel/YOUR-UUID-HERE.png"
  curl "http://localhost:3001/api/track/pixel/YOUR-UUID-HERE.png"
  ```
  - Check database: only 1 event recorded

- [ ] **Step 7.6:** Open test HTML file
  - Update pixel-test.html with your tracking_pixel_id
  - Open in browser
  - Check server logs
  - Check database for new tracking event

- [ ] **Step 7.7:** Test location tracking
  ```bash
  # Use public IP in test (not localhost)
  # Or check logs for location extracted from your IP
  ```

---

## QA Verification Checklist

### ✅ Pixel Endpoint Tests

- [ ] **QA-1.1:** Basic pixel request
  - GET /api/track/pixel/{valid-uuid}.png
  - Returns 200 status
  - Returns image/png content type
  - Response body is valid PNG image

- [ ] **QA-1.2:** Pixel display
  - Embed pixel in HTML img tag
  - Image loads without visible display
  - No console errors

- [ ] **QA-1.3:** Invalid tracking ID
  - GET /api/track/pixel/invalid-uuid.png
  - Returns 200 status (always return pixel)
  - Returns pixel image
  - Warning logged server-side

- [ ] **QA-1.4:** Non-existent tracking ID
  - GET /api/track/pixel/{valid-but-nonexistent-uuid}.png
  - Returns 200 status
  - Returns pixel image
  - No database error

### ✅ Tracking Event Recording Tests

- [ ] **QA-2.1:** Event creation
  - Load pixel for existing tracked email
  - Check database: tracking_event created
  - Event has correct tracked_email_id
  - Event type is 'open'
  - Timestamp is current time

- [ ] **QA-2.2:** IP address capture
  - Make request with known IP
  - Check database: ip_address recorded
  - IP matches request IP

- [ ] **QA-2.3:** User agent capture
  - Make request with specific user agent
  - Check database: user_agent recorded
  - User agent matches request header

- [ ] **QA-2.4:** Proxy IP handling
  - Set X-Forwarded-For header
  - Check database: correct IP extracted
  - Uses first IP in chain

### ✅ GeoIP Location Tests

- [ ] **QA-3.1:** Public IP location
  - Request from public IP
  - Check database: location field populated
  - Format: "City, State/Region, Country"

- [ ] **QA-3.2:** Localhost handling
  - Request from 127.0.0.1
  - Check database: location is "Local/Private Network"

- [ ] **QA-3.3:** Private IP handling
  - Request from 192.168.x.x or 10.x.x.x
  - Check database: location is "Local/Private Network"

- [ ] **QA-3.4:** Unknown IP handling
  - Request from IP not in GeoIP database
  - Check database: location is NULL
  - No errors thrown

### ✅ Deduplication Tests

- [ ] **QA-4.1:** Rapid duplicate requests
  - Send 5 requests in quick succession (< 1 second apart)
  - Same tracking_pixel_id, IP, user agent
  - Check database: only 1 event recorded

- [ ] **QA-4.2:** Different IP
  - Send request from IP A
  - Send request from IP B (same pixel)
  - Check database: 2 events recorded (different IPs)

- [ ] **QA-4.3:** Different user agent
  - Send request with User Agent A
  - Send request with User Agent B (same pixel, IP)
  - Check database: 2 events recorded (different agents)

- [ ] **QA-4.4:** Time window
  - Send request
  - Wait 6 minutes
  - Send same request again
  - Check database: 2 events recorded (outside 5-minute window)

### ✅ Performance Tests

- [ ] **QA-5.1:** Response time
  - Measure pixel response time
  - Should be < 200ms for p95
  - Use: `time curl "http://localhost:3001/api/track/pixel/UUID.png"`

- [ ] **QA-5.2:** Concurrent requests
  - Send 100 concurrent pixel requests
  - All return 200 status
  - All complete in reasonable time
  - No server crashes

- [ ] **QA-5.3:** Database async
  - Verify pixel returns immediately
  - Database write happens asynchronously
  - Slow database doesn't delay pixel response

### ✅ CORS Tests

- [ ] **QA-6.1:** CORS headers present
  - Check response headers
  - Access-Control-Allow-Origin: * present
  - Pixel loads from different origins

- [ ] **QA-6.2:** Cross-origin loading
  - Load pixel from different domain
  - Pixel loads successfully
  - No CORS errors

### ✅ Cache Control Tests

- [ ] **QA-7.1:** No caching
  - Check response headers
  - Cache-Control: no-store, no-cache present
  - Pragma: no-cache present
  - Expires: 0 present

- [ ] **QA-7.2:** Repeated requests
  - Load same pixel multiple times
  - Each request hits server (not cached)
  - Check server logs for multiple requests

### ✅ Error Handling Tests

- [ ] **QA-8.1:** Database connection error
  - Stop database
  - Request pixel
  - Still returns 200 and pixel image
  - Error logged but not exposed

- [ ] **QA-8.2:** GeoIP service down
  - Remove GeoIP database file
  - Restart server
  - Request pixel
  - Still works, location is NULL

### ✅ Integration Tests

- [ ] **QA-9.1:** Full tracking flow
  1. Create tracked email in database
  2. Embed pixel in HTML email
  3. Open email
  4. Verify tracking event recorded
  5. Verify all fields populated correctly

- [ ] **QA-9.2:** Multiple emails
  - Create 10 tracked emails
  - Load all 10 pixels
  - Verify 10 separate tracking events
  - Each linked to correct email

---

## Technical Notes

### Why 1x1 Transparent PNG?
- Invisible to email recipient
- Widely supported by email clients
- Small size (43 bytes) - fast to load
- PNG format more reliable than GIF

### Why Async Recording?
- Pixel must return immediately (< 200ms)
- Database write can happen in background
- Email display not delayed by tracking
- Trade-off: very rare case of tracking failure

### Deduplication Strategy
- Email clients often pre-fetch/preview images
- 5-minute window prevents inflated open counts
- Based on IP + User Agent + Email combination
- Balance between accuracy and not missing real opens

### GeoIP Considerations
- City-level only (privacy-friendly)
- Offline database (fast, no API calls)
- Updates needed monthly (GeoLite2 updated regularly)
- Handles edge cases (localhost, private IPs, VPNs)

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.1 - Project Setup](./story-1.1-project-setup-monorepo.md) - API package required
- [Story 1.2 - Database Schema](./story-1.2-database-schema-migrations.md) - TrackingEvents and TrackedEmails tables required

**Blocks (Stories Waiting on This):**
- [Story 1.5 - Real-time Notification System](./story-1.5-realtime-notification-system.md) - Needs tracking events to notify about
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Core tracking functionality required
- [Story 3.1 - Link Click Tracking](./story-3.1-link-click-tracking.md) - Similar tracking pattern

**Related Stories (Helpful Context):**
- [Story 1.3 - Authentication](./story-1.3-user-authentication-registration.md) - User context for tracking

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All developer implementation steps completed
- [ ] All QA verification steps pass
- [ ] Pixel endpoint returns image < 200ms
- [ ] Tracking events recorded in database
- [ ] GeoIP location extraction working
- [ ] Deduplication functioning correctly
- [ ] Manual testing completed
- [ ] Error handling comprehensive

---

## Rollback Plan

If issues arise:
1. Remove tracking routes from app.ts
2. Stop GeoIP service initialization
3. Revert code changes
4. Clean up test data: `DELETE FROM tracking_events; DELETE FROM tracked_emails;`

---

## Future Improvements (Post-MVP)

- [ ] Add WebSocket notification on tracking event
- [ ] Add batch recording for high volume
- [ ] Add tracking event webhooks
- [ ] Add bot detection (filter out crawlers)
- [ ] Add device detection (mobile vs desktop)
- [ ] Add email client detection
- [ ] Add open duration tracking
- [ ] Implement rate limiting per IP
- [ ] Add analytics aggregation

