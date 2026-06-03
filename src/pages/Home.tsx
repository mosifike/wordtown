// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, RotateCcw, Target, Flame } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

export default function Home() {
  const { selectedBook, userStats, getTodayStats, getWordsToReview, userProfile } = useAppStore();
  const todayStats = getTodayStats();
  const reviewWords = getWordsToReview();

  // 获取今日待学单词
  const getTodayWords = () => {
    if (!selectedBook) return [];
    const learnedIds = new Set(useAppStore.getState().learningRecords.map(r => r.wordId));
    return selectedBook.words.filter(w => !learnedIds.has(w.id)).slice(0, userProfile?.learning.dailyGoal || 20);
  };

  const todayWords = getTodayWords();
  const progress = todayWords.length > 0
    ? Math.round(((userProfile?.learning.dailyGoal || 20) - todayWords.length) / (userProfile?.learning.dailyGoal || 20) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <header className="p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-white mb-1">今日学习</h1>
          <p className="text-slate-400">{selectedBook?.name || '未选择词书'}</p>
        </motion.div>
      </header>

      <div className="px-6 space-y-4">
        {/* 学习进度 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl p-4 border border-slate-700"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">今日进度</span>
            <span className="text-indigo-400 font-bold">{progress}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-slate-400 text-sm mt-2">
            已学 {todayStats.wordsLearned} / 目标 {userProfile?.learning.dailyGoal || 20} 个
          </p>
        </motion.div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/learn/${todayWords[0]?.id}`}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-indigo-500/20 border border-indigo-500/30 rounded-xl p-4 text-center"
            >
              <BookOpen size={24} className="text-indigo-400 mx-auto mb-2" />
              <p className="text-white font-medium">开始学习</p>
              <p className="text-indigo-300 text-sm">{todayWords.length} 个待学</p>
            </motion.div>
          </Link>

          <Link to="/review">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center"
            >
              <RotateCcw size={24} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-white font-medium">复习</p>
              <p className="text-emerald-300 text-sm">{reviewWords.length} 个待复习</p>
            </motion.div>
          </Link>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <Target size={20} className="text-amber-400 mb-2" />
            <p className="text-2xl font-bold text-white">{userStats.totalWordsLearned}</p>
            <p className="text-slate-400 text-sm">累计学习</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
            <Flame size={20} className="text-orange-400 mb-2" />
            <p className="text-2xl font-bold text-white">{userStats.streakDays}</p>
            <p className="text-slate-400 text-sm">连续天数</p>
          </div>
        </div>
      </div>
    </div>
  );
}
