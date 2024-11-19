export type QuestionType = 
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE'
  | 'ORDERING'
  | 'IMAGE_BASED'
  | 'SCENARIO_BASED';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options: string[];
  correctAnswer: number | number[];
  explanation: string;
  category: string;
  subcategory?: string;
  difficulty: Difficulty;
  state: string;
  imageUrl?: string;
  timeLimit?: number;
  points: number;
  tags: string[];
}

export interface TestTemplate {
  id: string;
  state: string;
  questions: Question[];
  timeLimit: number;
  difficulty: Difficulty;
  passingScore: number;
}