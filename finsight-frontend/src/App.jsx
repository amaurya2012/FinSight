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
  const [transactionsList, setTransactionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load transactions from the backend on mount
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