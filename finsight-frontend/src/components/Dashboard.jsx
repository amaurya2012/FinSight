import React from 'react';

export default function Dashboard({ transactions }) {
  const totalExpense = transactions
    .filter(tx => tx.type === 'Expense')
    .reduce((acc, curr) => acc + Math.abs(curr.amount), 0);

  const categoryTotals = transactions
    .filter(tx => tx.type === 'Expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + Math.abs(curr.amount);
      return acc;
    }, {});

  const getCategoryColor = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('subscription') || lower.includes('saas')) return 'bg-[#34d399]';
    if (lower.includes('food') || lower.includes('cafe')) return 'bg-[#f5b942]';
    if (lower.includes('design')) return 'bg-[#818cf8]';
    if (lower.includes('utility') || lower.includes('fuel')) return 'bg-[#f87171]';
    return 'bg-[#38bdf8]';
  };

  const categoryList = Object.keys(categoryTotals).map(cat => ({
    name: cat,
    amount: categoryTotals[cat],
    percent: totalExpense > 0 ? Math.round((categoryTotals[cat] / totalExpense) * 100) : 0,
    colorClass: getCategoryColor(cat)
  }));

  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="space-y-6 font-sans">
      <div 
        className="border rounded-3xl p-6 shadow-xl transition-colors relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              TOTAL SPEND • AUGUST 2026
            </span>
            <h3 className="font-serif text-4xl font-bold mt-1" style={{ color: 'var(--text-main)' }}>
              ₹{totalExpense.toLocaleString('en-IN')}.00
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full border text-xs font-mono text-[#34d399] bg-[#34d399]/10 border-[#34d399]/30">
            +12.4% vs last month
          </span>
        </div>

        <div className="pt-4 border-t flex justify-between items-center text-xs font-mono" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
          <span>RECEIPT #FS-2026-08</span>
          <span className="text-[#34d399] font-bold">Verified Ledger Entry</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div 
          className="lg:col-span-2 border rounded-3xl p-6 shadow-xl transition-colors"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        >
          <h4 className="font-serif text-lg font-bold mb-6" style={{ color: 'var(--text-main)' }}>Category Breakdown</h4>
          
          <div className="space-y-5">
            {categoryList.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold" style={{ color: 'var(--text-main)' }}>{cat.name}</span>
                  <span style={{ color: 'var(--text-muted)' }}>₹{cat.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-2.5 rounded-full overflow-hidden border" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <div className={`h-full ${cat.colorClass} rounded-full transition-all duration-500`} style={{ width: `${Math.min(cat.percent, 100)}%` }}></div>
                </div>
              </div>
            ))}
            {categoryList.length === 0 && (
              <p className="text-xs font-mono py-4 text-center" style={{ color: 'var(--text-muted)' }}>No expense entries recorded yet.</p>
            )}
          </div>
        </div>

        <div 
          className="border rounded-3xl p-6 shadow-xl transition-colors flex flex-col justify-between"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        >
          <div>
            <h4 className="font-serif text-lg font-bold mb-4" style={{ color: 'var(--text-main)' }}>Recent Transactions</h4>
            <div className="space-y-3 font-mono text-xs">
              {recentTransactions.map(tx => (
                <div 
                  key={tx.id} 
                  className="p-3 rounded-2xl border transition-colors flex justify-between items-center"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                >
                  <div>
                    <p className="font-bold truncate max-w-[140px]" style={{ color: 'var(--text-main)' }}>{tx.title}</p>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{tx.date}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${tx.type === 'Income' ? 'text-[#34d399]' : ''}`} style={{ color: tx.type === 'Income' ? undefined : 'var(--text-main)' }}>
                      {tx.type === 'Income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}
                    </span>
                    <span className="block text-[9px] px-1.5 py-0.5 rounded border mt-0.5 text-center" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                      {tx.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}