import { TrafficSimulator } from './traffic-simulator';
import { SignRecognition } from './sign-recognition';
import { RoadSignQuiz } from './road-sign-quiz';
import { ParkingSimulator } from './parking-simulator';
import { WeatherConditions } from './weather-conditions';
import { EmergencyResponse } from './emergency-response';

// Comprehensive scenario collection for each state
export const scenarios = {
  GA: [
    {
      id: 'atlanta-merge',
      title: 'I-285 Merge Challenge',
      description: 'Practice merging onto I-285 during rush hour',
      difficulty: 'MEDIUM',
      content: {
        vehicles: [
          {
            id: 'player',
            type: 'car',
            position: [0, 0, 0],
            speed: 0,
            controls: true
          },
          {
            id: 'traffic1',
            type: 'car',
            position: [20, 0, 0],
            speed: 60,
            behavior: 'steady'
          },
          // Add more vehicles for realistic traffic
        ],
        weatherConditions: 'clear',
        timeOfDay: 'day',
        trafficDensity: 'high',
        objectives: [
          'Match highway speed before merging',
          'Maintain safe following distance',
          'Use turn signals appropriately'
        ]
      }
    },
    // Add more Georgia-specific scenarios
  ],
  FL: [
    {
      id: 'miami-beach',
      title: 'Miami Beach Navigation',
      description: 'Navigate busy beach traffic and tourist areas',
      difficulty: 'HARD',
      content: {
        vehicles: [
          {
            id: 'player',
            type: 'car',
            position: [0, 0, 0],
            speed: 0,
            controls: true
          },
          // Add tourist vehicles with unpredictable behavior
        ],
        weatherConditions: 'sunny',
        timeOfDay: 'day',
        pedestrians: [
          {
            id: 'ped1',
            position: [10, 0, 5],
            behavior: 'crossing'
          }
          // Add more pedestrians
        ]
      }
    }
    // Add more Florida-specific scenarios
  ]
  // Add scenarios for other states
};

export function getScenario(state: string, id: string) {
  return scenarios[state as keyof typeof scenarios]?.find(s => s.id === id);
}