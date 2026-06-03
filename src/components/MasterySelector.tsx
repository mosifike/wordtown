// src/components/MasterySelector.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MasteryLevel } from '../types';

interface MasterySelectorProps {
  onSelect: (level: MasteryLevel) => void;
}

export default function MasterySelector({ onSelect }: MasterySelectorProps) {
  const [selected, setSelected] = useState<MasteryLevel | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (level: MasteryLevel) => {
    setSelected(level);
    setShowFeedback(true);
    setTimeout(() => {
      onSelect(level);
    }, 800);
  };

  const options: { level: MasteryLevel; label: string; color: string; feedback: string }[] = [
    { level: 'new', label: '陌生', color: 'bg-red-500/20 border-red-500 text-red-400', feedback: '已记录，会加强复习' },
    { level: 'learning', label: '熟悉', color: 'bg-yellow-500/20 border-yellow-500 text-yellow-400', feedback: '已记录，适度复习' },
    { level: 'mastered', label: '掌握', color: 'bg-green-500/20 border-green-500 text-green-400', feedback: '已记录，延长复习间隔' },
  ];

  return (
    <div className="space-y-3">
      <p className="text-slate-300 text-sm">这个单词掌握得如何？</p>
      <div className="flex gap-3">
        {options.map((option) => (
          <motion.button
            key={option.level}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(option.level)}
            disabled={showFeedback}
            className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
              selected === option.level
                ? option.color
                : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
            }`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
      {showFeedback && selected && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-indigo-400 text-center"
        >
          {options.find(o => o.level === selected)?.feedback}
        </motion.p>
      )}
    </div>
  );
}
