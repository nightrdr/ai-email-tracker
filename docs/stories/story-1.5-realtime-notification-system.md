# Story 1.5: Real-time Notification System

**Story ID:** STORY-1.5  
**Epic:** Epic 1 - Foundation & Core Tracking Infrastructure  
**Priority:** P0 - Must Have for MVP  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** to receive instant notifications when someone opens my email  
**So that** I know immediately when my email is read and can follow up in a timely manner

---

## Business Value

Real-time notifications are a key differentiator:
- Creates "wow" moment for users
- Enables timely follow-ups
- Increases engagement with platform
- Makes tracking feel immediate and valuable

---

## Acceptance Criteria

### ✅ AC1: WebSocket Server Setup
- [ ] WebSocket server running on /api/ws endpoint
- [ ] Supports Socket.IO protocol
- [ ] Handles connection/disconnection events
- [ ] Runs alongside HTTP server

### ✅ AC2: Client Authentication
- [ ] WebSocket connections require JWT authentication
- [ ] Token validated on connection
- [ ] User ID extracted from token
- [ ] Unauthenticated connections rejected

### ✅ AC3: User-Specific Rooms
- [ ] Each authenticated user joins their own room
- [ ] Room ID format: user:{user_id}
- [ ] Events broadcast only to user's room
- [ ] Multiple tabs/devices supported

### ✅ AC4: Email Open Notification
- [ ] When email opened, event emitted to user's room
- [ ] Event name: 'email:opened'
- [ ] Event payload includes: tracking_pixel_id, recipient_email, opened_at, location
- [ ] Event sent immediately (< 1 second after open)

### ✅ AC5: Connection Management
- [ ] Track active connections per user
- [ ] Handle reconnection gracefully
- [ ] Clean up on disconnect
- [ ] Log connection statistics

### ✅ AC6: Error Handling
- [ ] Invalid token: disconnect with error message
- [ ] Malformed messages: logged, connection maintained
- [ ] Server errors: logged, user not affected
- [ ] Graceful degradation if WebSocket unavailable

### ✅ AC7: Redis Integration
- [ ] Redis pub/sub for multi-server notifications
- [ ] Tracking events published to Redis channel
- [ ] All WebSocket servers subscribe to channel
- [ ] Enables horizontal scaling

### ✅ AC8: Heartbeat/Ping-Pong
- [ ] Client-server heartbeat every 30 seconds
- [ ] Detect dead connections
- [ ] Auto-cleanup stale connections

---

## Requirements Traceability

**PRD Coverage:**
- **FR1:** Real-time email open notifications on desktop
- **NFR2:** Real-time notifications with latency <5 seconds from email open
- **NFR6:** Horizontal scalability through Redis pub/sub architecture

**Architecture References:**
- Real-time Communication: WebSocket with Socket.IO
- Scalability: Redis pub/sub for multi-server deployment
- Authentication: JWT-based WebSocket connection auth
- Data Models: User rooms, tracking events streaming

**Epic Context:**
This story creates the "wow moment" for users by delivering instant notifications. It transforms tracking from passive data collection to an active, engaging experience that drives user retention.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** WebSocket authentication, room management, message parsing
- **Integration Tests:** Full flow from tracking event to WebSocket delivery
- **Performance Tests:** Notification latency, concurrent connections, throughput
- **E2E Tests:** Browser → tracking event → notification → UI update

**Test Environment:**
- Local: Docker Redis + API server + WebSocket client
- Multiple browser tabs for multi-device testing
- Load testing with 100+ concurrent connections
- Redis pub/sub message flow validation

**Success Metrics:**
- Notification latency: <1 second (target), <5 seconds (requirement)
- Connection stability: 99.9% uptime
- Concurrent connections: Support 1000+ users
- Message delivery: 100% reliability

**Testing Tools:**
- Socket.IO client library for automated testing
- k6 or Artillery for WebSocket load testing
- Browser dev tools for real-time debugging
- Redis CLI for pub/sub inspection

---

## Developer Implementation Checklist

### Phase 1: Install Dependencies (15 min)

- [ ] **Step 1.1:** Install Socket.IO
  ```bash
  cd packages/api
  pnpm add socket.io
  pnpm add -D @types/socket.io
  ```

- [ ] **Step 1.2:** Install Redis client
  ```bash
  pnpm add ioredis
  pnpm add -D @types/ioredis
  ```

- [ ] **Step 1.3:** Install Socket.IO Redis adapter
  ```bash
  pnpm add @socket.io/redis-adapter
  ```

- [ ] **Step 1.4:** Setup Redis with Docker
  ```yaml
  # docker-compose.yml (add to existing file)
  services:
    redis:
      image: redis:7-alpine
      ports:
        - "6379:6379"
      volumes:
        - redis_data:/data
      command: redis-server --appendonly yes
  
  volumes:
    redis_data:
  ```

- [ ] **Step 1.5:** Add Redis environment variable
  ```bash
  # packages/api/.env
  REDIS_URL=redis://localhost:6379
  ```

### Phase 2: Create Redis Service (30 min)

- [ ] **Step 2.1:** Create Redis client
  ```typescript
  // packages/api/src/services/redis.service.ts
  import Redis from 'ioredis';
  
  class RedisService {
    private client: Redis | null = null;
    private publisher: Redis | null = null;
    private subscriber: Redis | null = null;
    
    async connect() {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      
      try {
        // Main client for general operations
        this.client = new Redis(redisUrl, {
          maxRetriesPerRequest: 3,
          retryStrategy: (times) => {
            if (times > 3) {
              console.error('Redis connection failed after 3 retries');
              return null;
            }
            return Math.min(times * 200, 1000);
          },
        });
        
        // Separate publisher for pub/sub
        this.publisher = new Redis(redisUrl);
        
        // Separate subscriber for pub/sub
        this.subscriber = new Redis(redisUrl);
        
        this.client.on('connect', () => {
          console.log('Redis connected successfully');
        });
        
        this.client.on('error', (err) => {
          console.error('Redis error:', err);
        });
        
        console.log('Redis service initialized');
      } catch (error) {
        console.error('Failed to connect to Redis:', error);
        throw error;
      }
    }
    
    getClient(): Redis {
      if (!this.client) {
        throw new Error('Redis client not initialized');
      }
      return this.client;
    }
    
    getPublisher(): Redis {
      if (!this.publisher) {
        throw new Error('Redis publisher not initialized');
      }
      return this.publisher;
    }
    
    getSubscriber(): Redis {
      if (!this.subscriber) {
        throw new Error('Redis subscriber not initialized');
      }
      return this.subscriber;
    }
    
    async disconnect() {
      await this.client?.quit();
      await this.publisher?.quit();
      await this.subscriber?.quit();
    }
  }
  
  export const redisService = new RedisService();
  ```

- [ ] **Step 2.2:** Initialize Redis on startup
  ```typescript
  // packages/api/src/app.ts (update initializeApp)
  import { redisService } from './services/redis.service';
  
  export async function initializeApp() {
    await geoIPService.init();
    await redisService.connect();
  }
  ```

### Phase 3: Create WebSocket Service (60 min)

- [ ] **Step 3.1:** Create WebSocket service
  ```typescript
  // packages/api/src/services/websocket.service.ts
  import { Server as HttpServer } from 'http';
  import { Server, Socket } from 'socket.io';
  import { createAdapter } from '@socket.io/redis-adapter';
  import { verifyToken } from '../utils/jwt';
  import { redisService } from './redis.service';
  
  export interface EmailOpenedPayload {
    tracking_pixel_id: string;
    tracked_email_id: string;
    recipient_email: string;
    opened_at: Date;
    location: string | null;
  }
  
  class WebSocketService {
    private io: Server | null = null;
    private connectedUsers: Map<string, Set<string>> = new Map(); // user_id -> socket_ids
    
    async initialize(httpServer: HttpServer) {
      // Create Socket.IO server
      this.io = new Server(httpServer, {
        cors: {
          origin: process.env.WEB_URL || 'http://localhost:3000',
          credentials: true,
        },
        path: '/api/ws',
        transports: ['websocket', 'polling'],
      });
      
      // Setup Redis adapter for multi-server support
      const pubClient = redisService.getPublisher();
      const subClient = redisService.getSubscriber();
      this.io.adapter(createAdapter(pubClient, subClient));
      
      // Authentication middleware
      this.io.use(async (socket, next) => {
        try {
          const token = socket.handshake.auth.token;
          
          if (!token) {
            return next(new Error('Authentication token required'));
          }
          
          const payload = verifyToken(token);
          socket.data.user_id = payload.user_id;
          socket.data.email = payload.email;
          
          next();
        } catch (error: any) {
          console.error('WebSocket authentication failed:', error.message);
          next(new Error('Authentication failed'));
        }
      });
      
      // Connection handler
      this.io.on('connection', (socket) => {
        this.handleConnection(socket);
      });
      
      // Subscribe to tracking events from Redis
      this.subscribeToTrackingEvents();
      
      console.log('WebSocket service initialized');
    }
    
    private handleConnection(socket: Socket) {
      const user_id = socket.data.user_id;
      const email = socket.data.email;
      
      console.log(`User connected: ${email} (${socket.id})`);
      
      // Join user-specific room
      socket.join(`user:${user_id}`);
      
      // Track connection
      if (!this.connectedUsers.has(user_id)) {
        this.connectedUsers.set(user_id, new Set());
      }
      this.connectedUsers.get(user_id)!.add(socket.id);
      
      // Send welcome message
      socket.emit('connected', {
        message: 'Connected to real-time tracking',
        user_id,
      });
      
      // Handle disconnect
      socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${email} (${reason})`);
        
        const userSockets = this.connectedUsers.get(user_id);
        if (userSockets) {
          userSockets.delete(socket.id);
          if (userSockets.size === 0) {
            this.connectedUsers.delete(user_id);
          }
        }
      });
      
      // Handle ping (heartbeat)
      socket.on('ping', () => {
        socket.emit('pong');
      });
      
      // Handle errors
      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }
    
    private subscribeToTrackingEvents() {
      const subscriber = redisService.getSubscriber();
      
      subscriber.subscribe('tracking:email_opened', (err) => {
        if (err) {
          console.error('Failed to subscribe to tracking events:', err);
          return;
        }
        console.log('Subscribed to tracking:email_opened channel');
      });
      
      subscriber.on('message', (channel, message) => {
        if (channel === 'tracking:email_opened') {
          try {
            const payload = JSON.parse(message);
            this.notifyEmailOpened(payload);
          } catch (error) {
            console.error('Failed to parse tracking event:', error);
          }
        }
      });
    }
    
    async publishEmailOpened(user_id: string, payload: EmailOpenedPayload) {
      const publisher = redisService.getPublisher();
      
      const message = JSON.stringify({
        user_id,
        ...payload,
      });
      
      await publisher.publish('tracking:email_opened', message);
    }
    
    private notifyEmailOpened(data: any) {
      const { user_id, ...payload } = data;
      
      if (!this.io) {
        console.error('Socket.IO not initialized');
        return;
      }
      
      // Emit to user's room
      this.io.to(`user:${user_id}`).emit('email:opened', payload);
      
      console.log(`Email opened notification sent to user ${user_id}`);
    }
    
    getConnectedUserCount(): number {
      return this.connectedUsers.size;
    }
    
    getConnectedSocketCount(): number {
      let count = 0;
      this.connectedUsers.forEach((sockets) => {
        count += sockets.size;
      });
      return count;
    }
    
    isUserConnected(user_id: string): boolean {
      return this.connectedUsers.has(user_id);
    }
  }
  
  export const webSocketService = new WebSocketService();
  ```

### Phase 4: Integrate with Tracking Service (30 min)

- [ ] **Step 4.1:** Update tracking service to publish events
  ```typescript
  // packages/api/src/services/tracking.service.ts (update recordOpen method)
  import { webSocketService } from './websocket.service';
  
  export class TrackingService {
    async recordOpen(dto: RecordOpenDto): Promise<TrackingEvent | null> {
      const { tracking_pixel_id, ip_address, user_agent } = dto;
      
      // ... existing code to find email and check duplicate ...
      
      // Get location from IP
      const location = geoIPService.getLocation(ip_address);
      
      // Record tracking event
      const result = await query(
        `INSERT INTO tracking_events (tracked_email_id, event_type, ip_address, user_agent, location)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [tracked_email_id, EventType.OPEN, ip_address, user_agent, location]
      );
      
      const trackingEvent = result.rows[0];
      
      // Get tracked email details for notification
      const emailDetailsResult = await query(
        `SELECT te.*, te.user_id, te.recipient_email, te.tracking_pixel_id
         FROM tracked_emails te
         WHERE te.id = $1`,
        [tracked_email_id]
      );
      
      const emailDetails = emailDetailsResult.rows[0];
      
      // Publish WebSocket notification
      await webSocketService.publishEmailOpened(emailDetails.user_id, {
        tracking_pixel_id: emailDetails.tracking_pixel_id,
        tracked_email_id: tracked_email_id,
        recipient_email: emailDetails.recipient_email,
        opened_at: trackingEvent.timestamp,
        location,
      });
      
      console.log('Open event recorded and notification sent:', {
        tracking_pixel_id,
        user_id: emailDetails.user_id,
        location,
      });
      
      return trackingEvent;
    }
  }
  ```

### Phase 5: Update Server Initialization (20 min)

- [ ] **Step 5.1:** Update server to use HTTP server
  ```typescript
  // packages/api/src/index.ts (update)
  import { createServer } from 'http';
  import app, { initializeApp } from './app';
  import { webSocketService } from './services/websocket.service';
  
  const PORT = process.env.API_PORT || 3001;
  
  async function start() {
    await initializeApp();
    
    // Create HTTP server
    const httpServer = createServer(app);
    
    // Initialize WebSocket
    await webSocketService.initialize(httpServer);
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket available at ws://localhost:${PORT}/api/ws`);
    });
  }
  
  start().catch(console.error);
  ```

### Phase 6: Create Test Client (30 min)

- [ ] **Step 6.1:** Create WebSocket test client
  ```html
  <!-- packages/api/test/websocket-test.html -->
  <!DOCTYPE html>
  <html>
  <head>
    <title>WebSocket Test Client</title>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .log { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; }
      .log.success { background: #d4edda; }
      .log.error { background: #f8d7da; }
      input { padding: 5px; margin: 5px; width: 300px; }
      button { padding: 5px 15px; }
    </style>
  </head>
  <body>
    <h1>WebSocket Test Client</h1>
    
    <div>
      <input type="text" id="token" placeholder="Enter JWT token" />
      <button onclick="connect()">Connect</button>
      <button onclick="disconnect()">Disconnect</button>
    </div>
    
    <div>
      <button onclick="sendPing()">Send Ping</button>
    </div>
    
    <h2>Connection Status: <span id="status">Disconnected</span></h2>
    
    <h2>Events Log:</h2>
    <div id="logs"></div>
    
    <script>
      let socket = null;
      
      function log(message, type = 'info') {
        const logs = document.getElementById('logs');
        const logEntry = document.createElement('div');
        logEntry.className = `log ${type}`;
        logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logs.insertBefore(logEntry, logs.firstChild);
      }
      
      function updateStatus(status) {
        document.getElementById('status').textContent = status;
      }
      
      function connect() {
        const token = document.getElementById('token').value;
        
        if (!token) {
          log('Please enter a JWT token', 'error');
          return;
        }
        
        log('Connecting to WebSocket...');
        updateStatus('Connecting...');
        
        socket = io('http://localhost:3001', {
          path: '/api/ws',
          auth: { token },
          transports: ['websocket', 'polling'],
        });
        
        socket.on('connect', () => {
          log('Connected successfully!', 'success');
          updateStatus('Connected');
        });
        
        socket.on('connected', (data) => {
          log(`Server says: ${data.message}`, 'success');
          log(`User ID: ${data.user_id}`);
        });
        
        socket.on('email:opened', (data) => {
          log('🎉 EMAIL OPENED!', 'success');
          log(`Recipient: ${data.recipient_email}`);
          log(`Location: ${data.location || 'Unknown'}`);
          log(`Time: ${new Date(data.opened_at).toLocaleString()}`);
          log(`Tracking ID: ${data.tracking_pixel_id}`);
        });
        
        socket.on('disconnect', (reason) => {
          log(`Disconnected: ${reason}`, 'error');
          updateStatus('Disconnected');
        });
        
        socket.on('connect_error', (error) => {
          log(`Connection error: ${error.message}`, 'error');
          updateStatus('Error');
        });
        
        socket.on('pong', () => {
          log('Received pong', 'success');
        });
      }
      
      function disconnect() {
        if (socket) {
          socket.disconnect();
          log('Manually disconnected');
        }
      }
      
      function sendPing() {
        if (socket && socket.connected) {
          socket.emit('ping');
          log('Sent ping');
        } else {
          log('Not connected', 'error');
        }
      }
    </script>
  </body>
  </html>
  ```

### Phase 7: Testing (45 min)

- [ ] **Step 7.1:** Start Redis
  ```bash
  docker-compose up -d redis
  ```

- [ ] **Step 7.2:** Start API server
  ```bash
  cd packages/api
  pnpm dev
  ```
  Verify logs show "Redis connected" and "WebSocket service initialized"

- [ ] **Step 7.3:** Get JWT token
  ```bash
  # Login or register to get token
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"Test1234"}'
  ```
  Copy the token

- [ ] **Step 7.4:** Open test client
  - Open websocket-test.html in browser
  - Paste JWT token
  - Click Connect
  - Verify "Connected successfully!" message

- [ ] **Step 7.5:** Test heartbeat
  - Click "Send Ping"
  - Verify "Received pong" message

- [ ] **Step 7.6:** Trigger email open
  ```bash
  # Load pixel for one of user's tracked emails
  curl "http://localhost:3001/api/track/pixel/YOUR-UUID-HERE.png"
  ```

- [ ] **Step 7.7:** Verify notification received
  - Check test client for "EMAIL OPENED!" message
  - Verify all fields present

- [ ] **Step 7.8:** Test multiple tabs
  - Open test client in another browser tab
  - Connect with same token
  - Trigger email open
  - Verify both tabs receive notification

### Phase 8: Unit and Integration Tests (90 min)

- [ ] **Step 8.1:** Write unit tests for Redis service
  - Test Redis connection establishment
  - Test publish message to channel
  - Test subscribe to channel
  - Test connection error handling
  - Test reconnection logic

- [ ] **Step 8.2:** Write unit tests for WebSocket authentication
  - Test JWT token extraction from query or headers
  - Test valid token allows connection
  - Test invalid token rejects connection
  - Test expired token rejects connection
  - Test user_id extracted correctly from token

- [ ] **Step 8.3:** Write unit tests for user room management
  - Test user joins room on connection
  - Test user leaves room on disconnection
  - Test multiple connections for same user join same room

- [ ] **Step 8.4:** Write unit tests for notification formatting
  - Test email open notification format includes all required fields
  - Test notification payload structure is correct
  - Test timestamp format is valid

- [ ] **Step 8.5:** Write integration tests for WebSocket connection flow
  - Test client connects with valid JWT token successfully
  - Test server authenticates and joins user to correct room
  - Test ping/pong heartbeat mechanism works
  - Test disconnection cleans up resources

- [ ] **Step 8.6:** Write integration tests for notification delivery
  - Test tracking event triggers WebSocket notification
  - Test notification delivered only to correct user (room isolation)
  - Test notification contains correct tracking event data
  - Test multiple connected clients receive same notification

- [ ] **Step 8.7:** Write integration tests for Redis pub/sub
  - Test message published to Redis channel
  - Test all subscribed clients receive message
  - Test pub/sub works across multiple server instances (horizontal scaling)

- [ ] **Step 8.8:** Write integration tests for notification latency
  - Test notification delivered within 5 seconds of tracking event
  - Test notification delivered within 1 second target
  - Test notification order preserved for multiple events

- [ ] **Step 8.9:** Write load tests for concurrent WebSocket connections
  - Test system handles 100+ simultaneous connections
  - Test message delivery under high connection load
  - Test connection stability over time

- [ ] **Step 8.10:** Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Generate coverage report
  - Verify WebSocket and Redis logic fully tested
  - Document performance benchmarks

---

## QA Verification Checklist

### ✅ WebSocket Connection Tests

- [ ] **QA-1.1:** Successful connection
  - Connect with valid JWT token
  - Connection established
  - Receive "connected" event
  - user_id included in response

- [ ] **QA-1.2:** Authentication failure
  - Connect without token
  - Connection rejected
  - Error message: "Authentication token required"

- [ ] **QA-1.3:** Invalid token
  - Connect with invalid/expired token
  - Connection rejected
  - Error message: "Authentication failed"

- [ ] **QA-1.4:** Token validation
  - Connect with valid token
  - Verify server extracts correct user_id
  - Verify user joins correct room

### ✅ Real-time Notification Tests

- [ ] **QA-2.1:** Email open notification
  - Connect WebSocket client
  - Trigger email open for user's tracked email
  - Receive "email:opened" event within 1 second
  - Event contains all required fields

- [ ] **QA-2.2:** Notification data accuracy
  - Check recipient_email matches
  - Check tracking_pixel_id matches
  - Check opened_at is current timestamp
  - Check location populated (if available)

- [ ] **QA-2.3:** User isolation
  - User A connected
  - User B connected
  - Trigger email open for User A
  - User A receives notification
  - User B does NOT receive notification

- [ ] **QA-2.4:** Multiple devices
  - Connect from device/tab 1
  - Connect from device/tab 2 (same user)
  - Trigger email open
  - Both devices receive notification

### ✅ Heartbeat/Ping-Pong Tests

- [ ] **QA-3.1:** Manual ping
  - Send ping event
  - Receive pong event
  - Response time < 100ms

- [ ] **QA-3.2:** Connection keepalive
  - Connect and stay idle
  - Connection remains open
  - No disconnects from timeout

### ✅ Connection Management Tests

- [ ] **QA-4.1:** Clean disconnect
  - Connect
  - Manually disconnect
  - No errors in logs
  - User removed from tracking

- [ ] **QA-4.2:** Reconnection
  - Connect
  - Disconnect
  - Connect again
  - Works without issues
  - Notifications still received

- [ ] **QA-4.3:** Multiple connections per user
  - Open 3 tabs, connect all
  - Verify all receive notifications
  - Close 1 tab
  - Other 2 still work

### ✅ Redis Integration Tests

- [ ] **QA-5.1:** Redis pub/sub
  - Verify Redis channels created
  - Verify subscription to tracking:email_opened
  - Trigger email open
  - Verify message published to Redis

- [ ] **QA-5.2:** Multi-server scaling
  - Start 2 API server instances
  - Connect client to server 1
  - Trigger event that reaches server 2
  - Client receives notification (via Redis)

### ✅ Error Handling Tests

- [ ] **QA-6.1:** Redis connection failure
  - Stop Redis
  - Try to connect WebSocket
  - Server handles error gracefully
  - Connection still possible when Redis returns

- [ ] **QA-6.2:** Malformed event data
  - Manually publish malformed JSON to Redis
  - Server logs error
  - WebSocket connections not affected

- [ ] **QA-6.3:** Network interruption
  - Connect client
  - Simulate network interruption
  - Client auto-reconnects
  - Notifications resume

### ✅ Performance Tests

- [ ] **QA-7.1:** Notification latency
  - Trigger email open
  - Measure time to WebSocket notification
  - Should be < 1 second

- [ ] **QA-7.2:** Concurrent connections
  - Connect 100 clients simultaneously
  - All connect successfully
  - No server performance degradation

- [ ] **QA-7.3:** High-frequency events
  - Trigger 50 email opens rapidly
  - All notifications delivered
  - No messages lost

### ✅ Integration Tests

- [ ] **QA-8.1:** End-to-end flow
  1. User registers and logs in
  2. User connects WebSocket with token
  3. User sends tracked email
  4. Recipient opens email
  5. User receives instant notification
  6. Notification shows in web dashboard

- [ ] **QA-8.2:** Cross-component validation
  - Tracking pixel loads
  - Database event recorded
  - Redis message published
  - WebSocket notification delivered
  - All within < 1 second

---

## Technical Notes

### Why Socket.IO?
- Automatic reconnection
- Fallback to polling if WebSocket blocked
- Built-in room management
- Wide browser support
- Easy authentication middleware

### Why Redis Pub/Sub?
- Enables horizontal scaling
- Multiple API servers can share notifications
- Decouples tracking service from WebSocket
- Reliable message delivery

### Security Considerations
- JWT validation on every connection
- Users can only receive their own notifications
- Room-based isolation prevents data leaks
- Token expiry handled gracefully

### Performance Trade-offs
- Redis adds small latency (~10-50ms)
- Trade-off for horizontal scalability
- Still well under 1-second target

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.2 - Database Schema](./story-1.2-database-schema-migrations.md) - Queries tracked_emails and tracking_events
- [Story 1.3 - User Authentication](./story-1.3-user-authentication-registration.md) - JWT tokens for WebSocket auth
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - Tracking events trigger notifications

**Blocks (Stories Waiting on This):**
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Needs notification system for complete flow
- [Story 3.3 - Analytics Dashboard](./story-3.3-dashboard-ui-charts.md) - Dashboard needs WebSocket for real-time updates
- Frontend notification UI components

**Related Stories (Helpful Context):**
- All tracking stories benefit from real-time notifications

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] All developer implementation steps completed
- [ ] All QA verification steps pass
- [ ] WebSocket server running
- [ ] Redis pub/sub working
- [ ] Email open notifications delivered < 1 second
- [ ] Multiple clients supported per user
- [ ] Manual testing completed
- [ ] No security vulnerabilities

---

## Rollback Plan

If issues arise:
1. Disable WebSocket initialization in index.ts
2. Remove Redis pub/sub from tracking service
3. Revert to HTTP-only API
4. Users can still track emails, just no real-time notifications

---

## Future Improvements (Post-MVP)

- [ ] Add typing indicators for team features
- [ ] Add presence detection (online/offline)
- [ ] Add notification history/replay
- [ ] Add notification preferences
- [ ] Add desktop push notifications
- [ ] Add mobile push notifications
- [ ] Add notification sound customization
- [ ] Add notification batching for high volume
- [ ] Add WebSocket performance metrics
- [ ] Implement backpressure handling

