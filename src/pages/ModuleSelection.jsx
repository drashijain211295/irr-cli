import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Shield, ArrowRight } from 'lucide-react';

export default function ModuleSelection() {
  const navigate = useNavigate();

  return (
    <div className="py-10 max-w-3xl mx-auto">
      {/* Heading */}
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Welcome! Which module would you like to work with?
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          Select a module to start calculating. You can switch between them anytime from the top bar.
        </p>
      </div>

      {/* Two Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* IRR Module Card */}
        <div 
          onClick={() => navigate('/irr')}
          className="bg-white rounded-2xl border-2 border-slate-200 hover:border-indigo-600 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <Calculator className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              IRR Module
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Calculate Flat Rate and Deal IRR from your Net Finance, Tenure, and EMI. Includes amortization schedule and disbursement breakdown.
            </p>
          </div>

          <button 
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-colors"
          >
            <span>Start with IRR</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* CLI Module Card */}
        <div 
          onClick={() => navigate('/cli')}
          className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-600 p-6 sm:p-7 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              CLI Module
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Calculate Credit Life Insurance single premium and 18% GST based on Borrower DOB, Loan Amount, and Tenure with automatic medical checks.
            </p>
          </div>

          <button 
            className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-colors"
          >
            <span>Start with CLI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
