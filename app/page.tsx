import { getPayloadClient } from "@/lib/payload";
import { Button } from "@/components/ui/button";
import { StateSelector } from "@/components/state-selector";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { StatsSection } from "@/components/stats-section";
import { GraduationCap, BookOpen, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const payload = await getPayloadClient();
  const { docs: stats } = await payload.find({
    collection: 'stats',
    limit: 1,
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-32 pb-20">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl font-bold leading-tight lg:text-6xl lg:leading-[1.2]">
                Master Your Driver's Test Through{" "}
                <span className="text-primary">Interactive Stories</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Join thousands of learners who've passed their driver's test using our 
                engaging, story-based learning platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <StateSelector />
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src="/images/hero-dashboard.png" 
                  alt="Platform Preview"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection 
        stats={[
          { label: "Learners", value: "50,000+" },
          { label: "Pass Rate", value: "95%" },
          { label: "States Covered", value: "15+" },
          { label: "Stories Created", value: "1,000+" },
        ]}
      />

      {/* Features Grid */}
      <section className="py-20 bg-secondary/10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to pass your driver's test with confidence
            </p>
          </div>
          <Features />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Journey to Success</h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to master your driver's test
            </p>
          </div>
          <HowItWorks />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-secondary/10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of satisfied learners
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl bg-primary p-12 text-primary-foreground text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Get unlimited access to all stories and practice tests
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">
                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}