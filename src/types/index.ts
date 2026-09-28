export type LanguageCode =
  | 'en' // English
  | 'es' // Spanish
  | 'hi' // Hindi
  | 'zh' // Chinese (Mandarin)
  | 'fr' // French
  | 'de' // German
  | 'ja' // Japanese
  | 'pt' // Portuguese
  | 'te'; // Telugu

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type DomainCategory =
  | 'python'
  | 'javascript'
  | 'java'
  | 'cpp'
  | 'sql'
  | 'system-design'
  | 'frontend'
  | 'behavioral';

export interface QuestionItem {
  id: string;
  domain: DomainCategory;
  difficulty: DifficultyLevel;
  title: string;
  question: string;
  introvertTip: string;
  starFramework: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  sampleAnswer: string;
  keyPoints: string[];
  codeSnippet?: string;
  tags: string[];
}

export type InterviewerMood =
  | 'smiling'
  | 'listening'
  | 'nodding'
  | 'encouraging'
  | 'thinking';

export interface InterviewerPersona {
  id: string;
  name: string;
  title: string;
  companyBackground: string;
  image: string;
  personality: string;
  empathyStyle: string;
  voicePitch: number;
  voiceRate: number;
  preferredTone: string;
}

export interface ChatMessage {
  id: string;
  role: 'interviewer' | 'candidate';
  content: string;
  timestamp: string;
  mood?: InterviewerMood;
  calmingTip?: string;
  rubricScore?: number;
}

export interface RubricEvaluation {
  score: number;
  strengths: string[];
  areasToRefine: string[];
  confidenceFeedback: string;
}

export interface TreasureChest {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'master';
  costPoints: number;
  iconName: string;
  description: string;
  rewardTitle: string;
  rewardType: 'badge' | 'charm' | 'cheatsheet' | 'streak_shield';
  rewardDetail: string;
  unlocked: boolean;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserStats {
  points: number;
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  targetInterviewDate: string; // YYYY-MM-DD
  targetRole: string;
  targetCompany: string;
  streakShields: number;
  completedQuestions: string[];
  completedInterviewsCount: number;
  unlockedChestIds: string[];
  unlockedBadgeIds: string[];
  calmDrillsCompleted: number;
}
