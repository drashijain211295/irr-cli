import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetToBaseline } from '../../redux/slices/irrSlice';
import { resetCliBaseline } from '../../redux/slices/cliSlice';
import { Calculator, Shield, RotateCcw } from 'lucide-react';

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isIrr = location.pathname.startsWith('/irr');
  const isCli = location.pathname.startsWith('/cli');

  const handleReset = () => {
    if (isIrr) dispatch(resetToBaseline());
    if (isCli) dispatch(resetCliBaseline());
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand / Title */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-xs">
            ₹
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-tight">
              Finance Calc
            </h1>
            <p className="text-[11px] text-slate-500 -mt-0.5">IRR & CLI</p>
          </div>
        </div>

        {/* Module Switcher: only IRR and CLI */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <NavLink
            to="/irr"
            className={({ isActive }) => `
              flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all
              ${isActive || isIrr
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
              }
            `}
          >
            <Calculator className="w-3.5 h-3.5 text-indigo-600" />
            <span>IRR</span>
          </NavLink>

          <NavLink
            to="/cli"
            className={({ isActive }) => `
              flex items-center gap-1.5 px-4 py-1.5 rounded-md text-xs font-semibold transition-all
              ${isActive || isCli
                ? 'bg-white text-emerald-700 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900'
              }
            `}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>CLI</span>
          </NavLink>
        </div>

        {/* Reset Button */}
        <div>
          {(isIrr || isCli) && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition-colors"
              title="Reset fields to original defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
