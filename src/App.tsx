import React, { useState } from 'react';
import { Package, Sparkles, Loader2, History } from 'lucide-react';
import { OptimizationResult } from './components/OptimizationResult';
import { HistoryView } from './components/HistoryView';
import { ProductData, OptimizationHistory } from './types';

const API_URL = 'http://localhost:3000';

function App() {
  const [asin, setAsin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ProductData | null>(null);
  const [history, setHistory] = useState<OptimizationHistory[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleOptimize = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setHistory([]);
    setShowHistory(false);

    if (!asin.trim() || !/^[A-Z0-9]{10}$/.test(asin.trim())) {
      setError('Please enter a valid 10-character ASIN (e.g., B08N5WRWNW)');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/optimize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ asin: asin.trim().toUpperCase() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to optimize listing');
      }

      const data = await response.json();
      setResult(data);

      const historyResponse = await fetch(`${API_URL}/api/history/${asin.trim().toUpperCase()}`);
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setHistory(historyData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = async () => {
    if (!asin.trim()) {
      setError('Please enter an ASIN to view history');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/history/${asin.trim().toUpperCase()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }

      const data = await response.json();
      setHistory(data);
      setShowHistory(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-slate-900">
              Amazon Listing Optimizer
            </h1>
          </div>
          <p className="text-slate-600 text-lg">
            Optimize your Amazon product listings with AI-powered suggestions
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <form onSubmit={handleOptimize} className="space-y-6">
            <div>
              <label htmlFor="asin" className="block text-sm font-medium text-slate-700 mb-2">
                Amazon ASIN
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="asin"
                  value={asin}
                  onChange={(e) => setAsin(e.target.value.toUpperCase())}
                  placeholder="e.g., B08N5WRWNW"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  maxLength={10}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleViewHistory}
                  disabled={loading}
                  className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <History className="w-5 h-5" />
                  History
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Optimize
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Enter a 10-character Amazon Standard Identification Number
              </p>
            </div>
          </form>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {result && <OptimizationResult data={result} />}
        {showHistory && <HistoryView history={history} />}
        {result && history.length > 0 && !showHistory && (
          <div className="mt-6">
            <HistoryView history={history} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
