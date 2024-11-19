import { describe, expect, it } from '@jest/globals'
import { createMocks } from 'node-mocks-http'
import { POST } from './route'

describe('Story Progress API', () => {
  it('updates story progress', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        progress: 50,
      },
      query: {
        storyId: '1',
      },
    })

    const response = await POST(req, { params: { storyId: '1' } })
    expect(response.status).toBe(200)
  })
})