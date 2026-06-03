// src/services/aiImage.ts
import { WordMemoryContent } from '../types';

// 预留AI图像生成接口
export async function generateComicImages(
  content: WordMemoryContent
): Promise<string[]> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 返回占位图片URL（使用占位图服务）
  return [
    `https://via.placeholder.com/800x450/6366f1/ffffff?text=${encodeURIComponent(content.wordId)}_1`,
    `https://via.placeholder.com/800x450/10b981/ffffff?text=${encodeURIComponent(content.wordId)}_2`,
    `https://via.placeholder.com/800x450/f59e0b/ffffff?text=${encodeURIComponent(content.wordId)}_3`,
  ];
}
