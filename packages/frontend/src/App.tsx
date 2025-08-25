import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import Positions from './pages/Positions';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='portfolio' element={<Portfolio />} />
          <Route path='positions' element={<Positions />} />
          <Route path='reports' element={<Reports />} />
          <Route path='settings' element={<Settings />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
