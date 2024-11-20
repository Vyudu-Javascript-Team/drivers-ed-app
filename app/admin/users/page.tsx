import { Metadata } from "next"
import { UserList } from "@/components/admin/users/user-list"
import { UserFilters } from "@/components/admin/users/user-filters"

export const metadata: Metadata = {
  title: "User Management",
  description: "Manage user accounts and permissions",
}

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      </div>
      <div className="flex flex-col space-y-8">
        <UserFilters />
        <UserList />
      </div>
    </div>
  )
}
