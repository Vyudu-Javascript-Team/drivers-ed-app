'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Users,
  BookOpen,
  ClipboardList,
  Settings,
  BarChart,
  CreditCard,
} from 'lucide-react'

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: BarChart,
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Stories',
    href: '/admin/stories',
    icon: BookOpen,
  },
  {
    title: 'Tests',
    href: '/admin/tests',
    icon: ClipboardList,
  },
  {
    title: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: CreditCard,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <div className="border-r bg-secondary/10">
      <div className="flex flex-col gap-2 p-4">
        <div className="px-2 py-2">
          <h2 className="px-4 text-lg font-semibold">Admin Dashboard</h2>
        </div>
        <nav className="grid gap-1 px-2">
          {adminNavItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  pathname === item.href && 'bg-secondary'
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}