export const constructionZones = {
  title: "Construction Zone Safety",
  content: {
    rules: [
      {
        title: "Speed Reduction",
        content: "Always observe reduced speed limits in construction zones. Fines are typically doubled.",
        visualAid: "/images/common/construction-speed.svg"
      },
      {
        title: "Worker Safety",
        content: "Watch for workers and equipment. Follow flaggers' instructions at all times.",
        visualAid: "/images/common/flagger-signals.svg"
      }
    ],
    scenarios: [
      {
        id: "construction-001",
        title: "Lane Closure Navigation",
        description: "Practice merging and lane changes in construction zones",
        content: {
          situation: "lane_closure",
          hazards: [
            "Narrow lanes",
            "Equipment proximity",
            "Worker presence"
          ]
        }
      }
    ]
    // Additional construction zone content
  }
};