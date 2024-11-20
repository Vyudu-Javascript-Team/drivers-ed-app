import { Metadata } from "next"
import { AnalyticsOverview } from "@/components/admin/analytics/analytics-overview"
import { UserActivity } from "@/components/admin/analytics/user-activity"
import { TestPerformance } from "@/components/admin/analytics/test-performance"
import { TopicProgress } from "@/components/admin/analytics/topic-progress"
import { DateRangePicker } from "@/components/date-range-picker"

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "View detailed analytics and insights",
}

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <DateRangePicker />
      </div>
      <AnalyticsOverview />
      <div className="grid gap-6 md:grid-cols-2">
        <UserActivity />
        <TestPerformance />
      </div>
      <TopicProgress />
    </div>
  )
}
