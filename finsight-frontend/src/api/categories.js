import { API_URL, TEMP_USER_ID } from '../config/api';

export async function fetchCategories() {
  const res = await fetch(`${API_URL}/api/categories`, {
    headers: { 'x-user-id': TEMP_USER_ID }
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function createCategory(name) {
  const res = await fetch(`${API_URL}/api/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': TEMP_USER_ID
    },
    body: JSON.stringify({ name })
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
}

// Budgets are linked to a category by ID. This finds an existing category
// by name, or creates one on the fly if it doesn't exist yet - so the user
// never has to manage categories separately before setting a budget.
export async function findOrCreateCategoryId(name) {
  const categories = await fetchCategories();
  const existing = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing.id;

  const created = await createCategory(name);
  return created.id;
}