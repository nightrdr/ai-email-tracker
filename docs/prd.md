# Email Tracker + Campaign Manager Product Requirements Document (PRD)

## Goals and Background Context

### Goals

- Enable users to track email opens, clicks, and engagement in real-time across Gmail and Outlook
- Provide unlimited AI-powered email features (voice cloning, personalization, scoring) without credit restrictions
- Build scalable email campaign and sequence management for sales teams and agencies
- Eliminate artificial email sending limits while promoting best practices with soft warnings
- Deliver mobile-first experience with full feature parity across web, extension, and mobile apps
- Support multi-tier pricing (Free, Individual, Pro, Business) with clear value differentiation
- Enable team collaboration and shared intelligence for business users
- Achieve rapid time-to-value with <5 minute setup and immediate tracking capabilities

### Background Context

Sales professionals, freelancers, and agencies need visibility into email engagement to optimize outreach and close deals faster. Current solutions impose restrictive credit systems for AI features and artificial sending limits that frustrate power users. This product addresses the market gap by offering unlimited AI capabilities at Pro/Business tiers and a trust-based approach to email volume (warnings at 40/day, not hard blocks).

The competitive advantage centers on three pillars: (1) unlimited AI features without credit systems, (2) no artificial email sending restrictions, and (3) 40-50% lower pricing than competitors while delivering superior functionality. The MVP focuses on core tracking accuracy, basic AI features, and rapid market entry, with advanced AI and team features rolling out over 8-12 weeks.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2024-11-14 | 1.0 | Initial PRD creation from product brief | PM Agent |

## Requirements

### Functional

**FR1:** The system shall track email opens with pixel-based tracking and display real-time notifications on desktop and mobile

**FR2:** The system shall track link clicks within emails using redirect-based tracking with full URL analytics

**FR3:** The system shall track attachment downloads with timestamp and recipient identification

**FR4:** The system shall provide location tracking at city-level for email opens (Individual tier and above)

**FR5:** The system shall support individual recipient tracking in group emails to identify which specific recipients opened/clicked

**FR6:** The system shall provide email scheduling with timezone support for send-later functionality

**FR7:** The system shall support unlimited email templates with variable substitution (50 for Individual, unlimited for Pro+)

**FR8:** The system shall generate follow-up reminders when recipients don't reply within a configurable timeframe

**FR9:** The system shall support up to 5 custom email signatures (Individual tier)

**FR10:** The system shall provide AI email scoring that evaluates emails before sending across multiple dimensions (spam triggers, readability, engagement likelihood)

**FR11:** The system shall implement AI voice cloning that learns user writing style from past emails and applies it to AI-generated content

**FR12:** The system shall generate subject line variants using AI with contextual awareness

**FR13:** The system shall provide AI-powered send time suggestions based on recipient engagement patterns

**FR14:** The system shall offer tone adjustment capabilities (formal/casual) for email content using AI

**FR15:** The system shall generate AI-powered email response suggestions based on incoming message context

**FR16:** The system shall support multi-step email sequences with unlimited sends (Pro tier and above)

**FR17:** The system shall provide automated follow-up rules based on recipient behavior (opens, clicks, no response)

**FR18:** The system shall implement conditional sequence branching (if recipient clicks X, send Y)

**FR19:** The system shall support drip campaigns with full tracking and analytics

**FR20:** The system shall enable A/B testing for subject lines, send times, and email content

**FR21:** The system shall predict reply likelihood and suggest optimal follow-up timing (Pro tier)

**FR22:** The system shall auto-personalize emails at scale by researching recipients via LinkedIn and company websites (Pro tier)

**FR23:** The system shall provide real-time email health monitoring with spam detection, reading level optimization, and deliverability scoring

**FR24:** The system shall implement intelligent sequence branching that adapts based on recipient behavior patterns

**FR25:** The system shall provide AI meeting scheduler that learns user preferences and predicts optimal meeting times

**FR26:** The system shall automatically generate and test multiple subject line variants in campaigns

**FR27:** The system shall score contacts by engagement level and potential, alerting when high-value contacts go quiet

**FR28:** The system shall support multi-account management (up to 5 email accounts for Business tier)

**FR29:** The system shall provide unified dashboard across all connected email accounts with per-account analytics

**FR30:** The system shall enable team collaboration with 3-5 user seats, shared templates, and assignment features (Business tier)

**FR31:** The system shall build AI team knowledge base from all team emails and suggest best practices (Business tier)

**FR32:** The system shall analyze incoming email sentiment and detect frustration, urgency, or risk indicators (Business tier)

**FR33:** The system shall detect competitor mentions and provide automated battle cards (Business tier)

**FR34:** The system shall recommend optimal communication channels (email/LinkedIn/phone) using AI (Business tier)

**FR35:** The system shall predict deal closure probability and forecast pipeline from email activity (Business tier)

**FR36:** The system shall draft AI-powered auto-responses for common inquiries with team member approval workflow (Business tier)

**FR37:** The system shall optimize deliverability by detecting issues and suggesting sending pattern improvements (Business tier)

**FR38:** The system shall display warning message when user sends 40+ emails per day per account (soft limit, no hard block)

**FR39:** The system shall integrate with Gmail via Chrome extension with inline tracking indicators

**FR40:** The system shall integrate with Outlook web via Chrome extension

**FR41:** The system shall provide compose window AI assistant within the Chrome extension

**FR42:** The system shall offer web application with campaign builder, analytics dashboard, and settings management

**FR43:** The system shall support Razorpay payment gateway for domestic (India) users with automatic GeoIP detection

**FR44:** The system shall support PayPal payment gateway for international users

**FR45:** The system shall display pricing in local currency based on user location (INR for India, USD for international)

**FR46:** The system shall support monthly and annual billing cycles with 2 months free discount on annual plans

**FR47:** The system shall handle plan upgrades by charging new plan immediately and refunding prorated unused time from old plan

**FR48:** The system shall handle plan downgrades by charging new plan immediately and refunding prorated unused time from old plan

**FR49:** The system shall enforce Free tier limit of 100 total email tracks with no location or link tracking

**FR50:** The system shall remove all branding for Individual tier and above

**FR51:** The system shall display visible branding "Sent with [Product]" on Free tier emails

**FR52:** The system shall integrate with Gmail API for Gmail users for sending emails

**FR53:** The system shall integrate with Microsoft Graph API for Outlook users for sending emails

**FR54:** The system shall support custom domain tracking links for white-label branding (Business tier)

### Non Functional

**NFR1:** The system shall enable time-to-first-tracked-email of less than 5 minutes from signup

**NFR2:** The system shall deliver real-time notifications with latency of less than 5 seconds from email open/click event

**NFR3:** The system shall store tracking data in GDPR-compliant manner with appropriate data retention policies

**NFR4:** The system shall use OpenAI GPT-4o or Anthropic Claude APIs for all AI features (external APIs, no in-house ML models)

**NFR5:** The system shall implement rate limiting and caching for AI API calls to optimize costs

**NFR6:** The system shall use server-side tracking infrastructure with websocket support for real-time updates

**NFR7:** The system shall maintain 99.5% uptime for core tracking functionality

**NFR8:** The system shall support scaling to handle 10,000+ concurrent users during MVP phase

**NFR9:** The system shall process refunds within 5-7 business days to original payment method

**NFR10:** The system shall send email confirmations for all billing changes (upgrades, downgrades, payments)

**NFR11:** The system shall maintain 90-day analytics history for Individual tier and unlimited history for Pro/Business tiers

**NFR12:** The system shall support exportable analytics data in CSV and Excel formats (Pro tier)

**NFR13:** The system shall implement security best practices including encrypted data storage and secure API authentication

**NFR14:** The system shall optimize Chrome extension to use minimal memory (<100MB) and not degrade Gmail/Outlook performance

## User Interface Design Goals

### Overall UX Vision

The product delivers a seamless, unobtrusive tracking and AI assistant experience that integrates naturally into users' existing email workflows. The Chrome extension provides subtle inline indicators and a powerful compose assistant without disrupting the Gmail/Outlook interface. The web dashboard emphasizes clarity and actionability with real-time data visualization, making complex campaign analytics immediately understandable.

### Key Interaction Paradigms

- **Ambient Intelligence:** Tracking and AI features work silently in the background, surfacing insights only when actionable
- **Progressive Disclosure:** Advanced features (sequences, team management) revealed only to users on appropriate tiers
- **One-Click Actions:** Common tasks (track email, apply template, schedule send) accessible with single click from compose window
- **Real-Time Feedback:** Immediate visual confirmation for tracking status, AI scores, and recipient engagement
- **Contextual Assistance:** AI compose assistant appears inline, providing suggestions without requiring context switching

### Core Screens and Views

- **Chrome Extension - Compose Assistant:** Inline panel in Gmail/Outlook with AI scoring, template insertion, scheduling controls
- **Chrome Extension - Tracking Indicators:** Subtle icons showing real-time open/click status directly in inbox
- **Web Dashboard - Analytics Overview:** Main view showing today's activity, recent opens/clicks, engagement trends
- **Web Dashboard - Campaign Builder:** Visual sequence builder with drag-drop nodes for conditional branching
- **Web Dashboard - Contact Management:** Searchable contact list with engagement scores and history
- **Web Dashboard - Templates Library:** Grid view of templates with search, preview, and quick-edit
- **Web Dashboard - Team Performance:** Business tier view comparing team member metrics and pipeline
- **Settings - Billing & Plans:** Clear tier comparison with upgrade CTAs and billing history
- **Settings - Integrations:** One-click authorization for Gmail and Outlook

### Accessibility: WCAG AA

All interfaces will meet WCAG AA standards including:
- Keyboard navigation support for all features
- Screen reader compatibility with ARIA labels
- Minimum 4.5:1 contrast ratios for text
- Resizable text up to 200% without loss of functionality
- Focus indicators for all interactive elements

### Branding

Modern SaaS aesthetic with emphasis on clarity and trust:
- **Color Palette:** Professional blues and greens suggesting reliability and growth
- **Typography:** Clean sans-serif (Inter or similar) prioritizing readability
- **Data Visualization:** Color-blind friendly palette for charts and status indicators
- **Tone:** Confident but approachable, avoiding overly technical jargon
- **Visual Style:** Minimal shadows, generous whitespace, subtle animations for state transitions

### Target Device and Platforms: Web Responsive

- **Web Responsive:** Optimized for desktop (1920x1080 primary) and laptop (1366x768 secondary)
- **Chrome Extension:** Gmail and Outlook web clients, full feature set on desktop browsers
- **Tablet/Mobile Web:** Responsive web design works on tablets and mobile browsers (native apps not in MVP scope)

## Technical Assumptions

### Repository Structure: Monorepo

The project will use a monorepo structure to house all components (web app, API, Chrome extension) in a single repository. This enables:
- Shared code for business logic and types across platforms
- Atomic commits spanning multiple components
- Simplified dependency management
- Consistent tooling and CI/CD configuration
- Easier code review and collaboration

**Rationale:** Given the tight coupling between web app, extension, and API, and the need for rapid iteration, a monorepo reduces overhead and maintains consistency across the stack.

### Service Architecture

**Hybrid: Serverless Functions + Long-Running Services within Monorepo**

- **API Gateway + Serverless Functions:** Core CRUD operations, billing webhooks, and infrequent operations deployed as serverless functions (AWS Lambda or Vercel Functions)
- **Long-Running Services:** Real-time tracking infrastructure, websocket servers, and email sending queues run as containerized services (ECS/Fargate or similar)
- **Static Hosting:** Web dashboard and marketing pages deployed to CDN (Vercel, Cloudflare Pages, or S3+CloudFront)

**Rationale:** Serverless reduces costs during low usage (critical for MVP economics), while long-running services handle real-time requirements that serverless can't efficiently support. This hybrid approach optimizes for both cost and performance.

### Testing Requirements

**Unit + Integration Testing with Manual E2E**

- **Unit Tests:** Required for all business logic, AI prompt engineering, and utility functions (80%+ coverage target)
- **Integration Tests:** API endpoints, payment gateway integration, email provider APIs, tracking pixel/redirect logic
- **Manual E2E:** UI flows tested manually during development; automated E2E tests added post-MVP for critical paths
- **Testing Convenience:** Mock email providers, payment gateways, and AI APIs with local dev fixtures for rapid testing without external dependencies

**Rationale:** Unit and integration tests provide safety net for rapid iteration. Manual E2E acceptable for MVP given speed-to-market priority; automated E2E added as product stabilizes.

### Additional Technical Assumptions and Requests

**Languages & Frameworks:**
- **Backend API:** Node.js with TypeScript, Express or Fastify for APIs
- **Web Dashboard:** React 18+ with TypeScript, Next.js for SSR/SSG and routing
- **Chrome Extension:** TypeScript with React for popup/options, vanilla JS for content scripts
- **Database:** PostgreSQL for relational data (users, subscriptions, contacts), Redis for caching and real-time tracking events

**External APIs & Services:**
- **AI Provider:** OpenAI GPT-4o as primary, Anthropic Claude as fallback
- **Email Sending:** Gmail API for Gmail users, Microsoft Graph API for Outlook users
- **Tracking Infrastructure:** Self-hosted pixel and redirect servers (not third-party tracking service)
- **Payment Gateways:** Razorpay SDK for India, PayPal REST API for international
- **GeoIP:** MaxMind GeoLite2 or IP2Location for location tracking
- **Websockets:** Socket.io or native WebSocket server for real-time notifications

**Deployment & Infrastructure:**
- **Cloud Provider:** AWS (primary) or Vercel for web/API
- **CI/CD:** GitHub Actions for automated testing and deployment
- **Monitoring:** Sentry for error tracking, LogRocket or similar for session replay
- **Analytics:** PostHog or Mixpanel for product analytics

**Security & Compliance:**
- OAuth 2.0 for Gmail/Outlook integration
- JWT-based authentication for API
- Encryption at rest for sensitive data (API keys, email content in queues)
- GDPR compliance requirements including data export and deletion endpoints
- Rate limiting on all public APIs to prevent abuse

**Development Tooling:**
- **Package Manager:** pnpm for monorepo workspace management
- **Linting:** ESLint + Prettier for consistent code style
- **Type Safety:** Strict TypeScript across all projects
- **API Documentation:** OpenAPI/Swagger for API documentation

## Epic List

**Epic 1: Foundation & Core Tracking Infrastructure**
Establish project foundation with authentication, database, basic user management, and pixel-based email open tracking. Deliver end-to-end tracking capability for first tracked email.

**Epic 2: Chrome Extension & Email Integration**
Build Gmail and Outlook Chrome extension with inline tracking indicators, compose assistant interface, and email sending integration via Gmail/Microsoft APIs.

**Epic 3: Advanced Tracking & Analytics Dashboard**
Implement link click tracking, attachment tracking, location detection, and web dashboard with real-time analytics and notification system.

**Epic 4: Email Productivity Features**
Add email scheduling, template system with variables, follow-up reminders, and custom signatures to enable core productivity workflows.

**Epic 5: AI Foundation & Email Scoring**
Integrate OpenAI/Anthropic APIs, implement AI email scoring, and build AI voice cloning (basic version) that learns from user's past emails.

**Epic 6: Billing & Subscription Management**
Implement Razorpay and PayPal payment gateways, subscription tiers (Free/Individual/Pro/Business), upgrade/downgrade flows, and billing dashboard.

**Epic 7: Email Campaigns & Sequences**
Build multi-step email sequences, automated follow-up rules, drip campaign functionality, and sequence tracking analytics (Pro tier).

**Epic 8: Advanced AI Features (Pro Tier)**
Implement AI reply prediction, auto-personalization at scale, email health monitoring, intelligent sequence branching, meeting scheduler, subject line testing, and contact scoring.

**Epic 9: Team Collaboration & Multi-Account (Business Tier)**
Implement multi-account management (up to 5 accounts), team user seats, shared templates, assignment features, and unified team dashboard.

**Epic 10: Enterprise AI Features (Business Tier)**
Build AI team knowledge base, sentiment/risk detection, competitive intelligence monitor, multi-channel orchestration, revenue intelligence, auto-response workflow, and deliverability optimization.

## Epic 1: Foundation & Core Tracking Infrastructure

**Epic Goal:** Establish the foundational technical infrastructure including monorepo setup, database, authentication system, and basic user management. Deliver the core value proposition with pixel-based email open tracking that allows a user to send their first tracked email and receive a notification when it's opened. This epic creates the project skeleton while delivering tangible functionality that validates the entire tracking workflow end-to-end.

### Story 1.1: Project Setup & Monorepo Infrastructure

As a developer,
I want the monorepo configured with all necessary projects and tooling,
so that I can develop across frontend, backend, and extension with consistent standards.

#### Acceptance Criteria

1. Monorepo initialized with pnpm workspaces containing projects: `packages/api`, `packages/web`, `packages/extension`, `packages/shared`
2. TypeScript configured with strict mode and shared tsconfig extending from root
3. ESLint and Prettier configured with consistent rules across all packages
4. Package.json scripts created for `dev`, `build`, `test`, `lint` that work across workspaces
5. Git repository initialized with .gitignore excluding node_modules, dist, .env files
6. GitHub Actions CI pipeline created that runs linting and type-checking on push
7. README created with project structure documentation and setup instructions
8. Environment variable template (.env.example) created for local development

### Story 1.2: Database Schema & Migrations

As a developer,
I want the PostgreSQL database schema designed and migration system configured,
so that I can persist user data, tracking events, and application state reliably.

#### Acceptance Criteria

1. PostgreSQL database provisioned (local Docker for dev, RDS or similar for production)
2. Migration tool configured (node-pg-migrate, Prisma, or TypeORM migrations)
3. Users table created with fields: id, email, password_hash, created_at, updated_at, subscription_tier
4. EmailAccounts table created with fields: id, user_id, provider (gmail/outlook), oauth_tokens (encrypted), email_address
5. TrackedEmails table created with fields: id, user_id, email_account_id, recipient_email, subject, message_id, tracking_pixel_id, sent_at
6. TrackingEvents table created with fields: id, tracked_email_id, event_type (open/click/download), timestamp, ip_address, user_agent, location
7. Database indexes created on frequently queried fields (user_id, tracking_pixel_id, sent_at)
8. Initial migration successfully runs on clean database

### Story 1.3: User Authentication & Registration

As a new user,
I want to create an account with email and password,
so that I can access the email tracking platform.

#### Acceptance Criteria

1. POST /api/auth/register endpoint accepts email and password, creates user with hashed password (bcrypt)
2. Email validation ensures valid format and uniqueness
3. Password validation enforces minimum 8 characters with mix of letters and numbers
4. Registration returns JWT token and user object (excluding password)
5. POST /api/auth/login endpoint validates credentials and returns JWT token
6. JWT tokens expire after 7 days and include user_id and subscription_tier claims
7. Middleware created for protecting authenticated routes that validates JWT
8. Basic error handling returns appropriate status codes (400 for validation, 401 for auth, 500 for server errors)

### Story 1.4: Tracking Pixel Service

As a developer,
I want a pixel tracking service that records email opens,
so that users can see when recipients open their emails.

#### Acceptance Criteria

1. GET /api/track/pixel/:tracking_pixel_id endpoint returns 1x1 transparent PNG image
2. Endpoint records TrackingEvent with type='open', timestamp, IP address, user agent
3. Tracking pixel ID is unique UUID generated when email is prepared for sending
4. GeoIP library integrated (MaxMind GeoLite2) to extract city-level location from IP address
5. Duplicate opens from same recipient within 5 minutes are deduplicated
6. Endpoint responds in < 200ms to avoid email client timeouts
7. CORS headers configured to allow requests from any origin (email clients)
8. Tracking pixel URL format: https://track.domain.com/pixel/:tracking_pixel_id.png

### Story 1.5: Basic Web Dashboard with Authentication

As a user,
I want to log into a web dashboard,
so that I can view my tracked emails and analytics.

#### Acceptance Criteria

1. Next.js web application created with pages: login, register, dashboard
2. Login page with email/password form that calls /api/auth/login
3. Registration page with email/password/confirm-password form that calls /api/auth/register
4. JWT token stored in httpOnly cookie or localStorage
5. Dashboard page protected by authentication check (redirects to login if no valid token)
6. Dashboard displays placeholder message "No tracked emails yet" for new users
7. Navigation header with logout button that clears token and redirects to login
8. Form validation with error messages for invalid inputs

### Story 1.6: Email Open Tracking Integration & First Tracked Email

As a user,
I want to send an email with tracking enabled via my Gmail account,
so that I can see when the recipient opens it.

#### Acceptance Criteria

1. POST /api/emails/send endpoint accepts recipient_email, subject, body_html
2. Endpoint generates unique tracking_pixel_id and inserts tracking pixel into email HTML before closing </body> tag
3. TrackedEmail record created in database with tracking_pixel_id
4. Email sent via Gmail API using user's OAuth credentials (manual OAuth token setup acceptable for MVP)
5. Dashboard displays list of tracked emails showing: recipient, subject, sent time, open status
6. When tracking pixel is loaded, TrackingEvent created and dashboard updates to show "Opened" status with timestamp
7. Dashboard polls /api/emails endpoint every 30 seconds for updates (real-time websockets not required yet)
8. Free tier users see counter "X of 100 tracks used"

### Story 1.7: Desktop Notification System

As a user,
I want to receive a desktop notification when someone opens my tracked email,
so that I can respond promptly to engaged recipients.

#### Acceptance Criteria

1. Web dashboard requests browser notification permission on first login
2. When new tracking event occurs, desktop notification triggered with title "Email Opened" and body "[Recipient] opened [Subject]"
3. Notification only sent for first open of each tracked email (not subsequent opens)
4. Clicking notification navigates browser to dashboard with relevant email highlighted
5. Notifications respect browser "Do Not Disturb" settings
6. If notification permission denied, user sees banner in dashboard offering to enable
7. Notifications work across Chrome, Firefox, Safari, and Edge browsers

## Epic 2: Chrome Extension & Email Integration

**Epic Goal:** Build the Chrome extension that integrates seamlessly with Gmail and Outlook web interfaces, providing inline tracking indicators and a compose assistant. Enable users to send tracked emails directly from their email client with one-click tracking toggle, and authenticate their Gmail/Outlook accounts via OAuth for automated email sending. This epic transforms the product from a standalone web app into an embedded tool within the user's existing workflow.

### Story 2.1: Chrome Extension Manifest & Project Setup

As a developer,
I want the Chrome extension project configured with proper manifest and build system,
so that I can develop and test the extension locally and publish to Chrome Web Store.

#### Acceptance Criteria

1. Extension project created in `packages/extension` with manifest v3 configuration
2. Manifest declares permissions: identity (OAuth), storage, tabs, notifications
3. Manifest defines content scripts for mail.google.com and outlook.live.com/outlook.office365.com
4. Webpack or Vite configured to build TypeScript content scripts and React popup
5. Extension loads successfully in Chrome with "Load unpacked" during development
6. Hot reload configured for development builds
7. Production build script creates minified extension package ready for Chrome Web Store
8. Extension icons created in required sizes (16x16, 48x48, 128x128)

### Story 2.2: Gmail OAuth Integration

As a user,
I want to connect my Gmail account to the extension,
so that the system can send emails on my behalf and access my email history.

#### Acceptance Criteria

1. Extension popup displays "Connect Gmail" button for unauthenticated users
2. Clicking button initiates OAuth 2.0 flow using chrome.identity.launchWebAuthFlow
3. OAuth scopes requested: gmail.send, gmail.readonly, gmail.modify
4. After successful OAuth, extension receives access token and refresh token
5. Tokens stored securely in chrome.storage.local (encrypted)
6. POST /api/email-accounts endpoint saves email account with encrypted tokens
7. Extension displays connected email address and "Disconnect" option
8. Refresh token automatically exchanges for new access token when expired

### Story 2.3: Outlook OAuth Integration

As a user,
I want to connect my Outlook account to the extension,
so that I can use email tracking with my Microsoft email.

#### Acceptance Criteria

1. Extension popup displays "Connect Outlook" button
2. OAuth flow uses Microsoft Graph API with scopes: Mail.Send, Mail.ReadWrite
3. Tokens stored and managed same as Gmail (chrome.storage.local, encrypted)
4. Extension detects whether user is on Gmail or Outlook and shows appropriate connection status
5. Both Gmail and Outlook accounts can be connected simultaneously for Individual+ tiers
6. Extension icon badge shows number of connected accounts
7. Disconnect flow removes tokens from storage and calls DELETE /api/email-accounts/:id

### Story 2.4: Gmail Content Script & Tracking Indicators

As a user,
I want to see which emails in my Gmail inbox have tracking enabled,
so that I can quickly identify tracked conversations.

#### Acceptance Criteria

1. Content script injects into mail.google.com and detects email list view
2. Script calls GET /api/emails/tracked to fetch user's tracked emails
3. For each tracked email in inbox, small tracking icon appears next to subject line
4. Hovering over icon shows tooltip with open status: "Opened 3 times, last at 2:30 PM" or "Not opened yet"
5. Icon color changes based on status: gray (not opened), blue (opened), green (clicked link)
6. Script listens for Gmail DOM changes (SPA navigation) and updates indicators dynamically
7. Indicators only appear for sent emails, not received emails
8. Performance optimized to avoid slowing down Gmail interface

### Story 2.5: Gmail Compose Window Integration

As a user,
I want a tracking toggle and AI assistant panel in my Gmail compose window,
so that I can enable tracking and use productivity features while writing emails.

#### Acceptance Criteria

1. Content script detects Gmail compose window (new email, reply, forward)
2. Extension injects tracking toggle button into compose toolbar
3. Toggle button shows "Enable Tracking" with icon, clicking toggles to "Tracking Enabled" (green)
4. When tracking enabled, small panel appears below compose area with options: "AI Score", "Use Template", "Schedule"
5. Tracking state persists if user switches between compose windows
6. Extension prevents duplicate UI injection if compose window refreshes
7. UI styling matches Gmail's design system (Material Design)
8. Tracking enabled state stored in chrome.storage for each draft

### Story 2.6: Send Tracked Email from Gmail

As a user,
I want to send a tracked email directly from Gmail,
so that I can use my normal workflow while getting tracking insights.

#### Acceptance Criteria

1. Extension intercepts Gmail send button click using MutationObserver or event listeners
2. If tracking enabled, extension extracts email content (recipient, subject, body HTML)
3. Extension calls POST /api/emails/send with tracking_enabled=true
4. API generates tracking pixel and inserts it into email HTML
5. API sends email via Gmail API using user's OAuth token
6. TrackedEmail record created in database
7. User sees confirmation toast "Email sent with tracking enabled"
8. If send fails, user sees error message and email remains in compose window as draft
9. Sent email appears in Gmail Sent folder as normal
10. Free tier users see error if they've reached 100 track limit before sending

### Story 2.7: Outlook Web Integration

As a user,
I want the same tracking functionality in Outlook web,
so that I can use the product regardless of my email provider.

#### Acceptance Criteria

1. Content script detects outlook.live.com and outlook.office365.com domains
2. Tracking toggle injected into Outlook compose toolbar
3. Tracking indicators appear in Outlook inbox email list
4. Send interception works for Outlook compose window
5. Email sent via Microsoft Graph API's sendMail endpoint
6. Tracking pixel insertion works identically to Gmail
7. UI styling matches Outlook's design language
8. All functionality from Gmail stories (2.4-2.6) works equivalently in Outlook

## Epic 3: Advanced Tracking & Analytics Dashboard

**Epic Goal:** Expand tracking capabilities beyond email opens to include link clicks, attachment downloads, and location detection. Build a comprehensive analytics dashboard that displays real-time engagement metrics with visual charts and trends. Implement websocket-based real-time updates so users see instant notifications without polling. This epic transforms basic open tracking into a full engagement intelligence platform.

### Story 3.1: Link Click Tracking with Redirect Service

As a user,
I want to track when recipients click links in my emails,
so that I can measure engagement beyond just opens.

#### Acceptance Criteria

1. Link processing service scans email HTML and replaces all <a href> links with tracking redirect URLs
2. Tracking URL format: https://track.domain.com/link/:link_tracking_id
3. TrackedLinks table created with fields: id, tracked_email_id, original_url, link_tracking_id, created_at
4. GET /api/track/link/:link_tracking_id endpoint records TrackingEvent with type='click' and 302 redirects to original URL
5. Click tracking records timestamp, IP address, user agent, and location
6. Dashboard displays clicked links with count of clicks per link
7. Multiple clicks on same link by same recipient counted separately with timestamps
8. Redirect happens in < 100ms to avoid perceived delay

### Story 3.2: Attachment Download Tracking

As a user,
I want to know when recipients download email attachments,
so that I can gauge their interest in detailed materials.

#### Acceptance Criteria

1. Attachment upload endpoint POST /api/attachments accepts file (max 25MB for MVP)
2. File stored in S3 or equivalent with unique ID
3. Attachment link in email replaced with tracking URL: https://track.domain.com/attachment/:attachment_id
4. GET /api/track/attachment/:attachment_id records TrackingEvent with type='download'
5. Endpoint streams file to user with appropriate Content-Type and Content-Disposition headers
6. Dashboard shows attachment name, size, and download count with timestamps
7. TrackedAttachments table links attachment to tracked_email_id
8. Free tier does not have attachment tracking (Individual tier and above only)

### Story 3.3: Enhanced Analytics Dashboard with Charts

As a user,
I want to view my email engagement metrics in visual charts,
so that I can quickly understand trends and performance.

#### Acceptance Criteria

1. Dashboard homepage displays key metrics cards: Total Sent, Total Opened, Open Rate %, Total Clicks
2. Line chart shows emails sent and opened over last 7/30/90 days (filterable)
3. Bar chart displays top 5 most engaged recipients by total opens + clicks
4. Pie chart shows email status distribution: Opened, Not Opened, Clicked, Downloaded
5. Individual email detail page shows timeline of all events (sent, opened, clicked, downloaded) with timestamps
6. Charts built with Recharts, Chart.js, or similar React charting library
7. Individual tier shows 90-day history, Pro/Business shows unlimited history
8. Dashboard responsive and works on tablet/mobile screen sizes

### Story 3.4: Real-Time Updates with WebSockets

As a user,
I want the dashboard to update instantly when someone opens or clicks my email,
so that I don't have to refresh the page manually.

#### Acceptance Criteria

1. WebSocket server configured using Socket.io or native WebSocket on backend
2. Client establishes WebSocket connection on dashboard page load with JWT authentication
3. When TrackingEvent created, server emits event to connected user's socket
4. Dashboard receives event and updates UI: adds new event to timeline, increments counters, updates charts
5. Connection automatically reconnects if dropped with exponential backoff
6. Fallback to 30-second polling if WebSocket connection fails (firewall issues)
7. Socket room per user ensures events only sent to correct user
8. Desktop notification triggered via WebSocket event (not polling)

### Story 3.5: Contact Management & Engagement History

As a user,
I want to see all my contacts and their engagement history,
so that I can identify my most engaged prospects.

#### Acceptance Criteria

1. Contacts page displays list of all email recipients with columns: Name, Email, Total Sent, Total Opened, Last Engaged
2. Contacts automatically created when email sent to new recipient
3. Clicking contact shows detail page with all emails sent to them and engagement timeline
4. Contact detail shows aggregate metrics: Open Rate, Avg Time to First Open, Most Engaged Day/Time
5. Search functionality filters contacts by name or email
6. Sort contacts by: Most Recent, Most Engaged, Least Engaged, Alphabetical
7. Contact marked as "Hot" (green), "Warm" (yellow), "Cold" (gray) based on recent engagement
8. Contacts table paginated (50 per page) for performance

### Story 3.6: Email Sending Volume Warning System

As a user,
I want to receive a warning when I send 40+ emails in a day,
so that I'm aware of potential deliverability risks.

#### Acceptance Criteria

1. Backend tracks daily email send count per email account (resets at midnight UTC)
2. When user sends 40th email in a day, warning modal appears: "You've sent 40 emails today. Consider spreading volume to maintain deliverability."
3. Warning includes "Don't show again today" checkbox and "Learn More" link to deliverability best practices article
4. User can proceed with sending after acknowledging warning
5. Warning appears again at 60, 80, 100 emails with escalating language
6. Dashboard settings page shows "Today's Send Count: X emails" with progress bar
7. No hard limit enforced - user can send unlimited emails after warning
8. Business tier with 5 accounts tracks 40/day limit separately per account

## Epic 4: Email Productivity Features

**Epic Goal:** Add core productivity features that make email workflows more efficient: email scheduling with timezone support, a robust template system with variable substitution, follow-up reminders, and custom signatures. These features deliver immediate value to Individual tier users and establish the foundation for more advanced Pro tier automation. This epic focuses on time-saving tools that complement tracking rather than requiring AI.

### Story 4.1: Email Scheduling System

As a user,
I want to schedule emails to send at a specific future time,
so that I can optimize send times for different timezones and recipient availability.

#### Acceptance Criteria

1. Compose assistant panel includes "Schedule Send" button
2. Clicking button opens date/time picker with timezone selector (user's timezone auto-detected)
3. Scheduled email stored in ScheduledEmails table with: id, user_id, recipient_email, subject, body_html, scheduled_for (timestamp), timezone, tracking_enabled
4. Background job (cron or queue worker) runs every minute checking for emails where scheduled_for <= now
5. When scheduled time reached, email sent via normal send pipeline (with tracking if enabled)
6. Scheduled emails appear in dashboard "Scheduled" tab showing: recipient, subject, send time, cancel option
7. User can cancel scheduled email before send time (moves to Drafts)
8. After sending, scheduled email moves to Sent tab with normal tracking
9. Timezone conversion displayed clearly: "Will send Jan 15, 3:00 PM EST (8:00 PM GMT)"

### Story 4.2: Email Template System with Variables

As a user,
I want to create and use email templates with dynamic variables,
so that I can quickly send personalized emails without retyping common content.

#### Acceptance Criteria

1. Templates page in dashboard with "Create Template" button
2. Template editor with fields: Name, Subject (supports variables), Body HTML (rich text editor)
3. Variable syntax: {{first_name}}, {{company}}, {{custom_field}}
4. Template preview shows example with sample variable values filled in
5. Templates table in database: id, user_id, name, subject_template, body_template, created_at
6. Compose assistant "Use Template" button opens template selector dropdown
7. Selecting template populates compose window with template content
8. Variable insertion modal prompts user to fill in values before sending
9. Individual tier: 50 template limit, Pro/Business: unlimited
10. Template library includes 5 pre-built templates: Introduction, Follow-up, Meeting Request, Thank You, Sales Pitch

### Story 4.3: Follow-Up Reminder System

As a user,
I want automatic reminders to follow up if a recipient doesn't reply,
so that I never miss important conversations.

#### Acceptance Criteria

1. Compose assistant includes "Remind if No Reply" toggle with configurable days (1, 3, 5, 7)
2. When enabled, creates FollowUpReminder record: id, tracked_email_id, remind_after_days, status (pending/completed/cancelled)
3. Background job checks daily for reminders where (sent_date + remind_after_days) <= today AND no reply received
4. Gmail/Outlook API checked for replies to original email (matching In-Reply-To or References headers)
5. If no reply found, desktop notification sent: "No reply from [Recipient] on [Subject]. Follow up now?"
6. Dashboard "Follow-Ups" tab lists all pending reminders with "Mark as Done" or "Send Follow-Up" actions
7. "Send Follow-Up" button opens compose window with original email quoted and template suggestion
8. If recipient replies, reminder automatically marked completed
9. Individual tier: unlimited reminders

### Story 4.4: Custom Email Signatures

As a user,
I want to create multiple email signatures for different contexts,
so that I can present professionally across various scenarios.

#### Acceptance Criteria

1. Settings page includes "Signatures" section with "Add Signature" button (max 5 for Individual tier)
2. Signature editor supports rich text: bold, italic, links, images (logo upload)
3. Signatures table: id, user_id, name, html_content, is_default, created_at
4. One signature marked as default, automatically appended to all emails
5. Compose assistant dropdown allows selecting different signature for current email
6. Signature inserted at cursor position or appended to end of email body
7. Variables supported in signatures: {{full_name}}, {{title}}, {{company}}, {{phone}}, {{website}}
8. Preview shows signature exactly as it will appear in sent email
9. Individual tier: 5 signatures, Pro/Business: unlimited

### Story 4.5: Quick Reply Shortcuts

As a user,
I want keyboard shortcuts for common email responses,
so that I can respond faster to frequent inquiries.

#### Acceptance Criteria

1. Settings page "Quick Replies" section with predefined shortcuts: "ty" → "Thank you!", "lmk" → "Let me know if you have questions"
2. User can add custom shortcuts (max 20 for Individual tier)
3. In compose window, typing shortcut followed by space automatically expands to full text
4. Expansion happens client-side with visual indication (text briefly highlighted)
5. Shortcut expansion can be undone with Cmd/Ctrl+Z
6. Quick replies support variables: "intro {{first_name}}" → "Hi {{first_name}}, nice to meet you!"
7. QuickReplies table: id, user_id, shortcut, expanded_text
8. Default quick replies provided: ty, lmk, fu (follow up), np (no problem), wdyt (what do you think)

## Epic 5: AI Foundation & Email Scoring

**Epic Goal:** Integrate OpenAI/Anthropic AI providers into the platform and deliver the first AI-powered features: email scoring that evaluates emails before sending, and basic AI voice cloning that learns the user's writing style from their sent emails. Establish the AI infrastructure and prompt engineering patterns that will support all future AI features. This epic introduces the product's key differentiator - unlimited AI capabilities.

### Story 5.1: AI Provider Integration & Configuration

As a developer,
I want OpenAI and Anthropic APIs integrated with proper configuration management,
so that I can use AI features across the platform with fallback support.

#### Acceptance Criteria

1. Environment variables configured for API keys: OPENAI_API_KEY, ANTHROPIC_API_KEY
2. AI service module created with methods: generateCompletion(prompt, provider), streamCompletion(prompt, provider)
3. Default provider set to OpenAI GPT-4o, fallback to Anthropic Claude if OpenAI fails
4. Rate limiting implemented: max 10 requests/minute per user for Individual tier
5. Token counting and cost tracking logged for monitoring purposes
6. Caching layer (Redis) for identical prompts with 1-hour TTL
7. Error handling with user-friendly messages: "AI service temporarily unavailable"
8. Admin dashboard shows AI usage metrics: total calls, tokens consumed, costs by tier

### Story 5.2: AI Email Scoring Engine

As a user,
I want my email scored by AI before sending,
so that I can improve clarity, engagement, and deliverability.

#### Acceptance Criteria

1. "AI Score" button in compose assistant triggers scoring of current email
2. API endpoint POST /api/ai/score accepts email subject and body
3. AI prompt evaluates email across dimensions: spam likelihood (0-100), reading level grade, engagement prediction (0-100), mobile readability (0-100), deliverability score (0-100)
4. Response returns overall score (0-100) and dimension breakdown with actionable suggestions
5. Compose assistant displays score with visual indicator: red (<50), yellow (50-75), green (>75)
6. Clicking score shows detailed breakdown panel with suggestions like "Subject line too long (60 chars, aim for 40)" or "3 spam trigger words detected: 'free', 'guaranteed', 'act now'"
7. User can re-score after making edits to see improvement
8. Individual tier: 100 scores/month soft limit (unlimited for Pro/Business)
9. Scoring completes in < 5 seconds

### Story 5.3: User Email History Analysis for Voice Cloning

As a developer,
I want to fetch and analyze the user's past sent emails,
so that AI can learn their writing style for voice cloning.

#### Acceptance Criteria

1. Background job POST /api/ai/analyze-writing-style triggered when user connects email account or manually via settings
2. Job fetches last 50 sent emails from user's Gmail/Outlook via API
3. Email content extracted (subject, body) and personal information redacted (names, emails, phone numbers)
4. Emails concatenated and sent to AI with prompt: "Analyze this person's writing style across dimensions: tone, vocabulary complexity, sentence structure, common phrases, salutation/closing style"
5. AI response stored in UserWritingProfile table: user_id, style_summary (JSON), analyzed_at, email_count
6. Profile includes: formality_level, avg_sentence_length, common_words, signature_patterns, tone_description
7. User can view writing profile in Settings → AI Features with summary: "Your style: Professional yet approachable, concise sentences, business casual tone"
8. Analysis runs in background, user notified when complete
9. Profile updated automatically every 30 days or manually via "Re-analyze" button

### Story 5.4: AI-Generated Email with Voice Cloning

As a user,
I want AI to draft emails that sound like me,
so that I can save time while maintaining my personal voice.

#### Acceptance Criteria

1. Compose assistant "AI Draft Email" button opens dialog: "What do you want to say?" (short prompt input)
2. User enters intent like "Follow up on proposal sent last week, ask if they have questions"
3. POST /api/ai/draft-email sends: user_prompt, user_writing_profile, context (recipient name, previous emails)
4. AI prompt: "Draft email matching this writing style: [profile]. Intent: [prompt]. Make it sound authentic to the writer."
5. Generated email appears in compose window with banner "AI Draft - Review before sending"
6. User can regenerate with "Try Again" or edit directly
7. Compose assistant shows "AI Drafted" badge and tracks usage for metrics
8. Individual tier: 100 AI drafts/month, Pro/Business: unlimited
9. Draft generation completes in < 8 seconds

### Story 5.5: AI Subject Line Generation

As a user,
I want AI to generate compelling subject lines,
so that my emails get higher open rates.

#### Acceptance Criteria

1. Compose assistant "Generate Subject" button appears when subject line empty or selected
2. Clicking button sends email body to AI with prompt: "Generate 3 compelling subject line variants for this email. Match writing style: [profile]. Max 50 characters."
3. Modal displays 3 subject line options with predicted open rate (AI estimation)
4. User clicks subject to insert into email or "Generate More" for 3 new options
5. Subject lines avoid spam triggers and optimize for mobile preview (40-50 chars)
6. User can provide context: "Make it urgent" or "Keep it casual" to refine generation
7. Individual tier: 50 generations/month, Pro/Business: unlimited
8. Generation completes in < 4 seconds

## Epic 6: Billing & Subscription Management

**Epic Goal:** Implement complete payment processing with Razorpay (India) and PayPal (international), subscription tier enforcement (Free, Individual, Pro, Business), upgrade/downgrade flows with prorated refunds, and a billing dashboard. Enable GeoIP-based gateway selection and currency display. This epic monetizes the platform and enforces tier-based feature access.

### Story 6.1: Payment Gateway Integration (Razorpay & PayPal)

As a user,
I want to subscribe to a paid plan using my preferred payment method,
so that I can access premium features.

#### Acceptance Criteria

1. Razorpay and PayPal SDKs integrated into backend
2. GeoIP detection (using same library as tracking) determines user location on checkout page
3. India users see Razorpay with prices in INR, all others see PayPal with prices in USD
4. Checkout page displays plan comparison: Free, Individual ($6.99/mo), Pro ($29/mo), Business ($99/mo)
5. User selects monthly or annual billing (annual shows "Save 2 months" badge)
6. Payment flow: User clicks "Subscribe" → Gateway modal opens → User completes payment → Webhook confirms → Subscription activated
7. Subscriptions table: id, user_id, tier, billing_cycle, amount, currency, gateway, gateway_subscription_id, status, current_period_end
8. Successful payment creates subscription record and updates user.subscription_tier
9. Payment failure shows error message and allows retry

### Story 6.2: Subscription Tier Enforcement & Feature Gates

As a developer,
I want subscription tiers enforced across all features,
so that users can only access features they've paid for.

#### Acceptance Criteria

1. Middleware function checkFeatureAccess(feature_name, user) returns true/false based on subscription_tier
2. Feature gate configuration defined: { ai_unlimited: ['pro', 'business'], sequences: ['pro', 'business'], multi_account: ['business'], team_features: ['business'] }
3. Free tier enforced: 100 total email tracks, no link/location tracking, no AI features, branding visible
4. Individual tier enforced: 1 email account, 100 AI actions/month, 50 templates, 5 signatures
5. Pro tier: Unlimited AI, unlimited templates/signatures, sequences enabled
6. Business tier: 5 email accounts, team features enabled
7. Feature gate UI: Locked features show upgrade CTA "Upgrade to Pro to unlock sequences"
8. API endpoints return 403 Forbidden with upgrade message if user lacks access
9. Dashboard displays current tier with usage meters: "AI Actions: 45/100 this month"

### Story 6.3: Subscription Upgrade/Downgrade with Prorated Refunds

As a user,
I want to upgrade or downgrade my plan,
so that I can adjust my subscription as my needs change.

#### Acceptance Criteria

1. Settings → Billing page shows "Change Plan" button with plan comparison modal
2. Upgrade flow: Calculate unused days: (days_remaining / days_in_period) × old_plan_price
3. Charge new plan amount immediately via payment gateway
4. Issue refund for unused portion to original payment method
5. Update subscription record: tier, amount, current_period_end (resets to upgrade date + 30 days)
6. Email sent with invoice showing: Charge: $29.00, Refund: $3.50, Net: $25.50
7. Downgrade flow: Same calculation and process as upgrade
8. Annual plan handling: Calculate prorated refund based on days_remaining / 365 × annual_price
9. New plan activated immediately after successful payment
10. If payment fails, user remains on old plan with error message

### Story 6.4: Webhook Handling for Payment Events

As a developer,
I want webhooks from Razorpay and PayPal processed reliably,
so that subscription status stays synchronized.

#### Acceptance Criteria

1. POST /api/webhooks/razorpay endpoint verifies signature and processes events
2. POST /api/webhooks/paypal endpoint verifies signature and processes events
3. Events handled: payment.success, payment.failed, subscription.renewed, subscription.cancelled
4. payment.success: Update subscription status to 'active', extend current_period_end
5. payment.failed: Update status to 'past_due', send email notification, allow 3-day grace period
6. subscription.cancelled: Update status to 'cancelled', schedule downgrade to Free tier at period end
7. Webhook events logged in WebhookEvents table for debugging
8. Idempotency ensured: Duplicate webhook events ignored based on gateway_event_id
9. Failed webhook processing retried with exponential backoff

### Story 6.5: Billing Dashboard & Invoice Management

As a user,
I want to view my billing history and download invoices,
so that I can track my expenses and manage accounting.

#### Acceptance Criteria

1. Settings → Billing page displays current plan, billing cycle, next billing date
2. "Payment History" section shows table: Date, Description, Amount, Status, Invoice
3. Each row has "Download Invoice" button generating PDF invoice
4. Invoice includes: Company logo, invoice number, date, user details, line items, payment method
5. Invoice PDF generated using library like PDFKit or Puppeteer
6. "Update Payment Method" button opens gateway modal to change card/PayPal account
7. "Cancel Subscription" button with confirmation: "Your access continues until [period_end], then downgrades to Free"
8. Usage meters displayed: "This month: 45 AI actions, 320 emails tracked"
9. Next charge preview: "Next charge: $29.00 on Feb 1, 2025"

## Epic 7: Email Campaigns & Sequences

**Epic Goal:** Build multi-step email sequence functionality for Pro tier users, enabling automated campaigns with conditional branching, follow-up rules, and drip campaigns. Implement sequence builder UI, sequence tracking, and A/B testing capabilities. This epic delivers the core automation that differentiates Pro tier from Individual tier.

### Story 7.1: Sequence Data Model & Campaign Builder UI

As a Pro user,
I want to create multi-step email sequences visually,
so that I can automate follow-up campaigns without manual sending.

#### Acceptance Criteria

1. Sequences table: id, user_id, name, status (draft/active/paused), created_at
2. SequenceSteps table: id, sequence_id, step_number, delay_days, email_subject_template, email_body_template, condition_type (none/opened/clicked/not_opened)
3. Campaign Builder page with drag-drop visual editor (React Flow or similar)
4. User adds steps: "Send Email" node with template selector and delay configuration
5. User adds conditional branches: "If opened → Send Step 2A, If not opened → Send Step 2B"
6. Step editor includes: Delay (X days after previous step), Email template, Send time preference (morning/afternoon/evening)
7. Sequence saved as draft until user clicks "Activate"
8. Active sequences appear in dashboard "Campaigns" tab
9. Maximum 10 steps per sequence for MVP

### Story 7.2: Sequence Enrollment & Execution Engine

As a Pro user,
I want contacts automatically enrolled in sequences,
so that emails send at the right times without manual intervention.

#### Acceptance Criteria

1. Contacts can be enrolled manually: Select contact → "Add to Sequence" → Choose sequence
2. Bulk enrollment: Select multiple contacts → "Enroll in Sequence"
3. SequenceEnrollments table: id, sequence_id, contact_id, current_step, status (active/completed/unsubscribed), enrolled_at, next_send_at
4. Background job runs every hour checking for enrollments where next_send_at <= now
5. When triggered, job sends email for current step, updates current_step, calculates next_send_at
6. Conditional logic evaluated: Check if previous email opened/clicked, determine next step branch
7. When sequence completed (all steps sent), enrollment marked completed
8. Contact receives sequence emails with unsubscribe link at bottom
9. Clicking unsubscribe updates enrollment status and stops future emails

### Story 7.3: Sequence Analytics & Performance Tracking

As a Pro user,
I want to see how my sequences perform,
so that I can optimize campaigns for better engagement.

#### Acceptance Criteria

1. Sequence detail page shows metrics: Total Enrolled, Active, Completed, Unsubscribed
2. Step-by-step breakdown: Step 1: 100 sent, 45 opened (45%), 12 clicked (12%)
3. Funnel visualization showing drop-off at each step
4. Individual contact progress: Contact list with current step and last interaction
5. Best performing time analysis: "Most opens happen at 9-11 AM"
6. Export sequence results as CSV: contact_email, steps_completed, total_opens, total_clicks, status
7. Real-time updates via WebSocket when sequence emails opened/clicked
8. Comparison view for A/B tested sequences (when implemented)

### Story 7.4: A/B Testing for Sequences

As a Pro user,
I want to A/B test subject lines or email content in sequences,
so that I can discover what resonates best with my audience.

#### Acceptance Criteria

1. Sequence step editor includes "Enable A/B Test" toggle
2. When enabled, user creates Variant A and Variant B (different subject or body)
3. Split percentage configurable: 50/50, 60/40, 70/30
4. When step sends, variant randomly assigned to each contact based on split
5. SequenceStepVariants table: id, step_id, variant_name, subject_template, body_template, send_percentage
6. Analytics show variant performance: Variant A: 48% open rate, Variant B: 52% open rate
7. "Declare Winner" button stops test and uses best-performing variant for future sends
8. Maximum 2 variants per step for MVP
9. A/B test results exportable

### Story 7.5: Automated Follow-Up Rules

As a Pro user,
I want automatic behavior-based follow-ups,
so that engaged contacts receive different messaging than unengaged ones.

#### Acceptance Criteria

1. Sequence step includes condition rules: "If opened", "If clicked link", "If not opened after X days", "If replied"
2. Rule builder UI with dropdown conditions and delay inputs
3. Example: "If email opened within 2 days → Send Step 3, If not opened → Send Reminder Step"
4. Sequence execution engine evaluates rules before sending next step
5. Reply detection: Background job checks Gmail/Outlook API for replies matching In-Reply-To header
6. If reply detected, enrollment marked "Replied" and sequence paused (optional: automatically completed)
7. Link click tracking integrated: If specific link clicked → Trigger branch
8. Rules support "Wait until" logic: "Wait until opened (max 5 days) → Then send next"

## Epic 8: Advanced AI Features (Pro Tier)

**Epic Goal:** Implement the full suite of advanced AI features for Pro tier: reply prediction, auto-personalization at scale, real-time email health monitoring, intelligent sequence branching, AI meeting scheduler, automated subject line testing, and contact scoring. These features represent the product's AI advantage and justify the Pro tier premium.

### Story 8.1: AI Smart Reply Prediction

As a Pro user,
I want AI to predict reply likelihood and suggest optimal follow-up timing,
so that I can prioritize high-potential conversations.

#### Acceptance Criteria

1. After sending tracked email, AI analyzes email content and recipient engagement history
2. POST /api/ai/predict-reply endpoint calculates: reply_likelihood (0-100), suggested_followup_time (timestamp), recommended_tone, key_talking_points
3. Prediction displayed in email detail page: "65% likely to reply within 2 days"
4. Dashboard "Priority Inbox" shows emails sorted by reply likelihood (high to low)
5. AI considers factors: email length, question count, call-to-action clarity, past recipient responsiveness
6. Notification sent at optimal follow-up time: "Good time to follow up with [Recipient]"
7. Prediction updates in real-time as recipient engagement changes (opened, clicked)
8. Accuracy tracking: Log actual replies vs predictions for model improvement feedback

### Story 8.2: AI Auto-Personalization at Scale

As a Pro user,
I want AI to automatically personalize emails by researching recipients,
so that I can send relevant, customized messages without manual research.

#### Acceptance Criteria

1. Contact enrichment service integration (Clearbit API, Hunter.io, or web scraping)
2. POST /api/ai/enrich-contact endpoint accepts email → Returns: name, company, title, LinkedIn URL, company website, recent news
3. When user composes email, "AI Personalize" button triggers research + personalization
4. AI generates personalized opening line based on recipient data: "Saw your recent post about [topic] on LinkedIn..."
5. Value proposition tailored to role/industry: Sales → ROI focus, Engineering → Technical features
6. Custom CTA based on company data: Startup → "Let's chat about scaling", Enterprise → "Schedule demo with team"
7. Personalization preview shown before inserting into email
8. ContactEnrichmentCache table stores enriched data (24-hour TTL) to avoid redundant API calls
9. Bulk personalization: Select 50 contacts → AI personalizes template for each → Review before sending

### Story 8.3: AI Email Health Monitor (Real-Time)

As a Pro user,
I want real-time AI feedback as I compose emails,
so that I can optimize for engagement and deliverability while writing.

#### Acceptance Criteria

1. Compose assistant displays live health score that updates as user types (debounced every 2 seconds)
2. Score panel shows: Spam Score (0-100), Reading Level (grade), Engagement Prediction (0-100), Mobile Readability (0-100), Deliverability (0-100)
3. Real-time suggestions appear inline: "⚠️ Subject line 65 chars – trim to 50 for mobile"
4. Spam trigger detection highlights words: "free" → "Consider alternatives to avoid spam filters"
5. Reading level optimization: "12th grade level – simplify for broader appeal"
6. Engagement indicators: "✓ Strong CTA", "⚠️ No question – add to encourage reply", "✓ Personalized greeting"
7. Mobile preview shows email rendering on phone screen
8. Deliverability checks: Link count, image-to-text ratio, HTML complexity
9. All checks complete in < 2 seconds to feel instant

### Story 8.4: Intelligent Sequence Branching (Behavior-Based)

As a Pro user,
I want sequences that automatically adapt based on recipient behavior,
so that engaged contacts get different messaging than unengaged ones.

#### Acceptance Criteria

1. Sequence builder supports advanced branching: "If opened but no click → Case study", "If clicked but no reply → Limited-time offer"
2. Behavior tracking integrated: Opened count, clicked links, time on page (if tracked URL), reply status
3. AI recommends branches: "Based on patterns, contacts who click but don't reply respond better to urgency"
4. Auto-optimization mode: AI tests different branches, learns which performs better, adjusts split over time
5. Engagement scoring per contact: Hot (3+ opens, 1+ clicks), Warm (1-2 opens), Cold (no opens)
6. Different templates for each segment: Hot → Direct ask, Cold → Educational content
7. Sequence detail shows branch performance: Branch A: 32% conversion, Branch B: 28% conversion
8. Maximum 5 branch paths per step for MVP

### Story 8.5: AI Meeting Scheduler

As a Pro user,
I want AI to suggest optimal meeting times,
so that I can schedule appointments that both parties are likely to accept.

#### Acceptance Criteria

1. Settings → Calendar Integration connects Google Calendar or Outlook Calendar via OAuth
2. AI analyzes user's calendar: Free slots, preferred meeting times (most meetings happen 10-11 AM, 2-3 PM)
3. "Suggest Meeting Times" button in compose assistant generates 3 time options
4. AI considers recipient timezone (detected from email domain or past interaction times)
5. Suggestions optimize for both parties: "Tuesday 10 AM your time (2 PM their time) – both typically available"
6. Calendar invite link generation: "Click to schedule: [3 time slot links]"
7. When recipient clicks time slot, calendar invite auto-sent to both parties
8. Meeting scheduler page shows scheduled meetings, confirmed status, reminders
9. AI learns from accepted/rejected invites to improve future suggestions

### Story 8.6: AI Subject Line Generator & A/B Testing

As a Pro user,
I want AI to automatically generate and test subject line variants,
so that I can discover what drives the highest open rates.

#### Acceptance Criteria

1. Sequence step "Auto-generate Subject Lines" creates 3-5 variants automatically
2. Variants test different approaches: Question, Benefit-focused, Curiosity, Urgency, Personalized
3. A/B test runs automatically with equal split across contacts
4. AI tracks open rates per variant in real-time
5. After statistical significance reached (min 100 sends per variant), AI declares winner
6. Winner automatically used for remaining contacts in sequence
7. Learning applied to future subject line generation: "Short questions perform best for your audience"
8. Subject Line Library shows best-performing patterns: "How to [topic]" → 58% open rate avg
9. User can manually override AI winner if desired

### Story 8.7: AI Contact Scoring & Prioritization

As a Pro user,
I want AI to score contacts by engagement and potential,
so that I can focus on high-value relationships.

#### Acceptance Criteria

1. Contact score calculated from: Email opens, clicks, replies, recency of engagement, inferred seniority (title), company size
2. Score displayed next to contact: 0-100 with badge (Hot: 80-100, Warm: 50-79, Cold: 0-49)
3. Dashboard "High Priority Contacts" widget shows top 10 scored contacts
4. Alert when high-value contact goes quiet: "VP of Sales at [Company] hasn't engaged in 14 days"
5. AI suggests talking points per contact: "Last clicked pricing link – follow up on budget questions"
6. Contact detail shows score breakdown: Engagement: 85, Potential: 75, Recency: 60, Overall: 73
7. Bulk actions based on score: Select all Cold contacts → "Re-engagement campaign"
8. Score recalculated daily, contact list sortable by score

## Epic 9: Team Collaboration & Multi-Account (Business Tier)

**Epic Goal:** Implement multi-account management (up to 5 email accounts), team user seats (3-5 members), shared templates, assignment features, and unified team dashboard. Enable Business tier customers to collaborate on email campaigns and share organizational knowledge.

### Story 9.1: Multi-Account Management

As a Business tier user,
I want to connect up to 5 email accounts,
so that I can manage multiple accounts from one dashboard.

#### Acceptance Criteria

1. Business tier users can connect up to 5 Gmail/Outlook accounts via OAuth
2. Account switcher dropdown in dashboard header shows all connected accounts
3. Each account has separate daily send limit tracking (40/day per account)
4. Tracked emails tagged with sending account: "Sent from john@company1.com"
5. Analytics filterable by account: "Show stats for sarah@company2.com"
6. Templates can be account-specific or shared across all accounts
7. Notifications indicate which account received engagement: "[Account 1] Email opened"
8. Settings page shows list of connected accounts with usage stats per account

### Story 9.2: Team User Seats & Permissions

As a Business account owner,
I want to invite team members with role-based permissions,
so that my team can collaborate on email campaigns.

#### Acceptance Criteria

1. Settings → Team page shows "Invite Member" button (max 5 seats for Business tier)
2. Invitation flow: Enter email → Select role (Admin, Member, Viewer) → Send invite
3. TeamMembers table: id, account_id (Business account), user_id, role, invited_by, joined_at
4. Roles define permissions: Admin (full access), Member (can send/view own emails + shared campaigns), Viewer (read-only)
5. Invited user receives email with sign-up link, joins team after creating account
6. Team dashboard shows all team members' activity (permission-controlled)
7. Team members share subscription: Business tier features available to all
8. Account owner can remove team members and revoke access

### Story 9.3: Shared Templates & Team Library

As a Business team member,
I want access to shared templates created by my team,
so that we can maintain consistent messaging.

#### Acceptance Criteria

1. Template editor includes "Visibility" option: Private, Team Shared
2. Shared templates appear in all team members' template libraries
3. Templates page has "My Templates" and "Team Templates" tabs
4. Team members can edit shared templates (changes visible to all)
5. Template ownership tracked: "Created by [User], last edited by [User] 2 days ago"
6. Version history for shared templates: View and restore previous versions
7. Template usage analytics: "Used 45 times by team this month"
8. Templates can be locked by Admin role to prevent editing

### Story 9.4: Email Assignment & Collaboration

As a Business team member,
I want to assign follow-ups to teammates,
so that we can distribute workload and ensure no email is missed.

#### Acceptance Criteria

1. Email detail page includes "Assign To" dropdown with team members list
2. EmailAssignments table: id, tracked_email_id, assigned_to_user_id, assigned_by_user_id, status (pending/completed), due_date
3. Assigned member receives notification: "You've been assigned to follow up with [Recipient]"
4. Team dashboard shows "Assigned to Me" section with pending follow-ups
5. Internal notes feature: Team members can add private notes on emails visible only to team
6. Activity log shows assignment history: "Assigned by John to Sarah on Jan 10"
7. Completion tracking: Assigned member marks follow-up complete with optional outcome note
8. Overdue assignments highlighted in red with escalation notification to assigner

### Story 9.5: Unified Team Dashboard & Performance

As a Business account owner,
I want a team performance dashboard,
so that I can monitor team productivity and identify coaching opportunities.

#### Acceptance Criteria

1. Team Dashboard page accessible by Admin role
2. Metrics shown: Total Team Emails Sent, Team Open Rate, Team Click Rate, Team Reply Rate
3. Leaderboard: Top performers by emails sent, highest open rate, most replies
4. Individual performance cards: Each team member's stats with trend indicators
5. Territory or account-based filtering: Show stats by assigned accounts/contacts
6. Export team performance report as CSV or PDF
7. Goal tracking: Set team goals (e.g., "500 emails this month"), show progress bar
8. Coaching insights: "Sarah's open rate 15% below team average – review subject lines"
9. Team performance analytics accessible without CRM integrations

## Epic 10: Enterprise AI Features (Business Tier)

**Epic Goal:** Build advanced AI features exclusive to Business tier: team knowledge base, sentiment/risk detection, competitive intelligence, multi-channel orchestration, revenue intelligence, auto-response workflow, and deliverability optimization. These features provide organizational intelligence and automation at scale.

### Story 10.1: AI Team Knowledge Base

As a Business team,
I want AI to learn from all team emails and suggest best practices,
so that new members can leverage team knowledge quickly.

#### Acceptance Criteria

1. Background job analyzes all team emails monthly: Successful patterns, high-performing templates, common objections and responses
2. TeamKnowledgeBase table stores: best_practices (JSON), successful_patterns, common_responses, updated_at
3. "Ask AI" feature in dashboard: Team members ask questions like "How do we usually handle pricing objections?"
4. AI searches team knowledge base and successful emails to provide answers with examples
5. Best template suggestions: AI recommends templates that have highest success rates for specific scenarios
6. Onboarding assistant: New team members get AI-generated guide based on team's successful strategies
7. Knowledge base updates automatically as team sends more emails
8. Settings allow excluding certain emails from knowledge base (confidential content)

### Story 10.2: AI Sentiment & Risk Detection

As a Business team manager,
I want AI to detect unhappy customers and at-risk deals,
so that I can intervene before losing opportunities.

#### Acceptance Criteria

1. AI analyzes incoming emails (replies) for sentiment: Positive, Neutral, Negative, Urgent
2. Negative sentiment triggers alert to assigned team member and manager: "⚠️ Frustrated customer detected: [Contact]"
3. Risk indicators detected: Competitor mention, pricing concerns, timeline delays, decision-maker change
4. Dashboard "At Risk" section shows deals/contacts flagged by AI with risk reason
5. AI suggests de-escalation language: "Recommended response tone: Empathetic, solution-focused"
6. Escalation workflow: High-risk situations automatically assigned to manager or senior team member
7. Sentiment tracked over time: Contact engagement trend chart showing sentiment shifts
8. Coaching suggestions: "Team member handled similar situation successfully in [Email] – review for tactics"

### Story 10.3: AI Competitive Intelligence Monitor

As a Business team,
I want AI to detect competitor mentions and provide battle cards,
so that we can respond effectively to competitive situations.

#### Acceptance Criteria

1. AI scans incoming emails for competitor names (configured in Settings → Competitors list)
2. Competitor mention triggers notification: "Competitor [Name] mentioned by [Contact]"
3. AI generates battle card: Strengths vs competitor, common objections, recommended positioning
4. Competitive Intelligence dashboard shows: Most mentioned competitors, win/loss by competitor, trending objections
5. AI analyzes team emails for successful competitive wins and extracts strategies
6. Auto-suggested response includes competitive differentiation points
7. Battle cards update automatically as AI learns from team's successful competitive responses
8. Win/loss analysis: When deal closes, AI identifies patterns (why we won/lost vs each competitor)

### Story 10.4: Multi-Channel AI Orchestration

As a Business user,
I want AI to recommend the best communication channel,
so that I can reach contacts through their preferred medium.

#### Acceptance Criteria

1. AI tracks response patterns across channels: Email, LinkedIn, Phone
2. Contact profile shows channel preference: "Most responsive on LinkedIn (68% response rate vs 32% email)"
3. Compose assistant shows AI recommendation: "💡 Suggest reaching out via LinkedIn – 2x higher response rate"
4. Manual activity logging: Users can log LinkedIn messages and phone calls with notes
5. Unified engagement view: Timeline shows all touches across channels
6. Cross-channel analytics: Compare email vs LinkedIn vs phone effectiveness based on logged data
7. AI suggests optimal cadence: "Email → Wait 2 days → LinkedIn → Wait 3 days → Phone"

### Story 10.5: AI Revenue Intelligence & Forecasting

As a Business team manager,
I want AI to predict deal outcomes and forecast pipeline,
so that I can make informed decisions and accurate forecasts.

#### Acceptance Criteria

1. AI analyzes email engagement patterns to predict deal closure probability (0-100%)
2. Deal scoring considers: Email responsiveness, engagement trend, stakeholder involvement, timeline signals
3. Forecast dashboard shows: Predicted revenue this quarter, deals likely to close, deals at risk
4. Early warning system: AI detects engagement drop-offs that predict deal loss
5. Pipeline health score: Overall team pipeline quality assessment with recommendations
6. Individual deal intelligence: "Deal forecast: 75% likely to close in 14 days based on engagement patterns"
7. Performance benchmarking: Compare team member metrics to top performers
8. AI coaching insights: "Increase touch frequency – deals with 5+ touches close 40% faster"
9. Historical accuracy tracking: AI prediction accuracy improves over time with feedback loop

### Story 10.6: AI Auto-Response Workflow

As a Business team,
I want AI to draft responses to common inquiries for team approval,
so that we can respond faster with less effort.

#### Acceptance Criteria

1. AI detects common inquiry types: Pricing questions, Demo requests, Support issues, Feature questions
2. Auto-response queue shows AI-drafted replies awaiting approval
3. Team member receives notification: "AI drafted response to [Contact] – review and approve"
4. One-click approval sends email immediately, or member can edit before sending
5. AI learns from edits: Adjusts future drafts based on how team modifies responses
6. Auto-approval rules for trusted AI: After 90% approval rate, auto-send specific inquiry types
7. Analytics show time saved: "AI handled 40% of routine inquiries this month"
8. Escalation rules: Complex inquiries routed to specific team members

### Story 10.7: AI Deliverability Optimization

As a Business user,
I want AI to monitor and optimize email deliverability,
so that my emails consistently reach inboxes.

#### Acceptance Criteria

1. AI monitors deliverability metrics: Bounce rate, spam complaints, open rates by domain
2. Deliverability health score (0-100) shown in Settings with trend indicator
3. AI detects issues: "⚠️ Bounce rate increased 5% this week – review email list hygiene"
4. Domain/sending pattern suggestions: "Gradually increase volume – avoid sudden spikes"
5. Warm-up scheduler for new email accounts: AI creates gradual send schedule for first 30 days
6. Sender reputation monitoring: Integration with sender score services
7. Content analysis: AI flags content likely to trigger spam filters before sending
8. Recommendations dashboard: "Remove inactive contacts (no open in 90 days)", "Segment high vs low engagement"
9. Deliverability playbook: AI-generated action plan when deliverability drops

## Checklist Results Report

### Executive Summary

**Overall PRD Completeness:** 95%

**MVP Scope Appropriateness:** Appropriate - The PRD covers 10 epics focused on core email tracking and campaign management. Recommendation: Focus on Epics 1-3 as true MVP (2-3 weeks), with Epics 4-10 as post-MVP roadmap.

**Readiness for Architecture Phase:** ✅ Ready - The PRD provides sufficient technical constraints, requirements clarity, and epic structure for architecture work to begin.

**Most Critical Concerns:**
1. MVP scope clearly defined as Epics 1-3 (Foundation, Extension, Advanced Tracking)
2. Some acceptance criteria could benefit from more specific performance metrics
3. Technical risks should be explicitly flagged for architect (WebSocket scaling, AI API costs, email deliverability)

### Category Validation Results

| Category                         | Status  | Critical Issues                                          |
| -------------------------------- | ------- | -------------------------------------------------------- |
| 1. Problem Definition & Context  | PASS    | None - Clear problem statement and target users          |
| 2. MVP Scope Definition          | PASS    | MVP clearly defined as Epics 1-3                         |
| 3. User Experience Requirements  | PASS    | Comprehensive UI/UX goals and accessibility requirements |
| 4. Functional Requirements       | PASS    | 54 FRs and 14 NFRs well-documented                      |
| 5. Non-Functional Requirements   | PASS    | Performance, security, and compliance covered            |
| 6. Epic & Story Structure        | PASS    | 10 epics with 60+ stories, well-structured               |
| 7. Technical Guidance            | PASS    | Clear technical assumptions and architecture direction   |
| 8. Cross-Functional Requirements | PASS    | Data models and operations covered (no external CRMs)    |
| 9. Clarity & Communication       | PASS    | Well-structured, clear language throughout               |

### MVP Scope Recommendation

**Recommended True MVP (Epics 1-3, ~2-3 weeks):**
- **Epic 1:** Foundation & Core Tracking Infrastructure
- **Epic 2:** Chrome Extension & Email Integration  
- **Epic 3:** Advanced Tracking & Analytics Dashboard

**Rationale:** These 3 epics deliver the core value proposition - email tracking with Chrome extension integration and real-time analytics - creating a complete, shippable product that validates the core hypothesis.

**Post-MVP Roadmap (Epics 4-10, 4-6 weeks):**
- Epic 4: Productivity Features (templates, scheduling, signatures)
- Epic 5-6: AI Features + Billing (voice cloning, scoring, payment processing)
- Epic 7-8: Campaigns + Advanced AI (sequences, A/B testing, contact scoring)
- Epic 9-10: Team Features + Enterprise AI (multi-account, team collaboration, advanced analytics)

### Technical Risks Identified

1. **WebSocket Scaling:** Real-time notifications at scale requires careful infrastructure design
2. **AI API Costs:** Unlimited AI for Pro tier needs cost optimization strategies (caching, rate limiting)
3. **Email Deliverability:** Tracking pixels can trigger spam filters - monitoring required
4. **OAuth Token Security:** Secure storage and refresh token handling critical
5. **Database Write Volume:** Tracking events table will have high write volume - optimization needed

### Recommendations

**For MVP Launch (Epics 1-3):**
1. Focus architecture work on core tracking infrastructure
2. Implement basic billing (Free + Individual tier) in parallel to Epic 3
3. Plan Chrome Web Store submission process

**For Architecture Phase:**
1. Design WebSocket infrastructure for scalability
2. Plan database schema optimization for high-volume tracking events
3. Design multi-tenancy architecture to support future Business tier
4. Create AI API cost projection model

**For Future Iterations:**
1. Add explicit user flow diagrams
2. Develop A/B test plan for feature rollout
3. Plan phased rollout strategy with beta users

### Final Validation

**Status:** ✅ **READY FOR ARCHITECT**

The PRD is comprehensive, properly structured, and provides sufficient detail for architectural design. Requirements are clear and testable, technical constraints are well-articulated, and epic structure is logical. The architect should focus on Epics 1-3 as MVP while designing for extensibility to support the broader roadmap.

## Next Steps

### UX Expert Prompt

Design team, please proceed with creating detailed UI/UX specifications based on this PRD:

**Primary Deliverables:**
1. High-fidelity mockups for Chrome extension (Gmail/Outlook integration, compose assistant)
2. Web dashboard wireframes and visual design (analytics, campaign builder, settings)
3. Responsive web design for tablet and mobile browsers
4. Design system documentation (colors, typography, components)

**Key Design Considerations:**
- Chrome extension must feel native to Gmail/Outlook interfaces
- Dashboard should emphasize data clarity with intuitive charts
- Responsive design for all screen sizes (desktop, tablet, mobile web)
- Accessibility WCAG AA compliance
- Dark mode support

Please reference the "User Interface Design Goals" section for detailed requirements.

### Architect Prompt

Architecture team, please create the technical architecture document based on this PRD:

**Primary Deliverables:**
1. System architecture diagram (monorepo structure, services, data flow)
2. Database schema design (all tables with relationships)
3. API specification (REST endpoints, authentication, rate limiting)
4. Technology stack decisions with rationale
5. Deployment architecture (AWS/Vercel, CI/CD pipeline)
6. Security architecture (OAuth flows, data encryption, GDPR compliance)

**Key Technical Constraints:**
- Monorepo with pnpm workspaces
- Hybrid architecture: Serverless + long-running services
- Real-time requirements via WebSockets
- External AI APIs (OpenAI/Anthropic)
- Multi-tenant SaaS with tier-based feature gates

Please reference the "Technical Assumptions" section for detailed technology choices and the full requirements sections for functional scope.

