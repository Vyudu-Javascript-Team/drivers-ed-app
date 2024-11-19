import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AuthError({
  searchParams,
}: {
  searchParams: { error: string };
}) {
  const error = searchParams?.error || "An error occurred";

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link was invalid or has expired.",
    Default: "An error occurred during authentication.",
  };

  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px] p-6">
        <div className="flex flex-col items-center gap-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Authentication Error
            </h1>
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
          <Button asChild className="w-full">
            <Link href="/auth/signin">Try Again</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}