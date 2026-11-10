import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  Download, 
  BarChart2, 
  Table as TableIcon, 
  Search,
  ArrowUpDown
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  BarChart,
  Bar
} from 'recharts';
import { formatINR, formatNumber } from '../../../utils/formatters';

export default function IrrCashFlowTable(props) {
  const reduxOutputs = useSelector((state) => state?.irr?.outputs);
  const schedule = (props.schedule && props.schedule.length > 0) ? props.schedule : (reduxOutputs?.amortizationSchedule || []);
  const dealIrrPct = props.dealIrrPct ?? (reduxOutputs?.dealIrrPct || 0);

  const [viewType, setViewType] = useState('table'); // 'table' or 'chart'
  const [searchTerm, setSearchTerm] = useState('');

  if (!schedule || schedule.length === 0) return null;

  const filteredSchedule = schedule.filter(row => {
    if (!searchTerm) return true;
    return String(row.period).includes(searchTerm) || row.date.includes(searchTerm);
  });

  const handleExportCSV = () => {
    const headers = ['Period', 'Date', 'Installment', 'Accounting Flow', 'Interest Accrued', 'Principal Repaid', 'Principal Balance', 'Balance Installments'];
    const rows = schedule.map(r => [
      r.period,
      r.date,
      r.installment,
      r.accountingFlow,
      r.interestAccrued.toFixed(2),
      r.principalRepaid.toFixed(2),
      r.principalBalance.toFixed(2),
      r.remainingInstallments.toFixed(2)
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IRR_Amortization_Schedule_${schedule.length - 1}M.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prepare chart data (excluding period 0 negative flow for clean visualization)
  const chartData = schedule.slice(1).map(r => ({
    period: `M${r.period}`,
    Principal: Math.round(r.principalRepaid),
    Interest: Math.round(r.interestAccrued),
    Balance: Math.round(r.principalBalance)
  }));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800 mb-5">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Amortization & Cash Flow Schedule</span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {schedule.length - 1} Periods @ {dealIrrPct}% Deal IRR
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed month-by-month cash flows matching the Excel 'Cashflows' sheet.
          </p>
        </div>

        {/* View Switcher & Export */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewType('table')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewType === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewType('chart')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                viewType === 'chart' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Chart</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="p-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV Export</span>
          </button>
        </div>
      </div>

      {viewType === 'chart' ? (
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="interestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(val) => formatINR(val)}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="Balance" stroke="#3b82f6" fillOpacity={1} fill="url(#balanceGrad)" name="Principal Balance" />
              <Area type="monotone" dataKey="Interest" stroke="#f59e0b" fillOpacity={1} fill="url(#interestGrad)" name="Monthly Interest" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>
          {/* Search Bar */}
          <div className="mb-4 max-w-xs relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search period or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[460px] overflow-y-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/90 text-slate-400 sticky top-0 z-10 border-b border-slate-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Installment</th>
                  <th className="py-2.5 px-3 text-right">A/c Flows</th>
                  <th className="py-2.5 px-3 text-right text-amber-400">Interest Accrued</th>
                  <th className="py-2.5 px-3 text-right text-emerald-400">Principal Repaid</th>
                  <th className="py-2.5 px-3 text-right text-blue-400">Closing Balance</th>
                  <th className="py-2.5 px-3 text-right">Remaining Installments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredSchedule.map((row) => (
                  <tr 
                    key={row.period} 
                    className={`hover:bg-slate-800/40 transition-colors ${
                      row.period === 0 ? 'bg-blue-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2 px-3 text-slate-300">
                      {row.period === 0 ? 'M0 (Disb.)' : `M${row.period}`}
                    </td>
                    <td className="py-2 px-3 text-slate-400">{row.date}</td>
                    <td className="py-2 px-3 text-right font-semibold text-white">
                      {row.installment > 0 ? formatINR(row.installment) : '-'}
                    </td>
                    <td className={`py-2 px-3 text-right font-semibold ${
                      row.accountingFlow < 0 ? 'text-red-400' : 'text-slate-200'
                    }`}>
                      {row.accountingFlow < 0 
                        ? `(${formatINR(Math.abs(row.accountingFlow))})` 
                        : (row.accountingFlow > 0 ? formatINR(row.accountingFlow) : '-')}
                    </td>
                    <td className="py-2 px-3 text-right text-amber-300">
                      {row.interestAccrued > 0 ? formatINR(row.interestAccrued) : '-'}
                    </td>
                    <td className="py-2 px-3 text-right text-emerald-300">
                      {row.principalRepaid !== 0 
                        ? (row.principalRepaid < 0 ? `(${formatINR(Math.abs(row.principalRepaid))})` : formatINR(row.principalRepaid))
                        : '-'}
                    </td>
                    <td className="py-2 px-3 text-right font-semibold text-blue-300">
                      {formatINR(row.principalBalance)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-400">
                      {formatINR(row.remainingInstallments)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
