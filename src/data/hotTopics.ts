// src/data/hotTopics.ts
export interface HotTopic {
  id: string;
  title: string;
  category: string;
  description: string;
}

export const hotTopics: HotTopic[] = [
  {
    id: 'ht_001',
    title: 'AI技术突破',
    category: '科技',
    description: '人工智能技术在各领域的最新突破和应用',
  },
  {
    id: 'ht_002',
    title: '新能源汽车',
    category: '科技',
    description: '电动汽车和清洁能源汽车的发展',
  },
  {
    id: 'ht_003',
    title: '太空探索',
    category: '科技',
    description: '人类对太空的探索和发现',
  },
  {
    id: 'ht_004',
    title: '热门影视剧',
    category: '娱乐',
    description: '当下热门的电影和电视剧',
  },
  {
    id: 'ht_005',
    title: '音乐节',
    category: '娱乐',
    description: '各类音乐活动和音乐节',
  },
  {
    id: 'ht_006',
    title: '奥运会',
    category: '体育',
    description: '奥林匹克运动会及相关赛事',
  },
  {
    id: 'ht_007',
    title: '世界杯',
    category: '体育',
    description: '足球世界杯赛事',
  },
  {
    id: 'ht_008',
    title: '传统文化',
    category: '文化',
    description: '中国传统文化的传承和创新',
  },
  {
    id: 'ht_009',
    title: '环保行动',
    category: '社会',
    description: '环境保护和可持续发展',
  },
  {
    id: 'ht_010',
    title: '数字经济',
    category: '商业',
    description: '数字化转型和经济发展',
  },
  {
    id: 'ht_011',
    title: '直播带货',
    category: '商业',
    description: '电商直播和网红经济',
  },
  {
    id: 'ht_012',
    title: '电竞比赛',
    category: '体育',
    description: '电子竞技游戏赛事',
  },
  {
    id: 'ht_013',
    title: '美食探店',
    category: '生活',
    description: '餐厅推荐和美食体验',
  },
  {
    id: 'ht_014',
    title: '旅游打卡',
    category: '生活',
    description: '热门旅游目的地分享',
  },
  {
    id: 'ht_015',
    title: '科技创新',
    category: '科技',
    description: '最新科技产品和创新应用',
  },
];

export function getHotTopicsByCategory(category: string): HotTopic[] {
  return hotTopics.filter(t => t.category === category);
}

export function getRandomHotTopics(count: number): HotTopic[] {
  const shuffled = [...hotTopics].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getCategories(): string[] {
  return [...new Set(hotTopics.map(t => t.category))];
}
