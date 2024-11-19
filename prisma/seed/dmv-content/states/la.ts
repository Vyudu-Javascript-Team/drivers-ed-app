export const la = {
  name: 'Louisiana',
  content: {
    stories: [
      {
        title: "New Orleans Driving with Lil Wayne",
        description: "Master Louisiana's road rules with Weezy F. Baby",
        sections: [
          {
            type: "text",
            content: "Join Lil Wayne as he guides you through the unique challenges of driving in Louisiana, from handling wet weather to navigating historic streets. 'You see,' Wayne explains, 'in New Orleans, you gotta respect both the history and the weather.'",
          },
          {
            type: "rule",
            title: "Louisiana Weather Driving",
            content: "During heavy rain, reduce speed by at least 10 mph below the posted limit. Increase following distance to 4 seconds or more.",
            visualAid: "/images/la/weather-driving.svg"
          },
          {
            type: "scenario",
            title: "French Quarter Navigation",
            description: "Practice navigating narrow historic streets",
            difficulty: "HARD",
            content: {
              conditions: {
                timeOfDay: "day",
                weather: "clear",
                traffic: "heavy",
                pedestrians: true
              }
            }
          }
        ]
      },
      {
        title: "Bayou Backroads with Boosie",
        description: "Learn rural driving and wildlife safety",
        sections: [
          {
            type: "text",
            content: "Boosie takes us through Louisiana's scenic backroads, teaching essential skills for rural driving and wildlife awareness...",
          },
          {
            type: "rule",
            title: "Wildlife Safety",
            content: "Be especially alert for wildlife at dawn and dusk. If you encounter an alligator on the road, do not approach - contact local authorities.",
            visualAid: "/images/la/wildlife-safety.svg"
          }
        ]
      },
      {
        title: "Baton Rouge Rush Hour",
        description: "Navigate capital city traffic patterns",
        sections: [
          {
            type: "text",
            content: "Master the unique traffic patterns around the State Capitol and LSU campus...",
          },
          {
            type: "rule",
            title: "School Zone Rules",
            content: "School zones in Louisiana require complete stops at crosswalks when children are present, regardless of signals."
          }
        ]
      }
    ],
    questions: [
      {
        id: "la-001",
        type: "MULTIPLE_CHOICE",
        text: "What is the speed limit in Louisiana school zones during posted hours?",
        options: ["15 mph", "20 mph", "25 mph", "30 mph"],
        correctAnswer: 1,
        explanation: "School zones in Louisiana have a speed limit of 20 mph during posted hours.",
        category: "SPEED_LIMITS",
        difficulty: "EASY"
      },
      // Add 20+ more Louisiana-specific questions
    ],
    scenarios: [
      {
        id: "la-scenario-001",
        title: "French Quarter Navigation",
        description: "Navigate narrow historic streets with heavy pedestrian traffic",
        type: "INTERACTIVE",
        difficulty: "HARD",
        content: {
          initialState: {
            playerPosition: { x: 100, y: 300 },
            traffic: [
              { type: "pedestrian", position: { x: 300, y: 200 }, behavior: "crossing" },
              { type: "tourist", position: { x: 500, y: 400 }, behavior: "unpredictable" }
            ],
            objectives: [
              "Maintain safe speed in historic district",
              "Yield to pedestrians",
              "Navigate one-way streets"
            ]
          }
        }
      }
    ]
  }
};