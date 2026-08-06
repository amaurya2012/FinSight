const supabase = require('../config/supabase');

// GET all categories for a user
async function getCategories(req, res) {
  const userId = req.headers['x-user-id']; // frontend will send this after login

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  const { data, error } = await supabase
    .from('finsight_categories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

// POST create a new category
async function createCategory(req, res) {
  const userId = req.headers['x-user-id'];
  const { name, icon, color } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ error: 'user_id and name are required' });
  }

  const { data, error } = await supabase
    .from('finsight_categories')
    .insert([{ user_id: userId, name, icon, color }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
}

// DELETE a category
async function deleteCategory(req, res) {
  const { id } = req.params;
  const userId = req.headers['x-user-id'];

  const { error } = await supabase
    .from('finsight_categories')
    .delete()
    .eq('id', id)
    .eq('user_id', userId); // extra safety - can only delete own category

  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
}

module.exports = { getCategories, createCategory, deleteCategory };