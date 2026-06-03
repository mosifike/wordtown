// src/pages/WordLearning.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Volume2, ArrowLeft } from 'lucide-react';
import { getWordById, wordBooks } from '../data/words';
import { useAppStore } from '../stores/appStore';
import { generateStory } from '../services/aiStory';
import { WordMemoryContent } from '../types';
import StoryViewer from '../components/StoryViewer';
import MasterySelector from '../components/MasterySelector';

export default function WordLearning() {
  const { wordId } = useParams<{ wordId: string }>();
  const navigate = useNavigate();
  const { addLearningRecord, getCachedContent, setCachedContent, userProfile, updateMasteryLevel, updateStatsStudyTime, selectedBook, learningRecords } = useAppStore();
  
  const [content, setContent] = useState<WordMemoryContent | null>(null);
  const [loading, setLoading] = useState(true);

  const word = wordId ? getWordById(wordId) : null;

  // 获取下一个待学单词
  const getNextWord = () => {
    if (!selectedBook) return null;
    const learnedIds = new Set(learningRecords.map(r => r.wordId));
    // 找到当前单词的位置，然后取下一个
    const currentIndex = selectedBook.words.findIndex(w => w.id === wordId);
    const nextWords = selectedBook.words.slice(currentIndex + 1).filter(w => !learnedIds.has(w.id));
    // 如果没有下一个，返回第一个未学习的
    if (nextWords.length > 0) return nextWords[0];
    const unlearned = selectedBook.words.filter(w => !learnedIds.has(w.id));
    return unlearned.length > 0 ? unlearned[0] : null;
  };

  useEffect(() => {
    if (!word || !userProfile) return;

    const loadContent = async () => {
      // 检查缓存
      const cached = getCachedContent(word.id);
      if (cached) {
        setContent(cached);
        setLoading(false);
        return;
      }

      // 生成新内容
      try {
        const generated = await generateStory(word, userProfile);
        setCachedContent(word.id, generated);
        setContent(generated);
      } catch (error) {
        console.error('生成故事失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [word, userProfile, getCachedContent, setCachedContent]);

  const handleMasterySelect = (level: 'new' | 'learning' | 'mastered') => {
    if (word) {
      addLearningRecord(word.id);
      updateMasteryLevel(word.id, level);
      updateStatsStudyTime(1);
      
      // 查找下一个单词
      const nextWord = getNextWord();
      if (nextWord) {
        navigate(`/learn/${nextWord.id}`);
      } else {
        navigate('/home');
      }
    }
  };

  if (!word) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">单词不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate('/home')}
          className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <ArrowLeft size={20} />
        </button>
        <span className="text-slate-400 text-sm">单词学习</span>
        <div className="w-10" />
      </div>

      <div className="px-4 space-y-4">
        {/* 单词基础信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold word-font text-white">{word.word}</h1>
            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(word.word);
                utterance.lang = 'en-US';
                speechSynthesis.speak(utterance);
              }}
              className="p-2 rounded-full bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
            >
              <Volume2 size={20} />
            </button>
          </div>
          <p className="text-slate-400 text-lg mb-1">{word.phonetic}</p>
          <p className="text-xl text-indigo-300">{word.meaning}</p>
        </motion.div>

        {/* AI故事内容 */}
        {loading ? (
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-slate-400">正在为你生成个性化记忆内容...</p>
          </div>
        ) : content ? (
          <StoryViewer story={content.story} highlights={content.storyHighlights} />
        ) : null}

        {/* 掌握程度选择 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
        >
          <MasterySelector onSelect={handleMasterySelect} />
        </motion.div>
      </div>
    </div>
  );
}
