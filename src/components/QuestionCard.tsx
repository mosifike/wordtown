// src/components/QuestionCard.tsx
import { motion } from 'framer-motion';

interface QuestionCardProps {
  option: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: string;
}

export default function QuestionCard({ option, isSelected, onClick, icon }: QuestionCardProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
        isSelected
          ? 'border-indigo-500 bg-indigo-500/20 text-white'
          : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="font-medium">{option}</span>
      </div>
    </motion.button>
  );
}
