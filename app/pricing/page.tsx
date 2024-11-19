import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PricingCard } from "@/components/pricing/pricing-card"

export default async function PricingPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="container py-20">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <h1 className="text-4xl font-bold">Start Your Learning Journey</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Get full access to all features for just $7 per year
        </p>
      </div>

      <PricingCard userId={session?.user?.id} />

      <div className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-6">Everything You Need to Succeed</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-4">
            <h3 className="font-semibold">Learning Content</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Access to all state-specific stories</li>
              <li>Interactive learning scenarios</li>
              <li>Visual aids and diagrams</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Practice & Testing</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Unlimited practice tests</li>
              <li>Adaptive difficulty system</li>
              <li>Detailed performance analytics</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold">Extra Features</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Achievement system</li>
              <li>Progress tracking</li>
              <li>Study groups</li>
              <li>Priority support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}