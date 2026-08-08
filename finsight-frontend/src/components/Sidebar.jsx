import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, isOpen, onClose }) {
  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      ) 
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
          <path d="M16 8h-6M16 12h-6M12 16H8" />
        </svg>
      ) 
    },
    { 
      id: 'budgets', 
      label: 'Budgets', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
        </svg>
      ) 
    },
    { 
      id: 'insights', 
      label: 'Insights', 
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
          <path d="M22 12A10 10 0 0 0 12 2v10z" />
        </svg>
      ) 
    },
  ];

  const handleSelect = (id) => {
    setActiveTab(id);
    onClose?.(); // close the drawer automatically after picking a tab on mobile
  };

  return (
    <>
      {/* Backdrop - only shows on mobile when drawer is open */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full w-64 border-r flex flex-col justify-between p-6
          transition-transform duration-200 z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <div>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#34d399]/10 border border-[#34d399]/30 flex items-center justify-center text-[#34d399] font-serif font-bold text-lg">
                ₹
              </div>
              <div>
                <h1 className="font-serif font-bold text-lg tracking-wide" style={{ color: 'var(--text-main)' }}>FinSight</h1>
                <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>receipt aesthetic</p>
              </div>
            </div>
            {/* Close button - mobile only */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#34d399]/10 text-[#34d399] border border-[#34d399]/20 shadow-sm'
                      : 'hover:opacity-80'
                  }`}
                  style={{ color: isActive ? '#34d399' : 'var(--text-muted)' }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}