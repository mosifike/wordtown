import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, Volume2 } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getWordById } from '../data/words';
import { Word } from '../types';

function ReviewCard({ word, onResult }: { word: Word; onResult: (isCorrect: boolean) => void }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <div className="text-center mb-6">
        <button onClick={handleSpeak} className="p-3 rounded-full bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 mb-4">
          <Volume2 size={32} />
        </button>
        <h2 className="text-3xl font-bold word-font text-white mb-2">{word.word}</h2>
        <p className="text-slate-400 text-lg">{word.phonetic}</p>
      </div>

      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition-colors"
        >
          显示答案
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-slate-900/50 rounded-xl p-4">
            <p className="text-indigo-300 text-lg font-medium mb-2">释义</p>
            <p className="text-white text-lg">{word.meaning}</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-4">
            <p className="text-indigo-300 text-sm mb-1">例句</p>
            <p className="text-slate-300 mb-2">{word.example}</p>
            <p className="text-slate-400 text-sm">{word.exampleTranslation}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onResult(false)}
              className="py-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-bold hover:bg-red-500/30"
            >
              不认识
            </button>
            <button
              onClick={() => onResult(true)}
              className="py-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl font-bold hover:bg-emerald-500/30"
            >
              认识了
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function ReviewCenter() {
  const { learningRecords, completeReview, getWordsToReview } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewWordIds, setReviewWordIds] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const ids = getWordsToReview();
    setReviewWordIds(ids);
    setCurrentIndex(0);
    setIsComplete(ids.length === 0);
  }, [learningRecords]);

  const currentWord = reviewWordIds[currentIndex]
    ? getWordById(reviewWordIds[currentIndex])
    : null;

  const handleResult = (isCorrect: boolean) => {
    if (currentWord) {
      completeReview(currentWord.id, isCorrect);
    }

    if (currentIndex < reviewWordIds.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen pb-20 bg-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8"
        >
          <CheckCircle size={64} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {reviewWordIds.length === 0 ? '今日暂无复习任务' : '复习完成！'}
          </h2>
          <p className="text-slate-400">
            {reviewWordIds.length === 0
              ? '去学习新单词吧'
              : `已完成 ${reviewWordIds.length} 个单词的复习`}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-900">
      <header className="p-6 text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-white mb-2"
        >
          复习中心
        </motion.h1>
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <BookOpen size={18} />
          <span>
            {currentIndex + 1} / {reviewWordIds.length}
          </span>
        </div>
      </header>

      <div className="mx-6 mb-8">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentIndex + 1) / reviewWordIds.length) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="px-6">
        <AnimatePresence mode="wait">
          {currentWord && (
            <motion.div
              key={currentWord.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ReviewCard word={currentWord} onResult={handleResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
