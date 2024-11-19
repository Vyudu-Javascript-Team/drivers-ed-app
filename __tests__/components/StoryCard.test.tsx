import { render, screen, fireEvent } from '@testing-library/react'
import { StoryCard } from '@/components/stories/story-card'
import { Story } from '@/types'

const mockStory: Story = {
  id: '1',
  title: 'Right of Way Rules',
  description: 'Learn about right of way rules at intersections',
  content: 'Story content here',
  difficulty: 'intermediate',
  xpReward: 100,
  state: 'CA',
  published: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('StoryCard', () => {
  it('renders story information correctly', () => {
    render(<StoryCard story={mockStory} />)
    
    expect(screen.getByText(mockStory.title)).toBeInTheDocument()
    expect(screen.getByText(mockStory.description)).toBeInTheDocument()
    expect(screen.getByText(`${mockStory.xpReward} XP`)).toBeInTheDocument()
  })

  it('shows difficulty badge with correct color', () => {
    render(<StoryCard story={mockStory} />)
    
    const badge = screen.getByText(/intermediate/i)
    expect(badge).toHaveClass('bg-yellow-100')
  })

  it('navigates to story detail page when clicked', () => {
    const mockRouter = jest.fn()
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: mockRouter
      })
    }))

    render(<StoryCard story={mockStory} />)
    fireEvent.click(screen.getByRole('link'))
    
    expect(mockRouter).toHaveBeenCalledWith(`/stories/${mockStory.id}`)
  })
})
