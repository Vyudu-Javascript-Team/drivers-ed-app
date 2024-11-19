export const ga = {
  name: 'Georgia',
  content: {
    stories: [
      {
        title: "Atlanta Traffic Tales with OutKast",
        description: "Navigate Atlanta's busy streets with Big Boi and André 3000",
        sections: [
          {
            type: "text",
            content: "Big Boi and André 3000 are cruising through Atlanta when they encounter the infamous I-285 traffic. 'You know,' says André, 'mastering Atlanta traffic is like mastering a complex rhythm – it's all about timing and flow.'",
          },
          {
            type: "rule",
            title: "Georgia Right of Way Rules",
            content: "At a four-way stop, the vehicle that arrived first has the right of way. If vehicles arrive simultaneously, the vehicle on the right goes first.",
          },
          {
            type: "scenario",
            title: "I-285 Merge Challenge",
            description: "Practice merging onto I-285 during rush hour",
            difficulty: "MEDIUM",
          }
        ]
      },
      {
        title: "Peach State Parking with T.I.",
        description: "Learn parallel parking and urban navigation",
        sections: [
          {
            type: "text",
            content: "T.I. demonstrates the art of parallel parking in downtown Atlanta...",
          },
          {
            type: "rule",
            title: "Georgia Parking Laws",
            content: "Must park within 12 inches of the curb. No parking within 15 feet of a fire hydrant.",
          }
        ]
      }
    ],
    questions: [
      {
        id: "ga-001",
        type: "MULTIPLE_CHOICE",
        text: "What is the speed limit in a residential area unless otherwise posted?",
        options: ["25 mph", "30 mph", "35 mph", "40 mph"],
        correctAnswer: 1,
        explanation: "In Georgia, the default speed limit in residential areas is 30 mph unless otherwise posted.",
        category: "SPEED_LIMITS",
        difficulty: "EASY"
      },
      {
        id: "ga-002",
        type: "SCENARIO_BASED",
        text: "You're approaching a school bus that has stopped with its red lights flashing. What should you do?",
        options: [
          "Stop and wait until the lights stop flashing",
          "Proceed slowly if no children are visible",
          "Pass on the left side carefully",
          "Honk and proceed"
        ],
        correctAnswer: 0,
        explanation: "Georgia law requires all vehicles to stop for a school bus that is loading or unloading children.",
        category: "SCHOOL_ZONES",
        difficulty: "MEDIUM"
      }
    ],
    scenarios: [
      {
        id: "ga-scenario-001",
        title: "Downtown Atlanta Navigation",
        description: "Navigate one-way streets and traffic patterns in downtown Atlanta",
        type: "INTERACTIVE",
        difficulty: "HARD",
        content: {
          initialState: {
            playerPosition: { x: 100, y: 300 },
            traffic: [
              { type: "car", position: { x: 300, y: 200 }, direction: "east" },
              { type: "bus", position: { x: 500, y: 400 }, direction: "north" }
            ],
            objectives: [
              "Navigate to Peachtree Street",
              "Maintain proper lane position",
              "Follow one-way street signs"
            ]
          }
        }
      }
    ]
  }
};