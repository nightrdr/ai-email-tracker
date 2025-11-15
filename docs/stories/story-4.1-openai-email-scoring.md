# Story 4.1: OpenAI Email Scoring & Suggestions

**Story ID:** STORY-4.1  
**Epic:** Epic 4 - AI-Powered Features (Email Intelligence)  
**Priority:** P1 - Should Have  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** AI to analyze my email and provide a score with improvement suggestions  
**So that** I can write more effective emails that get responses

---

## Acceptance Criteria

- [ ] POST /api/ai/score-email endpoint accepts subject and body
- [ ] OpenAI API integration analyzes email for clarity, tone, urgency, call-to-action
- [ ] Returns score 0-100 with breakdown (clarity: 85, tone: 70, etc.)
- [ ] Returns 3-5 specific suggestions for improvement
- [ ] Response time < 3 seconds
- [ ] Error handling for API failures/rate limits
- [ ] Extension shows score in compose panel

---

## Requirements Traceability

**PRD Coverage:**
- **FR10:** AI email scoring for multiple dimensions (spam triggers, readability, engagement)
- **FR23:** Real-time email health monitoring with optimization
- **NFR4:** Uses external OpenAI GPT-4 API (no in-house ML models)
- **NFR5:** Rate limiting and caching for AI API cost optimization

**Architecture References:**
- AI Integration: OpenAI GPT-4 API
- Prompt Engineering: Structured scoring prompts
- Caching Strategy: Redis for identical email deduplication
- Cost Optimization: Rate limiting, response caching

**Epic Context:**
This story delivers AI-powered intelligence that helps users write better emails, increasing reply rates and providing immediate value from AI features - a key competitive differentiator.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Prompt construction, response parsing, caching logic
- **Integration Tests:** Full OpenAI API integration flow
- **Performance Tests:** Response time <3 seconds, caching effectiveness
- **Quality Tests:** Scoring accuracy with various email types

**Test Environment:**
- OpenAI API key with test credits
- Mock AI responses for unit tests
- Redis for caching tests
- Various email samples (good, poor, spam-like)

**Success Metrics:**
- Response time: <3 seconds (p95)
- Cache hit rate: >80% for repeated emails
- Scoring consistency: Same email = same score
- API cost: <$0.01 per scoring request

**Testing Tools:**
- OpenAI API playground for prompt testing
- Jest for unit/integration tests
- k6 for performance testing
- Redis CLI for cache verification

---

## Developer Implementation Checklist

### Phase 1: OpenAI Service Setup (30 min)

- [ ] **Step 1.1:** Install OpenAI SDK
  ```bash
  cd packages/api
  pnpm add openai
  ```

- [ ] **Step 1.2:** Configure environment variables
  ```bash
  # packages/api/.env
  OPENAI_API_KEY=sk-...your-key-here
  OPENAI_MODEL=gpt-4
  ```

- [ ] **Step 1.3:** Create OpenAI service skeleton
  ```typescript
  // packages/api/src/services/openai.service.ts
  import OpenAI from 'openai';
  
  export class OpenAIService {
    private client: OpenAI;
    
    constructor() {
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    
    async scoreEmail(subject: string, body: string): Promise<EmailScore> {
      // Implementation below
    }
  }
  
  export interface EmailScore {
    overall_score: number;
    breakdown: {
      clarity: number;
      tone: number;
      urgency: number;
      call_to_action: number;
    };
    suggestions: string[];
  }
  ```

### Phase 2: Prompt Engineering (45 min)

- [ ] **Step 2.1:** Create scoring prompt template
  ```typescript
  private createScoringPrompt(subject: string, body: string): string {
    return `You are an expert email coach. Analyze this email and provide scores (0-100) for:

1. **Clarity**: How clear and easy to understand is the message?
2. **Tone**: Is the tone appropriate for the context?
3. **Urgency**: Does it convey appropriate urgency without being pushy?
4. **Call-to-Action**: Is there a clear, specific action requested?

Email Subject: "${subject}"

Email Body:
"""
${body}
"""

Provide your analysis in this JSON format:
{
  "overall_score": <0-100>,
  "breakdown": {
    "clarity": <0-100>,
    "tone": <0-100>,
    "urgency": <0-100>,
    "call_to_action": <0-100>
  },
  "suggestions": [
    "Specific suggestion 1",
    "Specific suggestion 2",
    "Specific suggestion 3"
  ]
}

Focus on actionable, specific suggestions for improvement.`;
  }
  ```

- [ ] **Step 2.2:** Implement scoreEmail method
  ```typescript
  async scoreEmail(subject: string, body: string): Promise<EmailScore> {
    try {
      const prompt = this.createScoringPrompt(subject, body);
      
      const completion = await this.client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email coach providing constructive feedback.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent scoring
        max_tokens: 500,
        response_format: { type: 'json_object' }
      });
      
      const response = completion.choices[0].message.content;
      const score: EmailScore = JSON.parse(response);
      
      return score;
    } catch (error) {
      console.error('OpenAI scoring error:', error);
      throw new Error('Failed to score email');
    }
  }
  ```

### Phase 3: Caching Implementation (30 min)

- [ ] **Step 3.1:** Add caching wrapper
  ```typescript
  import { createHash } from 'crypto';
  import { redisService } from './redis.service';
  
  async scoreEmailWithCache(subject: string, body: string): Promise<EmailScore> {
    // Create cache key from email content
    const content = `${subject}|${body}`;
    const cacheKey = `email_score:${createHash('sha256').update(content).digest('hex')}`;
    
    // Check cache
    const cached = await redisService.getClient().get(cacheKey);
    if (cached) {
      console.log('Cache hit for email scoring');
      return JSON.parse(cached);
    }
    
    // Score email
    const score = await this.scoreEmail(subject, body);
    
    // Cache for 24 hours
    await redisService.getClient().setex(cacheKey, 86400, JSON.stringify(score));
    
    return score;
  }
  ```

### Phase 4: API Endpoint (20 min)

- [ ] Install OpenAI SDK: `pnpm add openai`
- [ ] Configure OPENAI_API_KEY in environment
- [ ] Create `/packages/api/src/services/openai.service.ts`
- [ ] Implement `scoreEmail(subject, body)` method
- [ ] Use GPT-4 with prompt engineering for scoring
- [ ] Parse AI response into structured format
- [ ] Create POST `/api/ai/score-email` endpoint
- [ ] Add rate limiting (prevent abuse)
- [ ] Cache results for identical emails (24h)
- [ ] Extension: Add "AI Score" button in compose panel
- [ ] Display score with visual indicator (color-coded)
- [ ] Show suggestions in collapsible panel

### QA Verification Checklist

- [ ] Compose email in Gmail extension
- [ ] Click "AI Score" button
- [ ] Score returns within 3 seconds
- [ ] Score displayed (e.g., "72/100")
- [ ] Suggestions listed (e.g., "Add clear call-to-action")
- [ ] Test with poor email → low score with helpful suggestions
- [ ] Test with well-written email → high score
- [ ] Test with empty body → validation error
- [ ] Test API failure → graceful error message
- [ ] Verify caching: same email scored twice = instant response

---

## Definition of Done

- [ ] OpenAI integration working
- [ ] Email scoring accurate and helpful
- [ ] Extension UI displays scores
- [ ] Performance acceptable
- [ ] Error handling robust


