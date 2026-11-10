import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ModuleSelection from './pages/ModuleSelection';
import IrrPage from './modules/irr/pages/IrrPage';
import CliPage from './modules/cli/pages/CliPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Module Selection Landing Screen */}
        <Route index element={<ModuleSelection />} />
        
        {/* IRR Module */}
        <Route path="irr" element={<IrrPage />} />
        
        {/* CLI Module */}
        <Route path="cli" element={<CliPage />} />
        
        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
