import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';

// 懒加载页面组件
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const Positions = React.lazy(() => import('./pages/Positions'));
const BusinessProcess = React.lazy(() => import('./pages/BusinessProcess'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Settings = React.lazy(() => import('./pages/Settings'));

// 加载页面组件
const LoadingPage: React.FC = () => (
  <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
    <LoadingSpinner size='lg' text='页面加载中...' />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route
              index
              element={
                <Suspense fallback={<LoadingPage />}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path='portfolio'
              element={
                <Suspense fallback={<LoadingPage />}>
                  <Portfolio />
                </Suspense>
              }
            />
            <Route
              path='positions'
              element={
                <Suspense fallback={<LoadingPage />}>
                  <Positions />
                </Suspense>
              }
            />
            <Route
              path='business-process'
              element={
                <Suspense fallback={<LoadingPage />}>
                  <BusinessProcess />
                </Suspense>
              }
            />
            <Route
              path='reports'
              element={
                <Suspense fallback={<LoadingPage />}>
                  <Reports />
                </Suspense>
              }
            />
            <Route
              path='settings'
              element={
                <Suspense fallback={<LoadingPage />}>
                  <Settings />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

export default App;
