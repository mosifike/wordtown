export type Difficulty = 'easy' | 'medium' | 'hard';
export type MasteryLevel = 'new' | 'learning' | 'mastered';
export type ExamType = 'cet4' | 'cet6';
export type Extroversion = 'introvert' | 'ambivert' | 'extrovert';
export type SocialPreference = 'alone' | 'small' | 'crowd';
export type NoveltyApproach = 'cautious' | 'eager';
export type NarrativeStyle = 'humorous' | 'serious' | 'mysterious' | 'warm';
export type StoryLength = 'short' | 'medium' | 'long';
export type HotTopicAttitude = 'love' | 'neutral' | 'dislike';

export interface Word {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  exampleTranslation: string;
  difficulty: Difficulty;
  bookId: string;
}

export interface WordBook {
  id: string;
  name: string;
  examType: ExamType;
  totalWords: number;
  words: Word[];
}

export interface UserProfile {
  id: string;
  personality: {
    extroversion: Extroversion;
    socialPreference: SocialPreference;
    noveltyApproach: NoveltyApproach;
  };
  interests: {
    domains: string[];
    contentTypes: string[];
    hotTopics: string[];
  };
  preferences: {
    narrativeStyle: NarrativeStyle;
    storyLength: StoryLength;
    hotTopicAttitude: HotTopicAttitude;
  };
  learning: {
    targetExam: ExamType;
    dailyDuration: number;
    dailyGoal: number;
  };
}

export interface WordMemoryContent {
  wordId: string;
  userId: string;
  story: string;
  storyHighlights: string[];
  comicImages: string[];
  hotTopicsUsed: string[];
  generatedAt: string;
  expiresAt: string;
}

export interface LearningRecord {
  wordId: string;
  masteryLevel: MasteryLevel;
  firstLearnedDate: string;
  lastReviewDate: string;
  nextReviewDate: string;
  reviewCount: number;
  correctCount: number;
}

export interface DailyStat {
  date: string;
  wordsLearned: number;
  wordsReviewed: number;
  studyTime: number;
}

export interface UserStats {
  totalWordsLearned: number;
  totalWordsMastered: number;
  streakDays: number;
  totalStudyTime: number;
  dailyStats: DailyStat[];
  currentStreakStart: string;
}
