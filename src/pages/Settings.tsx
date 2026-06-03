import { motion } from 'framer-motion';
import { User, BookOpen, Target, Trash2 } from 'lucide-react';
import { useAppStore } from '../stores/appStore';

export default function Settings() {
  const { userProfile, selectedBook, userStats } = useAppStore();

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？此操作不可撤销。')) {
      localStorage.removeItem('wordtown_v2_data');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-900">
      <header className="p-6 text-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-white mb-2"
        >
          个人中心
        </motion.h1>
        <p className="text-slate-400">查看你的学习档案</p>
      </header>

      <div className="px-6 space-y-6 max-w-md mx-auto">
        {/* 用户画像 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <User size={24} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">用户画像</h2>
              <p className="text-slate-400 text-sm">基于问卷生成的个性化配置</p>
            </div>
          </div>

          {userProfile && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">性格</span>
                <span className="text-white">{userProfile.personality.extroversion === 'introvert' ? '内向' : userProfile.personality.extroversion === 'extrovert' ? '外向' : '中间'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">叙事风格</span>
                <span className="text-white">
                  {userProfile.preferences.narrativeStyle === 'humorous' ? '轻松幽默' :
                   userProfile.preferences.narrativeStyle === 'serious' ? '严肃深刻' :
                   userProfile.preferences.narrativeStyle === 'mysterious' ? '悬疑紧张' : '温暖治愈'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">兴趣领域</span>
                <span className="text-white">{userProfile.interests.domains.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">热点态度</span>
                <span className="text-white">
                  {userProfile.preferences.hotTopicAttitude === 'love' ? '非常喜欢' :
                   userProfile.preferences.hotTopicAttitude === 'neutral' ? '可以接受' : '不太喜欢'}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* 词书信息 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <BookOpen size={24} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">当前词书</h2>
              <p className="text-slate-400 text-sm">正在学习的词汇库</p>
            </div>
          </div>

          {selectedBook ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">词书名称</span>
                <span className="text-white">{selectedBook.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">词汇总量</span>
                <span className="text-white">{selectedBook.totalWords} 词</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">考试类型</span>
                <span className="text-white">{selectedBook.examType === 'cet4' ? '英语四级' : '英语六级'}</span>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">尚未选择词书</p>
          )}
        </motion.div>

        {/* 学习设置 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Target size={24} className="text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">学习设置</h2>
              <p className="text-slate-400 text-sm">每日学习目标</p>
            </div>
          </div>

          {userProfile && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">每日目标</span>
                <span className="text-white">{userProfile.learning.dailyGoal} 词</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">备考目标</span>
                <span className="text-white">{userProfile.learning.targetExam === 'cet4' ? '英语四级' : '英语六级'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">累计学习时长</span>
                <span className="text-white">{userStats.totalStudyTime} 分钟</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* 重置数据 */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleReset}
          className="w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/20"
        >
          <Trash2 size={20} />
          <span>重置所有数据</span>
        </motion.button>
      </div>
    </div>
  );
}
