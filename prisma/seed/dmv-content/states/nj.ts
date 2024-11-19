export const nj = {
  name: 'New Jersey',
  content: {
    stories: [
      {
        title: "Jersey Turnpike Tales with Bruce Springsteen",
        description: "Navigate New Jersey's complex highway system with The Boss",
        sections: [
          {
            type: "text",
            content: "Join Bruce Springsteen as he guides you through the Garden State's unique traffic patterns and jughandles. 'You see,' Bruce explains, 'in Jersey, we do things a little differently. Making a left turn? That's when the real magic happens.'",
          },
          {
            type: "rule",
            title: "New Jersey Jughandle Rules",
            content: "In New Jersey, many left turns are made using jughandles. When you want to turn left, look for signs directing you to use the right lane exit.",
            visualAid: "/images/nj/jughandle-diagram.svg"
          },
          {
            type: "scenario",
            title: "Jughandle Navigation",
            description: "Practice using jughandles for left turns",
            difficulty: "MEDIUM"
          }
        ]
      },
      {
        title: "Garden State Parkway Guide",
        description: "Master high-speed highway driving and toll systems",
        sections: [
          {
            type: "text",
            content: "The Garden State Parkway stretches from Cape May to the New York border, featuring unique challenges and toll systems...",
          },
          {
            type: "rule",
            title: "Toll Plaza Protocol",
            content: "Always maintain E-ZPass transponders properly mounted. Keep moving in E-ZPass lanes - don't stop.",
            visualAid: "/images/nj/toll-plaza-guide.svg"
          }
        ]
      },
      // Additional stories covering:
      // - Night driving on the Turnpike
      // - Shore traffic navigation
      // - Urban driving in Newark/Jersey City
      // - Weather conditions (snow/ice)
      // - Construction zones
      // - Emergency vehicle protocols
    ],
    questions: [
      {
        id: "nj-001",
        type: "MULTIPLE_CHOICE",
        text: "When using a jughandle to turn left, which lane should you use?",
        options: [
          "Left lane",
          "Right lane",
          "Center lane",
          "Any lane is acceptable"
        ],
        correctAnswer: 1,
        explanation: "In New Jersey, jughandles require using the right lane to make left turns. This unique traffic pattern helps reduce congestion and improve safety.",
        category: "TRAFFIC_PATTERNS",
        difficulty: "MEDIUM",
        visualAid: "/images/nj/jughandle-question.svg"
      },
      // Additional 500+ questions covering all categories
    ],
    scenarios: [
      {
        id: "nj-scenario-001",
        title: "Turnpike Merge Challenge",
        description: "Practice merging onto the NJ Turnpike during rush hour",
        type: "INTERACTIVE",
        difficulty: "HARD",
        content: {
          initialState: {
            playerPosition: { x: 100, y: 300 },
            traffic: [
              { type: "truck", position: { x: 300, y: 200 }, direction: "north" },
              { type: "car", position: { x: 500, y: 400 }, direction: "north" }
            ],
            weatherConditions: "clear",
            timeOfDay: "rush_hour",
            objectives: [
              "Match highway speed",
              "Find safe merge gap",
              "Execute smooth merge"
            ]
          }
        }
      }
    ],
    stateSpecificLaws: {
      "Cell Phone Use": "Hand-held cell phone use while driving is prohibited. Hands-free devices are permitted.",
      "Right on Red": "Right turn on red is permitted unless otherwise posted.",
      "Move Over Law": "Must move over one lane or slow down when passing emergency vehicles.",
      // Additional state-specific laws
    }
  }
};