import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  FileQuestion,
  Settings,
  LayoutDashboard
} from "lucide-react"

export function ContentNav() {
  const pathname = usePathname()

  const items = [
    {
      title: "Overview",
      href: "/admin/content",
      icon: LayoutDashboard,
    },
    {
      title: "Tests",
      href: "/admin/content/tests",
      icon: FileQuestion,
    },
    {
      title: "Stories",
      href: "/admin/content/stories",
      icon: BookOpen,
    },
    {
      title: "Settings",
      href: "/admin/content/settings",
      icon: Settings,
    },
  ]

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <Icon size={16} />
              {item.title}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}
