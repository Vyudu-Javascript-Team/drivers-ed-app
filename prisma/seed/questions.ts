import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Comprehensive practice test questions for each state
const questions = {
  GA: [
    {
      text: "What is the speed limit in a residential area unless otherwise posted?",
      options: [
        "25 mph",
        "30 mph",
        "35 mph",
        "40 mph",
      ],
      correctAnswer: 1,
      explanation: "In Georgia, the default speed limit in residential areas is 30 mph unless otherwise posted.",
      category: "SPEED_LIMITS",
      difficulty: "MEDIUM",
      points: 1,
    },
    {
      text: "When is it legal to pass a school bus in Georgia?",
      options: [
        "When the yellow lights are flashing",
        "When driving on a divided highway and the bus is on the other side",
        "When the bus is stopped but lights aren't flashing",
        "Never when the red lights are flashing",
      ],
      correctAnswer: 1,
      explanation: "In Georgia, you may pass a stopped school bus only when driving on a divided highway and the bus is on the opposite side.",
      category: "SCHOOL_ZONES",
      difficulty: "HARD",
      points: 2,
    },
    // Additional Georgia questions...
  ],
  FL: [
    {
      text: "What is the minimum safe following distance on highways in Florida?",
      options: [
        "2 seconds",
        "3 seconds",
        "4 seconds",
        "5 seconds",
      ],
      correctAnswer: 1,
      explanation: "In Florida, maintain at least a 3-second following distance on highways.",
      category: "SAFE_FOLLOWING",
      difficulty: "MEDIUM",
      points: 1,
    },
    // Additional Florida questions...
  ],
  // Questions for other states...
}

async function seedQuestions() {
  for (const [state, stateQuestions] of Object.entries(questions)) {
    for (const question of stateQuestions) {
      await prisma.question.create({
        data: {
          ...question,
          state,
        },
      })
    }
  }
  console.log("Questions seeded successfully")
}

export { seedQuestions }