import { API_URL, TEMP_USER_ID } from '../config/api';

export async function fetchTrend() {
  const res = await fetch(`${API_URL}/api/analytics/trend`, {
    headers: { 'x-user-id': TEMP_USER_ID }
  });
  if (!res.ok) throw new Error('Failed to fetch trend');
  return res.json();
}

export async function fetchPrediction() {
  const res = await fetch(`${API_URL}/api/analytics/prediction`, {
    headers: { 'x-user-id': TEMP_USER_ID }
  });
  if (!res.ok) {
    // Not enough data yet is a common, expected case - not a hard failure
    return { predicted_next_month_spend: null };
  }
  return res.json();
}

export async function fetchAnomalies() {
  const res = await fetch(`${API_URL}/api/analytics/anomalies`, {
    headers: { 'x-user-id': TEMP_USER_ID }
  });
  if (!res.ok) throw new Error('Failed to fetch anomalies');
  return res.json();
}