export type AnalyticsEvent = {
  name: string
  properties?: Record<string, any>
  userId?: string
  timestamp?: string
}

class Analytics {
  private async track(event: AnalyticsEvent) {
    const enrichedEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      clientVersion: process.env.NEXT_PUBLIC_APP_VERSION,
    }

    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enrichedEvent),
        })
      } catch (error) {
        console.error('Failed to track event:', error)
      }
    } else {
      console.log('Analytics Event:', enrichedEvent)
    }
  }

  // Page and Navigation Events
  pageView(path: string, userId?: string) {
    this.track({
      name: 'page_view',
      properties: { 
        path,
        referrer: document?.referrer,
        userAgent: navigator?.userAgent,
      },
      userId,
    })
  }

  // Story Events
  storyStarted(storyId: string, state: string, userId?: string) {
    this.track({
      name: 'story_started',
      properties: { storyId, state },
      userId,
    })
  }

  storyCompleted(storyId: string, state: string, userId?: string) {
    this.track({
      name: 'story_completed',
      properties: { storyId, state },
      userId,
    })
  }

  storyInteraction(storyId: string, interactionType: string, userId?: string) {
    this.track({
      name: 'story_interaction',
      properties: { storyId, interactionType },
      userId,
    })
  }

  // Test Events
  testStarted(testId: string, state: string, userId?: string) {
    this.track({
      name: 'test_started',
      properties: { testId, state },
      userId,
    })
  }

  testCompleted(testId: string, state: string, score: number, timeSpent: number, userId?: string) {
    this.track({
      name: 'test_completed',
      properties: { 
        testId, 
        state, 
        score,
        timeSpent,
        passingScore: score >= 70,
      },
      userId,
    })
  }

  // User Achievement Events
  achievementUnlocked(achievementId: string, type: string, userId?: string) {
    this.track({
      name: 'achievement_unlocked',
      properties: { achievementId, type },
      userId,
    })
  }

  xpGained(amount: number, source: string, userId?: string) {
    this.track({
      name: 'xp_gained',
      properties: { amount, source },
      userId,
    })
  }

  levelUp(newLevel: number, userId?: string) {
    this.track({
      name: 'level_up',
      properties: { newLevel },
      userId,
    })
  }

  // Subscription Events
  subscriptionStarted(planId: string, userId?: string) {
    this.track({
      name: 'subscription_started',
      properties: { planId },
      userId,
    })
  }

  subscriptionCancelled(planId: string, reason?: string, userId?: string) {
    this.track({
      name: 'subscription_cancelled',
      properties: { planId, reason },
      userId,
    })
  }

  // Error Events
  errorOccurred(errorType: string, message: string, userId?: string) {
    this.track({
      name: 'error_occurred',
      properties: { 
        errorType, 
        message,
        url: window?.location?.href,
      },
      userId,
    })
  }

  // Feature Usage Events
  featureUsed(featureName: string, userId?: string) {
    this.track({
      name: 'feature_used',
      properties: { featureName },
      userId,
    })
  }

  // Search Events
  searchPerformed(query: string, resultCount: number, userId?: string) {
    this.track({
      name: 'search_performed',
      properties: { 
        query, 
        resultCount,
        hasResults: resultCount > 0,
      },
      userId,
    })
  }
}

export const analytics = new Analytics()