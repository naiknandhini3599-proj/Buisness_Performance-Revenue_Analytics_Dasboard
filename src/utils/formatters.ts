/**
 * Currency and number formatting utilities
 */

export function formatINR(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '₹0';
  
  // Custom Indian Rupee numbering format (lakhs & crores)
  const isNegative = val < 0;
  const absVal = Math.round(Math.abs(val));
  const s = absVal.toString();
  
  let lastThree = s.substring(s.length - 3);
  const otherNumbers = s.substring(0, s.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

export function formatCompactINR(val: number): string {
  if (isNaN(val) || val === 0) return '₹0';
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(1)}Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)}L`;
  }
  if (val >= 1000) {
    return `₹${(val / 1000).toFixed(1)}K`;
  }
  return `₹${val}`;
}

export function formatPercent(val: number | null | undefined, decimals = 1): string {
  if (val === null || val === undefined || isNaN(val)) return '0.0%';
  return `${val.toFixed(decimals)}%`;
}

export function formatPctChange(current: number, previous: number): { valueStr: string; isPositive: boolean; isZero: boolean } {
  if (previous === 0) {
    if (current === 0) return { valueStr: '0.0%', isPositive: true, isZero: true };
    return { valueStr: '+100%', isPositive: true, isZero: false };
  }
  const pct = ((current - previous) / previous) * 100;
  const isPositive = pct >= 0;
  return {
    valueStr: `${isPositive ? '+' : ''}${pct.toFixed(1)}%`,
    isPositive,
    isZero: pct === 0,
  };
}

export function formatDateShort(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

export function formatDateFull(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
