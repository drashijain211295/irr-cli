import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Shield, ArrowRight } from 'lucide-react';

export default function ModuleSelection() {
  const navigate = useNavigate();

  return (
    <div className="py-12 max-w-2xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Welcome! Which would you like to work with?
        </h1>
      </div>

      {/* Two Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* IRR Card */}
        <div 
          onClick={() => navigate('/irr')}
          className="bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-600 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center justify-between group"
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 group-hover:scale-105 transition-transform">
              <Calculator className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              IRR
            </h2>
          </div>

          <button 
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <span>Start with IRR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* CLI Card */}
        <div 
          onClick={() => navigate('/cli')}
          className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-600 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col items-center text-center justify-between group"
        >
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              CLI
            </h2>
          </div>

          <button 
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <span>Start with CLI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
