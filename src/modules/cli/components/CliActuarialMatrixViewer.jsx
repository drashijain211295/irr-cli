import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import cliRateTables from '../data/cliRateTables.json';
import cliRules from '../data/cliRules.json';
import { Table, Search, Shield, Info } from 'lucide-react';

export default function CliActuarialMatrixViewer() {
  const { inputs, quote } = useSelector((state) => state.cli);
  const [selectedSegment, setSelectedSegment] = useState(inputs.segmentCode || 'NCV');
  const [selectedGender, setSelectedGender] = useState(inputs.gender || 'Male');
  const [ageSearch, setAgeSearch] = useState('');

  const currentAge = quote?.meta?.entryAge || 34;
  const currentTenure = inputs.tenureMonths || 60;
  const currentTermKey = `${currentTenure}_${currentTenure}`;

  const tableKey = `${selectedSegment}_Base_Mor0_${selectedGender}_14`;
  const rateTable = cliRateTables[tableKey] || {};

  // Standard terms for columns
  const terms = [12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84];

  // Filter ages based on search or display full range
  const allAges = Object.keys(rateTable).map(Number).sort((a, b) => a - b);
  const filteredAges = ageSearch
    ? allAges.filter((a) => String(a).includes(ageSearch))
    : allAges;

  // NML Underwriting limits
  const segmentKey = selectedSegment === 'STR' ? 'StrategicCV' : (selectedSegment === 'UCV' ? 'RetailUsedCV' : 'RetailNewCV');
  const nmlBands = cliRules.NML[segmentKey]?.bands || [];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Table className="w-5 h-5 text-emerald-600" />
              Tata AIA Actuarial Rate Matrix & Underwriting Limits
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rates per ₹1,000 Sum Assured for 14% Reducing Interest Scheme (Moratorium 0)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Segment Selector */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs">
              {['STR', 'NCV', 'UCV'].map((seg) => (
                <button
                  key={seg}
                  onClick={() => setSelectedSegment(seg)}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                    selectedSegment === seg
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {seg}
                </button>
              ))}
            </div>

            {/* Gender Selector */}
            <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800 text-xs">
              {['Male', 'Female'].map((gen) => (
                <button
                  key={gen}
                  onClick={() => setSelectedGender(gen)}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                    selectedGender === gen
                      ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {gen}
                </button>
              ))}
            </div>

            {/* Age Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter Age..."
                value={ageSearch}
                onChange={(e) => setAgeSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg w-28 outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Active Matrix Indicator */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span className="font-mono font-medium">
            Active Matrix: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{tableKey}</span>
          </span>
          <span>
            Highlighting: <span className="font-bold text-slate-800 dark:text-slate-200">Age {currentAge}</span> / <span className="font-bold text-slate-800 dark:text-slate-200">{currentTenure} Months</span>
          </span>
        </div>
      </div>

      {/* Actuarial 2D Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[460px]">
          <table className="w-full text-xs text-right border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 font-bold sticky top-0 z-10">
              <tr>
                <th className="py-2.5 px-3 text-left sticky left-0 bg-slate-100 dark:bg-slate-800 z-20 border-b border-r border-slate-300 dark:border-slate-700 w-16">
                  Age
                </th>
                {terms.map((t) => {
                  const isCurrentTerm = t === currentTenure;
                  return (
                    <th
                      key={t}
                      className={`py-2.5 px-3 border-b border-slate-300 dark:border-slate-700 ${
                        isCurrentTerm
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-extrabold'
                          : ''
                      }`}
                    >
                      {t}M
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
              {filteredAges.map((age) => {
                const isCurrentAge = age === currentAge;
                const rowData = rateTable[String(age)] || {};

                return (
                  <tr
                    key={age}
                    className={`transition-colors ${
                      isCurrentAge
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <td
                      className={`py-2 px-3 text-left font-bold sticky left-0 z-10 border-r border-slate-200 dark:border-slate-700 ${
                        isCurrentAge
                          ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-950 dark:text-emerald-200'
                          : 'bg-slate-50 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {age} {isCurrentAge && '👉'}
                    </td>
                    {terms.map((t) => {
                      const termKey = `${t}_${t}`;
                      const rateVal = rowData[termKey];
                      const isTargetCell = isCurrentAge && t === currentTenure;

                      return (
                        <td
                          key={t}
                          className={`py-2 px-3 ${
                            isTargetCell
                              ? 'bg-emerald-600 text-white font-black text-xs ring-2 ring-emerald-500'
                              : t === currentTenure
                              ? 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 font-medium'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {rateVal != null ? Number(rateVal).toFixed(3) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Underwriting NML Policy Reference */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          Non-Medical Limits (NML) Underwriting Schedule for {selectedSegment}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {nmlBands.filter(b => b.limit > 0).map((band, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Ages {band.minAge} – {band.maxAge} Years
              </div>
              <div className="text-base font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                Up to ₹{(band.limit / 100000).toFixed(0)} Lakhs
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Non-Medical Underwriting (Clear)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
