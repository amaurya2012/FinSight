import React, { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2.5 rounded-xl border transition-all cursor-pointer font-mono text-xs flex items-center gap-2"
      style={{ 
        backgroundColor: 'var(--bg-surface)', 
        borderColor: 'var(--border-color)', 
        color: 'var(--text-main)' 
      }}
      title="Toggle Theme"
    >
      <span>{isDark ? '🌙 Dark' : '☀️ Light'}</span>
    </button>
  );
}