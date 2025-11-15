# Story 4.2: AI Subject Line Generator

**Story ID:** STORY-4.2  
**Epic:** Epic 4 - AI-Powered Features  
**Priority:** P1 - Should Have  
**Story Points:** 5  
**Estimated Time:** 4-6 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** AI to generate compelling subject lines for my emails  
**So that** I can improve open rates

---

## Acceptance Criteria

- [ ] POST /api/ai/generate-subject accepts email body
- [ ] Returns 5 subject line suggestions with predicted open rates
- [ ] Variations: professional, casual, urgent, intriguing
- [ ] Extension shows suggestions in compose window
- [ ] Click to insert subject line
- [ ] Response time < 2 seconds

---

## Requirements Traceability

**PRD Coverage:**
- **FR12:** AI subject line generator with multiple tone options
- **FR26:** Multiple AI-generated alternatives with style variations
- **NFR4:** OpenAI GPT-4 integration
- **NFR5:** Rate limiting and caching

**Architecture References:**
- AI Integration: OpenAI GPT-4 API
- Prompt Engineering: Subject line generation prompts
- Extension UI: Dropdown suggestions in compose window
- Caching: Redis for duplicate content

**Epic Context:**
Subject line generation directly impacts open rates - the first metric users care about - making AI immediately valuable and demonstrating the power of AI features.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Subject line generation, prompt construction
- **Integration Tests:** Full API flow, caching
- **Quality Tests:** Subject line relevance, tone accuracy
- **UI Tests:** Extension dropdown, insertion logic

**Test Environment:**
- Various email body types (sales, support, follow-up)
- OpenAI API with test credits
- Extension compose window testing

**Success Metrics:**
- Generation time: <2 seconds
- Relevance score: User feedback-based
- Cache hit rate: >70%
- Tone accuracy: Each suggestion has distinct tone

**Testing Tools:**
- OpenAI Playground for prompt testing
- Jest for unit tests
- Extension manual testing

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 2.5 - Gmail Compose Integration](./story-2.5-gmail-compose-window-integration.md) - Compose window UI
- [Story 4.1 - OpenAI Email Scoring](./story-4.1-openai-email-scoring.md) - OpenAI service foundation

**Blocks (Stories Waiting on This):**
- None (enhancement feature)

**Related Stories:**
- [Story 4.1 - AI Email Scoring](./story-4.1-openai-email-scoring.md) - Shared OpenAI infrastructure

---

## Developer Implementation Checklist

### Phase 1: Prompt Engineering (30 min)

- [ ] **Step 1.1:** Create subject line generation prompt
  ```typescript
  private createSubjectLinePrompt(emailBody: string): string {
    return `You are an expert email marketer. Generate 5 compelling subject lines for this email.

Email Body:
"""
${emailBody.substring(0, 500)} // Limit to first 500 chars for cost
"""

Generate 5 subject lines with different tones:
1. Professional - Formal and business-appropriate
2. Casual - Friendly and conversational
3. Urgent - Creates sense of importance
4. Intriguing - Piques curiosity
5. Direct - Clear and straightforward

For each, provide:
- The subject line (max 60 characters)
- Predicted open rate (Low/Medium/High)
- Brief reasoning

Return as JSON:
{
  "suggestions": [
    {
      "text": "Quick question about your demo",
      "tone": "Casual",
      "predicted_open_rate": "High",
      "reasoning": "Personal and creates curiosity"
    },
    // ... 4 more
  ]
}`;
  }
  ```

- [ ] **Step 1.2:** Implement generation method
  ```typescript
  async generateSubjectLines(emailBody: string): Promise<SubjectLineSuggestion[]> {
    try {
      const prompt = this.createSubjectLinePrompt(emailBody);
      
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert email marketer focused on maximizing open rates.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8, // Higher for creative variations
        max_tokens: 400,
        response_format: { type: 'json_object' }
      });
      
      const response = JSON.parse(completion.choices[0].message.content);
      return response.suggestions;
    } catch (error) {
      console.error('Subject line generation error:', error);
      throw new Error('Failed to generate subject lines');
    }
  }
  
  interface SubjectLineSuggestion {
    text: string;
    tone: string;
    predicted_open_rate: 'Low' | 'Medium' | 'High';
    reasoning: string;
  }
  ```

### Phase 2: API Endpoint & Caching (20 min)

- [ ] Create `generateSubjectLines()` method in OpenAI service
- [ ] Use GPT-4 with prompt: "Generate 5 subject lines for this email..."
- [ ] Return array of {text, tone, predicted_open_rate}
- [ ] Create endpoint POST `/api/ai/generate-subject`
- [ ] Extension: Add "✨ AI Suggestions" button next to subject field
- [ ] Show dropdown with 5 suggestions
- [ ] Click suggestion → fills subject field
- [ ] Cache suggestions to avoid re-generating

### QA Verification Checklist

- [ ] Compose email body about product demo
- [ ] Click "AI Suggestions" button
- [ ] 5 subject lines generated within 2 seconds
- [ ] Suggestions are relevant to email content
- [ ] Click first suggestion → subject field updated
- [ ] Test with different email types (sales, support, follow-up)
- [ ] Each returns appropriate subject lines

### Phase 4: Unit and Integration Tests (90 min)

- [ ] Write unit tests for subject line generation
  - Test prompt construction with different email body lengths
  - Test parsing 5 subject lines from OpenAI response
  - Test handling of malformed API responses
  - Test error handling for API failures

- [ ] Write unit tests for caching
  - Test cache key based on email body hash
  - Test cache retrieval for repeated requests
  - Test cache invalidation after 24 hours

- [ ] Write integration tests for generation endpoint
  - Test POST /api/ai/subject-lines with valid email body returns 5 suggestions
  - Test endpoint caches results
  - Test endpoint requires authentication
  - Test endpoint validates input
  - Test endpoint handles empty/short email bodies

- [ ] Write integration tests for OpenAI API
  - Test actual API call with real OpenAI key
  - Test response time <2 seconds
  - Test handling rate limits and errors

- [ ] Write integration tests for extension UI
  - Test clicking "Generate Subject Lines" button calls API
  - Test 5 suggestions displayed
  - Test clicking suggestion updates subject field
  - Test loading state shown during generation

- [ ] Write quality tests
  - Test subject lines are relevant to email content
  - Test subject lines vary (not all similar)
  - Test subject lines for different email types (sales, support, follow-up)

- [ ] Run all tests and ensure 70%+ code coverage
  - Execute test suite
  - Verify subject line generation and caching fully tested
  - Document OpenAI costs per generation

---

## Definition of Done

- [ ] Subject line generation working
- [ ] Quality suggestions generated
- [ ] Extension UI functional
- [ ] Performance acceptable


