# Story 9.1: Custom Domain Tracking & White-Label

**Story ID:** STORY-9.1  
**Epic:** Epic 9 - Advanced Configuration & Customization  
**Priority:** P2 - Nice to Have  
**Story Points:** 13  
**Estimated Time:** 10-12 hours  
**Status:** Not Started

---

## User Story

**As a** Business tier user  
**I want** to use my own domain for tracking links  
**So that** recipients see my brand domain instead of generic tracking URLs

---

## Acceptance Criteria

- [ ] CustomDomains table created with: id, user_id, domain, verified, created_at
- [ ] POST /api/custom-domains endpoint adds domain
- [ ] Domain verification via DNS TXT record
- [ ] Tracking pixel/link URLs use custom domain: https://track.yourbrand.com/pixel/...
- [ ] SSL certificate auto-provisioned (Let's Encrypt)
- [ ] Fallback to default domain if custom domain fails

---

## Requirements Traceability

**PRD Coverage:**
- **FR54:** Custom domain tracking for white-label experience (Business tier)

**Architecture References:**
- DNS Verification: TXT record validation
- SSL Provisioning: Let's Encrypt automation
- Reverse Proxy: CDN/CloudFront for custom domains
- Fallback Strategy: Default domain on custom domain failure

**Epic Context:**
Custom domain tracking provides white-label branding, essential for agencies and enterprises who need to maintain brand consistency in all recipient touchpoints.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** DNS verification logic, domain validation
- **Integration Tests:** Full custom domain setup flow
- **SSL Tests:** Certificate provisioning and renewal
- **Fallback Tests:** Behavior when custom domain fails

**Test Environment:**
- Test domain for verification
- DNS record management
- SSL certificate validation
- Multiple custom domains per user

**Success Metrics:**
- DNS verification: <30 seconds
- SSL provisioning: <2 minutes
- Tracking via custom domain: 100% functional
- Fallback reliability: Instant

**Testing Tools:**
- DNS testing tools
- SSL certificate validators
- Custom domain simulators

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.4 - Tracking Pixel Service](./story-1.4-tracking-pixel-service.md) - Base tracking infrastructure
- [Story 6.1 - Subscription & Billing](./story-6.1-subscription-tiers-billing.md) - Business tier feature

**Blocks (Stories Waiting on This):**
- None (premium white-label feature)

**Related Stories:**
- Enables white-label/agency use cases

---

## Developer Implementation Checklist

- [ ] Create CustomDomains table
- [ ] Implement domain verification service
- [ ] Generate unique TXT record value
- [ ] Check DNS for verification: `dns.resolve4()` or external API
- [ ] Setup reverse proxy/CDN configuration (Cloudflare Workers or AWS CloudFront)
- [ ] Implement SSL certificate provisioning with Let's Encrypt
- [ ] Update tracking pixel/link generation to use custom domain if verified
- [ ] Create custom domain management UI
- [ ] Add DNS instructions for users
- [ ] Test with multiple custom domains per user

### QA Verification Checklist

- [ ] Add custom domain "track.mycompany.com"
- [ ] Get DNS verification instructions
- [ ] Add TXT record to DNS
- [ ] Click "Verify Domain"
- [ ] Domain verified successfully
- [ ] Send tracked email
- [ ] Tracking pixel URL uses custom domain: https://track.mycompany.com/pixel/abc123.png
- [ ] Recipient opens email → tracking works
- [ ] SSL certificate valid for custom domain
- [ ] Test with unverified domain → falls back to default

---

## Definition of Done

- [ ] Custom domain setup working
- [ ] DNS verification functional
- [ ] SSL auto-provisioning working
- [ ] Tracking uses custom domain


