// src/components/StoryViewer.tsx
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

interface StoryViewerProps {
  story: string;
  highlights: string[];
}

export default function StoryViewer({ story, highlights }: StoryViewerProps) {
  // 将Markdown风格的文本转换为React元素
  const renderContent = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // 标题行（以**开头和结尾）
      if (line.startsWith('**') && line.endsWith('**')) {
        const title = line.slice(2, -2);
        return (
          <h4 key={index} className="text-lg font-bold text-indigo-300 mt-4 mb-2">
            {title}
          </h4>
        );
      }
      
      // 分隔线
      if (line.trim() === '---') {
        return <hr key={index} className="my-4 border-slate-600" />;
      }
      
      // 列表项（以- 开头）
      if (line.trim().startsWith('- ')) {
        const content = line.trim().slice(2);
        return (
          <li key={index} className="text-slate-300 ml-4 mb-1">
            {renderInlineFormatting(content)}
          </li>
        );
      }
      
      // 数字列表项（以1. 2. 3. 开头）
      if (/^\d+\.\s/.test(line.trim())) {
        const match = line.trim().match(/^(\d+)\.\s(.*)$/);
        if (match) {
          return (
            <li key={index} className="text-slate-300 ml-4 mb-1 list-decimal">
              {renderInlineFormatting(match[2])}
            </li>
          );
        }
      }
      
      // 空行
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // 普通文本
      return (
        <p key={index} className="text-slate-300 mb-2 leading-relaxed">
          {renderInlineFormatting(line)}
        </p>
      );
    });
  };
  
  // 处理行内格式（**加粗**、emoji等）
  const renderInlineFormatting = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIndex = 0;
    
    // 处理**加粗**格式
    while (remaining.includes('**')) {
      const startIndex = remaining.indexOf('**');
      if (startIndex === -1) break;
      
      const endIndex = remaining.indexOf('**', startIndex + 2);
      if (endIndex === -1) break;
      
      // 添加前面的普通文本
      if (startIndex > 0) {
        parts.push(
          <span key={keyIndex++}>
            {highlightText(remaining.substring(0, startIndex))}
          </span>
        );
      }
      
      // 添加加粗文本
      const boldText = remaining.substring(startIndex + 2, endIndex);
      parts.push(
        <strong key={keyIndex++} className="text-white font-semibold">
          {boldText}
        </strong>
      );
      
      remaining = remaining.substring(endIndex + 2);
    }
    
    // 添加剩余的文本
    if (remaining) {
      parts.push(
        <span key={keyIndex++}>
          {highlightText(remaining)}
        </span>
      );
    }
    
    return parts.length > 0 ? parts : text;
  };
  
  // 高亮关键词
  const highlightText = (text: string) => {
    let result = text;
    highlights.forEach((highlight, index) => {
      if (result.includes(highlight)) {
        result = result.replace(
          new RegExp(highlight, 'g'),
          `{{HIGHLIGHT_${index}}}`
        );
      }
    });
    
    const parts = result.split(/{{HIGHLIGHT_(\d+)}}/);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const highlightIndex = parseInt(part);
        return (
          <span
            key={index}
            className="bg-indigo-500/30 text-indigo-200 px-1 rounded font-medium"
          >
            {highlights[highlightIndex]}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 rounded-xl p-6 border border-slate-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={20} className="text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">记忆内容</h3>
      </div>
      
      <div className="prose prose-invert max-w-none">
        {renderContent(story)}
      </div>
    </motion.div>
  );
}
