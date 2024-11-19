import { notFound } from "next/navigation"
import { StoryCard } from "@/components/story-card"

const STATES = ["ga", "fl", "nj", "ca", "la", "in"]

export function generateStaticParams() {
  return STATES.map((state) => ({
    state,
  }))
}

export default function StatePage({ params }: { params: { state: string } }) {
  if (!STATES.includes(params.state)) {
    notFound()
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">
        Driver's Education for {params.state.toUpperCase()}
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stories will be fetched and rendered here */}
      </div>
    </div>
  )
}