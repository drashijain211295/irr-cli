import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateInputs, resetToBaseline } from '../../../redux/slices/irrSlice';
import { formatCurrency, formatPercent } from '../../../utils/formatters';
import { Calculator, RotateCcw } from 'lucide-react';

export default function IrrPage() {
  const dispatch = useDispatch();
  const { inputs, outputs } = useSelector((state) => state.irr);

  const handleInputChange = (field, val) => {
    dispatch(updateInputs({ [field]: val }));
  };

  const handleNumericChange = (field, e) => {
    // Only allow numbers 0-9 (no letters, spinners, or scroller)
    const cleanNumeric = e.target.value.replace(/[^0-9]/g, '');
    handleInputChange(field, cleanNumeric);
  };

  const handleTenureChange = (e) => {
    const cleanNumeric = e.target.value.replace(/[^0-9]/g, '');
    handleInputChange('tenureMonths', cleanNumeric);
    
    if (cleanNumeric !== '') {
      const tenureNum = Number(cleanNumeric);
      if (inputs.installmentsInAdvance < 0) {
        handleInputChange('numberOfInstallments', Math.max(1, tenureNum - 1));
      } else {
        handleInputChange('numberOfInstallments', tenureNum);
      }
    } else {
      handleInputChange('numberOfInstallments', '');
    }
  };

  const handleAdvanceChange = (e) => {
    const adv = Number(e.target.value);
    handleInputChange('installmentsInAdvance', adv);
    if (inputs.tenureMonths !== '') {
      const tenureNum = Number(inputs.tenureMonths);
      if (adv === -1) {
        handleInputChange('numberOfInstallments', Math.max(1, tenureNum - 1));
      } else {
        handleInputChange('numberOfInstallments', tenureNum);
      }
    }
  };

  const hasData = Boolean(inputs.netFinance && inputs.loadValueInput);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            IRR
          </h1>
        </div>
        <button
          onClick={() => dispatch(resetToBaseline())}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-red-600 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear
        </button>
      </div>

      {/* Main 2-Card Layout: Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Card: Inputs */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-indigo-600" />
            1. Enter Deal Values
          </h2>

          {/* Asset Cost */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Asset Cost (in ₹)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={inputs.assetCost ?? ''}
              onChange={(e) => handleNumericChange('assetCost', e)}
              placeholder="2388000"
              className="w-full text-base font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
            {inputs.assetCost ? (
              <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
                ₹{Number(inputs.assetCost).toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                e.g. 23,88,000
              </span>
            )}
          </div>

          {/* Net Finance */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Net Finance (Loan Amount in ₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={inputs.netFinance ?? ''}
              onChange={(e) => handleNumericChange('netFinance', e)}
              placeholder="2215156"
              className="w-full text-base font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
            {inputs.netFinance ? (
              <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
                ₹{Number(inputs.netFinance).toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                e.g. 22,15,156
              </span>
            )}
          </div>

          {/* Load Value / EMI */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Load Value / Monthly EMI (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={inputs.loadValueInput ?? ''}
              onChange={(e) => handleNumericChange('loadValueInput', e)}
              placeholder="50500"
              className="w-full text-base font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            />
            {inputs.loadValueInput ? (
              <span className="text-[11px] text-slate-500 mt-0.5 block font-mono">
                ₹{Number(inputs.loadValueInput).toLocaleString('en-IN')}
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                e.g. 50,500
              </span>
            )}
          </div>

          {/* Tenure & No. of Installments */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tenure (Months)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={inputs.tenureMonths ?? ''}
                onChange={handleTenureChange}
                placeholder="60"
                className="w-full text-sm font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                No. of Installments
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                value={inputs.numberOfInstallments ?? ''}
                onChange={(e) => handleNumericChange('numberOfInstallments', e)}
                placeholder="59"
                className="w-full text-sm font-bold font-mono bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              />
            </div>
          </div>

          {/* Installment in Advance */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Installment in Advance
            </label>
            <select
              value={inputs.installmentsInAdvance}
              onChange={handleAdvanceChange}
              className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
            >
              <option value={-1}>1 Advance EMI (-1)</option>
              <option value={0}>0 Advance (Arrears)</option>
            </select>
          </div>
        </div>

        {/* Right Card: Complete Calculated Results */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            2. Complete Calculation Results
          </h2>

          {/* Top 4 IRR Rates Block matching Excel Sheet (I2:I5) */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white shadow-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 border-b border-slate-800 pb-1.5 flex justify-between items-center">
              <span>Annualized Internal Rate of Return (IRR)</span>
              <span className="text-emerald-400 font-mono">Periodicity: 12</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center bg-slate-800/80 px-2.5 py-1.5 rounded">
                <span className="text-slate-300">Deal IRR net of Brk:</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">
                  {hasData ? formatPercent(outputs?.dealIrrPct || 0, 2) : '0.00%'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/80 px-2.5 py-1.5 rounded">
                <span className="text-slate-300">Deal IRR gross of Brk:</span>
                <span className="font-bold font-mono text-emerald-400 text-sm">
                  {hasData ? formatPercent(outputs?.dealIrrPct || 0, 2) : '0.00%'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/80 px-2.5 py-1.5 rounded">
                <span className="text-slate-300">Accounting IRR:</span>
                <span className="font-bold font-mono text-slate-200">
                  {hasData ? formatPercent(outputs?.dealIrrPct || 0, 2) : '0.00%'}
                </span>
              </div>
              <div className="flex justify-between items-center bg-slate-800/80 px-2.5 py-1.5 rounded">
                <span className="text-slate-300">Client's IRR:</span>
                <span className="font-bold font-mono text-slate-200">
                  {hasData ? formatPercent(outputs?.dealIrrPct || 0, 2) : '0.00%'}
                </span>
              </div>
            </div>
          </div>

          {/* Flat Rate & Primary Metrics Card */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
              <span className="text-xs font-semibold text-indigo-700 block">
                Flat Interest Rate (%)
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-indigo-950 font-mono mt-0.5">
                {hasData ? formatPercent(outputs?.flatRatePct || 0, 3) : '0.00%'}
              </div>
              <span className="text-[11px] text-indigo-600 block mt-0.5">
                Auto calculated from EMI
              </span>
            </div>

            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl">
              <span className="text-xs font-semibold text-slate-700 block">
                Monthly EMI Amount
              </span>
              <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                {hasData ? formatCurrency(outputs?.primaryEmi || 0) : '₹0'}
              </div>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                {inputs.numberOfInstallments || 59} installments
              </span>
            </div>
          </div>

          {/* Complete ICICI Sheet Results Table (I7:I20) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Exposure (LTV %)</span>
              <span className="font-bold font-mono text-slate-900">
                {hasData ? formatPercent(outputs?.exposurePct || 0, 2) : '0.00%'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 px-3 border-b border-slate-200">
              <span className="text-slate-600">Disbursement Amount</span>
              <span className="font-bold font-mono text-slate-900">
                {hasData ? formatCurrency(outputs?.disbursementAmt || inputs.netFinance || 0) : '₹0'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 border-b border-slate-200">
              <span className="text-slate-600">Interest Amount</span>
              <span className="font-bold font-mono text-slate-900">
                {hasData ? formatCurrency(outputs?.totalInterest || 0) : '₹0'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 px-3 border-b border-slate-200">
              <span className="text-slate-600 font-medium">Agreement Value</span>
              <span className="font-bold font-mono text-indigo-700 text-sm">
                {hasData ? formatCurrency(outputs?.agreementValue || 0) : '₹0'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 px-3 bg-slate-50 border-b border-slate-200">
              <span className="text-slate-600">Total Installment</span>
              <span className="font-bold font-mono text-slate-900">
                {hasData ? formatCurrency(outputs?.totalInstallmentSum || outputs?.agreementValue || 0) : '₹0'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 px-3 border-b border-slate-200">
              <span className="text-slate-600">Customer Margin Money</span>
              <span className="font-bold font-mono text-slate-900">
                {hasData ? formatCurrency(outputs?.marginMoney || 0) : '₹0'}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 px-3 bg-slate-50">
              <span className="text-slate-600">Installment Amount 1 (Load Value)</span>
              <span className="font-bold font-mono text-slate-900">
                {hasData ? formatCurrency(outputs?.primaryEmi || 0) : '₹0'}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
