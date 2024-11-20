import { Metadata } from "next"
import { UserForm } from "@/components/admin/users/user-form"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Edit User",
  description: "Edit user details and permissions",
}

export default function EditUserPage({ params }: { params: { userId: string } }) {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
      </div>
      <UserForm userId={params.userId} />
    </div>
  )
}
