import { Metadata } from "next"
import { getServerSession } from "next-auth"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your learning progress and available courses",
}

export default async function DashboardPage() {
  const session = await getServerSession()

  return (
    <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
          Welcome back, {session?.user?.name}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Continue your learning journey where you left off.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Course cards will go here */}
      </div>
    </div>
  )
}