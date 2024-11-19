import { describe, expect, it, jest } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/tests/[testId]/route'

jest.mock('@/lib/auth', () => ({
  authOptions: {},
  getServerSession: jest.fn(() => ({
    user: { id: 'test-user-id' }
  }))
}))

describe('Tests API', () => {
  it('fetches test by id', async () => {
    const { req } = createMocks({
      method: 'GET',
    })

    const response = await GET(req, { params: { testId: '1' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })

  it('submits test answers', async () => {
    const { req } = createMocks({
      method: 'POST',
      body: {
        answers: [0, 1, 2],
        timeSpent: 300,
      },
    })

    const response = await POST(req, { params: { testId: '1' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})