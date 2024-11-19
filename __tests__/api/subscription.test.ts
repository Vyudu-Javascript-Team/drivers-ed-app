import { describe, expect, it, jest } from '@jest/globals'
import { NextRequest } from 'next/server'
import { POST as createCheckoutSession } from '@/app/api/payment/create-checkout/route'
import { POST as createCustomerPortal } from '@/app/api/payment/create-portal/route'
import { stripe } from '@/lib/stripe'

jest.mock('@/lib/stripe')
jest.mock('@/lib/auth', () => ({
  getServerSession: jest.fn(() => ({
    user: {
      id: 'test-user-id',
      email: 'test@example.com'
    }
  }))
}))

describe('Subscription API', () => {
  describe('create-checkout', () => {
    it('creates a checkout session successfully', async () => {
      const mockSession = {
        id: 'test-session-id',
        url: 'https://checkout.stripe.com/test'
      }
      
      ;(stripe.checkout.sessions.create as jest.Mock).mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/payment/create-checkout', {
        method: 'POST',
        body: JSON.stringify({ priceId: 'test-price-id' })
      })
      
      const response = await createCheckoutSession(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual({ sessionId: mockSession.id })
    })

    it('handles missing price ID', async () => {
      const request = new NextRequest('http://localhost:3000/api/payment/create-checkout', {
        method: 'POST',
        body: JSON.stringify({})
      })
      
      const response = await createCheckoutSession(request)
      
      expect(response.status).toBe(400)
    })
  })

  describe('create-portal', () => {
    it('creates a customer portal session successfully', async () => {
      const mockSession = {
        url: 'https://billing.stripe.com/test'
      }
      
      ;(stripe.billingPortal.sessions.create as jest.Mock).mockResolvedValue(mockSession)
      
      const request = new NextRequest('http://localhost:3000/api/payment/create-portal', {
        method: 'POST'
      })
      
      const response = await createCustomerPortal(request)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data).toEqual({ url: mockSession.url })
    })
  })
})
