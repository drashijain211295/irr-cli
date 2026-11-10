/**
 * Financial & Date Formatting Utilities for Indian Currency (INR) and Banking Standards
 */

export function formatINR(val, includeDecimals = false) {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  const num = Number(val);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: includeDecimals ? 2 : 0,
    minimumFractionDigits: includeDecimals ? 2 : 0
  }).format(num);
}

export const formatCurrency = formatINR;

export function formatNumber(val, decimals = 0) {
  if (val === null || val === undefined || isNaN(val)) return '0';
  const num = Number(val);
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(num);
}

export function formatPct(val, decimals = 2) {
  if (val === null || val === undefined || isNaN(val)) return '0.00%';
  const num = Number(val);
  return `${num.toFixed(decimals)}%`;
}

export const formatPercent = formatPct;

export function formatDate(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(d);
}
