const supabase = require('../config/supabase');
const axios = require('axios');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// GET all transactions for a user (with optional filters)
async function getTransactions(req, res) {
  const userId = req.headers['x-user-id'];
  const { startDate, endDate, categoryId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  let query = supabase
    .from('finsight_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('transaction_date', { ascending: false });

  if (startDate) query = query.gte('transaction_date', startDate);
  if (endDate) query = query.lte('transaction_date', endDate);
  if (categoryId) query = query.eq('category_id', categoryId);

  const { data, error } = await query;

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// POST create a transaction (auto-categorizes via FastAPI, but stores the
// user's manually selected category separately so it can take priority)
async function createTransaction(req, res) {
  const userId = req.headers['x-user-id'];
  const { description, amount, transaction_type, transaction_date, category_id, category } = req.body;

  if (!userId || !description || !amount || !transaction_date) {
    return res.status(400).json({ error: 'description, amount, and transaction_date are required' });
  }

  let predictedCategory = null;

  // ML categorization still runs every time (useful for analytics/insights),
  // but it no longer overrides what the user picked in the form.
  try {
    const response = await axios.post(`${FASTAPI_URL}/predict-category`, {
      description
    });
    predictedCategory = response.data.predicted_category;
  } catch (err) {
    console.error('FastAPI categorization failed:', err.message);
    // Not fatal - transaction can still be saved without a predicted category
  }

  const { data, error } = await supabase
    .from('finsight_transactions')
    .insert([{
      user_id: userId,
      category_id: category_id || null,
      manual_category: category || null,
      amount,
      description,
      transaction_type: transaction_type || 'expense',
      predicted_category: predictedCategory,
      transaction_date
    }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
}

// PUT update a transaction
async function updateTransaction(req, res) {
  const { id } = req.params;
  const userId = req.headers['x-user-id'];
  const updates = req.body;

  const { data, error } = await supabase
    .from('finsight_transactions')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  if (data.length === 0) return res.status(404).json({ error: 'Transaction not found' });
  res.json(data[0]);
}

// DELETE a transaction
async function deleteTransaction(req, res) {
  const { id } = req.params;
  const userId = req.headers['x-user-id'];

  const { error } = await supabase
    .from('finsight_transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
}

module.exports = { getTransactions, createTransaction, updateTransaction, deleteTransaction };