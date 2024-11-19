import { Redis } from '@upstash/redis'
import { NextRequest, NextResponse } from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export async function rateLimit(req: NextRequest) {
  const ip = req.ip ?? '127.0.0.1'
  const key = `rate-limit:${ip}`
  
  const window = 60 // 1 minute
  const max = 100 // max requests per window

  try {
    const result = await redis.multi()
      .incr(key)
      .expire(key, window)
      .exec()

    const count = result?.[0] as number

    if (count > max) {
      return new NextResponse('Too Many Requests', {
        status: 429,
        headers: {
          'Retry-After': window.toString(),
        },
      })
    }
  } catch (error) {
    console.error('Rate limit error:', error)
  }

  return null
}
