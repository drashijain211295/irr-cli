import React from 'react';
import { Outlet } from 'react-router-dom';
import TopNavbar from '../components/navbar/TopNavbar';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      <TopNavbar />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        IRR & CLI
      </footer>
    </div>
  );
}
