export const fl = {
  name: 'Florida',
  content: {
    stories: [
      {
        title: "Miami Beach Traffic Guide with DJ Khaled",
        description: "Master Miami's unique traffic patterns with DJ Khaled",
        sections: [
          {
            type: "text",
            content: "DJ Khaled guides us through Miami Beach's bustling streets, sharing another one - this time it's the keys to handling Florida's unique traffic patterns.",
          },
          {
            type: "rule",
            title: "Florida Weather Driving",
            content: "During sudden thunderstorms, reduce speed and increase following distance. If visibility is severely impaired, pull over to a safe location."
          }
        ]
      },
      {
        title: "Orlando Theme Park Traffic with Pitbull",
        description: "Navigate tourist areas and theme park traffic",
        sections: [
          {
            type: "text",
            content: "Mr. Worldwide himself shows us how to handle the unique challenges of driving near major tourist attractions...",
          },
          {
            type: "rule",
            title: "Tourist Area Guidelines",
            content: "Be prepared for sudden stops, watch for pedestrians, and be patient with out-of-state drivers."
          }
        ]
      }
    ],
    questions: [
      {
        id: "fl-001",
        type: "MULTIPLE_CHOICE",
        text: "What should you do when driving in a sudden Florida thunderstorm?",
        options: [
          "Speed up to get through it quickly",
          "Stop under an overpass",
          "Reduce speed and increase following distance",
          "Turn on high beam headlights"
        ],
        correctAnswer: 2,
        explanation: "During Florida thunderstorms, reducing speed and increasing following distance is the safest approach.",
        category: "WEATHER",
        difficulty: "MEDIUM"
      }
    ],
    scenarios: [
      {
        id: "fl-scenario-001",
        title: "Beach Traffic Navigation",
        description: "Handle heavy beach traffic and tourist areas",
        type: "INTERACTIVE",
        difficulty: "MEDIUM",
        content: {
          initialState: {
            playerPosition: { x: 100, y: 300 },
            traffic: [
              { type: "pedestrian", position: { x: 300, y: 200 }, direction: "west" },
              { type: "tourist_car", position: { x: 500, y: 400 }, direction: "south" }
            ],
            objectives: [
              "Watch for pedestrians",
              "Navigate tourist traffic",
              "Handle sudden stops"
            ]
          }
        }
      }
    ]
  }
};