import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Original, engaging story content for each state
const stories = {
  GA: [
    {
      title: "Atlanta Traffic Tales with OutKast",
      description: "Learn Georgia traffic rules through a fun story featuring OutKast navigating Atlanta's busy streets.",
      content: {
        sections: [
          {
            type: "text",
            content: "Big Boi and André 3000 are cruising through Atlanta in their Cadillac when they encounter the infamous I-285 traffic. As they navigate through the city's busiest intersections, they share essential driving wisdom...",
          },
          {
            type: "rule",
            title: "Georgia Right of Way Rules",
            content: "At a four-way stop, the vehicle that arrived first has the right of way. If vehicles arrive simultaneously, the vehicle on the right goes first.",
          },
          {
            type: "question",
            text: "When two vehicles arrive at a four-way stop simultaneously, who has the right of way?",
            options: [
              "The vehicle on the right",
              "The vehicle on the left",
              "The larger vehicle",
              "The vehicle going straight",
            ],
            correctAnswer: 0,
            explanation: "In Georgia, when two vehicles arrive at a four-way stop simultaneously, the vehicle on the right has the right of way.",
          },
        ],
      },
      state: "GA",
      published: true,
    },
    // Additional Georgia stories...
  ],
  FL: [
    {
      title: "Miami Beach Traffic Guide with DJ Khaled",
      description: "Master Miami's unique traffic patterns with DJ Khaled as your guide.",
      content: {
        sections: [
          {
            type: "text",
            content: "DJ Khaled is showing us another one - this time it's the proper way to handle Miami's unique traffic patterns. From beach traffic to afternoon thunderstorms, we're learning the keys to success on Florida roads...",
          },
          {
            type: "rule",
            title: "Florida Weather Driving",
            content: "During sudden thunderstorms, reduce speed and increase following distance. If visibility is severely impaired, pull over to a safe location until conditions improve.",
          },
          {
            type: "question",
            text: "What should you do when caught in a sudden thunderstorm?",
            options: [
              "Speed up to get through it quickly",
              "Continue driving normally",
              "Reduce speed and increase following distance",
              "Stop immediately wherever you are",
            ],
            correctAnswer: 2,
            explanation: "In Florida's frequent thunderstorms, reducing speed and increasing following distance is the safest approach.",
          },
        ],
      },
      state: "FL",
      published: true,
    },
    // Additional Florida stories...
  ],
  // Content for other states...
}

async function seedStories() {
  for (const [state, stateStories] of Object.entries(stories)) {
    for (const story of stateStories) {
      await prisma.story.create({
        data: story,
      })
    }
  }
  console.log("Stories seeded successfully")
}

export { seedStories }