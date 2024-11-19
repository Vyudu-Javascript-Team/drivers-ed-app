export type AnalyticsEvent = {
  name: string
  properties?: Record<string, any>
}

class Analytics {
  private async track(event: AnalyticsEvent) {
    if (process.env.NODE_ENV === 'production') {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(event),
        })
      } catch (error) {
        console.error('Failed to track event:', error)
      }
    } else {
      console.log('Analytics Event:', event)
    }
  }

  pageView(path: string) {
    this.track({
      name: 'page_view',
      properties: { path },
    })
  }

  storyStarted(storyId: string, state: string) {
    this.track({
      name: 'story_started',
      properties: { storyId, state },
    })
  }

  storyCompleted(storyId: string, state: string) {
    this.track({
      name: 'story_completed',
      properties: { storyId, state },
    })
  }

  testStarted(testId: string, state: string) {
    this.track({
      name: 'test_started',
      properties: { testId, state },
    })
  }

  testCompleted(testId: string, state: string, score: number) {
    this.track({
      name: 'test_completed',
      properties: { testId, state, score },
    })
  }
}

export const analytics = new Analytics()