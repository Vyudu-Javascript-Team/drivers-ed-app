export const emergencySituations = {
  title: "Emergency Situations",
  content: {
    rules: [
      {
        title: "Brake Failure",
        content: "If brakes fail: Pump brakes, shift to lower gear, use parking brake gradually, find safe path to stop.",
        visualAid: "/images/common/brake-failure-steps.svg"
      },
      {
        title: "Tire Blowout",
        content: "During a blowout: Grip wheel firmly, gradually release gas, don't brake suddenly, pull to shoulder.",
        visualAid: "/images/common/tire-blowout-response.svg"
      }
    ],
    scenarios: [
      {
        id: "emergency-001",
        title: "Emergency Vehicle Response",
        description: "Practice proper response to emergency vehicles",
        content: {
          situation: "emergency_vehicle_approach",
          requiredActions: [
            "Pull to right edge",
            "Stop completely",
            "Wait for vehicle to pass"
          ]
        }
      }
    ]
    // Additional emergency scenarios and questions
  }
};