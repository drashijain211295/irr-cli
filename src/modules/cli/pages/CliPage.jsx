import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCliInputs, resetCliBaseline } from '../../../redux/slices/cliSlice';
import { formatCurrency } from '../../../utils/formatters';
import { Shield, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CliPage() {
  const dispatch = useDispatch();
  const { inputs, quote } = useSelector((state) => state.cli);

  const handleInputChange = (field, val) => {
    dispatch(updateCliInputs({ [field]: val }));
  };

  const handleNumericChange = (field, e) => {
    // Only allow numbers 0-9 (no letters, spinners, or scroller)
    const cleanNumeric = e.target.value.replace(/[^0-9]/g, '');
    handleInputChange(field, cleanNumeric);
  };

  const activeQuote = quote?.activeQuote;
  const meta = quote?.meta;
  const underwriting = quote?.underwriting;
  const isFunded = inputs.premiumFunding === 'Funded';
  const hasData = Boolean(inputs.loanAmount && inputs.dob && meta?.entryAge > 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            CLI
          </h1>
        </div>
        <button
          onClick={() => dispatch(resetCliBaseline())}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Main 2-Card Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Card: Inputs */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            1. Enter Insurance Details
          </h2>

          {/* DOB & Computed Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth (DOB) <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={inputs.dob ?? ''}
                onChange={(e) => handleInputChange('dob', e.target.value)}
                className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Age at Disbursement
              </label>
              <div className="text-base font-bold font-mono bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-900">
                {inputs.dob ? `${meta?.entryAge || 0} Years` : '--'}
              </div>
            </div>
          </div>

          {/* Loan Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Loan Amount (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={inputs.loanAmount ?? ''}
              onChange={(e) => handleNumericChange('loanAmount', e)}
              placeholder="491000"
              className="w-full text-base font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
            />
            {inputs.loanAmount ? (
              <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
                ₹{Number(inputs.loanAmount).toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                e.g. 4,91,000
              </span>
            )}
          </div>

          {/* Tenure & Vehicle Segment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loan Tenure
              </label>
              <select
                value={inputs.tenureMonths || 60}
                onChange={(e) => handleInputChange('tenureMonths', Number(e.target.value))}
                className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              >
                {[12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84].map((m) => (
                  <option key={m} value={m}>{m} Months</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Loan Type / Segment
              </label>
              <select
                value={inputs.segmentCode}
                onChange={(e) => handleInputChange('segmentCode', e.target.value)}
                className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              >
                <option value="NCV">New Retail CV (NCV)</option>
                <option value="UCV">Used Retail CV (UCV)</option>
                <option value="STR">Strategic CV (STR)</option>
              </select>
            </div>
          </div>

          {/* Gender & Funding Option */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gender
              </label>
              <select
                value={inputs.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Premium Funding
              </label>
              <select
                value={inputs.premiumFunding}
                onChange={(e) => handleInputChange('premiumFunding', e.target.value)}
                className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none"
              >
                <option value="Funded">Funded (Add to Loan)</option>
                <option value="Non-Funded">Non-Funded (Direct)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Card: Calculated Results */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            2. Calculated Insurance Quote
          </h2>

          {/* Primary Highlight: Total Premium Payable */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-xs font-semibold text-emerald-800 block">
              Total Premium Payable (Incl. 18% GST)
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-mono mt-1">
              {hasData ? formatCurrency(activeQuote?.payablePremium || 0, true) : '₹0.00'}
            </div>
            <span className="text-xs text-emerald-700 mt-1 block">
              {isFunded ? 'Capitalized into loan amount' : 'Direct payment by borrower'}
            </span>
          </div>

          {/* Breakdown Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="flex justify-between items-center py-2.5 px-3 bg-slate-50 border-b border-slate-200">
              <span className="text-slate-600">Actuarial Base Rate</span>
              <span className="font-bold font-mono text-slate-900 text-sm">
                {hasData && meta?.rateLookup?.rate != null ? Number(meta.rateLookup.rate).toFixed(3) : '-'} <span className="text-[11px] font-normal text-slate-400">per ₹1k</span>
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 px-3 border-b border-slate-200">
              <span className="text-slate-600">Basic Premium (Before Tax)</span>
              <span className="font-bold font-mono text-slate-900">
                {hasData ? formatCurrency(activeQuote?.basicPremium || 0, true) : '₹0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 px-3 bg-slate-50 border-b border-slate-200">
              <span className="text-slate-600">GST @ 18%</span>
              <span className="font-bold font-mono text-slate-900">
                {hasData ? formatCurrency(activeQuote?.gstAmount || 0, true) : '₹0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 px-3 border-b border-slate-200">
              <span className="text-slate-600">{isFunded ? 'Revised Loan Amount (Sum Assured)' : 'Original Sum Assured'}</span>
              <span className="font-bold font-mono text-emerald-700 text-sm">
                {hasData ? formatCurrency(activeQuote?.revisedSumAssured || 0) : '₹0'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 px-3 bg-slate-50">
              <span className="text-slate-600">Medical Examination Status</span>
              {hasData ? (
                underwriting?.isMedicalRequired ? (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    <AlertTriangle className="w-3.5 h-3.5" /> Medicals Required
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Clear (Non-Medical)
                  </span>
                )
              ) : (
                <span className="text-slate-400 font-medium">Pending Inputs</span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
