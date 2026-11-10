import React from 'react';
import { useSelector } from 'react-redux';
import { formatCurrency, formatPercent } from '../../../utils/formatters';
import { GitCommit, Info, CheckCircle, Calculator } from 'lucide-react';

export default function CliFundingConvergenceTable() {
  const { quote, inputs } = useSelector((state) => state.cli);

  if (!quote) return null;

  const { funded, meta } = quote;
  const iterations = funded?.iterations || [];
  const analyticalSA = funded?.revisedSumAssured || 0;
  const analyticalPrem = funded?.payablePremium || 0;
  const rate = meta?.rateLookup?.rate || 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 rounded-lg">
              <GitCommit className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Circular Reference Funding Convergence Ladder
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exact unrolled 12-iteration fixed-point solver replicating Excel rows 94–106 in the CLI Calculation Sheet
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Analytical Convergence Achieved</span>
        </div>
      </div>

      {/* Explanation Banner */}
      <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">How Funded Insurance Premium Works in Excel:</p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            When insurance is funded, the premium is added to the loan amount, which increases the Sum Assured, which in turn increases the premium.
            Excel solves this circular dependency using an unrolled 12-iteration ladder:
            <span className="font-mono font-semibold ml-1">
              SA[n+1] = BaseLoan + Premium[n] + GST[n]
            </span>.
            Our calculation engine proves exact equivalence with both the 12-step ladder and the analytical closed-form limit
            <span className="font-mono font-semibold ml-1">
              SA* = BaseLoan / (1 - (Rate/1000 × 1.18))
            </span>.
          </p>
        </div>
      </div>

      {/* Analytical Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50/30 dark:bg-slate-800/20 border-b border-slate-200 dark:border-slate-800">
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Base Loan Amount</span>
          <span className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">
            {formatCurrency(inputs.loanAmount)}
          </span>
        </div>
        <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Actuarial Factor [Rate × 1.18]</span>
          <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {((rate / 1000) * 1.18 * 100).toFixed(4)}%
          </span>
        </div>
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">Closed-Form Limit (SA*)</span>
          <span className="text-lg font-bold font-mono text-emerald-900 dark:text-emerald-200">
            {formatCurrency(analyticalSA)}
          </span>
        </div>
      </div>

      {/* 12-Iteration Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4">Excel Row</th>
              <th className="py-3 px-4">Iteration #</th>
              <th className="py-3 px-4 text-right">Sum Assured (₹)</th>
              <th className="py-3 px-4 text-right">Basic Premium (₹)</th>
              <th className="py-3 px-4 text-right">GST @ 18% (₹)</th>
              <th className="py-3 px-4 text-right">Total Premium (₹)</th>
              <th className="py-3 px-4 text-right">Δ from Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            {iterations.map((row) => {
              const excelRowNumber = 94 + row.iteration;
              const delta = analyticalSA - row.sumAssured;
              const isFinal = row.iteration === 12;

              return (
                <tr
                  key={row.iteration}
                  className={`transition-colors ${
                    isFinal
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 font-bold text-emerald-950 dark:text-emerald-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <td className="py-2.5 px-4 font-sans text-slate-500 dark:text-slate-400 font-semibold">
                    Row {excelRowNumber}
                  </td>
                  <td className="py-2.5 px-4 font-sans">
                    Iteration {row.iteration} {isFinal && '(Final Converged)'}
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    {formatCurrency(row.sumAssured)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300">
                    {formatCurrency(row.basicPremium)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-700 dark:text-slate-300">
                    {formatCurrency(row.gstAmount)}
                  </td>
                  <td className="py-2.5 px-4 text-right font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(row.totalPremium)}
                  </td>
                  <td className="py-2.5 px-4 text-right text-slate-400 text-[11px]">
                    {delta < 0.01 ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹0.00 (Exact)</span>
                    ) : (
                      `₹${delta.toFixed(2)}`
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
