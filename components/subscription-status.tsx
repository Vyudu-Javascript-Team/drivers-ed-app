'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Calendar, CreditCard, AlertTriangle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

interface SubscriptionData {
  status: 'active' | 'canceled' | 'past_due' | 'none'
  currentPeriodEnd?: string
  cancelAtPeriodEnd?: boolean
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData>({ status: 'none' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch subscription status
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription')
      const data = await response.json()
      setSubscription(data)
    } catch (error) {
      console.error('Failed to fetch subscription status:', error)
    }
  }

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
      })
      const data = await response.json()
      
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } catch (error) {
      console.error('Failed to initiate subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Subscription Status</h2>
      
      {subscription.status === 'active' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-500">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="font-medium">Active Subscription</span>
          </div>
          
          {subscription.currentPeriodEnd && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Renews on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</span>
            </div>
          )}
          
          {subscription.cancelAtPeriodEnd && (
            <div className="flex items-center gap-2 text-yellow-500">
              <AlertTriangle className="h-4 w-4" />
              <span>Cancels at period end</span>
            </div>
          )}
        </div>
      )}

      {subscription.status === 'none' && (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Subscribe to access all stories and practice tests.
          </p>
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Subscribe Now - $7/year
          </Button>
        </div>
      )}

      {subscription.status === 'past_due' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <span>Payment Past Due</span>
          </div>
          <Button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full"
            variant="destructive"
          >
            Update Payment Method
          </Button>
        </div>
      )}
    </Card>
  )
}