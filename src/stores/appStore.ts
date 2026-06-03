// src/stores/appStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  WordBook,
  LearningRecord,
  UserStats,
  DailyStat,
  MasteryLevel,
  WordMemoryContent,
} from '../types';
import { calculateNextReviewDate, shouldReviewToday } from '../utils/reviewEngine';

interface AppState {
  // 用户数据
  userProfile: UserProfile | null;
  selectedBook: WordBook | null;
  
  // 学习记录
  learningRecords: LearningRecord[];
  userStats: UserStats;
  
  // 内容缓存
  contentCache: Record<string, WordMemoryContent>;
  
  // Actions
  setUserProfile: (profile: UserProfile) => void;
  setSelectedBook: (book: WordBook | null) => void;
  addLearningRecord: (wordId: string) => void;
  updateMasteryLevel: (wordId: string, level: MasteryLevel) => void;
  completeReview: (wordId: string, isCorrect: boolean) => void;
  getCachedContent: (wordId: string) => WordMemoryContent | undefined;
  setCachedContent: (wordId: string, content: WordMemoryContent) => void;
  getWordsToReview: () => string[];
  getTodayStats: () => DailyStat;
  getWordRecord: (wordId: string) => LearningRecord | undefined;
  updateStatsStudyTime: (minutes: number) => void;
}

const defaultUserStats: UserStats = {
  totalWordsLearned: 0,
  totalWordsMastered: 0,
  streakDays: 0,
  totalStudyTime: 0,
  dailyStats: [],
  currentStreakStart: new Date().toISOString(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      selectedBook: null,
      learningRecords: [],
      userStats: defaultUserStats,
      contentCache: {},

      setUserProfile: (profile: UserProfile) => {
        set({ userProfile: profile });
      },

      setSelectedBook: (book: WordBook | null) => {
        set({ selectedBook: book });
      },

      addLearningRecord: (wordId: string) => {
        const now = new Date().toISOString();
        const newRecord: LearningRecord = {
          wordId,
          masteryLevel: 'new',
          firstLearnedDate: now,
          lastReviewDate: now,
          nextReviewDate: now,
          reviewCount: 0,
          correctCount: 0,
        };

        set((state) => {
          const exists = state.learningRecords.find(r => r.wordId === wordId);
          if (exists) return state;

          const today = new Date().toISOString().split('T')[0];
          const todayStat = state.userStats.dailyStats.find(d => d.date === today);
          const newDailyStats = todayStat
            ? state.userStats.dailyStats.map(d =>
                d.date === today ? { ...d, wordsLearned: d.wordsLearned + 1 } : d
              )
            : [...state.userStats.dailyStats, { date: today, wordsLearned: 1, wordsReviewed: 0, studyTime: 0 }];

          return {
            learningRecords: [...state.learningRecords, newRecord],
            userStats: {
              ...state.userStats,
              totalWordsLearned: state.userStats.totalWordsLearned + 1,
              dailyStats: newDailyStats,
            },
          };
        });
      },

      updateMasteryLevel: (wordId: string, level: MasteryLevel) => {
        const now = new Date().toISOString();
        set((state) => ({
          learningRecords: state.learningRecords.map((r) =>
            r.wordId === wordId
              ? { ...r, masteryLevel: level, lastReviewDate: now, nextReviewDate: calculateNextReviewDate({ ...r, masteryLevel: level }).toISOString() }
              : r
          ),
        }));
      },

      completeReview: (wordId: string, isCorrect: boolean) => {
        const now = new Date().toISOString();
        set((state) => {
          const record = state.learningRecords.find(r => r.wordId === wordId);
          if (!record) return state;

          const updatedRecord: LearningRecord = {
            ...record,
            reviewCount: record.reviewCount + 1,
            correctCount: record.correctCount + (isCorrect ? 1 : 0),
            lastReviewDate: now,
            nextReviewDate: calculateNextReviewDate({
              ...record,
              reviewCount: record.reviewCount + 1,
            }).toISOString(),
          };

          const today = new Date().toISOString().split('T')[0];
          const todayStat = state.userStats.dailyStats.find(d => d.date === today);
          const newDailyStats = todayStat
            ? state.userStats.dailyStats.map(d =>
                d.date === today ? { ...d, wordsReviewed: d.wordsReviewed + 1 } : d
              )
            : [...state.userStats.dailyStats, { date: today, wordsLearned: 0, wordsReviewed: 1, studyTime: 0 }];

          const isMastered = updatedRecord.masteryLevel === 'mastered' ||
            (updatedRecord.masteryLevel === 'learning' && updatedRecord.correctCount >= 3);

          return {
            learningRecords: state.learningRecords.map(r =>
              r.wordId === wordId ? updatedRecord : r
            ),
            userStats: {
              ...state.userStats,
              totalWordsMastered: isMastered && record.masteryLevel !== 'mastered'
                ? state.userStats.totalWordsMastered + 1
                : state.userStats.totalWordsMastered,
              dailyStats: newDailyStats,
            },
          };
        });
      },

      getCachedContent: (wordId: string) => {
        return get().contentCache[wordId];
      },

      setCachedContent: (wordId: string, content: WordMemoryContent) => {
        set((state) => ({
          contentCache: { ...state.contentCache, [wordId]: content },
        }));
      },

      getWordsToReview: () => {
        const state = get();
        return state.learningRecords
          .filter(r => shouldReviewToday(r))
          .map(r => r.wordId);
      },

      getTodayStats: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        return state.userStats.dailyStats.find(d => d.date === today) || {
          date: today,
          wordsLearned: 0,
          wordsReviewed: 0,
          studyTime: 0,
        };
      },

      getWordRecord: (wordId: string) => {
        return get().learningRecords.find(r => r.wordId === wordId);
      },

      updateStatsStudyTime: (minutes: number) => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const todayStat = state.userStats.dailyStats.find(d => d.date === today);
          const newDailyStats = todayStat
            ? state.userStats.dailyStats.map(d =>
                d.date === today ? { ...d, studyTime: d.studyTime + minutes } : d
              )
            : [...state.userStats.dailyStats, { date: today, wordsLearned: 0, wordsReviewed: 0, studyTime: minutes }];

          return {
            userStats: {
              ...state.userStats,
              totalStudyTime: state.userStats.totalStudyTime + minutes,
              dailyStats: newDailyStats,
            },
          };
        });
      },
    }),
    {
      name: 'wordtown_v2_data',
    }
  )
);
