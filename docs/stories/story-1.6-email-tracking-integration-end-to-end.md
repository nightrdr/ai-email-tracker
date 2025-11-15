# Story 1.6: Email Tracking Integration (End-to-End First Email)

**Story ID:** STORY-1.6  
**Epic:** Epic 1 - Foundation & Core Tracking Infrastructure  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to send an email with tracking enabled  
**So that** I can see when the recipient opens it and receive a real-time notification

---

## Business Value

This story completes the end-to-end tracking flow:
- Validates entire tracking architecture
- Delivers core product value proposition
- Creates "aha moment" for users
- Proves technical feasibility of MVP

---

## Acceptance Criteria

### ✅ AC1: API Endpoint to Prepare Email
- [ ] POST /api/emails/prepare endpoint created
- [ ] Accepts: recipient_email, subject, html_body
- [ ] Generates unique tracking_pixel_id (UUID)
- [ ] Creates TrackedEmail record in database
- [ ] Injects tracking pixel into HTML body
- [ ] Returns modified HTML with pixel embedded

### ✅ AC2: Tracking Pixel Injection
- [ ] Pixel added as `<img>` tag at end of HTML body
- [ ] Pixel URL format: https://api.domain.com/api/track/pixel/{id}.png
- [ ] Pixel has width=1, height=1, display:none
- [ ] Original HTML content preserved

### ✅ AC3: Email Metadata Storage
- [ ] TrackedEmail record created with all fields
- [ ] user_id linked to authenticated user
- [ ] email_account_id recorded
- [ ] message_id stored for future reference
- [ ] tracking_pixel_id unique and indexed
- [ ] sent_at timestamp recorded

### ✅ AC4: End-to-End Flow Working
- [ ] User sends email via Gmail/Outlook
- [ ] Email includes tracking pixel
- [ ] Recipient opens email
- [ ] Pixel loads and triggers tracking endpoint
- [ ] TrackingEvent created in database
- [ ] WebSocket notification sent to user
- [ ] User sees notification in dashboard

### ✅ AC5: Gmail/Outlook Compatibility
- [ ] Pixel works in Gmail web
- [ ] Pixel works in Outlook web
- [ ] Pixel works in Apple Mail
- [ ] Pixel works in mobile email clients

### ✅ AC6: Error Handling
- [ ] Invalid HTML handled gracefully
- [ ] Missing email_account_id returns 400
- [ ] Unauthenticated requests return 401
- [ ] Database errors return 500 with generic message

### ✅ AC7: Notification Dashboard
- [ ] Basic dashboard page shows tracked emails
- [ ] Shows recipient, subject, sent_at
- [ ] Shows open status (opened/not opened)
- [ ] Shows open timestamp when opened
- [ ] Real-time updates when email opened

### ✅ AC8: Testing Interface
- [ ] Simple send email form for testing
- [ ] Form includes: to, subject, body fields
- [ ] Form submits to prepare endpoint
- [ ] Returns tracking URL for manual testing

---

## Requirements Traceability

**PRD Coverage:**
- **FR1:** Complete email open tracking with real-time notifications
- **FR39:** Gmail integration for tracking
- **FR52:** Gmail API for sending emails
- **NFR1:** Time-to-first-tracked-email <5 minutes from signup

**Architecture References:**
- Email Service: Email preparation with pixel injection
- Full Stack Integration: API + Database + WebSocket + Frontend
- Data Flow: Email prep → Send → Open → Track → Notify
- End-to-End Validation: Proves entire MVP architecture

**Epic Context:**
This story is the culmination of Epic 1 - it validates the entire tracking architecture works end-to-end. Success here proves the MVP concept and delivers the core "wow moment" to users.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Email preparation logic, pixel injection, HTML parsing
- **Integration Tests:** Full API flow from prepare to database
- **E2E Tests:** Complete user journey - prepare, send, open, notify
- **Manual Tests:** Real email clients (Gmail, Outlook, Apple Mail)

**Test Environment:**
- Full stack running: Database + Redis + API + Frontend
- Real email accounts for sending/receiving
- Multiple email clients for compatibility testing
- WebSocket connection for notification testing

**Success Metrics:**
- Email preparation: <1 second
- End-to-end flow: <5 minutes (user experience goal)
- Notification delivery: <2 seconds after open
- Pixel compatibility: 95%+ email clients

**Testing Tools:**
- Jest for unit tests
- Real Gmail/Outlook accounts for E2E
- Multiple devices/email clients
- Browser dev tools for debugging

---

## Developer Implementation Checklist

### Phase 1: Create Email Service (45 min)

- [ ] **Step 1.1:** Create email preparation service
  ```typescript
  // packages/api/src/services/email.service.ts
  import { v4 as uuidv4 } from 'uuid';
  import { query } from '../db';
  import { TrackedEmail } from '@ai-tracker/shared/types/database';
  
  export interface PrepareEmailDto {
    user_id: string;
    email_account_id: string;
    recipient_email: string;
    subject: string;
    html_body: string;
    message_id?: string;
  }
  
  export class EmailService {
    async prepareTrackedEmail(dto: PrepareEmailDto): Promise<{
      tracked_email: TrackedEmail;
      modified_html: string;
      tracking_url: string;
    }> {
      const {
        user_id,
        email_account_id,
        recipient_email,
        subject,
        html_body,
        message_id,
      } = dto;
      
      // Generate tracking pixel ID
      const tracking_pixel_id = uuidv4();
      
      // Create tracked email record
      const result = await query(
        `INSERT INTO tracked_emails (
          user_id,
          email_account_id,
          recipient_email,
          subject,
          message_id,
          tracking_pixel_id,
          sent_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
        RETURNING *`,
        [
          user_id,
          email_account_id,
          recipient_email,
          subject,
          message_id || `local-${tracking_pixel_id}`,
          tracking_pixel_id,
        ]
      );
      
      const tracked_email = result.rows[0];
      
      // Inject tracking pixel
      const tracking_url = `${process.env.API_URL || 'http://localhost:3001'}/api/track/pixel/${tracking_pixel_id}.png`;
      const modified_html = this.injectTrackingPixel(html_body, tracking_url);
      
      console.log('Tracked email prepared:', {
        tracking_pixel_id,
        recipient_email,
      });
      
      return {
        tracked_email,
        modified_html,
        tracking_url,
      };
    }
    
    private injectTrackingPixel(html: string, tracking_url: string): string {
      // Create pixel HTML
      const pixelHtml = `<img src="${tracking_url}" alt="" width="1" height="1" style="display:none;border:0;" />`;
      
      // Try to inject before </body> tag
      if (html.toLowerCase().includes('</body>')) {
        return html.replace(/<\/body>/i, `${pixelHtml}</body>`);
      }
      
      // If no </body>, append at end
      return html + pixelHtml;
    }
    
    async getTrackedEmails(user_id: string): Promise<any[]> {
      const result = await query(
        `SELECT 
          te.id,
          te.recipient_email,
          te.subject,
          te.sent_at,
          te.tracking_pixel_id,
          COUNT(tev.id) as open_count,
          MAX(tev.timestamp) as last_opened_at,
          ARRAY_AGG(tev.location) FILTER (WHERE tev.location IS NOT NULL) as locations
        FROM tracked_emails te
        LEFT JOIN tracking_events tev ON tev.tracked_email_id = te.id AND tev.event_type = 'open'
        WHERE te.user_id = $1
        GROUP BY te.id
        ORDER BY te.sent_at DESC
        LIMIT 50`,
        [user_id]
      );
      
      return result.rows.map(row => ({
        ...row,
        is_opened: row.open_count > 0,
        open_count: parseInt(row.open_count),
      }));
    }
  }
  ```

- [ ] **Step 1.2:** Install uuid package
  ```bash
  cd packages/api
  pnpm add uuid
  pnpm add -D @types/uuid
  ```

- [ ] **Step 1.3:** Add API_URL to environment
  ```bash
  # packages/api/.env
  API_URL=http://localhost:3001
  ```

### Phase 2: Create Email Controllers (30 min)

- [ ] **Step 2.1:** Create email controller
  ```typescript
  // packages/api/src/controllers/email.controller.ts
  import { Request, Response } from 'express';
  import { EmailService } from '../services/email.service';
  
  const emailService = new EmailService();
  
  export async function prepareEmail(req: Request, res: Response) {
    try {
      const { recipient_email, subject, html_body, email_account_id } = req.body;
      const user_id = req.user!.user_id;
      
      if (!recipient_email || !subject || !html_body) {
        return res.status(400).json({
          error: 'Missing required fields: recipient_email, subject, html_body',
        });
      }
      
      if (!email_account_id) {
        return res.status(400).json({
          error: 'email_account_id is required',
        });
      }
      
      const result = await emailService.prepareTrackedEmail({
        user_id,
        email_account_id,
        recipient_email,
        subject,
        html_body,
      });
      
      res.status(201).json(result);
    } catch (error: any) {
      console.error('Error preparing email:', error);
      res.status(500).json({
        error: 'Failed to prepare email',
      });
    }
  }
  
  export async function getTrackedEmails(req: Request, res: Response) {
    try {
      const user_id = req.user!.user_id;
      
      const emails = await emailService.getTrackedEmails(user_id);
      
      res.status(200).json({
        emails,
        count: emails.length,
      });
    } catch (error: any) {
      console.error('Error fetching tracked emails:', error);
      res.status(500).json({
        error: 'Failed to fetch tracked emails',
      });
    }
  }
  ```

### Phase 3: Create Email Routes (15 min)

- [ ] **Step 3.1:** Create email routes
  ```typescript
  // packages/api/src/routes/email.routes.ts
  import { Router } from 'express';
  import { prepareEmail, getTrackedEmails } from '../controllers/email.controller';
  import { authenticate } from '../middleware/auth';
  
  const router = Router();
  
  // Protected routes
  router.post('/prepare', authenticate, prepareEmail);
  router.get('/', authenticate, getTrackedEmails);
  
  export default router;
  ```

- [ ] **Step 3.2:** Add routes to app
  ```typescript
  // packages/api/src/app.ts (update)
  import emailRoutes from './routes/email.routes';
  
  app.use('/api/emails', emailRoutes);
  ```

### Phase 4: Create Simple Frontend Dashboard (90 min)

- [ ] **Step 4.1:** Setup Next.js project (if not done)
  ```bash
  cd packages/web
  pnpm add next react react-dom
  pnpm add -D @types/react @types/react-dom
  pnpm add axios socket.io-client
  ```

- [ ] **Step 4.2:** Create Next.js config
  ```javascript
  // packages/web/next.config.js
  /** @type {import('next').NextConfig} */
  module.exports = {
    reactStrictMode: true,
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    },
  };
  ```

- [ ] **Step 4.3:** Create API client
  ```typescript
  // packages/web/src/lib/api.ts
  import axios from 'axios';
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  export const api = axios.create({
    baseURL: API_URL,
  });
  
  // Add auth token to requests
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
  
  export function setAuthToken(token: string) {
    localStorage.setItem('auth_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  export function clearAuthToken() {
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  }
  ```

- [ ] **Step 4.4:** Create WebSocket hook
  ```typescript
  // packages/web/src/hooks/useWebSocket.ts
  import { useEffect, useRef, useState } from 'react';
  import { io, Socket } from 'socket.io-client';
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  
  export function useWebSocket(token: string | null) {
    const socketRef = useRef<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    
    useEffect(() => {
      if (!token) return;
      
      const socket = io(API_URL, {
        path: '/api/ws',
        auth: { token },
        transports: ['websocket', 'polling'],
      });
      
      socketRef.current = socket;
      
      socket.on('connect', () => {
        console.log('WebSocket connected');
        setIsConnected(true);
      });
      
      socket.on('disconnect', () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      });
      
      socket.on('email:opened', (data) => {
        console.log('Email opened:', data);
        setNotifications(prev => [data, ...prev]);
      });
      
      return () => {
        socket.disconnect();
      };
    }, [token]);
    
    return { isConnected, notifications, socket: socketRef.current };
  }
  ```

- [ ] **Step 4.5:** Create dashboard page
  ```typescript
  // packages/web/src/pages/dashboard.tsx
  import { useEffect, useState } from 'react';
  import { api } from '../lib/api';
  import { useWebSocket } from '../hooks/useWebSocket';
  
  export default function Dashboard() {
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const { isConnected, notifications } = useWebSocket(token);
    
    useEffect(() => {
      loadEmails();
    }, []);
    
    useEffect(() => {
      // Reload emails when notification received
      if (notifications.length > 0) {
        loadEmails();
      }
    }, [notifications]);
    
    async function loadEmails() {
      try {
        const response = await api.get('/api/emails');
        setEmails(response.data.emails);
      } catch (error) {
        console.error('Failed to load emails:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (loading) {
      return <div style={{ padding: 20 }}>Loading...</div>;
    }
    
    return (
      <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
        <h1>Email Tracking Dashboard</h1>
        
        <div style={{ marginBottom: 20, padding: 10, background: isConnected ? '#d4edda' : '#f8d7da', borderRadius: 5 }}>
          WebSocket: {isConnected ? '✅ Connected' : '❌ Disconnected'}
        </div>
        
        {notifications.length > 0 && (
          <div style={{ marginBottom: 20, padding: 10, background: '#fff3cd', borderRadius: 5 }}>
            <strong>🎉 Recent Notification:</strong>
            <div>Email opened: {notifications[0].recipient_email}</div>
            <div>Location: {notifications[0].location || 'Unknown'}</div>
            <div>Time: {new Date(notifications[0].opened_at).toLocaleString()}</div>
          </div>
        )}
        
        <h2>Tracked Emails ({emails.length})</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ padding: 10, textAlign: 'left', border: '1px solid #ddd' }}>Recipient</th>
              <th style={{ padding: 10, textAlign: 'left', border: '1px solid #ddd' }}>Subject</th>
              <th style={{ padding: 10, textAlign: 'left', border: '1px solid #ddd' }}>Sent</th>
              <th style={{ padding: 10, textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              <th style={{ padding: 10, textAlign: 'left', border: '1px solid #ddd' }}>Opens</th>
              <th style={{ padding: 10, textAlign: 'left', border: '1px solid #ddd' }}>Last Opened</th>
            </tr>
          </thead>
          <tbody>
            {emails.map((email) => (
              <tr key={email.id}>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{email.recipient_email}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{email.subject}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>
                  {new Date(email.sent_at).toLocaleString()}
                </td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>
                  {email.is_opened ? '✅ Opened' : '⏳ Not Opened'}
                </td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{email.open_count}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>
                  {email.last_opened_at ? new Date(email.last_opened_at).toLocaleString() : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {emails.length === 0 && (
          <p>No tracked emails yet. Send your first email with tracking!</p>
        )}
      </div>
    );
  }
  ```

### Phase 5: Create Test Email Form (30 min)

- [ ] **Step 5.1:** Create send email test page
  ```typescript
  // packages/web/src/pages/send-test-email.tsx
  import { useState } from 'react';
  import { api } from '../lib/api';
  
  export default function SendTestEmail() {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [subject, setSubject] = useState('Test Email with Tracking');
    const [body, setBody] = useState('<p>This is a test email with tracking.</p><p>Best regards,<br/>Your Name</p>');
    const [emailAccountId, setEmailAccountId] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();
      setLoading(true);
      setResult(null);
      
      try {
        const response = await api.post('/api/emails/prepare', {
          recipient_email: recipientEmail,
          subject,
          html_body: body,
          email_account_id: emailAccountId || 'test-account-id', // Use test ID for now
        });
        
        setResult(response.data);
        alert('Email prepared! Copy the HTML and send it via Gmail/Outlook.');
      } catch (error: any) {
        console.error('Error:', error);
        alert('Error: ' + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    }
    
    return (
      <div style={{ padding: 20, fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: '0 auto' }}>
        <h1>Send Test Email with Tracking</h1>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>To:</label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Subject:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: '100%', padding: 8 }}
              required
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5 }}>Body (HTML):</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={{ width: '100%', padding: 8, minHeight: 150 }}
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
          >
            {loading ? 'Preparing...' : 'Prepare Email'}
          </button>
        </form>
        
        {result && (
          <div style={{ marginTop: 30, padding: 20, background: '#f0f0f0', borderRadius: 5 }}>
            <h2>Email Prepared Successfully! ✅</h2>
            
            <div style={{ marginBottom: 15 }}>
              <strong>Tracking ID:</strong>
              <div style={{ fontFamily: 'monospace', background: 'white', padding: 5, marginTop: 5 }}>
                {result.tracked_email.tracking_pixel_id}
              </div>
            </div>
            
            <div style={{ marginBottom: 15 }}>
              <strong>Tracking URL:</strong>
              <div style={{ fontFamily: 'monospace', background: 'white', padding: 5, marginTop: 5, wordBreak: 'break-all' }}>
                {result.tracking_url}
              </div>
            </div>
            
            <div style={{ marginBottom: 15 }}>
              <strong>Modified HTML (with tracking pixel):</strong>
              <textarea
                value={result.modified_html}
                readOnly
                style={{ width: '100%', minHeight: 200, fontFamily: 'monospace', fontSize: 12, padding: 10 }}
              />
            </div>
            
            <div style={{ background: '#fff3cd', padding: 15, borderRadius: 5 }}>
              <strong>📋 Instructions:</strong>
              <ol>
                <li>Copy the modified HTML above</li>
                <li>Open Gmail or Outlook</li>
                <li>Compose new email</li>
                <li>Switch to HTML mode (if needed)</li>
                <li>Paste the HTML</li>
                <li>Send the email</li>
                <li>Open the dashboard to see when it's opened!</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    );
  }
  ```

### Phase 6: End-to-End Testing (60 min)

- [ ] **Step 6.1:** Start all services
  ```bash
  # Terminal 1: Start database and Redis
  docker-compose up -d
  
  # Terminal 2: Start API
  cd packages/api
  pnpm dev
  
  # Terminal 3: Start web
  cd packages/web
  pnpm dev
  ```

- [ ] **Step 6.2:** Create test user
  ```bash
  curl -X POST http://localhost:3001/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"tracking@test.com","password":"Test1234"}'
  ```
  Save the token

- [ ] **Step 6.3:** Create test email account
  ```sql
  -- Connect to database
  INSERT INTO email_accounts (id, user_id, provider, oauth_tokens, email_address)
  VALUES (
    'test-account-id',
    (SELECT id FROM users WHERE email = 'tracking@test.com'),
    'gmail',
    '{"test": true}',
    'tracking@test.com'
  );
  ```

- [ ] **Step 6.4:** Set auth token in browser
  - Open http://localhost:3000/dashboard
  - Open browser console
  - Run: `localStorage.setItem('auth_token', 'YOUR_TOKEN_HERE')`
  - Refresh page

- [ ] **Step 6.5:** Prepare test email
  - Open http://localhost:3000/send-test-email
  - Fill in your real email address as recipient
  - Click "Prepare Email"
  - Copy the modified HTML

- [ ] **Step 6.6:** Send email via Gmail
  - Open Gmail
  - Compose new email
  - Click ⋮ (More options) → Show original HTML (or use a Chrome extension for HTML emails)
  - Paste the HTML
  - Send to yourself

- [ ] **Step 6.7:** Verify tracking
  - Open the dashboard (http://localhost:3000/dashboard)
  - Verify WebSocket shows "Connected"
  - Check for your email in the list
  - Status should be "Not Opened"

- [ ] **Step 6.8:** Open the test email
  - Open your email inbox
  - Open the test email you just sent
  - Wait a few seconds

- [ ] **Step 6.9:** Verify notification
  - Check dashboard - should show notification popup
  - Email status should change to "Opened"
  - Open count should be 1
  - Last opened timestamp should be current time

- [ ] **Step 6.10:** Verify database
  ```sql
  SELECT * FROM tracked_emails WHERE recipient_email = 'YOUR_EMAIL';
  SELECT * FROM tracking_events ORDER BY timestamp DESC LIMIT 5;
  ```

### Phase 7: Unit and Integration Tests (120 min)

- [ ] **Step 7.1:** Write unit tests for email service pixel injection
  - Test pixel is correctly injected before closing body tag
  - Test pixel contains correct tracking_pixel_id
  - Test pixel has correct attributes (1x1, transparent, display:none)
  - Test HTML without body tag handles gracefully
  - Test malformed HTML handles gracefully

- [ ] **Step 7.2:** Write unit tests for email service URL generation
  - Test tracking_url is correctly formatted
  - Test tracking_pixel_id is valid UUID
  - Test URL includes correct domain and path

- [ ] **Step 7.3:** Write unit tests for email preparation validation
  - Test validates required fields (recipient, subject, body)
  - Test validates email format
  - Test validates user owns email_account_id
  - Test throws appropriate errors for invalid input

- [ ] **Step 7.4:** Write integration tests for email preparation endpoint
  - Test POST /api/emails/prepare with valid data returns 201 and tracking data
  - Test endpoint creates TrackedEmail record in database
  - Test endpoint generates unique tracking_pixel_id
  - Test endpoint injects pixel into HTML body
  - Test endpoint requires authentication
  - Test endpoint validates input fields

- [ ] **Step 7.5:** Write integration tests for email listing endpoint
  - Test GET /api/emails returns user's tracked emails only
  - Test response includes open status and event counts
  - Test pagination works correctly
  - Test filtering by date range works
  - Test requires authentication

- [ ] **Step 7.6:** Write integration tests for email detail endpoint
  - Test GET /api/emails/{id} returns full email details
  - Test response includes all tracking events
  - Test events sorted by timestamp
  - Test user can only access their own emails (authorization)

- [ ] **Step 7.7:** Write end-to-end integration test for complete tracking flow
  - Test prepare email → send email → load pixel → create tracking event → WebSocket notification
  - Test tracked_email record created with correct data
  - Test tracking event associated with correct tracked_email
  - Test notification delivered to user via WebSocket
  - Test dashboard can retrieve and display tracking data

- [ ] **Step 7.8:** Write integration tests for email status calculation
  - Test email status shows "Not Opened" when no tracking events exist
  - Test email status shows "Opened" after first open event
  - Test open count increments correctly for multiple opens
  - Test last_opened timestamp reflects most recent event

- [ ] **Step 7.9:** Write integration tests for multi-user isolation
  - Test User A cannot see User B's tracked emails
  - Test User A cannot access User B's email details
  - Test tracking events correctly associated with owning user

- [ ] **Step 7.10:** Run all tests and ensure 70%+ code coverage
  - Execute full test suite for Epic 1
  - Generate coverage report for all packages
  - Verify end-to-end tracking flow fully tested
  - Document any known limitations or edge cases

---

## QA Verification Checklist

### ✅ Email Preparation Tests

- [ ] **QA-1.1:** Valid email preparation
  - POST /api/emails/prepare with valid data
  - Returns 201 status
  - Returns tracked_email object
  - Returns modified_html with pixel
  - Returns tracking_url

- [ ] **QA-1.2:** Pixel injection validation
  - Check modified_html contains `<img>` tag
  - Pixel URL includes tracking_pixel_id
  - Pixel has width=1, height=1
  - Pixel has display:none style
  - Original content preserved

- [ ] **QA-1.3:** Database record creation
  - TrackedEmail created
  - All fields populated correctly
  - tracking_pixel_id is valid UUID
  - sent_at is current timestamp

- [ ] **QA-1.4:** Missing fields validation
  - Missing recipient_email: Returns 400
  - Missing subject: Returns 400
  - Missing html_body: Returns 400
  - Missing email_account_id: Returns 400

- [ ] **QA-1.5:** Authentication
  - No token: Returns 401
  - Invalid token: Returns 401
  - Valid token: Works correctly

### ✅ Dashboard Tests

- [ ] **QA-2.1:** Email list display
  - Dashboard shows all user's tracked emails
  - Shows recipient, subject, sent date
  - Shows open status correctly
  - Shows open count
  - Shows last opened timestamp

- [ ] **QA-2.2:** WebSocket connection status
  - Shows "Connected" when connected
  - Shows "Disconnected" when not connected
  - Visual indicator clear

- [ ] **QA-2.3:** Real-time updates
  - Email opens trigger notification
  - Notification shows immediately (< 2 seconds)
  - Email list updates automatically
  - Open status changes to "Opened"

- [ ] **QA-2.4:** Empty state
  - No emails: Shows appropriate message
  - Message is helpful

### ✅ End-to-End Flow Tests

- [ ] **QA-3.1:** Complete tracking flow
  1. Prepare email via API
  2. Send email with modified HTML
  3. Recipient opens email
  4. Pixel loads
  5. Tracking event recorded
  6. WebSocket notification sent
  7. Dashboard updates
  8. All steps complete successfully

- [ ] **QA-3.2:** Gmail compatibility
  - Send email via Gmail web
  - Email displays correctly
  - Pixel loads successfully
  - Tracking works

- [ ] **QA-3.3:** Outlook compatibility
  - Send email via Outlook web
  - Email displays correctly
  - Pixel loads successfully
  - Tracking works

- [ ] **QA-3.4:** Mobile email client
  - Open email on mobile device
  - Pixel loads (may be delayed)
  - Tracking recorded

### ✅ Multi-User Isolation Tests

- [ ] **QA-4.1:** User A and User B
  - User A sends tracked email
  - User B sends tracked email
  - User A only sees their emails
  - User B only sees their emails
  - No data leakage

- [ ] **QA-4.2:** Notification isolation
  - User A connected to WebSocket
  - User B connected to WebSocket
  - User A's email opened
  - Only User A receives notification
  - User B receives nothing

### ✅ Performance Tests

- [ ] **QA-5.1:** Email preparation speed
  - Prepare email completes in < 500ms
  - No performance degradation with large HTML

- [ ] **QA-5.2:** Dashboard load time
  - Dashboard loads in < 2 seconds
  - Email list loads efficiently
  - No lag with 50+ emails

- [ ] **QA-5.3:** Notification latency
  - Email open to notification < 2 seconds
  - Includes pixel load + tracking + websocket
  - Acceptable user experience

### ✅ Error Handling Tests

- [ ] **QA-6.1:** Invalid HTML
  - Malformed HTML handled gracefully
  - Pixel still injected
  - No errors thrown

- [ ] **QA-6.2:** Network failures
  - Database down: Appropriate error
  - Redis down: Tracking works, no notifications
  - WebSocket down: Dashboard still shows data

- [ ] **QA-6.3:** Email client blocks pixel
  - Some clients block external images
  - Email still displays correctly
  - Tracking simply doesn't fire (expected)

---

## Technical Notes

### HTML Email Limitations
- Not all email clients load external images by default
- Users may need to "Show images" or "Download pictures"
- This is expected behavior - tracking opt-in by recipient

### Why Inject at </body>?
- Ensures pixel loads after email content
- Doesn't interfere with email layout
- Consistent placement across emails

### Testing with Real Email
- Testing requires actual email send
- No way to fully simulate email client behavior
- Recommend using personal email for testing

### WebSocket Connection
- Dashboard must be open to receive real-time notifications
- Notifications not lost if offline (database persists events)
- Can refresh dashboard to see updated status

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.1 - Project Setup](./story-1.1-project-setup-monorepo.md) - Full stack infrastructure
- [Story 1.2 - Database Schema](./story-1.2-database-schema-migrations.md) - All tables required
- [Story 1.3 - User Authentication](./story-1.3-user-authentication-registration.md) - User accounts and JWT
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - Core tracking functionality
- [Story 1.5 - Real-time Notifications](./story-1.5-realtime-notification-system.md) - WebSocket notifications

**Blocks (Stories Waiting on This):**
- [Story 2.1 - Chrome Extension](./story-2.1-chrome-extension-scaffold.md) - Extension extends this foundation
- [Story 5.2 - Email Campaigns](./story-5.2-email-campaigns-sequences.md) - Campaigns use email preparation
- [Story 3.3 - Analytics Dashboard](./story-3.3-dashboard-ui-charts.md) - Dashboard shows tracked emails
- All Epic 2-10 features build on this foundation

**Related Stories (Helpful Context):**
- Completes Epic 1 - Foundation validated end-to-end

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All developer implementation steps completed
- [ ] All QA verification steps pass
- [ ] Prepare email API endpoint working
- [ ] Tracking pixel injected correctly
- [ ] Dashboard displays tracked emails
- [ ] Real-time notifications working
- [ ] End-to-end flow tested successfully
- [ ] Works in Gmail and Outlook
- [ ] Documentation complete

---

## Rollback Plan

If issues arise:
1. Disable email preparation endpoint
2. Revert to manual pixel insertion
3. Dashboard still shows existing tracked emails
4. No data loss

---

## Future Improvements (Post-MVP)

- [ ] Add email preview before sending
- [ ] Add HTML email editor (WYSIWYG)
- [ ] Add email templates
- [ ] Add bulk email preparation
- [ ] Add click tracking links
- [ ] Add attachment tracking
- [ ] Add reply detection
- [ ] Add scheduled send
- [ ] Add A/B testing
- [ ] Add email validation/verification
- [ ] Add spam score checking
- [ ] Add email warmup feature

---

## Success Metrics

This story completes Epic 1. Success measured by:
- User can send first tracked email
- User receives notification when opened
- End-to-end flow takes < 5 minutes
- User experiences "wow moment"
- Technical foundation validated

