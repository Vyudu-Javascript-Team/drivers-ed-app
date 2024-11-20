import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  BookOpen,
  BarChart2,
  Settings,
  CreditCard,
  Bell,
  FileText,
  GraduationCap,
  HelpCircle,
} from "lucide-react";

const adminNavItems = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: BarChart2,
  },
  {
    title: "User Management",
    href: "/admin/dashboard/users",
    icon: Users,
  },
  {
    title: "Content Management",
    href: "/admin/dashboard/content",
    icon: BookOpen,
    children: [
      {
        title: "Stories",
        href: "/admin/dashboard/content/stories",
        icon: FileText,
      },
      {
        title: "Practice Tests",
        href: "/admin/dashboard/content/tests",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Analytics",
    href: "/admin/dashboard/analytics",
    icon: BarChart2,
  },
  {
    title: "Subscriptions",
    href: "/admin/dashboard/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Notifications",
    href: "/admin/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Support",
    href: "/admin/dashboard/support",
    icon: HelpCircle,
  },
  {
    title: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 min-h-screen bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="space-y-2">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>

              {item.children && (
                <div className="ml-6 mt-2 space-y-2">
                  {item.children.map((child) => {
                    const isChildActive = pathname === child.href;

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                          isChildActive
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        )}
                      >
                        <child.icon className="h-4 w-4" />
                        <span>{child.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
