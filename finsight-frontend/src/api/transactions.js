import { API_URL, TEMP_USER_ID } from '../config/api';

// The backend stores transactions with fields like `description`,
// `predicted_category`, `transaction_type`, `transaction_date`.
// The UI components (Dashboard, Transactions) expect `title`, `category`,
// `date`, `type`. This function bridges the two shapes.
function transformTransaction(tx) {
  const isIncome = tx.transaction_type === 'income';
  return {
    id: tx.id,
    title: tx.description,
    category: tx.manual_category || tx.predicted_category || 'Other',
    predictedCategory: tx.predicted_category || null, // kept for Insights/ML display elsewhere
    account: 'Linked Account', // backend doesn't track multiple accounts yet
    date: new Date(tx.transaction_date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    }),
    amount: isIncome ? Math.abs(tx.amount) : -Math.abs(tx.amount),
    type: isIncome ? 'Income' : 'Expense',
    isAnomaly: tx.is_anomaly || false
  };
}

export async function fetchTransactions() {
  const res = await fetch(`${API_URL}/api/transactions`, {
    headers: { 'x-user-id': TEMP_USER_ID }
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  const data = await res.json();
  return data.map(transformTransaction);
}

// newTx expected shape (from the add-transaction form):
// { title, amount, type: 'Income' | 'Expense', date (ISO string) }
export async function deleteTransaction(id) {
  const res = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': TEMP_USER_ID }
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
  return true;
}

export async function createTransaction(newTx) {
  const res = await fetch(`${API_URL}/api/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': TEMP_USER_ID
    },
    body: JSON.stringify({
      description: newTx.title,
      amount: Math.abs(newTx.amount),
      transaction_type: newTx.type === 'Income' ? 'income' : 'expense',
      transaction_date: newTx.date || new Date().toISOString().split('T')[0],
      category: newTx.category || null
    })
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  const data = await res.json();
  return transformTransaction(data);
}