import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  onSearch, 
  placeholder = '搜索...', 
  className = '' 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);
    // 可选: 在输入时实时搜索，而不是等待表单提交
    // if (value === '' || value.length > 2) {
    //   onSearch(value);
    // }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative flex items-center ${className}`}
    >
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full h-11 pl-12 pr-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
      />
      <button
        type="submit"
        className={`absolute left-0 top-0 h-full px-4 flex items-center ${isFocused ? 'text-primary-600' : 'text-gray-500'} hover:text-primary-600 transition-colors`}
      >
        <SearchOutlined style={{ fontSize: '18px' }} />
      </button>
    </form>
  );
};

export default SearchBar; 