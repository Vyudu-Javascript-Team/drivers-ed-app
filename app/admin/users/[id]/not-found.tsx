import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UserNotFound() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-bold">User Not Found</h2>
      <p className="text-muted-foreground">The user you're looking for doesn't exist or has been deleted.</p>
      <Link href="/admin/users">
        <Button>Return to Users</Button>
      </Link>
    </div>
  )
}
