# Email Tracker + Campaign Manager - Product Brief

## Product Vision
Chrome extension + web app for email tracking and campaign management with unlimited AI features and no email sending restrictions (warnings only at 40+/day).

**Target Users:** Sales reps, freelancers, agencies
**Key Differentiator:** Unlimited AI features without credit systems + no artificial email sending limits

---

## Payment & Billing

### Payment Gateways
- **Razorpay:** For domestic users (India)
- **PayPal:** For international users (all other countries)
- **Detection:** GeoIP-based automatic detection
- **Display:** Show pricing in local currency based on location

### Pricing Display by Region
**Domestic (India) - Razorpay:**
- Individual: ₹599/month or ₹5,999/year (save ₹1,189 - 2 months free)
- Pro: ₹2,399/month or ₹23,999/year (save ₹4,789 - 2 months free)
- Business: ₹7,999/month or ₹79,999/year (save ₹15,989 - 2 months free)

**International - PayPal:**
- Individual: $6.99/month or $69.99/year (save $13.89 - 2 months free)
- Pro: $29/month or $290/year (save $58 - 2 months free)
- Business: $99/month or $990/year (save $198 - 2 months free)

### Annual Plan Discount
- **2 months free** (~16.67% discount)
- Monthly price × 10 = Annual price
- Billed annually, one-time payment

### Upgrade/Downgrade Policy
**Upgrades (e.g., Individual → Pro):**
1. Charge full amount for new plan immediately
2. Calculate unused days from old plan: `(days_remaining / days_in_month) × old_plan_price`
3. Refund unused amount to payment method
4. New plan activated immediately
5. Billing cycle resets to upgrade date

**Downgrades (e.g., Pro → Individual):**
1. Charge full amount for new plan immediately
2. Calculate unused days from old plan
3. Refund unused amount to payment method
4. New plan activated immediately
5. Billing cycle resets to downgrade date

**Example Upgrade Calculation:**
- Current: Individual ($6.99/month), 15 days remaining
- New: Pro ($29/month)
- Refund: (15/30) × $6.99 = $3.50
- Charge: $29.00
- Net transaction: $29.00 charged, $3.50 refunded separately

**Annual Plan Handling:**
- Calculate: `(days_remaining / 365) × annual_plan_price`
- Refund prorated amount
- Charge new plan (monthly or annual)

### Payment Processing
- Immediate charge + refund (not credit/prorating)
- Refunds processed to original payment method
- Refund processing time: 5-7 business days
- Email confirmation for all billing changes
- Clear invoice showing charge + refund separately

---

## Pricing Tiers & Feature Allocation

### FREE TIER
**Limits:** 100 email tracks total, no location/link tracking

**Core Features:**
- Basic email open tracking (up to 100 total)
- Desktop notifications for opens
- 7-day analytics history
- Visible branding ("Sent with [Product]")

**Restrictions:**
- No link click tracking
- No location tracking
- No AI features
- No campaigns
- No scheduling

---

### INDIVIDUAL - $6.99/month
**Limits:** 1 email account, soft email limit (warning at 40/day)

**Core Tracking (Unlimited):**
- Email open tracking with timestamps
- Link click tracking with URL analytics
- Attachment download tracking
- Location tracking (city-level)
- Real-time desktop + mobile notifications
- Individual recipient tracking in group emails

**Productivity Features:**
- Email scheduling (send later with timezone support)
- 50 email templates with variables
- Follow-up reminders (if no reply in X days)
- 5 custom email signatures
- Quick reply shortcuts
- Mobile app access

**AI Features (100 credits/month OR soft-limited unlimited):**
- AI email scoring before sending
- Subject line generation
- Smart send time suggestions
- Tone adjustment (formal/casual)
- Email response suggestions

**Analytics:**
- 90-day history
- Basic dashboard (opens, clicks, engagement)
- Daily/weekly summary emails
- Recipient engagement tracking

**Integrations:**
- Gmail + Outlook support
- Zapier (5 zaps)
- Calendar integration

**Branding:** All branding removed

---

### PRO - $29/month
**Limits:** 1 email account, soft email limit (warning at 40/day)

**Everything from Individual PLUS:**

**Email Campaigns & Automation:**
- Email sequences (multi-step campaigns, unlimited sends)
- Automated follow-up rules
- Conditional sequences (if clicks X, send Y)
- Drip campaigns with tracking
- A/B testing (subject lines, send times, content)

**AI Features (UNLIMITED):**

1. **AI Email Voice Cloning**
   - Analyzes your past emails to learn your writing style
   - All AI-generated emails sound like you
   - Continuous learning from successful emails

2. **Smart Reply Prediction**
   - Predicts reply likelihood
   - Suggests best follow-up timing
   - Recommends optimal tone
   - Identifies key talking points from context

3. **AI Auto-Personalization at Scale**
   - Researches recipients (LinkedIn, company website)
   - Auto-personalizes opening lines
   - Tailors value props by role/industry
   - Custom CTAs based on company data

4. **AI Email Health Monitor**
   - Real-time email scoring as you type
   - Spam trigger detection
   - Reading level optimization
   - Engagement likelihood prediction
   - Mobile readability check
   - Deliverability optimization

5. **Intelligent Sequence Branching**
   - Dynamic sequences based on behavior
   - Opened but no reply → case study
   - Clicked but no action → time-sensitive offer
   - No open → retry different approach
   - Auto-optimization based on results

6. **AI Meeting Scheduler**
   - Learns your preferred meeting times
   - Predicts when contacts accept meetings
   - Suggests optimal times for both parties
   - Auto-generates meeting agendas

7. **AI Subject Line Generator & Testing**
   - Generates 3-5 variants automatically
   - Tests in campaigns
   - Learns what works for your audience
   - Applies learnings to future emails

8. **AI Contact Scoring**
   - Scores contacts by engagement + potential
   - Prioritizes who to follow up with
   - Alerts when high-value contacts go quiet
   - Provides talking points per contact

**Auto-Reply:**
- Rule-based auto-responses
- AI-drafted replies (manual approval)
- Template-based quick responses

**Knowledge Base:**
- Personal email knowledge base
- Search past successful emails
- AI-powered suggestions from your history

**Advanced Analytics:**
- Unlimited history
- Custom report builder
- Exportable data (CSV, Excel)
- Engagement trends
- Campaign performance analytics

**CRM Integrations:**
- Salesforce bi-directional sync
- HubSpot integration
- Pipedrive connection
- Zoho CRM support

**Integrations:**
- API access (10,000 calls/month)
- Unlimited Zapier connections
- Webhook support
- Slack notifications

**Support:** Priority email (4-8 hour response)

---

### BUSINESS - $99/month
**Limits:** Up to 5 email accounts, soft email limit per account (warning at 40/day per account)

**Everything from Pro PLUS:**

**Multi-Account Management:**
- Connect up to 5 email accounts
- Unified dashboard across all accounts
- Per-account analytics
- Account-specific templates

**Team Features:**
- 3-5 user seats included
- Shared templates library
- Team performance dashboard
- Shared inbox/collaborative tracking
- Internal team notes on emails
- Assignment features (delegate follow-ups)
- Team collaboration on campaigns

**Enterprise AI Features (UNLIMITED):**

9. **AI Team Knowledge Base**
   - Builds knowledge base from all team emails
   - Suggests best templates from team successes
   - "Ask AI" about team best practices
   - Auto-surfaces relevant past conversations
   - Team learning from successful patterns

10. **AI Sentiment & Risk Detection**
    - Analyzes incoming emails for frustration/urgency
    - Alerts manager to unhappy customers
    - Suggests de-escalation language
    - Flags deals at risk
    - Coaching suggestions for team members

11. **AI Competitive Intelligence Monitor**
    - Detects competitor mentions in emails
    - Provides battle cards automatically
    - Tracks which competitors appear most
    - Suggests positioning based on patterns
    - Win/loss analysis by competitor

12. **Multi-Channel AI Orchestration**
    - AI recommends optimal channel (email/LinkedIn/phone)
    - Coordinates timing across channels
    - Unified engagement view
    - Cross-channel analytics

13. **AI Revenue Intelligence & Forecasting**
    - Predicts deal closure probability
    - Forecasts pipeline from email activity
    - Alerts to deals going cold
    - Team coaching insights
    - Performance benchmarking

14. **AI Auto-Response with Workflow**
    - AI drafts responses to common inquiries
    - Routes to team member for approval
    - One-click approval or edit
    - Learns from approvals
    - Handles 40-60% of routine emails

15. **AI Deliverability Optimization**
    - Auto-detects deliverability issues
    - Domain/sending pattern suggestions
    - Gradual volume increases for new domains
    - Sender reputation monitoring

**Team Analytics:**
- Team performance comparisons
- Territory/pipeline analytics
- Shared reporting
- Manager dashboards

**White-Label:**
- Remove all branding
- Custom domain tracking links
- Team-branded templates

**Support:**
- Priority email + live chat
- Onboarding call for teams
- Quarterly success check-ins
- Dedicated success manager

---

## Core Platform Features (All Tiers)

### Email Sending Restrictions
**Philosophy:** No hard limits, trust-based approach

- **No restrictions** on number of emails sent
- **Warning at 40 emails/day per account** (soft limit)
- Warning message: "You've sent 40+ emails today. To maintain deliverability and avoid spam filters, consider spreading emails across multiple days."
- Track sending patterns for deliverability optimization
- Suggest best practices if excessive sending detected

### Chrome Extension
- Gmail integration (inline tracking indicators)
- Outlook web integration
- Real-time tracking status
- Compose window AI assistant
- Template quick-insert
- Scheduling interface
- One-click campaign creation

### Web App
- Campaign builder
- Analytics dashboard
- Template management
- Contact management
- Sequence builder (Pro+)
- Team management (Business)
- Settings & integrations

### Mobile App (iOS + Android)
- Full feature parity with desktop
- Real-time notifications
- Track emails sent from mobile
- Quick replies with templates
- Dashboard access
- Campaign monitoring

### Notifications
- Real-time push notifications (desktop + mobile)
- Email open alerts
- Link click alerts
- Campaign milestone alerts
- Daily/weekly summary emails
- Custom notification rules

---

## Technical Implementation Notes

### AI Implementation
- Use OpenAI GPT-4o or Anthropic Claude for all AI features
- External API calls (no in-house ML models)
- Context window optimization for voice cloning
- Prompt engineering for each AI feature
- Rate limiting and caching for cost optimization

### Tracking Implementation
- Pixel-based tracking for opens
- Link redirect tracking for clicks
- Server-side tracking infrastructure
- Real-time websocket notifications
- GDPR-compliant data storage

### Email Sending
- SMTP integration (user's email server)
- Gmail API for Gmail users
- Microsoft Graph API for Outlook users
- No proprietary sending infrastructure
- Deliverability monitoring via external APIs

---

## Success Metrics

### Activation Metrics
- Time to first email tracked: <5 minutes
- Emails tracked in first 7 days: 10+
- AI feature usage in first week: 5+

### Conversion Metrics
- Free to paid: 3-7%
- Individual to Pro upgrade: 10-15%
- Annual billing take rate: 20-25%

### Retention Metrics
- 30-day retention: 60%+
- 90-day retention: 40%+
- Paid churn: <5%/month

### Engagement Metrics
- Daily active users: 40%+
- AI features used per week: 15+
- Emails tracked per user per week: 30+

---

## MVP Launch Priorities

### Week 1 (Immediate Launch)
**Must-Have Features:**
- Chrome extension (Gmail + Outlook)
- Core tracking (opens, clicks, attachments)
- Web dashboard (basic analytics)
- User authentication
- Free tier (100 tracks limit)
- Individual tier ($6.99) with payment
- AI Email Scoring (#4)
- AI Voice Cloning (#1) - basic version
- Email scheduling
- Template system
- 40/day warning system

### Week 2-3 (Rapid Iteration)
- AI Smart Reply Prediction (#2)
- AI Auto-Personalization (#3)
- Email sequences (Pro tier)
- Pro tier ($29) launch
- Mobile app (basic version)
- CRM integrations (start with HubSpot)

### Week 4-6 (Pro Features)
- Intelligent Sequence Branching (#5)
- AI Meeting Scheduler (#6)
- AI Subject Line Testing (#7)
- AI Contact Scoring (#8)
- Advanced analytics
- API access

### Week 7-8 (Business Tier)
- Business tier ($99) launch
- Team features
- AI Team Knowledge Base (#9)
- AI Sentiment Detection (#10)
- Multi-account support (5 accounts)

### Week 9-12 (Enterprise Features)
- AI Competitive Intelligence (#11)
- Multi-Channel Orchestration (#12)
- Revenue Intelligence (#13)
- Auto-Response Workflow (#14)
- AI Deliverability Optimization (#15)

---

## Feature Priority Matrix

### P0 (Must Have for Launch)
- Email tracking (opens/clicks)
- Chrome extension
- Web dashboard
- User auth + billing
- AI Email Scoring
- AI Voice Cloning (basic)
- Email scheduling
- Templates
- 40/day warnings

### P1 (Launch Week 2-3)
- AI Reply Prediction
- AI Personalization
- Email sequences
- Mobile app
- Pro tier features

### P2 (Month 2)
- All Pro AI features (#5-8)
- CRM integrations
- Advanced analytics
- Team features (prep for Business)

### P3 (Month 3)
- Business tier launch
- Enterprise AI features (#9-15)
- Multi-account support
- White-label options

---

## Competitive Advantages Summary

1. **Unlimited AI** at Pro/Business tiers (no credit systems)
2. **No email sending limits** (warnings only)
3. **AI Voice Cloning** (emails sound like you)
4. **Mobile-first** experience
5. **Team intelligence** (Business tier)
6. **Price:** 40-50% cheaper than competitors
7. **Simple pricing** (3 paid tiers, clear value)

---

## Notes for PM Agent

- All AI features use external APIs (OpenAI/Anthropic)
- No hard technical constraints on timeline
- Priority: Speed to market over perfection
- Focus on core tracking accuracy first
- AI features can be added iteratively
- Pricing validated by market research
- Target launch: Week 1 (MVP), Full features: 8-12 weeks

