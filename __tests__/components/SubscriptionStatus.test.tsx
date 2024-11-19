import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SubscriptionStatus } from '@/components/subscription/subscription-status'
import { useSubscription } from '@/hooks/use-subscription'

jest.mock('@/hooks/use-subscription')

const mockSubscription = {
  status: 'active',
  currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  cancelAtPeriodEnd: false
}

describe('SubscriptionStatus', () => {
  beforeEach(() => {
    (useSubscription as jest.Mock).mockReturnValue({
      subscription: mockSubscription,
      isLoading: false
    })
  })

  it('displays active subscription details correctly', () => {
    render(<SubscriptionStatus />)
    
    expect(screen.getByText(/Active/)).toBeInTheDocument()
    expect(screen.getByText(/Renews/)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    ;(useSubscription as jest.Mock).mockReturnValue({
      subscription: null,
      isLoading: true
    })

    render(<SubscriptionStatus />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('displays cancellation status when subscription is set to cancel', () => {
    ;(useSubscription as jest.Mock).mockReturnValue({
      subscription: {
        ...mockSubscription,
        cancelAtPeriodEnd: true
      },
      isLoading: false
    })

    render(<SubscriptionStatus />)
    
    expect(screen.getByText(/Cancels/)).toBeInTheDocument()
  })

  it('handles subscription management button click', async () => {
    const mockCreatePortal = jest.fn().mockResolvedValue({ url: 'https://stripe.com/portal' })
    global.window.location.assign = jest.fn()

    render(<SubscriptionStatus createPortal={mockCreatePortal} />)
    
    fireEvent.click(screen.getByText(/Manage Subscription/))
    
    await waitFor(() => {
      expect(mockCreatePortal).toHaveBeenCalled()
      expect(window.location.assign).toHaveBeenCalledWith('https://stripe.com/portal')
    })
  })

  it('displays error message when portal creation fails', async () => {
    const mockCreatePortal = jest.fn().mockRejectedValue(new Error('Portal creation failed'))

    render(<SubscriptionStatus createPortal={mockCreatePortal} />)
    
    fireEvent.click(screen.getByText(/Manage Subscription/))
    
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument()
    })
  })
})
