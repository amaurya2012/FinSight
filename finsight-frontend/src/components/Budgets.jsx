import React, { useState, useEffect } from 'react';
import { fetchBudgets, createBudget, deleteBudget } from '../api/budgets';
import { findOrCreateCategoryId } from '../api/categories';
import { fetchTransactions } from '../api/transactions';

const CATEGORY_OPTIONS = ['Food', 'Rent', 'Shopping', 'Bills', 'Transport', 'Entertainment', 'Healthcare', 'Subscription', 'Utilities', 'Other'];

const now = new Date();
const CURRENT_MONTH = now.getMonth() + 1;
const CURRENT_YEAR = now.getFullYear();

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('Food');
  const [newLimit, setNewLimit] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [budgetsData, txData] = await Promise.all([
        fetchBudgets(CURRENT_MONTH, CURRENT_YEAR),
        fetchTransactions()
      ]);
      setBudgets(budgetsData);
      setTransactions(txData);
      setError(null);
    } catch (err) {
      console.error('Failed to load budgets:', err);
      setError('Could not load budgets. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!newLimit.trim()) return;

    try {
      setSaving(true);
      const categoryId = await findOrCreateCategoryId(newCategory);
      await createBudget({
        category_id: categoryId,
        monthly_limit: Number(newLimit),
        month: CURRENT_MONTH,
        year: CURRENT_YEAR
      });
      setNewLimit('');
      setIsModalOpen(false);
      await loadData(); // refresh list with the new budget included
    } catch (err) {
      console.error('Failed to create budget:', err);
      setError('Could not save budget. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    try {
      await deleteBudget(id);
      setBudgets(budgets.filter(b => b.id !== id));
    } catch (err) {
      console.error('Failed to delete budget:', err);
      setError('Could not delete budget. Please try again.');
    }
  };

  // Compute "spent so far this month" per category from real transactions
  function getSpentForCategory(categoryName) {
    return transactions
      .filter(tx => tx.type === 'Expense' && tx.category?.toLowerCase() === categoryName?.toLowerCase())
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }

  const budgetCards = budgets.map(b => {
    const categoryName = b.finsight_categories?.name || 'Uncategorized';
    const spent = getSpentForCategory(categoryName);
    const limit = b.monthly_limit;
    const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
    const isOver = spent > limit;

    return {
      id: b.id,
      category: categoryName,
      spent,
      limit,
      percent,
      isOver,
      left: isOver ? spent - limit : limit - spent
    };
  });

  return (
    <div className="space-y-6 font-sans">
      <div
        className="border rounded-2xl p-6 shadow-xl transition-colors"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h4 className="font-serif text-lg font-bold" style={{ color: 'var(--text-main)' }}>Monthly Budget Allocation</h4>
            <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>Track spending boundaries and anomaly thresholds.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#34d399] text-[#0b1220] font-mono text-xs font-bold cursor-pointer hover:opacity-90 transition-all shadow-md shrink-0"
          >
            + Set Budget
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl border text-xs font-mono text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Loading budgets...</p>
        ) : budgetCards.length === 0 ? (
          <p className="text-xs font-mono py-6 text-center" style={{ color: 'var(--text-muted)' }}>
            No budgets set for this month yet. Click "+ Set Budget" to create one.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgetCards.map((item) => (
              <div
                key={item.id}
                className="border rounded-2xl p-5 shadow-sm transition-colors flex flex-col justify-between"
                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-serif font-bold text-sm" style={{ color: 'var(--text-main)' }}>{item.category}</h5>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold ${
                        item.isOver ? 'bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30' : 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30'
                      }`}>
                        {item.isOver ? 'Over Budget' : 'On Track'}
                      </span>
                      <button
                        onClick={() => handleDeleteBudget(item.id)}
                        className="w-6 h-6 rounded-lg border cursor-pointer text-[#f87171] hover:bg-[#f87171]/10 transition-colors text-xs shrink-0"
                        style={{ borderColor: 'var(--border-color)' }}
                        title="Delete budget"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
                    <span>Spent: <strong style={{ color: 'var(--text-main)' }}>₹{item.spent.toLocaleString('en-IN')}</strong></span>
                    <span>Limit: <strong style={{ color: 'var(--text-main)' }}>₹{item.limit.toLocaleString('en-IN')}</strong></span>
                  </div>

                  <div className="w-full h-2.5 rounded-full overflow-hidden border mb-3" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}>
                    <div
                      className={`h-full rounded-full ${item.isOver ? 'bg-[#f87171]' : 'bg-[#34d399]'}`}
                      style={{ width: `${Math.min(item.percent, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] font-mono pt-3 border-t" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                  <span>{item.percent}% utilized</span>
                  <span className="font-bold" style={{ color: item.isOver ? '#f87171' : 'var(--text-main)' }}>
                    ₹{item.left.toLocaleString('en-IN')} {item.isOver ? 'exceeded' : 'left'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div
            className="w-full max-w-md border rounded-3xl shadow-2xl p-6 transition-colors font-mono text-xs"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span className="font-bold font-serif text-base" style={{ color: 'var(--text-main)' }}>Set Monthly Budget</span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center border cursor-pointer hover:bg-slate-500/10"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBudget} className="space-y-4">
              <div>
                <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                >
                  {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Monthly Limit (INR)</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border cursor-pointer"
                  style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#34d399] text-[#0b1220] font-bold cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}