import { Metadata } from "next"
import { TestForm } from "@/components/admin/content/test-form"

export const metadata: Metadata = {
  title: "Create Test",
  description: "Create a new practice test",
}

export default function NewTestPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create New Test</h2>
      </div>
      <TestForm />
    </div>
  )
}
