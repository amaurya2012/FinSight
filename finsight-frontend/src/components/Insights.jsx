import React, { useState, useEffect } from 'react';
import { fetchTrend, fetchPrediction, fetchAnomalies } from '../api/analytics';

export default function Insights() {
  const [trend, setTrend] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        setLoading(true);
        const [trendData, predictionData, anomalyData] = await Promise.all([
          fetchTrend(),
          fetchPrediction(),
          fetchAnomalies()
        ]);
        setTrend(trendData.trend || []);
        setPrediction(predictionData.predicted_next_month_spend);
        setAnomalies(anomalyData.anomalies || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load insights:', err);
        setError('Could not load insights. Is the backend running?');
      } finally {
        setLoading(false);
      }
    }
    loadInsights();
  }, []);

  // Build a trend direction message from the last two months, if available
  const trendMessage = (() => {
    if (trend.length < 2) return null;
    const last = trend[trend.length - 1];
    const prev = trend[trend.length - 2];
    const change = ((last.amount - prev.amount) / prev.amount) * 100;
    const direction = change >= 0 ? 'increased' : 'decreased';
    return `Your spending ${direction} by ${Math.abs(change).toFixed(1)}% from ${prev.month} to ${last.month}.`;
  })();

  return (
    <div className="space-y-6 font-sans">
      <div
        className="border rounded-2xl p-6 shadow-xl transition-colors"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
      >
        <div className="mb-6">
          <h4 className="font-serif text-lg font-bold" style={{ color: 'var(--text-main)' }}>AI Financial Intelligence</h4>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>Automated pattern recognition & ledger health notes.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl border text-xs font-mono text-[#f87171] border-[#f87171]/30 bg-[#f87171]/10">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Analyzing your ledger...</p>
        ) : (
          <div className="space-y-4">
            {/* Spend Prediction */}
            {prediction !== null && (
              <div
                className="border rounded-2xl p-5 shadow-sm transition-colors flex items-start gap-4"
                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
              >
                <div className="px-2.5 py-1 rounded-xl border text-xs font-mono font-bold flex items-center justify-center bg-[#818cf8]/10 text-[#818cf8] border-[#818cf8]/30">
                  AI
                </div>
                <div>
                  <h5 className="font-serif font-bold text-sm mb-1" style={{ color: 'var(--text-main)' }}>Next Month's Predicted Spend</h5>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    Based on your recent spending trend, you're projected to spend approximately{' '}
                    <strong style={{ color: 'var(--text-main)' }}>₹{prediction.toLocaleString('en-IN')}</strong> next month.
                  </p>
                </div>
              </div>
            )}

            {/* Trend Direction */}
            {trendMessage && (
              <div
                className="border rounded-2xl p-5 shadow-sm transition-colors flex items-start gap-4"
                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
              >
                <div className="px-2.5 py-1 rounded-xl border text-xs font-mono font-bold flex items-center justify-center bg-[#f5b942]/10 text-[#f5b942] border-[#f5b942]/30">
                  ⚡
                </div>
                <div>
                  <h5 className="font-serif font-bold text-sm mb-1" style={{ color: 'var(--text-main)' }}>Cash Flow Trend</h5>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>{trendMessage}</p>
                </div>
              </div>
            )}

            {/* Anomalies */}
            {anomalies.length > 0 ? (
              anomalies.map((tx, idx) => (
                <div
                  key={idx}
                  className="border rounded-2xl p-5 shadow-sm transition-colors flex items-start gap-4"
                  style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
                >
                  <div className="px-2.5 py-1 rounded-xl border text-xs font-mono font-bold flex items-center justify-center bg-[#f87171]/10 text-[#f87171] border-[#f87171]/30">
                    !
                  </div>
                  <div>
                    <h5 className="font-serif font-bold text-sm mb-1" style={{ color: 'var(--text-main)' }}>Unusual Transaction Flagged</h5>
                    <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-main)' }}>{tx.description}</strong> for ₹{tx.amount.toLocaleString('en-IN')} on {tx.date} is significantly higher than your typical spend.
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="border rounded-2xl p-5 shadow-sm transition-colors flex items-start gap-4"
                style={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)' }}
              >
                <div className="px-2.5 py-1 rounded-xl border text-xs font-mono font-bold flex items-center justify-center bg-[#34d399]/10 text-[#34d399] border-[#34d399]/30">
                  ✓
                </div>
                <div>
                  <h5 className="font-serif font-bold text-sm mb-1" style={{ color: 'var(--text-main)' }}>No Anomalies Detected</h5>
                  <p className="text-xs font-mono leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    All recent transactions fall within your typical spending range.
                  </p>
                </div>
              </div>
            )}

            {trend.length === 0 && prediction === null && anomalies.length === 0 && (
              <p className="text-xs font-mono py-4 text-center" style={{ color: 'var(--text-muted)' }}>
                Add a few transactions across different months to unlock insights.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}