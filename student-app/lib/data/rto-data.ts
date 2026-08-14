import QUIZ_QUESTIONS_JSON from '@/prisma/data/rto-questions.json'
import ROAD_SIGNS_DATA_JSON from '@/prisma/data/road-signs.json'

export interface QuizQuestionItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export interface RoadSignItem {
  name: string;
  category: string;
  meaning: string;
  rule: string;
  imagePath: string;
  signKey: string;
  fallbackShape?: string;
  fallbackColor?: string;
  steps?: string[];
}

export const QUIZ_QUESTIONS: QuizQuestionItem[] = QUIZ_QUESTIONS_JSON as QuizQuestionItem[]
export const ROAD_SIGNS_DATA: RoadSignItem[] = ROAD_SIGNS_DATA_JSON as any as RoadSignItem[]
