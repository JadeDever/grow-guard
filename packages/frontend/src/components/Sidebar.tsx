import React, { useState } from 'react';
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
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Target,
  Activity,
  Database,
  Users,
  Zap,
} from 'lucide-react';
import Button from './ui/Button';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: string;
  badgeColor?: 'primary' | 'success' | 'warning' | 'danger';
}

interface NavigationGroup {
  title: string;
  items: NavigationItem[];
  icon?: React.ComponentType<any>;
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['概览', '投资管理'])
  );

  // 优化的导航结构 - 避免功能重复
  const navigationGroups: NavigationGroup[] = [
    {
      title: '概览',
      icon: Home,
      items: [
        {
          name: '仪表盘',
          href: '/',
          icon: Home,
          description: '投资概览和关键指标',
        },
      ],
    },
    {
      title: '投资管理',
      icon: Target,
      items: [
        {
          name: '投资组合',
          href: '/portfolio',
          icon: PieChart,
          description: '组合配置和权重管理',
        },
        {
          name: '持仓管理',
          href: '/positions',
          icon: BarChart3,
          description: '持仓详情和调整',
        },
        {
          name: '交易记录',
          href: '/transactions',
          icon: TrendingUp,
          description: '交易历史和执行记录',
        },
      ],
    },
    {
      title: '风控合规',
      icon: Shield,
      items: [
        {
          name: '纪律提醒',
          href: '/discipline',
          icon: Shield,
          description: '风险控制和纪律执行',
          badge: '3',
          badgeColor: 'warning',
        },
        {
          name: '业务流程',
          href: '/business-process',
          icon: Workflow,
          description: '流程控制和审批管理',
        },
      ],
    },
    {
      title: '分析报告',
      icon: FileText,
      items: [
        {
          name: '报告中心',
          href: '/reports',
          icon: FileText,
          description: '投资分析和报告生成',
        },
        {
          name: '绩效分析',
          href: '/performance',
          icon: Activity,
          description: '收益分析和风险评估',
        },
      ],
    },
    {
      title: '系统管理',
      icon: Settings,
      items: [
        {
          name: '用户管理',
          href: '/users',
          icon: Users,
          description: '用户权限和角色管理',
        },
        {
          name: '数据管理',
          href: '/data',
          icon: Database,
          description: '数据导入和同步',
        },
        {
          name: '系统设置',
          href: '/settings',
          icon: Settings,
          description: '系统配置和参数设置',
        },
      ],
    },
  ];

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  const toggleGroup = (groupTitle: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupTitle)) {
      newExpanded.delete(groupTitle);
    } else {
      newExpanded.add(groupTitle);
    }
    setExpandedGroups(newExpanded);
  };

  const SidebarContent = () => (
    <div
      className={`flex flex-col h-full transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className='flex flex-col h-0 flex-1 bg-white/90 backdrop-blur-md border-r border-gray-200/50'>
        {/* Logo */}
        <div className='flex items-center h-16 flex-shrink-0 px-4 bg-gradient-to-r from-primary-600 to-primary-700'>
          <div className='flex items-center w-full'>
            {!isCollapsed && (
              <div className='flex-shrink-0'>
                <h1 className='text-white text-xl font-bold'>长盈智投</h1>
              </div>
            )}
            <div className='ml-auto'>
              <Button
                variant='ghost'
                size='sm'
                onClick={toggleCollapse}
                className='text-white hover:bg-white/20 p-1'
              >
                {isCollapsed ? (
                  <ChevronRight className='h-4 w-4' />
                ) : (
                  <X className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <div className='flex-1 flex flex-col overflow-y-auto scrollbar-thin'>
          <nav className='flex-1 px-2 py-4 space-y-2'>
            {navigationGroups.map((group) => {
              const isExpanded = expandedGroups.has(group.title);
              const hasActiveItem = group.items.some(
                (item) => window.location.pathname === item.href
              );

              return (
                <div key={group.title} className='space-y-1'>
                  {/* 分组标题 */}
                  {!isCollapsed && (
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors ${
                        hasActiveItem ? 'text-primary-600' : ''
                      }`}
                    >
                      <div className='flex items-center space-x-2'>
                        {group.icon && <group.icon className='h-3 w-3' />}
                        <span>{group.title}</span>
                      </div>
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  )}

                  {/* 分组内容 */}
                  {isExpanded && (
                    <div className='space-y-1 ml-2'>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <NavLink
                            key={item.name}
                            to={item.href}
                            className={({ isActive }) =>
                              `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                isActive
                                  ? 'bg-primary-100 text-primary-900 border-r-2 border-primary-600 shadow-sm'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                              }`
                            }
                            title={isCollapsed ? item.description : undefined}
                          >
                            <Icon className='flex-shrink-0 h-4 w-4' />
                            {!isCollapsed && (
                              <>
                                <span className='ml-3 flex-1'>{item.name}</span>
                                {item.badge && (
                                  <span
                                    className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                                      item.badgeColor === 'success'
                                        ? 'bg-green-100 text-green-800'
                                        : item.badgeColor === 'warning'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : item.badgeColor === 'danger'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-primary-100 text-primary-800'
                                    }`}
                                  >
                                    {item.badge}
                                  </span>
                                )}
                                <div className='ml-auto opacity-0 group-hover:opacity-100 transition-opacity'>
                                  <ChevronRight className='h-3 w-3 text-gray-400' />
                                </div>
                              </>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* 底部信息 */}
        {!isCollapsed && (
          <div className='flex-shrink-0 flex border-t border-gray-200/50 p-4'>
            <div className='flex items-center w-full'>
              <div className='flex-shrink-0'>
                <div className='h-10 w-10 rounded-full bg-gradient-to-r from-primary-100 to-primary-200 flex items-center justify-center shadow-sm'>
                  <span className='text-primary-700 text-sm font-bold'>智</span>
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
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 桌面版侧边栏 */}
      <div className='hidden md:block'>
        <SidebarContent />
      </div>

      {/* 移动端遮罩 */}
      {isMobileOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-40 md:hidden'
          onClick={toggleMobile}
        />
      )}

      {/* 移动端侧边栏 */}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transform transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* 移动端菜单按钮 */}
      <div className='md:hidden fixed top-4 left-4 z-50'>
        <Button
          variant='ghost'
          size='sm'
          onClick={toggleMobile}
          className='bg-white/90 backdrop-blur-sm shadow-lg'
        >
          <Menu className='h-5 w-5' />
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
