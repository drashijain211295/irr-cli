import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCliInputs, setPremiumFunding, resetCliBaseline } from '../../../redux/slices/cliSlice';
import cliRules from '../data/cliRules.json';
import { Shield, User, Calendar, CreditCard, Clock, RotateCcw, Sparkles, AlertCircle } from 'lucide-react';

export default function CliInputForm() {
  const dispatch = useDispatch();
  const { inputs, quote } = useSelector((state) => state.cli);

  const handleFieldChange = (field, value) => {
    dispatch(updateCliInputs({ [field]: value }));
  };

  const presets = [
    {
      name: 'Deal 1: Baseline NCV (₹4.91L / 60M / Age 34)',
      payload: {
        borrowerName: 'Primary Borrower',
        dob: '1992-10-28',
        loanAmount: 491000,
        tenureMonths: 60,
        segmentCode: 'NCV',
        gender: 'Male',
        premiumFunding: 'Funded',
        calculationDate: '2026-11-06',
        disbursementDate: '2026-11-26'
      }
    },
    {
      name: 'Deal 2: Strategic CV (₹8.0L / 48M / Age 38)',
      payload: {
        borrowerName: 'Fleet Transporter',
        dob: '1988-04-12',
        loanAmount: 800000,
        tenureMonths: 48,
        segmentCode: 'STR',
        gender: 'Male',
        premiumFunding: 'Funded',
        calculationDate: '2026-11-06',
        disbursementDate: '2026-11-26'
      }
    },
    {
      name: 'Deal 3: Used CV Non-Funded (₹6.5L / 36M / Female)',
      payload: {
        borrowerName: 'Logistics Partner',
        dob: '1995-08-20',
        loanAmount: 650000,
        tenureMonths: 36,
        segmentCode: 'UCV',
        gender: 'Female',
        premiumFunding: 'Non-Funded',
        calculationDate: '2026-11-06',
        disbursementDate: '2026-11-26'
      }
    }
  ];

  const validation = quote?.validation;
  const meta = quote?.meta;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-lg">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Borrower & Loan Insurance Parameters
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Actuarial underwriting form for Tata AIA Sampoorna Raksha Supreme
            </p>
          </div>
        </div>

        <button
          onClick={() => dispatch(resetCliBaseline())}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          title="Reset to Excel Sheet Values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Preset Chips */}
      <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-800/20 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3 text-amber-500" /> Presets:
        </span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => dispatch(updateCliInputs(preset.payload))}
            className="text-xs px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-700 dark:text-slate-300 shrink-0 transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Validation Banner if Errors */}
      {validation && !validation.isValid && (
        <div className="m-5 mb-0 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-red-800 dark:text-red-300">Underwriting Validation Rules Failed:</h4>
              <ul className="mt-1 list-disc list-inside text-xs text-red-700 dark:text-red-400 space-y-0.5">
                {validation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="p-5 space-y-5">
        {/* Loan Segment / Scheme Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Commercial Vehicle Scheme / Segment
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {cliRules.SchemeOptions.map((scheme) => {
              const isSelected = inputs.segmentCode === scheme.code;
              return (
                <button
                  key={scheme.code}
                  type="button"
                  onClick={() => handleFieldChange('segmentCode', scheme.code)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 font-semibold'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-bold flex items-center justify-between">
                    <span>{scheme.code}</span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                    {scheme.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Borrower Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Borrower Name
            </label>
            <input
              type="text"
              value={inputs.borrowerName || ''}
              onChange={(e) => handleFieldChange('borrowerName', e.target.value)}
              className="w-full text-sm font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Ramesh Kumar"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Date of Birth (DOB)
            </label>
            <input
              type="date"
              value={inputs.dob}
              onChange={(e) => handleFieldChange('dob', e.target.value)}
              className="w-full text-sm font-semibold bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Computed Age: <span className="font-bold text-slate-800 dark:text-slate-200">{meta?.entryAge || 0} years</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Gender
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleFieldChange('gender', g)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                    inputs.gender === g
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Actuarial matrix differentiator</p>
          </div>
        </div>

        {/* Loan Financials */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
              Loan Amount / Sum Assured (₹)
            </label>
            <input
              type="number"
              step="5000"
              value={inputs.loanAmount}
              onChange={(e) => handleFieldChange('loanAmount', Number(e.target.value))}
              className="w-full text-base font-bold font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              ₹{(inputs.loanAmount || 0).toLocaleString('en-IN')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Loan Tenure (Months)
            </label>
            <select
              value={inputs.tenureMonths}
              onChange={(e) => handleFieldChange('tenureMonths', Number(e.target.value))}
              className="w-full text-sm font-bold bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {[12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84].map((m) => (
                <option key={m} value={m}>
                  {m} Months ({m / 12} Years)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1 font-mono">
              Maturity Age: <span className="font-semibold">{meta?.coverageAge?.toFixed(1) || 0} yrs</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Interest & Moratorium
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                disabled
                value="14% Reducing"
                className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-center cursor-not-allowed"
              />
              <input
                type="text"
                disabled
                value="0 Mo Moratorium"
                className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-2 text-center cursor-not-allowed"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Preset Tata CV terms</p>
          </div>
        </div>

        {/* Funding Mode Toggle */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Premium Payment Mechanism
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => dispatch(setPremiumFunding('Funded'))}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                inputs.premiumFunding === 'Funded'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Funded (Loan + Premium)</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                  Default
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Insurance premium & 18% GST are capitalized into the loan. Circular reference convergence applied.
              </p>
            </button>

            <button
              type="button"
              onClick={() => dispatch(setPremiumFunding('Non-Funded'))}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                inputs.premiumFunding === 'Non-Funded'
                  ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">Non-Funded (Direct Payment)</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Borrower pays the single premium directly out of pocket. Sum Assured remains exact original loan amount.
              </p>
            </button>
          </div>
        </div>

        {/* Dates Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Premium Calculation Date
            </label>
            <input
              type="date"
              value={inputs.calculationDate}
              onChange={(e) => handleFieldChange('calculationDate', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Expected Loan Disbursement / RCD
            </label>
            <input
              type="date"
              value={inputs.disbursementDate}
              onChange={(e) => handleFieldChange('disbursementDate', e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
