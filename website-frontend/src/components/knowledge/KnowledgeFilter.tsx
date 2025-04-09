import React from 'react';

interface Category {
  id: string;
  name: string;
}

interface KnowledgeFilterProps {
  categories: Category[];
  tags: string[];
  activeCategory: string;
  activeTags: string[];
  onCategoryChange: (category: string) => void;
  onTagToggle: (tag: string) => void;
}

const KnowledgeFilter = ({
  categories,
  tags,
  activeCategory,
  activeTags,
  onCategoryChange,
  onTagToggle
}: KnowledgeFilterProps) => {
  return (
    <div className="space-y-6">
      {/* 分类过滤器 */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-5 bg-primary-500 rounded-full mr-2"></span>
          内容分类
        </h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left px-4 py-2.5 rounded-lg transition duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white font-medium shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{category.name}</span>
                {activeCategory === category.id && category.id !== 'all' && (
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 标签过滤器 */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-5 bg-primary-500 rounded-full mr-2"></span>
          内容标签
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 ${
                activeTags.includes(tag)
                  ? 'bg-primary-600 text-white shadow-sm font-medium'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 额外筛选器 - 可根据需要添加更多 */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="w-1 h-5 bg-primary-500 rounded-full mr-2"></span>
          发布时间
        </h3>
        <div className="space-y-3">
          {['全部时间', '最近一周', '最近一月', '最近三月', '最近一年'].map(period => (
            <div key={period} className="flex items-center">
              <input
                type="radio"
                id={period}
                name="timePeriod"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 focus:ring-offset-0 border-gray-300 cursor-pointer"
              />
              <label htmlFor={period} className="ml-2.5 text-gray-700 cursor-pointer hover:text-primary-600 transition-colors">
                {period}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 清除所有过滤器按钮 */}
      {(activeCategory !== 'all' || activeTags.length > 0) && (
        <button
          onClick={() => {
            onCategoryChange('all');
            activeTags.forEach(tag => onTagToggle(tag));
          }}
          className="w-full py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition duration-200 font-medium flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          清除所有过滤器
        </button>
      )}
    </div>
  );
};

export default KnowledgeFilter; 