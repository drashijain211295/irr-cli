import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateInputs, 
  setCalculationMode, 
  loadPreset,
  resetToBaseline 
} from '../../../redux/slices/irrSlice';
import { 
  Calculator, 
  Sparkles, 
  RotateCcw, 
  ArrowLeftRight,
  HelpCircle,
  Bookmark
} from 'lucide-react';

export default function IrrInputForm() {
  const dispatch = useDispatch();
  const currentInputs = useSelector((state) => state.irr.inputs);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: currentInputs
  });

  // Keep form in sync when external state changes (e.g. preset loaded or reset)
  useEffect(() => {
    reset(currentInputs);
  }, [currentInputs, reset]);

  const watchedMode = watch('mode');

  const onFormChange = (data) => {
    dispatch(updateInputs({
      assetCost: Number(data.assetCost) || 0,
      netFinance: Number(data.netFinance) || 0,
      tenureMonths: Number(data.tenureMonths) || 1,
      numberOfInstallments: Number(data.numberOfInstallments) || 1,
      installmentsInAdvance: Number(data.installmentsInAdvance),
      moratoriumMonths: Number(data.moratoriumMonths) || 0,
      loadValueInput: Number(data.loadValueInput) || 0,
      flatRateInput: Number(data.flatRateInput) || 0,
      mode: data.mode
    }));
  };

  const handleModeToggle = (newMode) => {
    setValue('mode', newMode);
    dispatch(setCalculationMode(newMode));
  };

  const handleApplyPreset = (preset) => {
    dispatch(loadPreset(preset));
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Deal Parameters & Inputs</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure vehicle loan variables. Calculations update live in real-time.
          </p>
        </div>

        {/* Calculation Direction Mode Switcher */}
        <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleModeToggle('reverse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              watchedMode === 'reverse'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Auto Flat Rate (From EMI)
          </button>
          <button
            type="button"
            onClick={() => handleModeToggle('forward')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              watchedMode === 'forward'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Forward Mode (From Flat Rate)
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="mb-6 p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1 mr-2">
          <Bookmark className="w-3.5 h-3.5 text-blue-400" />
          <span>Excel Presets:</span>
        </span>

        <button
          type="button"
          onClick={() => handleApplyPreset({
            assetCost: 2388000,
            netFinance: 2215156,
            tenureMonths: 60,
            numberOfInstallments: 59,
            installmentsInAdvance: -1,
            moratoriumMonths: 2,
            loadValueInput: 50500,
            mode: 'reverse'
          })}
          className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
        >
          Deal 1: 60M @ 50.5k (Baseline 12.10% IRR)
        </button>

        <button
          type="button"
          onClick={() => handleApplyPreset({
            assetCost: 1200000,
            netFinance: 1000000,
            tenureMonths: 36,
            numberOfInstallments: 35,
            installmentsInAdvance: -1,
            moratoriumMonths: 2,
            loadValueInput: 33000,
            mode: 'reverse'
          })}
          className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
        >
          Deal 2: 36M @ 33k (10L Net, 9.33% IRR)
        </button>

        <button
          type="button"
          onClick={() => handleApplyPreset({
            assetCost: 1700000,
            netFinance: 1500000,
            tenureMonths: 48,
            numberOfInstallments: 47,
            installmentsInAdvance: -1,
            moratoriumMonths: 2,
            loadValueInput: 40000,
            mode: 'reverse'
          })}
          className="px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
        >
          Deal 3: 48M @ 40k (15L Net, 11.28% IRR)
        </button>
      </div>

      {/* Main Form Fields */}
      <form onChange={handleSubmit(onFormChange)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Net Finance (Loan Amount) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Net Finance (Loan Disbursement) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
              <input
                type="number"
                step="any"
                {...register('netFinance', { required: true, min: 10000 })}
                className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="2215156"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Net funds disbursed to customer/dealer</span>
          </div>

          {/* Asset Cost */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Asset Cost (Invoice / Value) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
              <input
                type="number"
                step="any"
                {...register('assetCost', { required: true, min: 10000 })}
                className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="2388000"
              />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Used to compute LTV Exposure & Margin Money</span>
          </div>

          {/* Primary EMI / Load Value or Flat Rate based on Mode */}
          {watchedMode === 'reverse' ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-blue-300">
                  Monthly Installment (Load Value / EMI) <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-emerald-400 font-semibold">Drives Flat Rate</span>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-sm">₹</span>
                <input
                  type="number"
                  step="any"
                  {...register('loadValueInput', { required: true, min: 100 })}
                  className="w-full pl-7 pr-3 py-2 bg-slate-950 border border-blue-500/70 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="50500"
                />
              </div>
              <span className="text-[11px] text-blue-400/90 mt-1 block">Flat Rate will be calculated automatically</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-indigo-300">
                  Annual Flat Rate (%) <span className="text-red-400">*</span>
                </label>
                <span className="text-[10px] text-indigo-400 font-semibold">Drives EMI</span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="0.0001"
                  {...register('flatRateInput', { required: true, min: 0.1, max: 40 })}
                  className="w-full px-3 py-2 bg-slate-950 border border-indigo-500/70 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="6.9010"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-sm">%</span>
              </div>
              <span className="text-[11px] text-indigo-400/90 mt-1 block">EMI will be derived from Flat Rate</span>
            </div>
          )}

          {/* Tenure in Months */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tenure (Months) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="6"
              max="120"
              {...register('tenureMonths', { required: true })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="60"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Total agreement duration (e.g. 36, 48, 60)</span>
          </div>

          {/* Number of Installments */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              No. of Installments <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="120"
              {...register('numberOfInstallments', { required: true })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="59"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">Installments payable (e.g. 59 for 60M with 1M moratorium)</span>
          </div>

          {/* Installments in Advance / Moratorium */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Installments In Advance / Timing
            </label>
            <select
              {...register('installmentsInAdvance')}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="-1">(-1) Moratorium (Payment starts Month 2)</option>
              <option value="0">(0) Regular In Arrears (Payment starts Month 1)</option>
              <option value="1">(1) 1 Advance EMI (Paid at Month 0)</option>
              <option value="2">(2) 2 Advance EMIs</option>
            </select>
            <span className="text-[11px] text-slate-400 mt-1 block">(-1) reflects ICICI 1-month moratorium deferral</span>
          </div>

        </div>
      </form>
    </div>
  );
}
