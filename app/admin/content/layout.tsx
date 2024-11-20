import { Metadata } from "next"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ContentNav } from "@/components/admin/content/content-nav"

export const metadata: Metadata = {
  title: "Content Management",
  description: "Manage tests, stories, and educational content",
}

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] px-8">
      <aside className="hidden w-[200px] flex-col md:flex">
        <ContentNav />
      </aside>
      <main className="flex w-full flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
