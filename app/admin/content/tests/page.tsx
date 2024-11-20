import { Metadata } from "next"
import { TestsList } from "@/components/admin/content/tests-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tests Management",
  description: "Create and manage practice tests",
}

export default async function TestsPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tests</h2>
        <Link href="/admin/content/tests/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Test
          </Button>
        </Link>
      </div>
      <TestsList />
    </div>
  )
}
