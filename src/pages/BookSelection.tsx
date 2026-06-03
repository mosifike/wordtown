// src/pages/BookSelection.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Check } from 'lucide-react';
import { wordBooks } from '../data/words';
import { useAppStore } from '../stores/appStore';

export default function BookSelection() {
  const navigate = useNavigate();
  const { setSelectedBook, userProfile } = useAppStore();

  const handleSelectBook = (bookId: string) => {
    const book = wordBooks.find(b => b.id === bookId);
    if (book) {
      setSelectedBook(book);
      navigate('/home');
    }
  };

  const recommendedBook = userProfile?.learning.targetExam || 'cet4';

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-white mb-2">选择词书</h2>
          <p className="text-slate-400 mb-6">根据你的备考目标推荐</p>

          <div className="space-y-4">
            {wordBooks.map((book) => {
              const isRecommended = book.id === recommendedBook;
              return (
                <motion.button
                  key={book.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectBook(book.id)}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all ${
                    isRecommended
                      ? 'border-indigo-500 bg-indigo-500/10'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isRecommended ? 'bg-indigo-500/20' : 'bg-slate-700'
                      }`}>
                        <BookOpen size={24} className={isRecommended ? 'text-indigo-400' : 'text-slate-400'} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{book.name}</h3>
                        <p className="text-slate-400 text-sm">{book.totalWords} 个核心词汇</p>
                      </div>
                    </div>
                    {isRecommended && (
                      <div className="flex items-center gap-1 text-indigo-400 text-sm">
                        <Check size={16} />
                        <span>推荐</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
