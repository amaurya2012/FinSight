import React, { useState } from 'react';

export default function WalletSelector() {
  const [selectedWallet, setSelectedWallet] = useState('Personal Savings');
  const [isOpen, setIsOpen] = useState(false);
  const wallets = ['Business HDFC', 'Personal Savings', 'Crypto Ledger'];

  return (
    <div className="relative font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-2 cursor-pointer transition-colors"
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderColor: 'var(--border-color)', 
          color: 'var(--text-main)' 
        }}
      >
        <span className="w-2 h-2 rounded-full bg-[#34d399]"></span>
        <span>{selectedWallet}</span>
        <span style={{ color: 'var(--text-muted)' }}>▼</span>
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 border rounded-xl shadow-2xl p-1 z-50 font-mono text-xs transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--border-color)' 
          }}
        >
          {wallets.map(w => (
            <button
              key={w}
              onClick={() => { setSelectedWallet(w); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer ${
                selectedWallet === w ? 'bg-[#34d399]/10 text-[#34d399] font-bold' : ''
              }`}
              style={{ 
                color: selectedWallet === w ? '#34d399' : 'var(--text-main)' 
              }}
            >
              {w}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}