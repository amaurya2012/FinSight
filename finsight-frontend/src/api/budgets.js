import { API_URL, TEMP_USER_ID } from '../config/api';

export async function fetchBudgets(month, year) {
  const res = await fetch(`${API_URL}/api/budgets?month=${month}&year=${year}`, {
    headers: { 'x-user-id': TEMP_USER_ID }
  });
  if (!res.ok) throw new Error('Failed to fetch budgets');
  return res.json();
}

export async function deleteBudget(id) {
  const res = await fetch(`${API_URL}/api/budgets/${id}`, {
    method: 'DELETE',
    headers: { 'x-user-id': TEMP_USER_ID }
  });
  if (!res.ok) throw new Error('Failed to delete budget');
  return true;
}
{
  const res = await fetch(`${API_URL}/api/budgets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': TEMP_USER_ID
    },
    body: JSON.stringify({ category_id, monthly_limit, month, year })
  });
  if (!res.ok) throw new Error('Failed to create budget');
  return res.json();
}