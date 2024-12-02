import { Button } from "@/components/ui/button";
import { StateSelector } from "@/components/state-selector";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { StatsSection } from "@/components/stats-section";
import { GraduationCap, BookOpen, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ErrorBoundary } from "@/app/error-boundary";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Driver's Ed Stories
        </h1>
        <p className="text-xl text-center mb-8">
          Learn to drive through interactive stories
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Story Cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Story {i}</h2>
              <p className="text-gray-600 mb-4">
                Learn about traffic rules and safe driving practices through our interactive stories.
              </p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Start Reading
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}