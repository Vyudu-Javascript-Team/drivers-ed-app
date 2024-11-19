import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/stories', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'Atlanta Traffic Tales',
        description: 'Learn about Georgia traffic rules',
        state: 'GA',
        progress: 0,
      },
    ])
  }),

  http.get('/api/achievements', () => {
    return HttpResponse.json([
      {
        id: '1',
        title: 'First Story Complete',
        description: 'Completed your first story',
        xpReward: 100,
        unlockedAt: new Date().toISOString(),
      },
    ])
  }),

  http.get('/api/subscription', () => {
    return HttpResponse.json({
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }),
]