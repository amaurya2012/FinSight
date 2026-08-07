import React, { useState } from 'react';

export default function Transactions({ transactions, onAddTransaction, onDeleteTransaction }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Subscription');
  const [newAccount, setNewAccount] = useState('Business HDFC');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState('Expense');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount.trim()) return;

    const numericAmount = Number(newAmount);
    // ISO date (YYYY-MM-DD) so the backend can parse it reliably
    const isoDate = new Date().toISOString().split('T')[0];

    const newTx = {
      title: newTitle,
      category: newCategory,
      account: newAccount,
      date: isoDate,
      amount: numericAmount,
      type: newType,
    };

    onAddTransaction(newTx);
    setNewTitle('');
    setNewAmount('');
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) {
      onDeleteTransaction(id);
    }
  };

  const filteredData = transactions.filter(tx => {
    const matchesFilter = filter === 'All' || tx.type === filter;
    const matchesSearch = tx.title.toLowerCase().includes(search.toLowerCase()) || tx.category.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      <div 
        className="border rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 transition-colors"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <input
          type="text"
          placeholder="Search transactions or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 border rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none transition-colors"
          style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
        />

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 font-mono text-xs">
            {['All', 'Income', 'Expense'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                  filter === tab ? 'bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30 font-bold' : ''
                }`}
                style={{
                  backgroundColor: filter === tab ? undefined : 'var(--bg-main)',
                  borderColor: filter === tab ? undefined : 'var(--border-color)',
                  color: filter === tab ? '#34d399' : 'var(--text-main)'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#34d399] text-[#0b1220] font-mono text-xs font-bold cursor-pointer hover:opacity-90 transition-all shadow-md"
          >
            + Add
          </button>
        </div>
      </div>

      <div 
        className="border rounded-2xl p-6 shadow-xl transition-colors"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <h4 className="font-serif text-lg font-bold mb-6" style={{ color: 'var(--text-main)' }}>Ledger History</h4>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
                <th className="pb-3 font-medium">TRANSACTION TITLE</th>
                <th className="pb-3 font-medium">CATEGORY</th>
                <th className="pb-3 font-medium">ACCOUNT</th>
                <th className="pb-3 font-medium">DATE</th>
                <th className="pb-3 font-medium text-right">AMOUNT</th>
                <th className="pb-3 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {filteredData.map(tx => (
                <tr key={tx.id} className="transition-colors hover:opacity-90">
                  <td className="py-4 font-semibold" style={{ color: 'var(--text-main)' }}>{tx.title}</td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-lg border text-[11px]" style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-4" style={{ color: 'var(--text-muted)' }}>{tx.account}</td>
                  <td className="py-4" style={{ color: 'var(--text-muted)' }}>{tx.date}</td>
                  <td className={`py-4 text-right font-bold ${tx.type === 'Income' ? 'text-[#34d399]' : ''}`} style={{ color: tx.type === 'Income' ? undefined : 'var(--text-main)' }}>
                    {tx.type === 'Income' ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString('en-IN')}.00
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="w-7 h-7 rounded-lg border cursor-pointer text-[#f87171] hover:bg-[#f87171]/10 transition-colors"
                      style={{ borderColor: 'var(--border-color)' }}
                      title="Delete transaction"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-6 text-center" style={{ color: 'var(--text-muted)' }}>
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans">
          <div 
            className="w-full max-w-md border rounded-3xl shadow-2xl p-6 transition-colors font-mono text-xs"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span className="font-bold font-serif text-base" style={{ color: 'var(--text-main)' }}>New Ledger Entry</span>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center border cursor-pointer hover:bg-slate-500/10"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Transaction Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adobe Subscription"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2.5 focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2.5 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  >
                    <option value="Expense">Expense</option>
                    <option value="Income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Category (suggestion)</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2.5 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  >
                    <option value="Subscription">Subscription</option>
                    <option value="Food">Food</option>
                    <option value="Design">Design</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Account</label>
                  <select
                    value={newAccount}
                    onChange={(e) => setNewAccount(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2.5 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  >
                    <option value="Business HDFC">Business HDFC</option>
                    <option value="Primary Bank">Primary Bank</option>
                    <option value="UPI Wallet">UPI Wallet</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1" style={{ color: 'var(--text-muted)' }}>Amount (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full border rounded-xl px-3 py-2.5 focus:outline-none"
                    style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}
                  />
                </div>
              </div>

              <p className="text-[10px] italic" style={{ color: 'var(--text-muted)' }}>
                Note: The final category shown may be auto-corrected by the ML categorization model based on the transaction title.
              </p>

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
                  className="px-5 py-2 rounded-xl bg-[#34d399] text-[#0b1220] font-bold cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}