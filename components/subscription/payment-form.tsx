'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Bank, Receipt } from 'lucide-react'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export function PaymentForm() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubscribe = async () => {
    if (!session?.user) {
      toast.error('Please sign in to subscribe')
      router.push('/auth/signin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          paymentMethod,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          toast.error(error.message)
        }
      }
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Choose Payment Method</h3>
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Credit/Debit Card
                </div>
              </SelectItem>
              <SelectItem value="us_bank_account">
                <div className="flex items-center gap-2">
                  <Bank className="h-4 w-4" />
                  Bank Account (ACH)
                </div>
              </SelectItem>
              <SelectItem value="cashapp">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Cash App
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Your subscription includes:
          </p>
          <ul className="text-sm space-y-1">
            <li>• Full access to all state content</li>
            <li>• Unlimited practice tests</li>
            <li>• Progress tracking</li>
            <li>• 7-day free trial</li>
          </ul>
        </div>

        <Button
          className="w-full"
          onClick={handleSubscribe}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Subscribe - $7/year'}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          By subscribing, you agree to our terms of service and privacy policy.
          You can cancel anytime.
        </p>
      </div>
    </Card>
  )
}