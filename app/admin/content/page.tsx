import { Metadata } from "next"
import { ContentOverview } from "@/components/admin/content/content-overview"
import { ContentStats } from "@/components/admin/content/content-stats"
import { RecentContent } from "@/components/admin/content/recent-content"

export const metadata: Metadata = {
  title: "Content Management",
  description: "Manage your educational content",
}

export default async function ContentPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
      </div>
      <ContentStats />
      <div className="grid gap-6 md:grid-cols-2">
        <ContentOverview />
        <RecentContent />
      </div>
    </div>
  )
}
