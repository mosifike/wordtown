// src/services/aiStory.ts
import { Word, UserProfile, WordMemoryContent } from '../types';
import { getRandomHotTopics, hotTopics } from '../data/hotTopics';

// 根据用户画像生成个性化记忆内容
export async function generateStory(
  word: Word,
  userProfile: UserProfile
): Promise<WordMemoryContent> {
  // 模拟AI生成延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 根据用户兴趣筛选热点话题
  const relevantTopics = selectRelevantHotTopics(userProfile);
  
  // 生成个性化记忆内容
  const memoryContent = generatePersonalizedContent(word, userProfile, relevantTopics);
  
  return {
    wordId: word.id,
    userId: userProfile.id,
    story: memoryContent.text,
    storyHighlights: memoryContent.highlights,
    comicImages: [], // 暂时移除漫剧，专注文本内容
    hotTopicsUsed: relevantTopics.map(t => t.title),
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

// 根据用户兴趣筛选相关的热点话题
function selectRelevantHotTopics(profile: UserProfile) {
  const userInterests = profile.interests.domains;
  const userTopics = profile.interests.hotTopics;
  
  // 优先选择用户感兴趣的话题
  let relevantTopics = hotTopics.filter(topic => 
    userInterests.some(interest => topic.category.includes(interest)) ||
    userTopics.some(userTopic => topic.title.includes(userTopic))
  );
  
  // 如果没有匹配的，随机选择
  if (relevantTopics.length < 2) {
    relevantTopics = getRandomHotTopics(2);
  }
  
  return relevantTopics.slice(0, 2);
}

// 生成个性化记忆内容
function generatePersonalizedContent(
  word: Word,
  profile: UserProfile,
  topics: { title: string; category: string; description?: string }[]
): { text: string; highlights: string[] } {
  
  // 根据用户画像构建内容框架
  const contentFramework = buildContentFramework(profile, word, topics);
  
  // 生成完整的记忆内容
  const fullContent = generateFullContent(contentFramework, profile, word, topics);
  
  return {
    text: fullContent,
    highlights: [word.word, word.meaning, ...contentFramework.keyConcepts]
  };
}

// 构建内容框架
function buildContentFramework(
  profile: UserProfile,
  word: Word,
  topics: { title: string; category: string }[]
) {
  const { personality, interests, preferences } = profile;
  
  // 根据性格确定叙事角度
  let narrativeAngle = '';
  let characterType = '';
  let emotionalTone = '';
  
  // 性格维度
  if (personality.extroversion === 'introvert') {
    characterType = '一个喜欢独处思考的主角';
    narrativeAngle = '内心独白和深度思考';
  } else if (personality.extroversion === 'extrovert') {
    characterType = '一个活泼开朗的主角';
    narrativeAngle = '社交互动和外部冒险';
  } else {
    characterType = '一个性格平衡的主角';
    narrativeAngle = '多元化的生活场景';
  }
  
  // 社交偏好
  if (personality.socialPreference === 'alone') {
    narrativeAngle += '，故事发生在安静的个人空间';
  } else if (personality.socialPreference === 'small') {
    narrativeAngle += '，故事发生在小圈子互动中';
  } else {
    narrativeAngle += '，故事发生在热闹的社交场合';
  }
  
  // 新事物态度
  if (personality.noveltyApproach === 'cautious') {
    emotionalTone = '谨慎探索、逐步理解';
  } else {
    emotionalTone = '充满好奇、积极尝试';
  }
  
  // 根据兴趣领域选择场景
  const primaryInterest = interests.domains[0] || '生活';
  const contentType = interests.contentTypes[0] || '日常';
  
  // 热点态度
  let topicIntegration = '';
  if (preferences.hotTopicAttitude === 'love') {
    topicIntegration = `巧妙融入${topics[0]?.title || '时事热点'}元素`;
  } else if (preferences.hotTopicAttitude === 'neutral') {
    topicIntegration = '适度引用现实案例';
  } else {
    topicIntegration = '专注经典场景，避免时事';
  }
  
  return {
    characterType,
    narrativeAngle,
    emotionalTone,
    primaryInterest,
    contentType,
    topicIntegration,
    keyConcepts: [primaryInterest, contentType]
  };
}

// 生成完整内容
function generateFullContent(
  framework: any,
  profile: UserProfile,
  word: Word,
  topics: { title: string; category: string }[]
): string {
  const { preferences } = profile;
  const style = preferences.narrativeStyle;
  const length = preferences.storyLength;
  
  // 根据叙事风格生成不同类型的内容
  let content = '';
  
  switch (style) {
    case 'humorous':
      content = generateHumorousContent(framework, word, topics, length);
      break;
    case 'mysterious':
      content = generateMysteriousContent(framework, word, topics, length);
      break;
    case 'serious':
      content = generateSeriousContent(framework, word, topics, length);
      break;
    case 'warm':
    default:
      content = generateWarmContent(framework, word, topics, length);
      break;
  }
  
  return content;
}

// 幽默风格内容
function generateHumorousContent(
  framework: any,
  word: Word,
  topics: { title: string; category: string }[],
  length: string
): string {
  const topic = topics[0]?.title || '日常生活';
  
  let content = `😄 **趣味记忆时刻**

${framework.characterType}在${topic}的世界里遇到了一个有趣的挑战。

场景：${framework.narrativeAngle}

---

"${word.word}"这个词突然出现在面前，它的意思是"${word.meaning}"。

主角的反应：${framework.emotionalTone}

💡 **趣味记忆法**：
想象一下，在${topic}的场景中，有人大喊"${word.word}"！原来是在${framework.primaryInterest}领域，这个词代表着"${word.meaning}"。

例句：${word.example}
（${word.exampleTranslation}）

---

🎯 **快速记忆口诀**：
"${word.word}" = ${word.meaning}
记住：在${framework.primaryInterest}中，${word.word}就是${word.meaning}！`;

  if (length === 'medium' || length === 'long') {
    content += `

📊 **拓展学习**：
- 词根词缀：分析${word.word}的构成
- 同义词：探索相关词汇
- 场景应用：在不同情境下使用`;
  }
  
  if (length === 'long') {
    content += `

🧠 **深度记忆技巧**：
1. 视觉联想：在脑海中构建${topic}的画面
2. 情感连接：感受${framework.emotionalTone}的氛围
3. 场景重现：想象自己在${framework.primaryInterest}环境中使用这个词`;
  }
  
  return content;
}

// 悬疑风格内容
function generateMysteriousContent(
  framework: any,
  word: Word,
  topics: { title: string; category: string }[],
  length: string
): string {
  const topic = topics[0]?.title || '神秘事件';
  
  let content = `🔮 **悬疑解密时刻**

${framework.characterType}收到了一条神秘信息，只有一个词："${word.word}"。

**案件背景**：
${framework.narrativeAngle}

---

🔍 **线索分析**：
这个词的意思是"${word.meaning}"，是破解整个谜题的关键！

主角以${framework.emotionalTone}的方式，逐步揭开了真相。

💡 **记忆推理**：
在${topic}的背景下，"${word.word}"成为了连接所有线索的核心。它的含义"${word.meaning}"正是解开谜题的钥匙。

例句：${word.example}
（${word.exampleTranslation}）

---

🎯 **记忆要点**：
记住"${word.word}" = "${word.meaning}"
在${framework.primaryInterest}领域，这个词扮演着关键角色。`;

  if (length === 'medium' || length === 'long') {
    content += `

🔎 **深度探索**：
- 词汇来源：追溯${word.word}的词源
- 使用场景：在${framework.contentType}中的应用
- 相关词汇：构建词汇网络`;
  }
  
  if (length === 'long') {
    content += `

🎭 **沉浸式记忆**：
闭上眼睛，想象自己是故事中的主角：
1. 收到神秘信息"${word.word}"
2. 通过推理发现它的意思是"${word.meaning}"
3. 用这个知识破解了整个谜题`;
  }
  
  return content;
}

// 严肃风格内容
function generateSeriousContent(
  framework: any,
  word: Word,
  topics: { title: string; category: string }[],
  length: string
): string {
  const topic = topics[0]?.title || '学术研究';
  
  let content = `📚 **学术学习时刻**

**主题**：${topic}领域的核心词汇

**词汇**：${word.word}
**释义**：${word.meaning}

---

📖 **深度解析**：
在${framework.primaryInterest}领域，"${word.word}"是一个重要的概念。

${framework.characterType}通过${framework.emotionalTone}的方式，深入理解了这个词的内涵。

💡 **知识框架**：
- 核心含义：${word.meaning}
- 应用领域：${framework.primaryInterest}
- 使用场景：${framework.contentType}

例句：${word.example}
（${word.exampleTranslation}）

---

🎯 **学习要点**：
掌握"${word.word}"的关键在于理解它在${framework.primaryInterest}中的具体应用。`;

  if (length === 'medium' || length === 'long') {
    content += `

📊 **拓展知识**：
- 词源分析：${word.word}的词源和演变
- 学术应用：在专业文献中的使用
- 相关概念：构建知识体系`;
  }
  
  if (length === 'long') {
    content += `

🧠 **深度学习方法**：
1. 概念理解：把握${word.meaning}的本质
2. 场景应用：在${framework.primaryInterest}中实践
3. 知识连接：与其他概念建立联系`;
  }
  
  return content;
}

// 温暖风格内容
function generateWarmContent(
  framework: any,
  word: Word,
  topics: { title: string; category: string }[],
  length: string
): string {
  const topic = topics[0]?.title || '温馨日常';
  
  let content = `☀️ **温暖记忆时刻**

${framework.characterType}在${topic}的美好时光中，遇到了一个特别的词。

**故事场景**：
${framework.narrativeAngle}

---

💝 **温馨故事**：
"${word.word}"这个词的意思是"${word.meaning}"，它承载着温暖的意义。

主角以${framework.emotionalTone}的态度，感受到了这个词背后的情感。

💡 **情感记忆**：
在${framework.primaryInterest}的世界里，"${word.word}"不仅仅是一个词，更是一种情感的传递。它的含义"${word.meaning}"代表着生活中的美好。

例句：${word.example}
（${word.exampleTranslation}）

---

🎯 **记忆心语**：
记住"${word.word}" = "${word.meaning}"
让这个词成为你在${framework.primaryInterest}旅程中的温暖伙伴。`;

  if (length === 'medium' || length === 'long') {
    content += `

🌸 **情感拓展**：
- 生活应用：在日常中感受${word.meaning}
- 情感连接：与个人经历建立联系
- 正向联想：构建积极的记忆网络`;
  }
  
  if (length === 'long') {
    content += `

💖 **心灵记忆法**：
1. 情感共鸣：感受${framework.emotionalTone}的温暖
2. 生活连接：在${framework.primaryInterest}中找到这个词
3. 心灵印记：让"${word.word}"成为你的一部分`;
  }
  
  return content;
}
