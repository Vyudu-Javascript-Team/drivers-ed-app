// Comprehensive traffic signs content
export const trafficSigns = {
  regulatory: [
    {
      id: 'stop',
      name: 'Stop Sign',
      imageUrl: '/signs/stop.svg',
      description: 'Complete stop required. Look for cross traffic.',
      rules: [
        'Must come to a complete stop',
        'Stop behind limit line or crosswalk',
        'Yield to pedestrians and cross traffic',
        'Proceed only when safe'
      ],
      questions: [
        {
          text: 'What must you do at a stop sign?',
          options: [
            'Come to a complete stop',
            'Slow down if no traffic',
            'Stop only if traffic present',
            'Yield to right only'
          ],
          correctAnswer: 0,
          explanation: 'A complete stop is always required at a stop sign, regardless of traffic conditions.'
        },
        // Add 10+ questions per sign
      ]
    },
    // Add 50+ regulatory signs
  ],
  warning: [
    // Add 50+ warning signs
  ],
  guide: [
    // Add 30+ guide signs
  ]
};