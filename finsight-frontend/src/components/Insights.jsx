import React from 'react';

export default function Insights() {
  const insightsList = [
    {
      id: 1,
      title: 'Subscription Optimization Detected',
      desc: 'Your SaaS overhead increased by 14% this month due to redundant cloud tools. Consider consolidating workspace licenses to save approx ₹1,200/mo.',
      badge: 'AI',
      badgeColor: 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30'
    },
    {
      id: 2,
      title: 'Cash Flow Velocity',
      desc: 'Inflow turnaround time averages 3.2 days faster than your rolling 3-month baseline. Overall ledger stability is rated Optimal.',
      badge: '⚡',
      badgeColor: 'bg-[#f5b942]/10 text-[#f5b942] border-[#f5b942]/30'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      <div 
        className="border rounded-2xl p-6 shadow-xl transition-colors"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <div className="mb-6">
          <h4 className="font-serif text-lg font-bold" style={{ color: 'var(--text-main)' }}>AI Financial Intelligence</h4>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>Automated pattern recognition & ledger health notes.</p>
        </div>

        <div className="space-y-4">
          {insightsList.map(item => (
            <div 
              key={item.id} 
              className="border rounded-2xl p-5 shadow-sm transition-colors flex items-start gap-4"
              style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
            >
              <div className={`px-2.5 py-1 rounded-xl border text-xs font-mono font-bold flex items-center justify-center ${item.badgeColor}`}>
                {item.badge}
              </div>
              <div>
                <h5 className="font-serif font-bold text-sm mb-1" style={{ color: 'var(--text-main)' }}>{item.title}</h5>
                <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}