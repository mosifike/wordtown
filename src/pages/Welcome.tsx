// src/pages/Welcome.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Brain } from 'lucide-react';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center gap-4 mb-8">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center"
          >
            <Sparkles size={32} className="text-indigo-400" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
            className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center"
          >
            <BookOpen size={32} className="text-emerald-400" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.6 }}
            className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center"
          >
            <Brain size={32} className="text-amber-400" />
          </motion.div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">词汇小镇</h1>
        <p className="text-xl text-indigo-300 mb-2">AI个性化背单词</p>
        <p className="text-slate-400 mb-8 leading-relaxed">
          根据你的性格和兴趣，为你定制专属的记忆故事和漫剧，让背单词不再枯燥
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/onboarding')}
          className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-lg transition-colors"
        >
          开始体验
        </motion.button>

        <p className="text-slate-500 text-sm mt-4">专为四六级备考设计</p>
      </motion.div>
    </div>
  );
}
