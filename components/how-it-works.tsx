import { Card } from "@/components/ui/card"
import { BookOpen, GraduationCap, Trophy } from "lucide-react"

const steps = [
  {
    icon: BookOpen,
    title: "1. Read Stories",
    description: "Engage with interactive stories that teach driving rules",
  },
  {
    icon: GraduationCap,
    title: "2. Take Practice Tests",
    description: "Test your knowledge with state-specific practice exams",
  },
  {
    icon: Trophy,
    title: "3. Earn Achievements",
    description: "Track your progress and earn rewards as you learn",
  },
]

export function HowItWorks() {
  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24 bg-secondary/50">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          How It Works
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Three simple steps to master your driver's test
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {steps.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="flex flex-col items-center space-y-4 p-6">
            <Icon className="h-12 w-12" />
            <h3 className="font-bold">{title}</h3>
            <p className="text-center text-sm text-muted-foreground">{description}</p>
          </Card>
        ))}
      </div>
    </section>
  )
}