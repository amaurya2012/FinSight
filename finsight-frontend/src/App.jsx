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
import { fetchTransactions, createTransaction, deleteTransaction } from './api/transactions';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactionsList, setTransactionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTransactions() {
      try {
        setLoading(true);
        const data = await fetchTransactions();
        setTransactionsList(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load transactions:', err);
        setError('Could not load transactions. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const addTransaction = async (newTx) => {
    try {
      const saved = await createTransaction(newTx);
      setTransactionsList([saved, ...transactionsList]);
    } catch (err) {
      console.error('Failed to add transaction:', err);
      setError('Could not save transaction. Please try again.');
    }
  };

  const removeTransaction = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactionsList(transactionsList.filter(tx => tx.id !== id));
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      setError('Could not delete transaction. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-main)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header
          className="border-b flex flex-wrap items-center justify-between gap-3 px-4 sm:px-8 py-4 shrink-0 transition-colors"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger - mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg border flex items-center justify-center cursor-pointer shrink-0"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
            >
              ☰
            </button>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold capitalize" style={{ color: 'var(--text-main)' }}>
                {activeTab} Overview
              </h2>
              <p className="hidden sm:block text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                Monitor your cash flow with receipt-tape precision.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <WalletSelector />
            <NotificationCenter />
            <ThemeToggle />
            <ExportButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl border text-xs font-mono text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10">
              {error}
            </div>
          )}
          {loading ? (
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Loading transactions...</p>
          ) : (
            <>
              {activeTab === 'dashboard' && <Dashboard transactions={transactionsList} />}
              {activeTab === 'transactions' && <Transactions transactions={transactionsList} onAddTransaction={addTransaction} onDeleteTransaction={removeTransaction} />}
              {activeTab === 'budgets' && <Budgets />}
              {activeTab === 'insights' && <Insights />}
            </>
          )}
        </main>
      </div>

      <AIChatModel transactions={transactionsList} />
    </div>
  );
}