import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import WalletSelector from './components/WalletSelector';
import NotificationCenter from './components/NotificationCenter';
import ThemeToggle from './components/ThemeToggle';
import ExportButton from './components/ExportButton';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Insights from './components/Insights';
import AIChatModel from './components/AIChatModel';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load initial transactions from localStorage if available, otherwise use default list
  const [transactionsList, setTransactionsList] = useState(() => {
    const saved = localStorage.getItem('finsight_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse local storage transactions", e);
      }
    }
    return [
      { id: 1, title: 'Cloud Infrastructure (AWS)', category: 'Subscription', account: 'Business HDFC', date: '05 Aug, 2026', amount: -2499, type: 'Expense' },
      { id: 2, title: 'Client Freelance Payout', category: 'Income', account: 'Primary Bank', date: '03 Aug, 2026', amount: 25000, type: 'Income' },
      { id: 3, title: 'Local Cafe & Workspace', category: 'Food', account: 'UPI Wallet', date: '01 Aug, 2026', amount: -450, type: 'Expense' },
      { id: 4, title: 'GitHub Enterprise Subscription', category: 'Subscription', account: 'Credit Card', date: '28 Jul, 2026', amount: -349, type: 'Expense' },
      { id: 5, title: 'UI/UX Design Kit Purchase', category: 'Design', account: 'Business HDFC', date: '25 Jul, 2026', amount: -1200, type: 'Expense' },
    ];
  });

  // Save transactions to localStorage whenever the list updates
  useEffect(() => {
    localStorage.setItem('finsight_transactions', JSON.stringify(transactionsList));
  }, [transactionsList]);

  const addTransaction = (newTx) => {
    setTransactionsList([newTx, ...transactionsList]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header 
          className="h-20 border-b flex items-center justify-between px-8 shrink-0 transition-colors"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        >
          <div>
            <h2 className="font-serif text-xl font-bold capitalize" style={{ color: 'var(--text-main)' }}>
              {activeTab} Overview
            </h2>
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              Monitor your cash flow with receipt-tape precision.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <WalletSelector />
            <NotificationCenter />
            <ThemeToggle />
            <ExportButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && <Dashboard transactions={transactionsList} />}
          {activeTab === 'transactions' && <Transactions transactions={transactionsList} onAddTransaction={addTransaction} />}
          {activeTab === 'budgets' && <Budgets />}
          {activeTab === 'insights' && <Insights />}
        </main>
      </div>

      <AIChatModel transactions={transactionsList} />
    </div>
  );
}