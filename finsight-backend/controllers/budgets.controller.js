const supabase = require('../config/supabase');

// GET budgets for a specific month/year
async function getBudgets(req, res) {
  const userId = req.headers['x-user-id'];
  const { month, year } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  let query = supabase
    .from('finsight_budgets')
    .select('*, finsight_categories(name, color)')
    .eq('user_id', userId);

  if (month) query = query.eq('month', month);
  if (year) query = query.eq('year', year);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// POST create a budget
async function createBudget(req, res) {
  const userId = req.headers['x-user-id'];
  const { category_id, monthly_limit, month, year } = req.body;

  if (!userId || !category_id || !monthly_limit || !month || !year) {
    return res.status(400).json({ error: 'category_id, monthly_limit, month, and year are required' });
  }

  const { data, error } = await supabase
    .from('finsight_budgets')
    .insert([{ user_id: userId, category_id, monthly_limit, month, year }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
}

// PUT update a budget
async function updateBudget(req, res) {
  const { id } = req.params;
  const userId = req.headers['x-user-id'];
  const updates = req.body;

  const { data, error } = await supabase
    .from('finsight_budgets')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  if (data.length === 0) return res.status(404).json({ error: 'Budget not found' });
  res.json(data[0]);
}

module.exports = { getBudgets, createBudget, updateBudget };