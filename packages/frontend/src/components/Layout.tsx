import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className='flex h-screen bg-gray-50'>
      {/* 侧边栏 */}
      <Sidebar />

      {/* 主内容区域 */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* 顶部导航 */}
        <Header />

        {/* 页面内容 */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
