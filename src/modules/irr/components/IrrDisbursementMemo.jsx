import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateInputs } from '../../../redux/slices/irrSlice';
import { formatCurrency, formatPercent, formatDate } from '../../../utils/formatters';
import irrMasters from '../data/irrMasters.json';
import { FileText, Printer, Building2, UserCheck, ShieldCheck, Car } from 'lucide-react';

export default function IrrDisbursementMemo() {
  const dispatch = useDispatch();
  const { inputs, outputs } = useSelector((state) => state.irr);

  const handleInputChange = (field, value) => {
    dispatch(updateInputs({ [field]: value }));
  };

  const handlePrint = () => {
    window.print();
  };

  // Calculations for memo
  const currentEmi = outputs?.primaryEmi || outputs?.standardEmi || 0;
  const currentIrr = outputs?.dealIrrPct || outputs?.dealIrrNet || 0;
  const currentFlatRate = outputs?.flatRatePct || outputs?.flatRate || 0;

  const marginMoney = Math.max(0, inputs.assetCost - inputs.netFinance);
  const ltvPercent = inputs.assetCost > 0 ? (inputs.netFinance / inputs.assetCost) * 100 : 0;
  const advanceEmiDeduction = inputs.installmentsInAdvance < 0 ? currentEmi : 0;
  const netPayableToBorrower = Math.max(0, inputs.netFinance - advanceEmiDeduction);

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs print:hidden">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Disbursement Memo (DM Input)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Official credit authorization and payment sanction memo matching ICICI commercial vehicle deal template
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4" />
          Print / Export Memo
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-md p-6 sm:p-8 print:border-none print:shadow-none print:p-0">
        {/* Memo Header */}
        <div className="border-b-2 border-indigo-600 pb-5 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xl tracking-wider">
              ICICI
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                ICICI BANK COMMERCIAL VEHICLE FINANCE
              </h1>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Disbursement Sanction & Underwriting Memorandum
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded font-mono text-xs font-bold border border-indigo-200 dark:border-indigo-800">
              REF: {inputs.fileNumber || 'AKLUV000002'}
            </span>
            <div className="text-xs text-slate-500 mt-1">
              Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatDate(inputs.startDate)}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Customer & Branch Metadata (Editable in form mode) */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            Origination & Deal Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Customer / Borrower</label>
              <input
                type="text"
                value={inputs.customerName || ''}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Hub Location</label>
              <select
                value={inputs.hubLocation || 'BARODA'}
                onChange={(e) => handleInputChange('hubLocation', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                {irrMasters.hubs.map((hub) => (
                  <option key={hub} value={hub}>{hub}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Deal Nature</label>
              <select
                value={inputs.dealNature || 'STRATEGIC CAPTIVE'}
                onChange={(e) => handleInputChange('dealNature', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                {irrMasters.dealNatures.map((dn) => (
                  <option key={dn} value={dn}>{dn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Sourced From / City</label>
              <input
                type="text"
                value={inputs.sourcedFrom || ''}
                onChange={(e) => handleInputChange('sourcedFrom', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Disbursement Officer</label>
              <input
                type="text"
                value={inputs.officerName || ''}
                onChange={(e) => handleInputChange('officerName', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Funding Type</label>
              <select
                value={inputs.fundingType || 'REFINANCE-LOAN'}
                onChange={(e) => handleInputChange('fundingType', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                {irrMasters.fundingTypes.map((ft) => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Asset Details */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <Car className="w-4 h-4 text-slate-400" />
            Asset & Vehicle Specifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Asset Segment</label>
              <select
                value={inputs.assetType || 'LCV'}
                onChange={(e) => handleInputChange('assetType', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5"
              >
                {irrMasters.assetTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Manufacturer / Make</label>
              <select
                value={inputs.make || 'BAJAJ'}
                onChange={(e) => handleInputChange('make', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5"
              >
                {irrMasters.makes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Model / Variant</label>
              <input
                type="text"
                value={inputs.model || 'CHALLENGER'}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Repayment Pattern</label>
              <select
                value={inputs.emiPattern || 'STRUCTURED'}
                onChange={(e) => handleInputChange('emiPattern', e.target.value)}
                className="w-full text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded px-2.5 py-1.5"
              >
                {irrMasters.emiPatterns.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Financial Sanction Table */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Approved Financial Parameters & Cash Flows
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
              <span className="text-xs text-indigo-700 dark:text-indigo-400 font-medium">Deal IRR (Net of Brk)</span>
              <div className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mt-0.5">
                {formatPercent(currentIrr, 3)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Agreement Value</span>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {formatCurrency(outputs?.agreementValue || 0)}
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Interest</span>
              <div className="text-xl font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {formatCurrency(outputs?.totalInterest || 0)}
              </div>
            </div>
            <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Flat Rate</span>
              <div className="text-xl font-bold text-emerald-900 dark:text-emerald-200 mt-0.5">
                {formatPercent(currentFlatRate, 3)}
              </div>
            </div>
          </div>

          <table className="w-full text-xs border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <td className="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300 w-1/3">1. Asset Invoice / Cost</td>
                <td className="py-2.5 px-4 font-mono font-bold text-right text-slate-900 dark:text-white">
                  {formatCurrency(inputs.assetCost)}
                </td>
                <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">Total invoice cost including VAT/RTO</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">2. Customer Margin Money</td>
                <td className="py-2.5 px-4 font-mono font-bold text-right text-slate-900 dark:text-white">
                  {formatCurrency(marginMoney)}
                </td>
                <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                  {ltvPercent > 0 ? `${(100 - ltvPercent).toFixed(2)}% of asset cost` : '-'}
                </td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <td className="py-2.5 px-4 font-semibold text-indigo-700 dark:text-indigo-400">3. Net Loan Sanctioned</td>
                <td className="py-2.5 px-4 font-mono font-black text-right text-indigo-700 dark:text-indigo-400 text-sm">
                  {formatCurrency(inputs.netFinance)}
                </td>
                <td className="py-2.5 px-4 font-medium text-indigo-600 dark:text-indigo-400">
                  LTV: {ltvPercent.toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">4. Loan Tenure & Installments</td>
                <td className="py-2.5 px-4 font-mono font-bold text-right text-slate-900 dark:text-white">
                  {inputs.tenureMonths} Months ({inputs.numberOfInstallments} EMIs)
                </td>
                <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">
                  {inputs.installmentsInAdvance < 0 ? '1 Advance EMI Included' : 'Regular in Arrears'}
                </td>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-800/60">
                <td className="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">5. Monthly Installment (EMI)</td>
                <td className="py-2.5 px-4 font-mono font-bold text-right text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(currentEmi)}
                </td>
                <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">Per monthly repayment cycle</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-medium text-slate-600 dark:text-slate-300">6. Less Advance EMI / Retained Amount</td>
                <td className="py-2.5 px-4 font-mono font-bold text-right text-red-600 dark:text-red-400">
                  - {formatCurrency(advanceEmiDeduction)}
                </td>
                <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400">First installment recovered upfront</td>
              </tr>
              <tr className="bg-emerald-50 dark:bg-emerald-950/40">
                <td className="py-3 px-4 font-black text-emerald-900 dark:text-emerald-200">
                  7. Net Pay-order / Disbursement Cheque
                </td>
                <td className="py-3 px-4 font-mono font-black text-right text-emerald-900 dark:text-emerald-200 text-sm">
                  {formatCurrency(netPayableToBorrower)}
                </td>
                <td className="py-3 px-4 font-semibold text-emerald-800 dark:text-emerald-300">
                  Payable to Dealer / Borrower
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 4: Sign-off & Underwriting Signatures */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center border-t border-dashed border-slate-300 dark:border-slate-600 pt-3">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{inputs.officerName || 'ABHISHEK KUMAR'}</p>
              <p className="text-[11px] text-slate-500">Prepared By (Credit Officer)</p>
            </div>
            <div className="text-center border-t border-dashed border-slate-300 dark:border-slate-600 pt-3">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">HUB CREDIT MANAGER</p>
              <p className="text-[11px] text-slate-500">Verified & Risk Assessed</p>
            </div>
            <div className="text-center border-t border-dashed border-slate-300 dark:border-slate-600 pt-3">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">AUTHORIZED SANCTIONER</p>
              <p className="text-[11px] text-slate-500">ICICI Bank Commercial Vehicle Ops</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
