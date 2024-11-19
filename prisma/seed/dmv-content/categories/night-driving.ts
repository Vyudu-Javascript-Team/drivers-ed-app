export const nightDriving = {
  title: "Night Driving Safety",
  content: {
    rules: [
      {
        title: "Headlight Usage",
        content: "Use headlights from sunset to sunrise and when visibility is less than 1000 feet.",
        visualAid: "/images/common/headlight-usage.svg"
      },
      {
        title: "Speed Adjustment",
        content: "Reduce speed at night as visibility is limited to the range of your headlights.",
        visualAid: "/images/common/night-speed-adjustment.svg"
      }
    ],
    scenarios: [
      {
        id: "night-001",
        title: "Rural Road Navigation",
        description: "Practice driving on unlit rural roads",
        content: {
          conditions: {
            lighting: "dark",
            weather: "clear",
            roadType: "rural"
          },
          challenges: [
            "Limited visibility",
            "Wildlife hazards",
            "High beam management"
          ]
        }
      }
    ],
    questions: [
      {
        id: "night-001",
        type: "MULTIPLE_CHOICE",
        text: "When should you use high beam headlights?",
        options: [
          "On all dark roads",
          "When no vehicles are approaching or ahead",
          "In city areas at night",
          "During twilight hours"
        ],
        correctAnswer: 1,
        explanation: "Use high beams on dark roads when no vehicles are approaching or ahead within 500 feet.",
        category: "NIGHT_DRIVING",
        difficulty: "MEDIUM"
      }
      // Additional questions
    ]
  }
};