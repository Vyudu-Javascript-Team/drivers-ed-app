import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Comprehensive content for each state
const content = {
  GA: [
    {
      title: "Atlanta Traffic Tales with OutKast",
      description: "Learn Georgia traffic rules through a fun story featuring OutKast navigating Atlanta's busy streets.",
      content: {
        sections: [
          {
            type: "text",
            content: "Big Boi and André 3000 are cruising through Atlanta in their Cadillac when they encounter the infamous I-285 traffic. As they navigate through the city's busiest intersections, they share essential driving wisdom about Georgia's specific traffic laws and regulations...",
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
  NJ: [
    {
      title: "Jersey Turnpike Tales with Bruce Springsteen",
      description: "Navigate New Jersey's complex highway system with The Boss.",
      content: {
        sections: [
          {
            type: "text",
            content: "Join Bruce Springsteen as he takes us on a journey through the Garden State's unique traffic patterns and jughandles...",
          },
          {
            type: "rule",
            title: "New Jersey Jughandle Rules",
            content: "In New Jersey, many left turns are made using jughandles. When you want to turn left, look for signs directing you to use the right lane exit.",
          },
          {
            type: "question",
            text: "How do you typically make a left turn at a major intersection in New Jersey?",
            options: [
              "Turn left from the left lane",
              "Use a jughandle from the right lane",
              "U-turn at the median",
              "Any of the above",
            ],
            correctAnswer: 1,
            explanation: "New Jersey is famous for its jughandles, where left turns are made by exiting to the right and then crossing the highway.",
          },
        ],
      },
      state: "NJ",
      published: true,
    },
  ],
  CA: [
    {
      title: "LA Traffic with Snoop Dogg",
      description: "Learn to navigate Los Angeles traffic with the D-O-Double-G.",
      content: {
        sections: [
          {
            type: "text",
            content: "Cruise through LA with Snoop as he teaches you about California's unique traffic laws and how to handle heavy traffic situations...",
          },
          {
            type: "rule",
            title: "California HOV Lane Rules",
            content: "High-Occupancy Vehicle (HOV) lanes require two or more occupants during posted hours. Some lanes are HOV 24/7.",
          },
          {
            type: "question",
            text: "When can you use the HOV (carpool) lane in California?",
            options: [
              "Only during rush hour",
              "When you have two or more occupants",
              "Whenever traffic is heavy",
              "Only on weekdays",
            ],
            correctAnswer: 1,
            explanation: "In California, HOV lanes typically require two or more occupants per vehicle to use them legally.",
          },
        ],
      },
      state: "CA",
      published: true,
    },
  ],
  LA: [
    {
      title: "New Orleans Driving with Lil Wayne",
      description: "Master Louisiana's road rules with Weezy F. Baby.",
      content: {
        sections: [
          {
            type: "text",
            content: "Join Lil Wayne as he guides you through the unique challenges of driving in Louisiana, from handling wet weather to navigating historic streets...",
          },
          {
            type: "rule",
            title: "Louisiana Weather Driving",
            content: "Louisiana's frequent rain requires special attention. Reduce speed and increase following distance in wet conditions.",
          },
          {
            type: "question",
            text: "What should you do when driving on wet Louisiana roads?",
            options: [
              "Drive normally",
              "Increase following distance and reduce speed",
              "Speed up to get through quickly",
              "Follow other cars closely",
            ],
            correctAnswer: 1,
            explanation: "Louisiana's wet weather requires increased following distance and reduced speed for safety.",
          },
        ],
      },
      state: "LA",
      published: true,
    },
  ],
  IN: [
    {
      title: "Indianapolis 500 Safety Guide",
      description: "Learn Indiana driving rules with racing legends.",
      content: {
        sections: [
          {
            type: "text",
            content: "Experience Indiana's driving rules through the eyes of Indy 500 champions, learning everything from basic road rules to handling winter weather...",
          },
          {
            type: "rule",
            title: "Indiana Winter Driving",
            content: "Indiana winters require special attention to road conditions. Always clear all snow from your vehicle and maintain safe distances.",
          },
          {
            type: "question",
            text: "What is required before driving in snowy conditions in Indiana?",
            options: [
              "Clear only the windshield",
              "Clear all windows and lights",
              "No special preparation needed",
              "Clear only the front and back windows",
            ],
            correctAnswer: 1,
            explanation: "Indiana law requires all windows and lights to be clear of snow and ice before driving.",
          },
        ],
      },
      state: "IN",
      published: true,
    },
  ],
}

async function seedContent() {
  for (const [state, stories] of Object.entries(content)) {
    for (const story of stories) {
      await prisma.story.create({
        data: story,
      })
    }
  }
  console.log("Content seeded successfully")
}

export { seedContent }