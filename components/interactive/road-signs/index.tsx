import { RoadSign } from '../road-sign'

export const roadSigns = {
  regulatory: [
    {
      id: 'stop',
      name: 'Stop Sign',
      imageUrl: '/signs/stop.svg',
      description: 'Come to a complete stop and proceed only when safe',
      quiz: {
        question: 'What action should you take at this sign?',
        options: [
          'Come to a complete stop',
          'Slow down but continue if clear',
          'Yield to other traffic',
          'No action required',
        ],
        correctAnswer: 0,
      },
    },
    {
      id: 'yield',
      name: 'Yield Sign',
      imageUrl: '/signs/yield.svg',
      description: 'Slow down and give way to other traffic',
      quiz: {
        question: 'When do you need to stop at a yield sign?',
        options: [
          'Only when other traffic is present',
          'Always stop completely',
          'Never stop',
          'Only at night',
        ],
        correctAnswer: 0,
      },
    },
    {
      id: 'speed-limit',
      name: 'Speed Limit',
      imageUrl: '/signs/speed-limit.svg',
      description: 'Maximum legal speed under ideal conditions',
      quiz: {
        question: 'What does this sign indicate?',
        options: [
          'Minimum speed',
          'Maximum legal speed',
          'Recommended speed',
          'Average speed',
        ],
        correctAnswer: 1,
      },
    },
  ],
  warning: [
    {
      id: 'curve',
      name: 'Curve Ahead',
      imageUrl: '/signs/curve.svg',
      description: 'Road curves ahead, adjust speed accordingly',
      quiz: {
        question: 'What should you do when you see this sign?',
        options: [
          'Increase speed',
          'Maintain current speed',
          'Reduce speed',
          'Come to a stop',
        ],
        correctAnswer: 2,
      },
    },
    {
      id: 'merge',
      name: 'Merge',
      imageUrl: '/signs/merge.svg',
      description: 'Traffic merging from another lane ahead',
      quiz: {
        question: 'What does this sign warn you about?',
        options: [
          'Road ends ahead',
          'Traffic merging ahead',
          'Lane splitting allowed',
          'Two-way traffic ahead',
        ],
        correctAnswer: 1,
      },
    },
    {
      id: 'pedestrian',
      name: 'Pedestrian Crossing',
      imageUrl: '/signs/pedestrian.svg',
      description: 'Watch for pedestrians crossing the road',
      quiz: {
        question: 'What action should you take at a pedestrian crossing?',
        options: [
          'Speed up to pass quickly',
          'Watch for and yield to pedestrians',
          'Honk to warn pedestrians',
          'No special action needed',
        ],
        correctAnswer: 1,
      },
    },
  ],
  guide: [
    {
      id: 'interstate',
      name: 'Interstate Highway',
      imageUrl: '/signs/interstate.svg',
      description: 'Interstate highway route marker',
      quiz: {
        question: 'What type of road does this sign indicate?',
        options: [
          'Local road',
          'State highway',
          'Interstate highway',
          'County road',
        ],
        correctAnswer: 2,
      },
    },
    {
      id: 'exit',
      name: 'Exit',
      imageUrl: '/signs/exit.svg',
      description: 'Highway exit ahead',
      quiz: {
        question: 'What does the exit number indicate?',
        options: [
          'Speed limit',
          'Distance to exit',
          'Mile marker location',
          'Exit priority',
        ],
        correctAnswer: 2,
      },
    },
  ],
}

export function getRoadSign(category: string, id: string) {
  return roadSigns[category as keyof typeof roadSigns]?.find(s => s.id === id)
}