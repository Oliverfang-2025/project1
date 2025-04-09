import React from 'react';

interface KnowledgeSorterProps {
  sortBy: string;
  onSortChange: (value: string) => void;
}

/**
 * 知识内容排序组件
 * 用于在知识列表页面提供排序功能
 */
const KnowledgeSorter = ({ sortBy, onSortChange }: KnowledgeSorterProps) => {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-gray-700">排序:</span>
      <select 
        className="form-select rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        <option value="newest">最新发布</option>
        <option value="popular">最多点赞</option>
        <option value="commented">最多评论</option>
      </select>
    </div>
  );
};

export default KnowledgeSorter; 