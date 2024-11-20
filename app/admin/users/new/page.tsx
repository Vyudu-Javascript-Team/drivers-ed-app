import { Metadata } from "next"
import { UserForm } from "@/components/admin/users/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Add New User",
  description: "Create a new user account",
}

export default function NewUserPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Add New User</h2>
      </div>
      <div className="max-w-2xl">
        <UserForm />
      </div>
    </div>
  )
}
