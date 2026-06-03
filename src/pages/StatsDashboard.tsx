import { motion } from 'framer-motion';
import { BookOpen, Target, Clock, Flame } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { wordBooks } from '../data/words';

export default function StatsDashboard() {
  const { userStats, learningRecords } = useAppStore();

  const masteredCount = learningRecords.filter(
    (r) => r.masteryLevel === 'mastered'
  ).length;
  const learningCount = learningRecords.filter(
    (r) => r.masteryLevel === 'learning'
  ).length;
  const newCount = learningRecords.filter(
    (r) => r.masteryLevel === 'new'
  ).length;

  const totalWords = wordBooks.reduce((sum, book) => sum + book.totalWords, 0);
  const masteryPercentage = totalWords > 0
    ? Math.round((masteredCount / totalWords) * 100)
    : 0;

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const weeklyData = last7Days.map((date) => {
    const stat = userStats.dailyStats.find((s) => s.date === date);
    return {
      date: date.slice(5),
      learned: stat?.wordsLearned || 0,
      reviewed: stat?.wordsReviewed || 0,
    };
  });

  const maxValue = Math.max(
    ...weeklyData.map((d) => Math.max(d.learned, d.reviewed)),
    1
  );

  return (
    <div className="min-h-screen pb-20 bg-slate-900">
      <header className="p-6 text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-white mb-2"
        >
          学习数据
        </motion.h1>
        <p className="text-slate-400">追踪你的学习进度</p>
      </header>

      <div className="px-6 grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 p-4 rounded-xl border border-slate-700"
        >
          <BookOpen size={24} className="text-indigo-400 mb-2" />
          <p className="text-2xl font-bold text-white">{userStats.totalWordsLearned}</p>
          <p className="text-xs text-slate-400">累计学习单词</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 p-4 rounded-xl border border-slate-700"
        >
          <Target size={24} className="text-emerald-400 mb-2" />
          <p className="text-2xl font-bold text-white">{masteredCount}</p>
          <p className="text-xs text-slate-400">已掌握单词</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 p-4 rounded-xl border border-slate-700"
        >
          <Clock size={24} className="text-amber-400 mb-2" />
          <p className="text-2xl font-bold text-white">{userStats.totalStudyTime}</p>
          <p className="text-xs text-slate-400">学习时长(分钟)</p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800/50 p-4 rounded-xl border border-slate-700"
        >
          <Flame size={24} className="text-orange-400 mb-2" />
          <p className="text-2xl font-bold text-white">{userStats.streakDays}</p>
          <p className="text-xs text-slate-400">连续学习天数</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mx-6 mb-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700 max-w-md mx-auto"
      >
        <h2 className="text-lg font-bold text-white mb-4">单词掌握度</h2>
        <div className="flex justify-around">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">{masteryPercentage}%</div>
            <div className="text-sm text-slate-400">已掌握</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-400">{Math.round((learningCount / totalWords) * 100)}%</div>
            <div className="text-sm text-slate-400">学习中</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-400">{Math.round((newCount / totalWords) * 100)}%</div>
            <div className="text-sm text-slate-400">新单词</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mx-6 p-6 bg-slate-800/50 rounded-xl border border-slate-700 max-w-md mx-auto"
      >
        <h2 className="text-lg font-bold text-white mb-4">本周学习趋势</h2>
        <div className="flex items-end justify-between h-32 gap-2">
          {weeklyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5">
                <motion.div
                  className="flex-1 bg-indigo-500 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.learned / maxValue) * 100}%` }}
                  transition={{ delay: 0.1 * index + 0.7 }}
                />
                <motion.div
                  className="flex-1 bg-emerald-500 rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.reviewed / maxValue) * 100}%` }}
                  transition={{ delay: 0.1 * index + 0.8 }}
                />
              </div>
              <span className="text-xs text-slate-400">{data.date}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-indigo-500 rounded" />
            <span className="text-xs text-slate-400">新学</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-emerald-500 rounded" />
            <span className="text-xs text-slate-400">复习</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
