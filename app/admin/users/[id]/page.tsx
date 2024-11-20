import { Metadata } from "next"
import { UserForm } from "@/components/admin/users/user-form"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { getUser } from "@/lib/api/users"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Edit User",
  description: "Edit user account details",
}

interface EditUserPageProps {
  params: {
    id: string
  }
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="ghost" size="sm">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">Edit User</h2>
      </div>
      <div className="max-w-2xl">
        <UserForm user={user} />
      </div>
    </div>
  )
}
