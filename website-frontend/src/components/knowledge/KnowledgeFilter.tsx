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
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">内容分类</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`block w-full text-left px-3 py-2 rounded-md transition ${
                activeCategory === category.id
                  ? 'bg-primary-600 text-white font-medium shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
              {activeCategory === category.id && category.id !== 'all' && (
                <span className="float-right">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 标签过滤器 */}
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">内容标签</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => onTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition ${
                activeTags.includes(tag)
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 额外筛选器 - 可根据需要添加更多 */}
      <div className="bg-white rounded-lg shadow p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">发布时间</h3>
        <div className="space-y-2">
          {['全部时间', '最近一周', '最近一月', '最近三月', '最近一年'].map(period => (
            <div key={period} className="flex items-center">
              <input
                type="radio"
                id={period}
                name="timePeriod"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label htmlFor={period} className="ml-2 text-gray-700">
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
          className="w-full py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition font-medium"
        >
          清除所有过滤器
        </button>
      )}
    </div>
  );
};

export default KnowledgeFilter; 