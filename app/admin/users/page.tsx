import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { UserList } from "@/components/admin/users/user-list"
import { UserFilters } from "@/components/admin/users/user-filters"
import { PlusIcon, DownloadIcon, UploadIcon } from "@radix-ui/react-icons"
import Link from "next/link"

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage user accounts and permissions",
}

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <UploadIcon className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Link href="/admin/users/new">
            <Button size="sm">
              <PlusIcon className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col space-y-8">
        <UserFilters />
        <UserList />
      </div>
    </div>
  )
}
