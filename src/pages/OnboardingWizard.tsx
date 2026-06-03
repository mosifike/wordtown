// src/pages/OnboardingWizard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile } from '../types';
import { useAppStore } from '../stores/appStore';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';

const steps = [
  {
    title: '性格画像',
    questions: [
      {
        id: 'extroversion',
        question: '你的性格更偏向？',
        options: [
          { value: 'introvert', label: '内向', icon: '📖' },
          { value: 'ambivert', label: '中间', icon: '🎭' },
          { value: 'extrovert', label: '外向', icon: '🎉' },
        ],
      },
      {
        id: 'socialPreference',
        question: '你平时更喜欢？',
        options: [
          { value: 'alone', label: '独处', icon: '🧘' },
          { value: 'small', label: '小圈子', icon: '👥' },
          { value: 'crowd', label: '热闹场合', icon: '🎪' },
        ],
      },
      {
        id: 'noveltyApproach',
        question: '面对新事物时？',
        options: [
          { value: 'cautious', label: '谨慎观察', icon: '🔍' },
          { value: 'eager', label: '跃跃欲试', icon: '🚀' },
        ],
      },
    ],
  },
  {
    title: '兴趣领域',
    questions: [
      {
        id: 'domains',
        question: '你最感兴趣的领域？（多选）',
        options: [
          { value: 'tech', label: '科技', icon: '💻' },
          { value: 'entertainment', label: '娱乐', icon: '🎬' },
          { value: 'sports', label: '体育', icon: '⚽' },
          { value: 'culture', label: '文化', icon: '🎨' },
          { value: 'nature', label: '自然', icon: '🌿' },
          { value: 'business', label: '商业', icon: '💼' },
        ],
        multiple: true,
      },
      {
        id: 'contentTypes',
        question: '你喜欢的内容类型？（多选）',
        options: [
          { value: 'mystery', label: '悬疑', icon: '🔮' },
          { value: 'comedy', label: '喜剧', icon: '😄' },
          { value: 'scifi', label: '科幻', icon: '🚀' },
          { value: 'history', label: '历史', icon: '📜' },
          { value: 'emotion', label: '情感', icon: '💝' },
          { value: 'inspirational', label: '励志', icon: '⭐' },
        ],
        multiple: true,
      },
    ],
  },
  {
    title: '内容偏好',
    questions: [
      {
        id: 'narrativeStyle',
        question: '你喜欢的叙事风格？',
        options: [
          { value: 'humorous', label: '轻松幽默', icon: '😄' },
          { value: 'serious', label: '严肃深刻', icon: '🤔' },
          { value: 'mysterious', label: '悬疑紧张', icon: '🔮' },
          { value: 'warm', label: '温暖治愈', icon: '☀️' },
        ],
      },
      {
        id: 'storyLength',
        question: '偏好的故事长度？',
        options: [
          { value: 'short', label: '简短精悍', icon: '⚡' },
          { value: 'medium', label: '中等篇幅', icon: '📄' },
          { value: 'long', label: '详细展开', icon: '📚' },
        ],
      },
      {
        id: 'hotTopicAttitude',
        question: '对时事热点的态度？',
        options: [
          { value: 'love', label: '非常喜欢融入', icon: '🔥' },
          { value: 'neutral', label: '可以接受', icon: '🤷' },
          { value: 'dislike', label: '不太喜欢', icon: '😶' },
        ],
      },
    ],
  },
  {
    title: '学习偏好',
    questions: [
      {
        id: 'targetExam',
        question: '当前备考目标？',
        options: [
          { value: 'cet4', label: '英语四级', icon: '📗' },
          { value: 'cet6', label: '英语六级', icon: '📘' },
        ],
      },
      {
        id: 'dailyGoal',
        question: '每日单词目标？',
        options: [
          { value: '10', label: '10个', icon: '🔟' },
          { value: '20', label: '20个', icon: '20' },
          { value: '30', label: '30个', icon: '30' },
        ],
      },
    ],
  },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { setUserProfile } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const currentStepData = steps[currentStep];

  const handleSelect = (questionId: string, value: string, multiple?: boolean) => {
    setAnswers(prev => {
      if (multiple) {
        const current = prev[questionId] || [];
        const updated = current.includes(value)
          ? current.filter((v: string) => v !== value)
          : [...current, value];
        return { ...prev, [questionId]: updated };
      }
      return { ...prev, [questionId]: value };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      const profile: UserProfile = {
        id: `user_${Date.now()}`,
        personality: {
          extroversion: answers.extroversion || 'ambivert',
          socialPreference: answers.socialPreference || 'small',
          noveltyApproach: answers.noveltyApproach || 'cautious',
        },
        interests: {
          domains: answers.domains || ['tech'],
          contentTypes: answers.contentTypes || ['scifi'],
          hotTopics: ['tech', 'entertainment'],
        },
        preferences: {
          narrativeStyle: answers.narrativeStyle || 'humorous',
          storyLength: answers.storyLength || 'medium',
          hotTopicAttitude: answers.hotTopicAttitude || 'neutral',
        },
        learning: {
          targetExam: answers.targetExam || 'cet4',
          dailyDuration: 20,
          dailyGoal: parseInt(answers.dailyGoal || '20'),
        },
      };
      setUserProfile(profile);
      navigate('/select-book');
    }
  };

  const canProceed = () => {
    const requiredQuestions = currentStepData.questions.map(q => q.id);
    return requiredQuestions.every(id => {
      const answer = answers[id];
      return answer && (Array.isArray(answer) ? answer.length > 0 : true);
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-md mx-auto">
        <ProgressBar currentStep={currentStep + 1} totalSteps={steps.length} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold text-white mb-2">{currentStepData.title}</h2>
            <p className="text-slate-400 mb-6">让我们了解你的偏好</p>

            <div className="space-y-6">
              {currentStepData.questions.map((question) => (
                <div key={question.id}>
                  <h3 className="text-lg font-medium text-white mb-3">{question.question}</h3>
                  <div className="space-y-2">
                    {question.options.map((option) => (
                      <QuestionCard
                        key={option.value}
                        option={option.label}
                        icon={option.icon}
                        isSelected={
                          question.multiple
                            ? (answers[question.id] || []).includes(option.value)
                            : answers[question.id] === option.value
                        }
                        onClick={() => handleSelect(question.id, option.value, question.multiple)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700"
            >
              上一步
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 py-3 rounded-xl font-medium ${
              canProceed()
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {currentStep < steps.length - 1 ? '下一步' : '完成'}
          </button>
        </div>
      </div>
    </div>
  );
}
