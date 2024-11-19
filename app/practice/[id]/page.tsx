import { notFound } from 'next/navigation'
import { AdaptiveTest } from '@/components/test/adaptive-test'

export default function PracticeTestPage({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="container py-8">
      <AdaptiveTest testId={params.id} />
    </div>
  )
}