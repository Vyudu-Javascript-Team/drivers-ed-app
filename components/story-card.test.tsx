import { render, screen, fireEvent } from '@testing-library/react'
import { StoryCard } from './story-card'

describe('StoryCard', () => {
  it('renders story information', () => {
    render(
      <StoryCard
        title="Test Story"
        description="Test Description"
        storyId="1"
        state="GA"
      />
    )

    expect(screen.getByText('Test Story')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
  })

  it('shows locked state for premium content', () => {
    render(
      <StoryCard
        title="Premium Story"
        description="Premium Content"
        storyId="2"
        state="GA"
        isLocked={true}
      />
    )

    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})