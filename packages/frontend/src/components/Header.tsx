import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className='bg-white shadow-sm border-b border-gray-200'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* 左侧搜索 */}
          <div className='flex-1 flex items-center'>
            <div className='w-full max-w-lg lg:max-w-xs'>
              <label htmlFor='search' className='sr-only'>
                搜索
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <Search className='h-5 w-5 text-gray-400' />
                </div>
                <input
                  id='search'
                  className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
                  placeholder='搜索股票、组合...'
                  type='search'
                />
              </div>
            </div>
          </div>

          {/* 右侧操作 */}
          <div className='flex items-center space-x-4'>
            {/* 通知 */}
            <button className='p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500'>
              <span className='sr-only'>查看通知</span>
              <Bell className='h-6 w-6' />
            </button>

            {/* 用户菜单 */}
            <div className='relative'>
              <button className='flex items-center space-x-2 p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500'>
                <span className='sr-only'>用户菜单</span>
                <User className='h-6 w-6' />
              </button>
            </div>

            {/* 市场状态 */}
            <div className='hidden sm:flex items-center space-x-4'>
              <div className='text-sm'>
                <span className='text-gray-500'>上证指数:</span>
                <span className='ml-1 font-medium text-green-600'>
                  3,123.45
                </span>
                <span className='ml-1 text-green-600'>+0.85%</span>
              </div>
              <div className='text-sm'>
                <span className='text-gray-500'>深证成指:</span>
                <span className='ml-1 font-medium text-red-600'>10,234.56</span>
                <span className='ml-1 text-red-600'>-0.32%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
