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
      <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm px-3 py-2">
        <span className="mr-2.5 text-gray-700 font-medium flex items-center">
          <svg className="w-5 h-5 mr-1.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          排序:
        </span>
        <div className="relative">
          <select 
            className="appearance-none bg-transparent pr-8 py-1 pl-2 text-gray-700 focus:outline-none focus:ring-0 focus:border-transparent"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">最新发布</option>
            <option value="popular">最多点赞</option>
            <option value="commented">最多评论</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeSorter; 