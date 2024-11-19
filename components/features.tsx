import { Card } from "@/components/ui/card"
import { BookOpen, Trophy, Users, Zap } from "lucide-react"

const features = [
  {
    icon: BookOpen,
    title: "Story-Based Learning",
    description: "Learn through engaging stories featuring your favorite artists",
  },
  {
    icon: Trophy,
    title: "Gamified Experience",
    description: "Earn achievements and compete on leaderboards",
  },
  {
    icon: Users,
    title: "State-Specific Content",
    description: "Content tailored to your state's requirements",
  },
  {
    icon: Zap,
    title: "Interactive Practice",
    description: "Test your knowledge with interactive quizzes",
  },
]

export function Features() {
  return (
    <section className="container space-y-6 py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Everything you need to pass your driver's test with confidence
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-4">
        {features.map(({ icon: Icon, title, description }) => (
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