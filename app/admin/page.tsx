import { Card } from "@/components/ui/card"
import { Overview } from "@/components/admin/overview"
import { RecentActivity } from "@/components/admin/recent-activity"
import { UserStats } from "@/components/admin/user-stats"

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
      </div>

      <UserStats />

      <div className="grid gap-8 md:grid-cols-7">
        <Card className="col-span-4 p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Overview</h2>
          <Overview />
        </Card>

        <Card className="col-span-3 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <RecentActivity />
        </Card>
      </div>
    </div>
  )
}