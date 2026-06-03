import { LearningRecord, MasteryLevel } from '../types';

const reviewIntervals: Record<MasteryLevel, number[]> = {
  new: [0, 0, 1, 2, 4, 7, 15],
  learning: [1, 2, 4, 7, 15, 30],
  mastered: [7, 15, 30, 60],
};

export function getReviewInterval(masteryLevel: MasteryLevel, reviewCount: number): number {
  const intervals = reviewIntervals[masteryLevel];
  return intervals[Math.min(reviewCount, intervals.length - 1)];
}

export function calculateNextReviewDate(record: LearningRecord): Date {
  const interval = getReviewInterval(record.masteryLevel, record.reviewCount);
  const nextDate = new Date(record.lastReviewDate);
  nextDate.setDate(nextDate.getDate() + interval);
  return nextDate;
}

export function getTodayReviewWords(records: LearningRecord[]): string[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return records
    .filter(r => new Date(r.nextReviewDate) <= today)
    .map(r => r.wordId);
}

export function shouldReviewToday(record: LearningRecord): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(record.nextReviewDate) <= today;
}
