'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { NavigationMenu } from '@/components/ui/navigation-menu';
import { UserNav } from '@/components/user-nav';
import { Stethoscope } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <Stethoscope className="h-6 w-6" />
            <span className="font-bold">DriversEd Stories</span>
          </Link>
          <NavigationMenu />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          {session ? (
            <UserNav user={session.user} />
          ) : (
            <Button asChild variant="secondary">
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}