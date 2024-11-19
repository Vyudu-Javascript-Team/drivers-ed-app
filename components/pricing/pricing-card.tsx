import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import { PLANS } from "@/lib/stripe";
import { toast } from "sonner";

interface PricingCardProps {
  userId?: string;
}

export function PricingCard({ userId }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubscribe = async () => {
    if (!userId) {
      router.push("/auth/signin");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const { sessionId } = await response.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold">Annual Access</h3>
        <div className="mt-4">
          <span className="text-4xl font-bold">$7</span>
          <span className="text-muted-foreground">/year</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        <li className="flex items-center">
          <Check className="h-5 w-5 text-primary mr-2" />
          <span>Access to all state-specific content</span>
        </li>
        <li className="flex items-center">
          <Check className="h-5 w-5 text-primary mr-2" />
          <span>Unlimited practice tests</span>
        </li>
        <li className="flex items-center">
          <Check className="h-5 w-5 text-primary mr-2" />
          <span>Progress tracking & achievements</span>
        </li>
        <li className="flex items-center">
          <Check className="h-5 w-5 text-primary mr-2" />
          <span>Interactive learning tools</span>
        </li>
        <li className="flex items-center">
          <Check className="h-5 w-5 text-primary mr-2" />
          <span>Study groups & community features</span>
        </li>
      </ul>

      <Button 
        className="w-full" 
        size="lg" 
        onClick={onSubscribe}
        disabled={loading}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {userId ? "Subscribe Now" : "Sign in to Subscribe"}
      </Button>

      <p className="text-sm text-muted-foreground text-center mt-4">
        Secure payment via Stripe. Cancel anytime.
      </p>
    </Card>
  );
}