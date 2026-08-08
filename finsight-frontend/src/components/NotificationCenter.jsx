import React, { useState, useRef, useEffect } from 'react';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const alerts = [
    { id: 1, text: 'Shopping & Leisure budget exceeded by ₹500.', time: '10m ago' },
    { id: 2, text: 'New recurring subscription detected.', time: '2h ago' }
  ];

  // Close the dropdown when clicking/tapping anywhere outside it
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative font-sans" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl border transition-all cursor-pointer relative"
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderColor: 'var(--border-color)', 
          color: 'var(--text-main)' 
        }}
      >
        🔔
        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#f87171] animate-ping"></span>
      </button>

      {isOpen && (
        <div 
          className="fixed top-16 right-3 sm:right-6 w-72 max-w-[85vw] border rounded-2xl shadow-2xl p-4 z-50 font-mono transition-colors"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--border-color)' 
          }}
        >
          <div className="flex justify-between items-center mb-3 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-xs font-bold" style={{ color: 'var(--text-main)' }}>System Alerts</span>
            <span className="text-[10px] text-[#34d399]">2 Unread</span>
          </div>
          <div className="space-y-2">
            {alerts.map(alt => (
              <div 
                key={alt.id} 
                className="p-2.5 rounded-xl border text-xs"
                style={{ 
                  backgroundColor: 'var(--bg-main)', 
                  borderColor: 'var(--border-color)' 
                }}
              >
                <p style={{ color: 'var(--text-main)' }}>{alt.text}</p>
                <span className="text-[10px] mt-1 block" style={{ color: 'var(--text-muted)' }}>{alt.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}