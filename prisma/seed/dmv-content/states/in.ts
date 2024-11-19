export const in = {
  name: 'Indiana',
  content: {
    stories: [
      {
        title: "Indianapolis 500 Safety Guide",
        description: "Learn Indiana driving rules with racing legends",
        sections: [
          {
            type: "text",
            content: "Join racing legend Tony Stewart as he shares insights about safe driving in Indiana. 'The same principles that keep us safe on the track apply to everyday driving,' Tony explains. 'It's all about awareness, control, and respect for conditions.'",
          },
          {
            type: "rule",
            title: "Indiana Winter Driving",
            content: "Clear all snow and ice from your entire vehicle before driving. Reduce speed by half in snowy conditions.",
            visualAid: "/images/in/winter-driving.svg"
          }
        ]
      },
      {
        title: "Hoosier Highway Masters",
        description: "Navigate Indiana's interstate system",
        sections: [
          {
            type: "text",
            content: "Master the intricacies of Indiana's major highways, including I-65, I-70, and I-465...",
          },
          {
            type: "rule",
            title: "Construction Zone Laws",
            content: "Indiana law requires reduced speeds and doubled fines in all construction zones, active or inactive."
          }
        ]
      },
      {
        title: "Rural Indiana Road Guide",
        description: "Master country road driving and farm equipment safety",
        sections: [
          {
            type: "text",
            content: "Learn to safely share the road with farm equipment and navigate unpaved roads...",
          },
          {
            type: "rule",
            title: "Farm Equipment Rules",
            content: "Always yield to farm equipment. Pass only when indicated by the operator and when safe to do so."
          }
        ]
      }
    ],
    questions: [
      {
        id: "in-001",
        type: "MULTIPLE_CHOICE",
        text: "What is the minimum safe following distance for winter driving in Indiana?",
        options: [
          "2 seconds",
          "4 seconds",
          "6 seconds",
          "8 seconds"
        ],
        correctAnswer: 2,
        explanation: "In winter conditions, maintain at least a 6-second following distance to ensure safe stopping.",
        category: "WEATHER",
        difficulty: "MEDIUM"
      },
      // Add 20+ more Indiana-specific questions
    ],
    scenarios: [
      {
        id: "in-scenario-001",
        title: "Winter Highway Challenge",
        description: "Navigate snowy interstate conditions",
        type: "INTERACTIVE",
        difficulty: "HARD",
        content: {
          conditions: {
            weather: "snow",
            visibility: "reduced",
            roadCondition: "icy"
          },
          challenges: [
            "Maintain safe speed",
            "Proper following distance",
            "Safe lane changes"
          ]
        }
      }
    ]
  }
};