"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RichText } from "@/components/ui/rich-text";

interface StoryContentProps {
  story: any;
}

export function StoryContent({ story }: StoryContentProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const sections = story.content || [];

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <h1 className="text-3xl font-bold mb-6">{story.title}</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <RichText content={sections[currentSection]} />
        </div>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentSection === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous Section
        </Button>
        <Button
          onClick={handleNext}
          disabled={currentSection === sections.length - 1}
        >
          Next Section
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}