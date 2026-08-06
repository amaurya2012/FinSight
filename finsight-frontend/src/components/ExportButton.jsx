import React from 'react';

export default function ExportButton() {
  const handleExport = () => {
    const reportData = `--- FINSIGHT FINANCIAL LEDGER REPORT ---
Date: August 2026
Status: Secure Ledger Active
Total Spend: ₹21,000.00
Net Savings Rate: 58.2%
----------------------------------------
Generated via FinSight Analytics Dashboard`;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'FinSight-Ledger-Report.txt';
    link.click();
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 rounded-xl bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/30 hover:bg-[#34d399]/20 transition-all text-xs font-mono flex items-center gap-2 cursor-pointer"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      <span>Export Report</span>
    </button>
  );
}