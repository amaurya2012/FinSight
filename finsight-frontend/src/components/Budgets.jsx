import React from 'react';

export default function Budgets() {
  const budgetsList = [
    { category: 'Food & Dining', spent: '₹14,250', limit: '₹18,000', percent: '79%', left: '₹3,750 left', status: 'On Track', statusColor: 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30', barColor: 'bg-[#34d399]' },
    { category: 'Subscriptions', spent: '₹4,120', limit: '₹5,000', percent: '82%', left: '₹880 left', status: 'On Track', statusColor: 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30', barColor: 'bg-[#f5b942]' },
    { category: 'Utilities & Fuel', spent: '₹2,630', limit: '₹4,000', percent: '66%', left: '₹1,370 left', status: 'On Track', statusColor: 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30', barColor: 'bg-[#34d399]' },
    { category: 'Shopping & Leisure', spent: '₹6,500', limit: '₹6,000', percent: '108%', left: '₹500 exceeded', status: 'Over Budget', statusColor: 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30', barColor: 'bg-[#f87171]' },
  ];

  return (
    <div className="space-y-6 font-sans">
      
      <div 
        className="border rounded-2xl p-6 shadow-xl transition-colors"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <div className="mb-6">
          <h4 className="font-serif text-lg font-bold" style={{ color: 'var(--text-main)' }}>Monthly Budget Allocation</h4>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>Track spending boundaries and anomaly thresholds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetsList.map((item, idx) => (
            <div 
              key={idx} 
              className="border rounded-2xl p-5 shadow-sm transition-colors flex flex-col justify-between"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-serif font-bold text-sm" style={{ color: 'var(--text-main)' }}>{item.category}</h5>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
                  <span>Spent: <strong style={{ color: 'var(--text-main)' }}>{item.spent}</strong></span>
                  <span>Limit: <strong style={{ color: 'var(--text-main)' }}>{item.limit}</strong></span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 rounded-full overflow-hidden border mb-3" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                  <div className={`h-full ${item.barColor} rounded-full`} style={{ width: item.percent }}></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono pt-3 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <span>{item.percent} utilized</span>
                <span className="font-bold" style={{ color: item.status === 'Over Budget' ? '#f87171' : 'var(--text-main)' }}>{item.left}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}