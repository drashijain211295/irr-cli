import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency, formatPercent } from '../../../utils/formatters';
import { ShieldCheck, AlertTriangle, Layers, Percent, ArrowUpRight, CheckCircle2, Building } from 'lucide-react';

export default function CliQuoteSummary() {
  const { quote, inputs } = useSelector((state) => state.cli);

  if (!quote) return null;

  const { activeQuote, funded, nonFunded, meta, underwriting, validation } = quote;
  const isFunded = inputs.premiumFunding === 'Funded';
  const rateLookup = meta?.rateLookup;

  return (
    <div className="space-y-6">
      {/* Primary Hero KPI Card */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 backdrop-blur-xs text-white border border-white/20 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Tata AIA Life Single Premium Quote
            </div>
            <h3 className="text-sm font-medium text-emerald-100">
              Total Single Premium Payable (Incl. 18% GST)
            </h3>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight mt-1">
              {formatCurrency(activeQuote?.payablePremium || 0)}
            </div>
          </div>

          <div className="sm:text-right bg-white/10 backdrop-blur-xs px-4 py-3 rounded-xl border border-white/15">
            <span className="text-xs text-emerald-100 font-medium block">
              {isFunded ? 'Revised Loan / Sum Assured' : 'Original Loan / Sum Assured'}
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white">
              {formatCurrency(activeQuote?.revisedSumAssured || 0)}
            </span>
            <span className="text-[11px] text-emerald-200 block mt-0.5">
              {isFunded ? `+${formatCurrency(activeQuote?.payablePremium || 0)} capitalized` : 'Direct out of pocket'}
            </span>
          </div>
        </div>

        {/* Underwriting Badge */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald-200">Underwriting Status:</span>
            {underwriting?.isMedicalRequired ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-amber-400 text-slate-950">
                <AlertTriangle className="w-3.5 h-3.5" /> Medical Underwriting Required
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-emerald-300 text-emerald-950">
                <CheckCircle2 className="w-3.5 h-3.5" /> Clear (Non-Medical Limit)
              </span>
            )}
          </div>
          <div className="text-emerald-100 font-mono text-[11px]">
            NML Limit: ₹{(underwriting?.limit || 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* 4 Detailed Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Actuarial Rate */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>Actuarial Rate</span>
            <Percent className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {rateLookup?.rate != null ? `${Number(rateLookup.rate).toFixed(3)}` : 'N/A'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate" title={rateLookup?.tableKey}>
            per ₹1,000 Sum Assured
          </div>
        </div>

        {/* Metric 2: Basic Premium */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>Basic Premium</span>
            <Layers className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(activeQuote?.basicPremium || 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Before taxes
          </div>
        </div>

        {/* Metric 3: GST Amount */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>GST @ 18%</span>
            <Percent className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {formatCurrency(activeQuote?.gstAmount || 0)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Statutory tax rate
          </div>
        </div>

        {/* Metric 4: Entry & Maturity Age */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">
            <span>Borrower Age</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 dark:text-white">
            {meta?.entryAge || 0} <span className="text-xs font-normal text-slate-400">/ {meta?.coverageAge?.toFixed(1) || 0} yrs</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Entry / Maturity Age
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison: Funded vs Non-Funded */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
          Funding Mode Breakdown Comparison
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                <th className="text-left py-2 font-medium">Parameter</th>
                <th className={`text-right py-2 px-3 font-semibold ${isFunded ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                  Funded Option {isFunded && '✓ (Active)'}
                </th>
                <th className={`text-right py-2 px-3 font-semibold ${!isFunded ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>
                  Non-Funded Option {!isFunded && '✓ (Active)'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <tr>
                <td className="py-2 text-slate-700 dark:text-slate-300 font-sans font-medium">Original Loan Amount</td>
                <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{formatCurrency(inputs.loanAmount)}</td>
                <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{formatCurrency(inputs.loanAmount)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700 dark:text-slate-300 font-sans font-medium">Revised Sum Assured</td>
                <td className="py-2 px-3 text-right font-bold text-emerald-700 dark:text-emerald-300">
                  {formatCurrency(funded?.revisedSumAssured || 0)}
                </td>
                <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-400">
                  {formatCurrency(nonFunded?.sumAssured || 0)}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700 dark:text-slate-300 font-sans font-medium">Basic Premium (Excl GST)</td>
                <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{formatCurrency(funded?.basicPremium || 0)}</td>
                <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{formatCurrency(nonFunded?.basicPremium || 0)}</td>
              </tr>
              <tr>
                <td className="py-2 text-slate-700 dark:text-slate-300 font-sans font-medium">GST @ 18%</td>
                <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{formatCurrency(funded?.gstAmount || 0)}</td>
                <td className="py-2 px-3 text-right text-slate-800 dark:text-slate-200">{formatCurrency(nonFunded?.gstAmount || 0)}</td>
              </tr>
              <tr className="font-bold text-sm bg-slate-50 dark:bg-slate-800/40">
                <td className="py-2.5 px-2 text-slate-900 dark:text-white font-sans">Total Payable Premium</td>
                <td className="py-2.5 px-3 text-right text-emerald-700 dark:text-emerald-400">
                  {formatCurrency(funded?.payablePremium || 0)}
                </td>
                <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-300">
                  {formatCurrency(nonFunded?.payablePremium || 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Compliance & Product Credentials Footer */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-500 dark:text-slate-400 flex items-start gap-3">
        <Building className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            {meta?.disclaimer?.planName || 'TATA AIA LIFE GROUP SAMPOORNA RAKSHA SUPREME PLAN'} (UIN: {meta?.disclaimer?.uin || '110N173V02'})
          </p>
          <p className="text-[11px]">
            Master Policyholder: <span className="font-semibold">{meta?.disclaimer?.masterPolicyHolder || 'Tata Capital Limited'}</span> | Insurer: {meta?.disclaimer?.insurer}
          </p>
          <p className="text-[10px] text-slate-400">
            Rates are based on Tata AIA actuarial tables approved by IRDAI for commercial vehicle credit life group insurance.
          </p>
        </div>
      </div>
    </div>
  );
}
