import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  PieChart,
  BarChart3,
  FileText,
  Settings,
  TrendingUp,
  Shield,
  Workflow,
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigation = [
    { name: '仪表盘', href: '/', icon: Home },
    { name: '投资组合', href: '/portfolio', icon: PieChart },
    { name: '持仓管理', href: '/positions', icon: BarChart3 },
    { name: '业务流程', href: '/business-process', icon: Workflow },
    { name: '交易记录', href: '/transactions', icon: TrendingUp },
    { name: '纪律提醒', href: '/discipline', icon: Shield },
    { name: '报告中心', href: '/reports', icon: FileText },
    { name: '系统设置', href: '/settings', icon: Settings },
  ];

  return (
    <div className='hidden md:flex md:flex-shrink-0'>
      <div className='flex flex-col w-64'>
        <div className='flex flex-col h-0 flex-1 bg-white border-r border-gray-200'>
          {/* Logo */}
          <div className='flex items-center h-16 flex-shrink-0 px-4 bg-primary-600'>
            <div className='flex items-center'>
              <div className='flex-shrink-0'>
                <h1 className='text-white text-xl font-bold'>长盈智投</h1>
              </div>
            </div>
          </div>

          {/* 导航菜单 */}
          <div className='flex-1 flex flex-col overflow-y-auto'>
            <nav className='flex-1 px-2 py-4 space-y-1'>
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <Icon className='mr-3 flex-shrink-0 h-5 w-5' />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* 底部信息 */}
          <div className='flex-shrink-0 flex border-t border-gray-200 p-4'>
            <div className='flex items-center w-full'>
              <div className='flex-shrink-0'>
                <div className='h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center'>
                  <span className='text-primary-600 text-sm font-medium'>
                    智
                  </span>
                </div>
              </div>
              <div className='ml-3'>
                <p className='text-sm font-medium text-gray-700'>
                  智能投资助手
                </p>
                <p className='text-xs text-gray-500'>让投资更简单</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
