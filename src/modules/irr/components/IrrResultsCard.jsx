import React from 'react';
import { useSelector } from 'react-redux';
import { 
  TrendingUp, 
  Percent, 
  Coins, 
  CreditCard, 
  PieChart, 
  ShieldAlert, 
  CheckCircle,
  FileCheck2
} from 'lucide-react';
import { formatINR, formatPct } from '../../../utils/formatters';

export default function IrrResultsCard(props) {
  const reduxState = useSelector((state) => state?.irr);
  const outputs = props.outputs || reduxState?.outputs;
  const inputs = props.inputs || reduxState?.inputs || {};

  if (!outputs) return null;

  return (
    <div className="space-y-6">
      {/* Top Highlight KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Deal IRR Card */}
        <div className="bg-gradient-to-br from-blue-950/80 to-slate-900 border border-blue-500/40 rounded-2xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block mb-1">
            Effective Deal IRR
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
            {formatPct(outputs.dealIrrPct)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-blue-500/20 pt-2">
            <span>Accounting IRR: <strong className="text-slate-200">{formatPct(outputs.dealIrrPct)}</strong></span>
            <span>Annualized (x12)</span>
          </div>
        </div>

        {/* Flat Rate Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Flat Interest Rate
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
              {inputs.mode === 'reverse' ? 'Auto Calculated' : 'User Specified'}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400 tracking-tight font-mono">
            {formatPct(outputs.flatRatePct, 4)}
          </div>
          <div className="mt-2.5 text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            Total Interest: <strong className="text-slate-200 font-mono">{formatINR(outputs.totalInterest)}</strong>
          </div>
        </div>

        {/* Monthly EMI Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Monthly Installment (EMI)
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight font-mono">
            {formatINR(outputs.primaryEmi)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span>Agreement Value: <strong className="text-slate-200 font-mono">{formatINR(outputs.agreementValue)}</strong></span>
          </div>
        </div>

        {/* Exposure / LTV Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Exposure (Net LTV)
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight font-mono">
            {formatPct(outputs.exposurePct)}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
            <span>Margin Money: <strong className="text-slate-200 font-mono">{formatINR(outputs.marginMoney)}</strong></span>
          </div>
        </div>

      </div>

      {/* Balancing Status / Verification Strip */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
        outputs.balancingShortfall > 0 
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
      }`}>
        <div className="flex items-center space-x-2.5">
          {outputs.balancingShortfall > 0 ? (
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <div>
            <span className="font-semibold">
              {outputs.balancingShortfall > 0
                ? `Installment Shortfall of ${formatINR(outputs.balancingShortfall)} detected.`
                : 'Deal Balanced: Total Installment Stream matches Agreement Value perfectly.'
              }
            </span>
            <span className="ml-1 opacity-80">
              ({inputs.numberOfInstallments} payments @ {formatINR(outputs.primaryEmi)} = {formatINR(outputs.totalInstallmentSum)})
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 font-mono text-[11px] shrink-0">
          <span>Net Finance: <strong>{formatINR(outputs.disbursementAmt)}</strong></span>
          <span>•</span>
          <span>Tenure: <strong>{inputs.tenureMonths}M</strong></span>
        </div>
      </div>
    </div>
  );
}
