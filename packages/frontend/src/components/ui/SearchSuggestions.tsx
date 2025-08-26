import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  FileText,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';

export interface SearchSuggestion {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'function' | 'data';
  href?: string;
  icon?: React.ComponentType<any>;
  tags?: string[];
}

interface SearchSuggestionsProps {
  query: string;
  suggestions: SearchSuggestion[];
  isVisible: boolean;
  onClose: () => void;
  onSelect: (suggestion: SearchSuggestion) => void;
  className?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  suggestions,
  isVisible,
  onClose,
  onSelect,
  className = '',
}) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSelect, onClose]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page':
        return FileText;
      case 'function':
        return TrendingUp;
      case 'data':
        return BarChart3;
      default:
        return Search;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'page':
        return 'text-blue-600 bg-blue-100';
      case 'function':
        return 'text-green-600 bg-green-100';
      case 'data':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isVisible || suggestions.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto ${className}`}
    >
      <div className='p-2'>
        <div className='flex items-center justify-between px-3 py-2 border-b border-gray-100'>
          <span className='text-sm font-medium text-gray-700'>
            搜索结果 ({suggestions.length})
          </span>
          <button
            onClick={onClose}
            className='p-1 hover:bg-gray-100 rounded-lg transition-colors'
          >
            <X className='h-4 w-4 text-gray-400' />
          </button>
        </div>

        <div className='py-2'>
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon || getTypeIcon(suggestion.type);
            const isSelected = index === selectedIndex;

            return (
              <div
                key={suggestion.id}
                className={`px-3 py-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-primary-50 border border-primary-200'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelect(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className='flex items-start space-x-3'>
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg ${getTypeColor(
                      suggestion.type
                    )}`}
                  >
                    <Icon className='h-4 w-4' />
                  </div>

                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center space-x-2 mb-1'>
                      <h4 className='text-sm font-medium text-gray-900 truncate'>
                        {suggestion.title}
                      </h4>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getTypeColor(
                          suggestion.type
                        )}`}
                      >
                        {suggestion.type}
                      </span>
                    </div>

                    <p className='text-sm text-gray-600 line-clamp-2'>
                      {suggestion.description}
                    </p>

                    {suggestion.tags && suggestion.tags.length > 0 && (
                      <div className='flex flex-wrap gap-1 mt-2'>
                        {suggestion.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className='px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className='px-3 py-2 border-t border-gray-100'>
          <div className='text-xs text-gray-500'>
            使用 ↑↓ 键导航，Enter 键选择，Esc 键关闭
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSuggestions;
