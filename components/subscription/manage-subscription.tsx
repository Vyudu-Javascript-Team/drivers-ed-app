'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Settings } from 'lucide-react'

interface ManageSubscriptionProps {
  subscriptionStatus: string
  periodEnd?: Date
  cancelAtPeriodEnd?: boolean
}

export function ManageSubscription({
  subscriptionStatus,
  periodEnd,
  cancelAtPeriodEnd,
}: ManageSubscriptionProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleManageSubscription = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/manage', {
        method: 'POST',
      })
      const { url } = await response.json()
      router.push(url)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Subscription Status</h3>
            <p className="text-sm text-muted-foreground">
              Manage your subscription and payment methods
            </p>
          </div>
          <div className={`px-2 py-1 rounded-full text-sm ${
            subscriptionStatus === 'active'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}>
            {subscriptionStatus}
          </div>
        </div>

        {periodEnd && (
          <div className="text-sm text-muted-foreground">
            {cancelAtPeriodEnd ? (
              <>
                Your subscription will end on{' '}
                {new Date(periodEnd).toLocaleDateString()}
              </>
            ) : (
              <>
                Next billing date:{' '}
                {new Date(periodEnd).toLocaleDateString()}
              </>
            )}
          </div>
        )}

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleManageSubscription}
            disabled={loading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {loading ? 'Loading...' : 'Update Payment Method'}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleManageSubscription}
            disabled={loading}
          >
            <Settings className="mr-2 h-4 w-4" />
            {loading ? 'Loading...' : 'Manage Subscription'}
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Need help? Contact our support team.
        </p>
      </div>
    </Card>
  )
}