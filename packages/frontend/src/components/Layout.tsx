import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className='flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden'>
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区域 */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* 顶部导航 */}
        <Header />

        {/* 页面内容 */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 scrollbar-thin'>
          <div className='container-responsive'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
