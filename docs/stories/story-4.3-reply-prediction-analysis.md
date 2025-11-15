# Story 4.3: AI Reply Prediction & Analysis

**Story ID:** STORY-4.3  
**Epic:** Epic 4 - AI-Powered Features  
**Priority:** P2 - Nice to Have  
**Story Points:** 8  
**Estimated Time:** 6-8 hours  
**Status:** Not Started

---

## User Story

**As a** user  
**I want** AI to predict the likelihood of getting a reply  
**So that** I can prioritize my follow-ups effectively

---

## Acceptance Criteria

- [ ] POST /api/ai/predict-reply analyzes email content and recipient history
- [ ] Returns reply probability (0-100%) with explanation
- [ ] Factors considered: subject urgency, body length, time of day, recipient engagement history
- [ ] Dashboard shows predicted reply rates for sent emails
- [ ] Highlights emails with low reply probability for revision

---

## Requirements Traceability

**PRD Coverage:**
- **FR21:** AI reply prediction analysis
- **NFR4:** OpenAI GPT-4 integration

**Architecture References:**
- AI Integration: OpenAI GPT-4 for prediction
- Data Analysis: Historical recipient engagement patterns
- Prediction Model: Multi-factor analysis (subject, body, timing, history)

**Epic Context:**
Reply prediction helps users prioritize follow-ups and identify emails that need improvement before sending, directly impacting productivity and success rates.

---

## Testing Strategy

**Test Approach:**
- **Unit Tests:** Prediction algorithm, factor weighting
- **Integration Tests:** Full prediction flow with historical data
- **Accuracy Tests:** Compare predictions vs actual replies over time
- **UI Tests:** Dashboard display, visual indicators

**Test Environment:**
- Historical email data with known reply outcomes
- Various email types and recipient patterns
- OpenAI API testing

**Success Metrics:**
- Prediction accuracy: Target 70%+ correlation with actual replies
- Response time: <3 seconds
- Useful insights: Actionable feedback provided
- User satisfaction: Predictions feel accurate

**Testing Tools:**
- Historical data analysis
- A/B testing of predictions
- User feedback collection

---

## Dependencies

**Prerequisites (Must Complete First):**
- [Story 1.6 - Email Tracking Integration](./story-1.6-email-tracking-integration-end-to-end.md) - Historical tracking data
- [Story 4.1 - OpenAI Email Scoring](./story-4.1-openai-email-scoring.md) - OpenAI service foundation
- [Story 3.3 - Analytics Dashboard](./story-3.3-dashboard-ui-charts.md) - Dashboard for displaying predictions

**Blocks (Stories Waiting on This):**
- None (enhancement feature)

**Related Stories:**
- [Story 4.1 - AI Email Scoring](./story-4.1-openai-email-scoring.md) - Similar AI analysis pattern

---

## Developer Implementation Checklist

### Phase 1: Prediction Model (45 min)

- [ ] **Step 1.1:** Create reply prediction prompt
  ```typescript
  private createReplyPredictionPrompt(
    subject: string,
    body: string,
    recipientHistory?: {
      previous_emails_sent: number;
      previous_replies: number;
      avg_reply_time_hours?: number;
    }
  ): string {
    const historyContext = recipientHistory 
      ? `Recipient history: ${recipientHistory.previous_emails_sent} emails sent, ${recipientHistory.previous_replies} replied (${Math.round(recipientHistory.previous_replies / recipientHistory.previous_emails_sent * 100)}% reply rate)`
      : 'No previous email history with this recipient';
    
    return `Analyze this email and predict the likelihood of receiving a reply.

Subject: "${subject}"

Body:
"""
${body}
"""

${historyContext}

Consider these factors:
1. Call-to-action clarity: Is there a clear question or request?
2. Email length: Is it concise and scannable?
3. Subject line: Does it create urgency or interest?
4. Personalization: Is it tailored to the recipient?
5. Timing: Current time and day (if applicable)
6. Recipient history: Past engagement patterns

Provide analysis as JSON:
{
  "reply_probability": <0-100>,
  "confidence": "Low" | "Medium" | "High",
  "key_factors": {
    "positive": ["Factor that increases reply probability"],
    "negative": ["Factor that decreases reply probability"]
  },
  "suggestions": ["Actionable improvement"],
  "reasoning": "Brief explanation"
}`;
  }
  ```

- [ ] **Step 1.2:** Implement prediction method
  ```typescript
  async predictReplyProbability(
    subject: string,
    body: string,
    recipientEmail: string
  ): Promise<ReplyPrediction> {
    // Fetch recipient history
    const history = await this.getRecipientHistory(recipientEmail);
    
    const prompt = this.createReplyPredictionPrompt(subject, body, history);
    
    const completion = await this.client.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert email analyst predicting reply probability.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower for consistent predictions
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });
    
    const prediction = JSON.parse(completion.choices[0].message.content);
    return prediction;
  }
  
  interface ReplyPrediction {
    reply_probability: number;
    confidence: 'Low' | 'Medium' | 'High';
    key_factors: {
      positive: string[];
      negative: string[];
    };
    suggestions: string[];
    reasoning: string;
  }
  ```

### Phase 2: Historical Data Integration (30 min)

- [ ] Create reply prediction model (GPT-4 or fine-tuned model)
- [ ] Gather historical reply data for training
- [ ] Implement prediction algorithm considering multiple factors
- [ ] Create endpoint POST `/api/ai/predict-reply`
- [ ] Add reply probability field to tracked emails
- [ ] Display prediction in dashboard
- [ ] Add visual indicator (low/medium/high probability)
- [ ] Extension shows prediction before sending

### QA Verification Checklist

- [ ] Compose vague email with no call-to-action
- [ ] Prediction: 15% reply probability
- [ ] Explanation: "No clear question or call-to-action"
- [ ] Revise email with specific question
- [ ] Prediction: 65% reply probability
- [ ] Send email, recipient replies
- [ ] Track accuracy over time

---

## Definition of Done

- [ ] Reply prediction working
- [ ] Predictions reasonably accurate
- [ ] Dashboard displays predictions
- [ ] Extension integration complete


