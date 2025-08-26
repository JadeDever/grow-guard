import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  HelpCircle,
} from 'lucide-react';
import Button from './ui/Button';
import Badge from './ui/Badge';
import SearchSuggestions from './ui/SearchSuggestions';
import { SearchSuggestion } from './ui/SearchSuggestions';

const Header: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [notifications] = useState([
    { id: 1, message: '比亚迪触发止损提醒', time: '2分钟前', unread: true },
    { id: 2, message: '宁德时代达到止盈目标', time: '15分钟前', unread: true },
    { id: 3, message: '军工板块权重超限', time: '1小时前', unread: false },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 模拟搜索建议数据
  const searchSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      title: '投资组合',
      description: '查看和管理您的投资组合配置',
      type: 'page',
      href: '/portfolio',
      tags: ['组合', '配置', '权重'],
    },
    {
      id: '2',
      title: '持仓管理',
      description: '管理您的股票持仓和仓位调整',
      type: 'page',
      href: '/positions',
      tags: ['持仓', '股票', '仓位'],
    },
    {
      id: '3',
      title: '风险控制',
      description: '设置止损止盈和风险控制参数',
      type: 'function',
      href: '/discipline',
      tags: ['风险', '止损', '控制'],
    },
    {
      id: '4',
      title: '绩效分析',
      description: '分析投资绩效和收益表现',
      type: 'data',
      href: '/performance',
      tags: ['绩效', '收益', '分析'],
    },
    {
      id: '5',
      title: '交易记录',
      description: '查看历史交易记录和执行情况',
      type: 'page',
      href: '/transactions',
      tags: ['交易', '历史', '执行'],
    },
  ];

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // 处理搜索输入
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSearchSuggestions(query.length > 0);
  };

  // 处理搜索建议选择
  const handleSearchSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.href) {
      window.location.href = suggestion.href;
    }
    setSearchQuery('');
    setShowSearchSuggestions(false);
  };

  // 关闭搜索建议
  const closeSearchSuggestions = () => {
    setShowSearchSuggestions(false);
  };

  // 点击外部关闭搜索建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 过滤搜索建议
  const filteredSuggestions = searchSuggestions.filter(
    (suggestion) =>
      suggestion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      suggestion.tags?.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <header className='bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm'>
      <div className='flex items-center justify-between h-16 px-6'>
        {/* 左侧搜索区域 */}
        <div
          className='flex items-center space-x-4 flex-1 max-w-md'
          ref={searchRef}
        >
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              placeholder='搜索股票、基金或报告...'
              value={searchQuery}
              onChange={handleSearchInput}
              onFocus={() =>
                searchQuery.length > 0 && setShowSearchSuggestions(true)
              }
              className='w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200'
            />

            {/* 搜索建议 */}
            <SearchSuggestions
              query={searchQuery}
              suggestions={filteredSuggestions}
              isVisible={showSearchSuggestions}
              onClose={closeSearchSuggestions}
              onSelect={handleSearchSelect}
            />
          </div>
        </div>

        {/* 右侧操作区域 */}
        <div className='flex items-center space-x-3'>
          {/* 主题切换 */}
          <Button
            variant='ghost'
            size='sm'
            onClick={toggleDarkMode}
            className='p-2'
            title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}
          >
            {isDarkMode ? (
              <Sun className='h-4 w-4' />
            ) : (
              <Moon className='h-4 w-4' />
            )}
          </Button>

          {/* 帮助 */}
          <Button variant='ghost' size='sm' className='p-2' title='帮助中心'>
            <HelpCircle className='h-4 w-4' />
          </Button>

          {/* 通知 */}
          <div className='relative'>
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleNotifications}
              className='p-2 relative'
              title='通知中心'
            >
              <Bell className='h-4 w-4' />
              {unreadCount > 0 && (
                <Badge
                  variant='danger'
                  size='sm'
                  className='absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-xs'
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>

            {/* 通知下拉菜单 */}
            {showNotifications && (
              <div className='absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-scale-in'>
                <div className='p-4 border-b border-gray-200'>
                  <div className='flex items-center justify-between'>
                    <h3 className='text-sm font-semibold text-gray-900'>
                      通知中心
                    </h3>
                    <Button variant='ghost' size='sm' className='text-xs'>
                      全部标记为已读
                    </Button>
                  </div>
                </div>
                <div className='max-h-64 overflow-y-auto'>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors ${
                        notification.unread ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className='flex-1'>
                        <p className='text-sm text-gray-900'>
                          {notification.message}
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className='p-3 border-t border-gray-200'>
                  <Button variant='secondary' size='sm' className='w-full'>
                    查看全部通知
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* 用户菜单 */}
          <div className='relative'>
            <Button
              variant='ghost'
              size='sm'
              onClick={toggleUserMenu}
              className='flex items-center space-x-2 p-2'
            >
              <div className='w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center'>
                <User className='h-4 w-4 text-white' />
              </div>
              <span className='hidden sm:block text-sm font-medium text-gray-700'>
                投资经理
              </span>
            </Button>

            {/* 用户下拉菜单 */}
            {showUserMenu && (
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-scale-in'>
                <div className='p-3 border-b border-gray-200'>
                  <p className='text-sm font-medium text-gray-900'>投资经理</p>
                  <p className='text-xs text-gray-500'>manager@growguard.com</p>
                </div>
                <div className='p-1'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start'
                    icon={Settings}
                  >
                    账户设置
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
                    icon={LogOut}
                  >
                    退出登录
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 点击外部关闭下拉菜单 */}
      {(showNotifications || showUserMenu) && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;
