export const ca = {
  name: 'California',
  content: {
    stories: [
      {
        title: "LA Traffic with Snoop Dogg",
        description: "Navigate Los Angeles traffic with the D-O-Double-G",
        sections: [
          {
            type: "text",
            content: "Cruising through LA with Snoop, you'll learn the ins and outs of California's unique traffic laws and HOV lanes. 'The key to LA traffic,' Snoop explains, 'is staying cool and knowing your lanes.'",
          },
          {
            type: "rule",
            title: "California HOV Lane Rules",
            content: "High-Occupancy Vehicle (HOV) lanes require two or more occupants during posted hours. Some lanes are HOV 24/7.",
            visualAid: "/images/ca/hov-lanes-guide.svg"
          }
        ]
      },
      {
        title: "San Francisco Hills with Metallica",
        description: "Master hill parking and cable car interactions",
        sections: [
          {
            type: "text",
            content: "Join Metallica as they demonstrate proper hill parking techniques and how to share the road with cable cars...",
          },
          {
            type: "rule",
            title: "Hill Parking Requirements",
            content: "When parking on a hill, turn wheels properly: uphill - away from curb, downhill - toward curb.",
            visualAid: "/images/ca/hill-parking-diagram.svg"
          }
        ]
      }
      // Additional stories covering:
      // - Highway 1 coastal driving
      // - Desert driving conditions
      // - Mountain road navigation
      // - Fog and marine layer conditions
      // - Wildfire safety protocols
    ],
    questions: [
      {
        id: "ca-001",
        type: "MULTIPLE_CHOICE",
        text: "What is required to use HOV (carpool) lanes during posted hours?",
        options: [
          "One person in an electric vehicle",
          "Two or more occupants",
          "Three or more occupants",
          "Any vehicle during rush hour"
        ],
        correctAnswer: 1,
        explanation: "California HOV lanes typically require two or more occupants per vehicle during posted hours, though some lanes may have different requirements.",
        category: "TRAFFIC_LAWS",
        difficulty: "MEDIUM",
        visualAid: "/images/ca/hov-question.svg"
      }
      // Additional 500+ questions covering all categories
    ]
    // Additional scenarios and state-specific laws
  }
};