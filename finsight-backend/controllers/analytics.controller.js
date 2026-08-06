const supabase = require('../config/supabase');
const axios = require('axios');

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

// Helper: fetch a user's transactions in the shape FastAPI expects
async function fetchUserTransactions(userId) {
  const { data, error } = await supabase
    .from('finsight_transactions')
    .select('description, amount, transaction_date')
    .eq('user_id', userId);

  if (error) throw new Error(error.message);

  // FastAPI expects { description, amount, date }
  return data.map(t => ({
    description: t.description,
    amount: t.amount,
    date: t.transaction_date
  }));
}

// GET monthly spend trend
async function getTrend(req, res) {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'User ID required' });

  try {
    const transactions = await fetchUserTransactions(userId);
    if (transactions.length === 0) {
      return res.json({ trend: [] });
    }

    const response = await axios.post(`${FASTAPI_URL}/analytics/trend`, { transactions });
    res.json(response.data);
  } catch (err) {
    console.error('Trend analytics failed:', err.message);
    res.status(500).json({ error: 'Failed to compute spend trend' });
  }
}

// GET next month's predicted spend
async function getPrediction(req, res) {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'User ID required' });

  try {
    const transactions = await fetchUserTransactions(userId);

    const response = await axios.post(`${FASTAPI_URL}/analytics/prediction`, { transactions });
    res.json(response.data);
  } catch (err) {
    console.error('Prediction analytics failed:', err.message);
    // Forward FastAPI's actual error message if available (e.g. "need at least 2 months of data")
    const detail = err.response?.data?.detail || 'Failed to compute prediction';
    res.status(err.response?.status || 500).json({ error: detail });
  }
}

// GET flagged anomalous transactions
async function getAnomalies(req, res) {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'User ID required' });

  try {
    const transactions = await fetchUserTransactions(userId);
    if (transactions.length === 0) {
      return res.json({ threshold: 0, anomaly_count: 0, anomalies: [] });
    }

    const response = await axios.post(`${FASTAPI_URL}/analytics/anomalies`, { transactions });
    res.json(response.data);
  } catch (err) {
    console.error('Anomaly detection failed:', err.message);
    res.status(500).json({ error: 'Failed to detect anomalies' });
  }
}

module.exports = { getTrend, getPrediction, getAnomalies };