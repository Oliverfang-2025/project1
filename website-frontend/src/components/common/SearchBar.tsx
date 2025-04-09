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
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute left-0 top-0 h-full px-3 flex items-center text-gray-500 hover:text-primary"
      >
        <SearchOutlined />
      </button>
    </form>
  );
};

export default SearchBar; 