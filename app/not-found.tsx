import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileQuestion } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
          <h2 className="text-xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}